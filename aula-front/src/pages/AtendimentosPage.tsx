import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { ClienteForm } from "@/components/atendimentos/ClienteForm"
import { ClienteTable } from "@/components/atendimentos/ClienteTable"
import { api, ApiError } from "@/lib/api"
import type { Cliente } from "@/types/cliente"

export function AtendimentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

        <ClienteForm onCreated={loadClientes} />

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando clientes...</p>
        ) : (
          <ClienteTable clientes={clientes} onChange={loadClientes} />
        )}
      </div>
    </AppShell>
  )
}
