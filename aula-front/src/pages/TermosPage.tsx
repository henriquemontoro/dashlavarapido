import { useCallback, useEffect, useState } from "react"
import { Trash } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { api, ApiError } from "@/lib/api"
import { parseApiDate } from "@/lib/parseApiDate"

interface RespostaTermo {
  atendimento_id: number
  cliente_nome: string
  placa: string | null
  modelo_carro: string | null
  cpf: string | null
  tem_plano: boolean
  plano: string | null
  aceito_em: string | null
}

export function TermosPage() {
  const [respostas, setRespostas] = useState<RespostaTermo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const loadRespostas = useCallback(async () => {
    try {
      const data = await api.get<RespostaTermo[]>("/termo/respostas")
      setRespostas(data)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar as respostas")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRespostas()
  }, [loadRespostas])

  async function excluir(atendimentoId: number) {
    setPendingId(atendimentoId)
    try {
      await api.delete(`/termo/respostas/${atendimentoId}`)
      toast.success("Termo removido")
      loadRespostas()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível remover o termo")
    } finally {
      setPendingId(null)
      setConfirmingId(null)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
            Termos de adesão
          </h1>
          <p className="text-sm text-brand-ink/60">Quem já assinou o termo de adesão pelo link enviado.</p>
        </div>

        {isLoading ? (
          <p className="text-sm text-brand-ink/50">Carregando...</p>
        ) : respostas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-line bg-brand-card/60 p-8 text-center text-sm text-brand-ink/50">
            Nenhum termo assinado ainda.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brand-line bg-brand-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink/60">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Veículo</th>
                  <th className="px-4 py-3 font-medium">CPF</th>
                  <th className="px-4 py-3 font-medium">Plano</th>
                  <th className="px-4 py-3 font-medium">Assinado em</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {respostas.map((resposta) => (
                  <tr key={resposta.atendimento_id} className="border-b border-brand-line last:border-0">
                    <td className="px-4 py-3 text-brand-ink">{resposta.cliente_nome}</td>
                    <td className="px-4 py-3 text-brand-ink/70">
                      {resposta.modelo_carro}
                      {resposta.placa ? ` · ${resposta.placa}` : ""}
                    </td>
                    <td className="px-4 py-3 text-brand-ink/70">{resposta.cpf ?? "—"}</td>
                    <td className="px-4 py-3 text-brand-ink/70">
                      {resposta.tem_plano ? (resposta.plano ?? "Sim") : "Sem plano"}
                    </td>
                    <td className="px-4 py-3 text-brand-ink/70">
                      {resposta.aceito_em ? parseApiDate(resposta.aceito_em).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {confirmingId === resposta.atendimento_id ? (
                        <div className="flex items-center gap-2 whitespace-nowrap text-xs">
                          <span className="text-brand-ink/60">Remover?</span>
                          <button
                            type="button"
                            disabled={pendingId === resposta.atendimento_id}
                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                            onClick={() => excluir(resposta.atendimento_id)}
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
                        <button
                          type="button"
                          aria-label={`Remover termo de ${resposta.cliente_nome}`}
                          className="rounded-md p-1.5 text-brand-ink/60 transition-colors hover:bg-brand-surface hover:text-red-600"
                          onClick={() => setConfirmingId(resposta.atendimento_id)}
                        >
                          <Trash size={16} />
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
