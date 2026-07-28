import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function RoleHomePage() {
  const { user } = useAuth()
  return <Navigate to={user?.role === "owner" ? "/dashboard" : "/atendimentos"} replace />
}
