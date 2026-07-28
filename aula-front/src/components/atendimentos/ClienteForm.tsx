import { useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Cliente } from "@/types/cliente"

const emptyForm = { nome: "", sobrenome: "", telefone: "", modelo_carro: "" }

export function ClienteForm({ onCreated }: { onCreated: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await api.post<Cliente>("/clientes", form)
      toast.success("Cliente cadastrado")
      setForm(emptyForm)
      setIsOpen(false)
      onCreated()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível cadastrar o cliente")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
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
              {isSubmitting ? "Salvando..." : "Salvar cliente"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => {
                setIsOpen(false)
                setForm(emptyForm)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
