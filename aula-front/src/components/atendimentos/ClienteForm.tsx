import { useEffect, useState, type FormEvent } from "react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SERVICE_EXPECTED_MINUTES, SERVICE_NAMES } from "@/data/services"
import { cn } from "@/lib/utils"
import type { Cliente } from "@/types/cliente"

const emptyForm = {
  nome: "",
  sobrenome: "",
  telefone: "",
  modelo_carro: "",
  placa: "",
  cor_carro: "",
  servicos: [] as string[],
}

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
        placa: cliente.placa ?? "",
        cor_carro: cliente.cor_carro ?? "",
        servicos: cliente.servicos,
      })
    }
  }, [cliente])

  function toggleServico(servico: string) {
    setForm((prev) => ({
      ...prev,
      servicos: prev.servicos.includes(servico)
        ? prev.servicos.filter((item) => item !== servico)
        : [...prev.servicos, servico],
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (form.servicos.length === 0) {
      toast.error("Selecione ao menos um serviço")
      return
    }
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
            <Label htmlFor="nome">
              Nome <span className="text-red-600">*</span>
            </Label>
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
              value={form.sobrenome}
              onChange={(event) => setForm({ ...form, sobrenome: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="telefone">
              Telefone <span className="text-red-600">*</span>
            </Label>
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
              value={form.modelo_carro}
              onChange={(event) => setForm({ ...form, modelo_carro: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="placa">
              Placa <span className="text-red-600">*</span>
            </Label>
            <Input
              id="placa"
              required
              placeholder="ABC1D23"
              value={form.placa}
              onChange={(event) => setForm({ ...form, placa: event.target.value.toUpperCase() })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cor_carro">Cor do carro</Label>
            <Input
              id="cor_carro"
              value={form.cor_carro}
              onChange={(event) => setForm({ ...form, cor_carro: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>
              Serviços <span className="text-red-600">*</span>
            </Label>
            <div className="grid gap-2 sm:grid-cols-3">
              {SERVICE_NAMES.map((servico) => (
                <label
                  key={servico}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-brand-line px-2.5 py-1.5 text-sm text-brand-ink/80",
                    form.servicos.includes(servico) && "border-brand-cyan bg-brand-cyan/10 text-brand-ink",
                  )}
                >
                  <input
                    type="checkbox"
                    className="accent-brand-cyan"
                    checked={form.servicos.includes(servico)}
                    onChange={() => toggleServico(servico)}
                  />
                  {servico}{" "}
                  <span className="text-brand-ink/40">({SERVICE_EXPECTED_MINUTES[servico] ?? 20}min)</span>
                </label>
              ))}
            </div>
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
