import { useEffect, useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "@/types/auth"
import type { ManagedUser } from "@/types/managedUser"

const emptyForm = { name: "", email: "", password: "", role: "employee" as UserRole, is_active: true }

interface UserFormProps {
  user?: ManagedUser | null
  onSaved: () => void
  onCancelEdit?: () => void
}

export function UserForm({ user, onSaved, onCancelEdit }: UserFormProps) {
  const isEditing = user != null
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: "", role: user.role, is_active: user.is_active })
    }
  }, [user])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      if (isEditing && user) {
        await api.put<ManagedUser>(`/users/${user.id}`, {
          name: form.name,
          email: form.email,
          role: form.role,
          is_active: form.is_active,
          password: form.password || undefined,
        })
        toast.success("Usuário atualizado")
      } else {
        await api.post<ManagedUser>("/users", {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        })
        toast.success("Usuário cadastrado")
        setForm(emptyForm)
        setIsOpen(false)
      }
      onSaved()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível salvar o usuário")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    if (isEditing) {
      onCancelEdit?.()
    } else {
      setIsOpen(false)
      setForm(emptyForm)
    }
  }

  if (!isEditing && !isOpen) {
    return (
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setIsOpen(true)}>
        + Novo usuário
      </Button>
    )
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{isEditing ? "Nova senha" : "Senha"}</Label>
            <PasswordInput
              id="password"
              required={!isEditing}
              placeholder={isEditing ? "Deixe em branco para manter a atual" : undefined}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Papel</Label>
            <select
              id="role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
              className="h-10 w-full rounded-md border border-brand-line bg-brand-card px-3 text-sm text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              <option value="employee">Funcionário</option>
              <option value="owner">Dono</option>
            </select>
          </div>
          {isEditing && (
            <label className="flex items-center gap-2 text-sm text-brand-ink sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                className="h-4 w-4 rounded border-brand-line accent-brand"
              />
              Conta ativa
            </label>
          )}
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar usuário"}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
