import { useState } from "react"
import { PencilSimple, Trash } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { api, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { ManagedUser } from "@/types/managedUser"

const roleLabel: Record<ManagedUser["role"], string> = {
  owner: "Dono",
  employee: "Funcionário",
}

interface UserTableProps {
  users: ManagedUser[]
  onChange: () => void
  onEdit: (user: ManagedUser) => void
}

export function UserTable({ users, onChange, onEdit }: UserTableProps) {
  const { user: currentUser } = useAuth()
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  async function excluir(user: ManagedUser) {
    setPendingId(user.id)
    try {
      await api.delete(`/users/${user.id}`)
      toast.success("Usuário excluído")
      onChange()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível excluir o usuário")
    } finally {
      setPendingId(null)
      setConfirmingId(null)
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-card/60 p-8 text-center text-sm text-brand-ink/50">
        Nenhum usuário cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand-line bg-brand-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink/60">
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">E-mail</th>
            <th className="px-4 py-3 font-medium">Papel</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUser?.id
            return (
              <tr key={user.id} className="border-b border-brand-line last:border-0">
                <td className="px-4 py-3 text-brand-ink">
                  {user.name} {isSelf && <span className="text-brand-ink/40">(você)</span>}
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      user.role === "owner" ? "bg-brand/10 text-brand" : "bg-brand-cyan/20 text-brand-dark",
                    )}
                  >
                    {roleLabel[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-medium", user.is_active ? "text-brand-ink/70" : "text-red-600")}>
                    {user.is_active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {confirmingId === user.id ? (
                    <div className="flex items-center gap-2 whitespace-nowrap text-xs">
                      <span className="text-brand-ink/60">Excluir?</span>
                      <button
                        type="button"
                        disabled={pendingId === user.id}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                        onClick={() => excluir(user)}
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        className="text-brand-ink/60 hover:underline"
                        onClick={() => setConfirmingId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Editar ${user.name}`}
                        className="rounded-md p-1.5 text-brand-ink/60 transition-colors hover:bg-brand-surface hover:text-brand-ink"
                        onClick={() => onEdit(user)}
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Excluir ${user.name}`}
                        disabled={isSelf}
                        className="rounded-md p-1.5 text-brand-ink/60 transition-colors hover:bg-brand-surface hover:text-red-600 disabled:opacity-30"
                        onClick={() => setConfirmingId(user.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
