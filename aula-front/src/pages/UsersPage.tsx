import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { UserForm } from "@/components/users/UserForm"
import { UserTable } from "@/components/users/UserTable"
import { api, ApiError } from "@/lib/api"
import type { ManagedUser } from "@/types/managedUser"

export function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null)

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.get<ManagedUser[]>("/users")
      setUsers(data)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar os usuários")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
            Usuários
          </h1>
          <p className="text-sm text-brand-ink/60">
            Crie credenciais e defina quem tem acesso de dono ou de funcionário.
          </p>
        </div>

        <UserForm
          user={editingUser}
          onSaved={() => {
            setEditingUser(null)
            loadUsers()
          }}
          onCancelEdit={() => setEditingUser(null)}
        />

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando usuários...</p>
        ) : (
          <UserTable users={users} onChange={loadUsers} onEdit={setEditingUser} />
        )}
      </div>
    </AppShell>
  )
}
