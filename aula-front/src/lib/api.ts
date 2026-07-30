import { config } from "@/config/config"

const TOKEN_KEY = "lava-rapido:token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers(options.headers)
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${config.apiBaseUrl}${path}`, { ...options, headers })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body?.detail ?? "Erro inesperado")
  }

  return response
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  const response = await authenticatedFetch(path, { ...options, headers })
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  // Multipart: sem Content-Type manual — o navegador define o boundary sozinho.
  postForm: async <T>(path: string, formData: FormData): Promise<T> => {
    const response = await authenticatedFetch(path, { method: "POST", body: formData })
    if (response.status === 204) return undefined as T
    return (await response.json()) as T
  },
  getBlob: async (path: string): Promise<Blob> => {
    const response = await authenticatedFetch(path, { method: "GET" })
    return response.blob()
  },
}
