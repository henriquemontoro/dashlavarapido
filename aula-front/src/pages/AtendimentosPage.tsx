import { useCallback, useEffect, useMemo, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { ClienteForm } from "@/components/atendimentos/ClienteForm"
import { ClienteTable } from "@/components/atendimentos/ClienteTable"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { api, ApiError } from "@/lib/api"
import type { Cliente } from "@/types/cliente"

type Aba = "tempo_real" | "finalizados"

export function AtendimentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [search, setSearch] = useState("")
  const [aba, setAba] = useState<Aba>("tempo_real")

  const clientesTempoReal = useMemo(
    () => clientes.filter((cliente) => cliente.status !== "finalizado"),
    [clientes],
  )
  const clientesFinalizados = useMemo(
    () => clientes.filter((cliente) => cliente.status === "finalizado"),
    [clientes],
  )

  const clientesFiltrados = useMemo(() => {
    const base = aba === "tempo_real" ? clientesTempoReal : clientesFinalizados
    const termo = search.trim().toLowerCase()
    if (!termo) return base
    return base.filter((cliente) => `${cliente.nome} ${cliente.sobrenome}`.toLowerCase().includes(termo))
  }, [aba, clientesTempoReal, clientesFinalizados, search])

  const loadClientes = useCallback(async (silent = false) => {
    try {
      const data = await api.get<Cliente[]>("/clientes")
      setClientes(data)
    } catch (error) {
      if (!silent) {
        toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar os clientes")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClientes()
  }, [loadClientes])

  // Atualização automática pra funcionar como painel em tempo real (ex.: numa TV da loja).
  useEffect(() => {
    const interval = setInterval(() => loadClientes(true), 15000)
    return () => clearInterval(interval)
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-md border border-brand-line bg-brand-card p-1">
            <button
              type="button"
              onClick={() => setAba("tempo_real")}
              className={cn(
                "rounded px-4 py-1.5 text-sm font-medium transition-colors",
                aba === "tempo_real" ? "bg-brand text-white" : "text-brand-ink/70 hover:text-brand-ink",
              )}
            >
              Tempo real ({clientesTempoReal.length})
            </button>
            <button
              type="button"
              onClick={() => setAba("finalizados")}
              className={cn(
                "rounded px-4 py-1.5 text-sm font-medium transition-colors",
                aba === "finalizados" ? "bg-brand text-white" : "text-brand-ink/70 hover:text-brand-ink",
              )}
            >
              Finalizados ({clientesFinalizados.length})
            </button>
          </div>

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
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando clientes...</p>
        ) : (
          <ClienteTable
            clientes={clientesFiltrados}
            onChange={loadClientes}
            onEdit={setEditingCliente}
            emptyMessage={
              aba === "finalizados"
                ? "Nenhum atendimento finalizado ainda."
                : "Nenhum cliente em andamento no momento."
            }
          />
        )}
      </div>
    </AppShell>
  )
}
