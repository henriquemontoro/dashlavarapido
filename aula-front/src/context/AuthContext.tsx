import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { AUTH_UNAUTHORIZED_EVENT, api, clearToken, getToken, setToken as persistToken } from "@/lib/api"
import type { AuthUser, LoginResponse } from "@/types/auth"

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function rehydrate() {
      if (!getToken()) {
        setIsLoading(false)
        return
      }
      try {
        const me = await api.get<AuthUser>("/auth/me")
        setUser(me)
      } catch {
        clearToken()
      } finally {
        setIsLoading(false)
      }
    }
    rehydrate()
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setUser(null)
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  async function login(email: string, password: string) {
    const response = await api.post<LoginResponse>("/auth/login", { email, password })
    persistToken(response.access_token)
    const me = await api.get<AuthUser>("/auth/me")
    setUser(me)
    return me
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth precisa ser usado dentro de AuthProvider")
  return ctx
}
