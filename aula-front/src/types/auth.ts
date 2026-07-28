export type UserRole = "owner" | "employee"

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  access_token: string
  token_type: string
  role: UserRole
}
