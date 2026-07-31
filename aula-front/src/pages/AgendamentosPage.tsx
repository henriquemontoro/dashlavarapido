import { useCallback, useEffect, useMemo, useState } from "react"
import { MagnifyingGlass } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Agendamento } from "@/types/agendamento"

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function formatarPreco(preco: number) {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [cancelingId, setCancelingId] = useState<number | null>(null)

  const loadAgendamentos = useCallback(async (silent = false) => {
    try {
      const data = await api.get<Agendamento[]>("/agendamentos")
      setAgendamentos(data)
    } catch (error) {
      if (!silent) {
        toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar os agendamentos")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAgendamentos()
  }, [loadAgendamentos])

  // Atualização automática pra refletir agendamentos novos feitos pelo assistente no WhatsApp.
  useEffect(() => {
    const interval = setInterval(() => loadAgendamentos(true), 15000)
    return () => clearInterval(interval)
  }, [loadAgendamentos])

  const cancelarAgendamento = useCallback(async (agendamento: Agendamento) => {
    setCancelingId(agendamento.id)
    try {
      const atualizado = await api.patch<Agendamento>(`/agendamentos/${agendamento.id}/cancelar`)
      setAgendamentos((atual) => atual.map((item) => (item.id === atualizado.id ? atualizado : item)))
      toast.success("Agendamento desmarcado")
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível desmarcar o agendamento")
    } finally {
      setCancelingId(null)
      setConfirmingId(null)
    }
  }, [])

  const agendamentosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase()
    if (!termo) return agendamentos
    return agendamentos.filter((agendamento) =>
      `${agendamento.nome} ${agendamento.sobrenome} ${agendamento.modelo_carro}`.toLowerCase().includes(termo),
    )
  }, [agendamentos, search])

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">Agenda</h1>
          <p className="text-sm text-brand-ink/60">
            Agendamentos feitos pelo assistente no WhatsApp para os próximos dias.
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
          />
          <Input
            placeholder="Buscar por nome ou carro..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando agendamentos...</p>
        ) : agendamentosFiltrados.length === 0 ? (
          <p className="text-sm text-brand-ink/50">Nenhum agendamento nos próximos dias.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-brand-line bg-brand-card">
            <table className="w-full text-sm">
              <thead className="bg-brand-surface text-left text-xs uppercase tracking-wide text-brand-ink/60">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Horário</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Carro</th>
                  <th className="px-4 py-3">Serviços</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {agendamentosFiltrados.map((agendamento) => (
                  <tr key={agendamento.id} className={agendamento.status === "cancelado" ? "opacity-50" : undefined}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatarData(agendamento.data)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {agendamento.horario_inicio}–{agendamento.horario_fim}
                    </td>
                    <td className="px-4 py-3">
                      {agendamento.nome} {agendamento.sobrenome}
                      <div className="text-xs text-brand-ink/50">{agendamento.telefone}</div>
                    </td>
                    <td className="px-4 py-3">
                      {agendamento.modelo_carro}
                      {agendamento.placa && <div className="text-xs text-brand-ink/50">{agendamento.placa}</div>}
                    </td>
                    <td className="px-4 py-3">{agendamento.servicos.join(", ")}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatarPreco(agendamento.preco_total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "w-fit rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          agendamento.status === "cancelado"
                            ? "bg-red-100 text-red-700"
                            : "bg-brand/10 text-brand",
                        )}
                      >
                        {agendamento.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {agendamento.status === "cancelado" ? null : confirmingId === agendamento.id ? (
                        <span className="flex items-center justify-end gap-2 text-xs">
                          <span className="text-brand-ink/60">Desmarcar?</span>
                          <button
                            type="button"
                            disabled={cancelingId === agendamento.id}
                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                            onClick={() => cancelarAgendamento(agendamento)}
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
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="text-xs font-medium text-brand-ink/50 hover:text-red-600 hover:underline"
                          onClick={() => setConfirmingId(agendamento.id)}
                        >
                          Desmarcar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  )
}
