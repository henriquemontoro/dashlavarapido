import { useCallback, useEffect, useMemo, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { ClienteForm } from "@/components/atendimentos/ClienteForm"
import { ClienteTable } from "@/components/atendimentos/ClienteTable"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import type { Cliente } from "@/types/cliente"

export function AtendimentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [search, setSearch] = useState("")

  const clientesFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()
    if (!termo) return clientes
    return clientes.filter((cliente) =>
      `${cliente.nome} ${cliente.sobrenome}`.toLowerCase().includes(termo),
    )
  }, [clientes, search])

  const loadClientes = useCallback(async () => {
    try {
      const data = await api.get<Cliente[]>("/clientes")
      setClientes(data)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar os clientes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClientes()
  }, [loadClientes])

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
            Atendimentos
          </h1>
          <p className="text-sm text-brand-ink/60">
            Cadastre clientes e acompanhe quem está em lavagem agora.
          </p>
        </div>

        <ClienteForm
          cliente={editingCliente}
          onSaved={() => {
            setEditingCliente(null)
            loadClientes()
          }}
          onCancelEdit={() => setEditingCliente(null)}
        />

        <div className="relative w-full max-w-xs">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
          />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando clientes...</p>
        ) : (
          <ClienteTable clientes={clientesFiltrados} onChange={loadClientes} onEdit={setEditingCliente} />
        )}
      </div>
    </AppShell>
  )
}
