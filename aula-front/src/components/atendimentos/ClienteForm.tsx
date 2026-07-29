import { useEffect, useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cliente } from "@/types/cliente"

const emptyForm = { nome: "", sobrenome: "", telefone: "", modelo_carro: "" }

interface ClienteFormProps {
  cliente?: Cliente | null
  onSaved: () => void
  onCancelEdit?: () => void
}

export function ClienteForm({ cliente, onSaved, onCancelEdit }: ClienteFormProps) {
  const isEditing = cliente != null
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        telefone: cliente.telefone,
        modelo_carro: cliente.modelo_carro,
      })
    }
  }, [cliente])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      if (isEditing && cliente) {
        await api.put<Cliente>(`/clientes/${cliente.id}`, form)
        toast.success("Cliente atualizado")
      } else {
        await api.post<Cliente>("/clientes", form)
        toast.success("Cliente cadastrado")
        setForm(emptyForm)
        setIsOpen(false)
      }
      onSaved()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível salvar o cliente")
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
        + Novo cliente
      </Button>
    )
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              required
              value={form.nome}
              onChange={(event) => setForm({ ...form, nome: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sobrenome">Sobrenome</Label>
            <Input
              id="sobrenome"
              required
              value={form.sobrenome}
              onChange={(event) => setForm({ ...form, sobrenome: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              required
              placeholder="(11) 99999-9999"
              value={form.telefone}
              onChange={(event) => setForm({ ...form, telefone: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="modelo_carro">Modelo do carro</Label>
            <Input
              id="modelo_carro"
              required
              value={form.modelo_carro}
              onChange={(event) => setForm({ ...form, modelo_carro: event.target.value })}
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" size="sm" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : isEditing ? "Salvar alterações" : "Salvar cliente"}
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
