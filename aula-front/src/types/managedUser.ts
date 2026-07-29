import type { UserRole } from "@/types/auth"

export interface ManagedUser {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
}
