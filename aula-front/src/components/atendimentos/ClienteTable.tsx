import { useEffect, useMemo, useState } from "react"
import { Car, Check, Images, PencilSimple, Phone, Trash } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SERVICE_EXPECTED_MINUTES, SERVICE_ORDER } from "@/data/services"
import { formatDuration } from "@/lib/formatDuration"
import { parseApiDate } from "@/lib/parseApiDate"
import type { Cliente, ServicoStatus } from "@/types/cliente"
import { PhotoCaptureModal } from "@/components/atendimentos/PhotoCaptureModal"
import { PhotoViewerModal } from "@/components/atendimentos/PhotoViewerModal"

const statusLabel: Record<Cliente["status"], string> = {
  aguardando: "Aguardando",
  em_andamento: "Em atendimento",
  finalizado: "Finalizado",
}

const statusBadgeClass: Record<Cliente["status"], string> = {
  aguardando: "bg-brand-surface text-brand-ink/60",
  em_andamento: "bg-brand-cyan/20 text-brand-dark",
  finalizado: "bg-brand/10 text-brand",
}

interface ServicoBase {
  id: number
  servico: string
  concluido: boolean
  concluido_em: string | null
}

interface ServicoTimelineItem extends ServicoBase {
  isCurrent: boolean
  isFuture: boolean
  elapsedMs: number | null
}

// Serviços rodam UM DE CADA VEZ, na ordem operacional (SERVICE_ORDER), não
// todos ao mesmo tempo: o timer do próximo só começa quando o anterior é
// marcado como concluído. Retorna a lista com o tempo de cada um e, se todos
// já foram concluídos, o instante em que o último terminou (pra congelar o
// "tempo total" do atendimento nesse ponto, sem continuar contando).
function buildServicoTimeline(servicos: ServicoBase[], iniciadoEmMs: number | null, now: number) {
  const ordenados = [...servicos].sort(
    (a, b) => SERVICE_ORDER.indexOf(a.servico) - SERVICE_ORDER.indexOf(b.servico),
  )
  const currentIndex = ordenados.findIndex((item) => !item.concluido)
  let cursorMs = iniciadoEmMs

  const itens: ServicoTimelineItem[] = ordenados.map((item, index) => {
    const isCurrent = index === currentIndex
    const isFuture = currentIndex !== -1 && index > currentIndex
    const startMs = cursorMs
    let elapsedMs: number | null = null

    if (item.concluido && item.concluido_em && startMs != null) {
      const endMs = parseApiDate(item.concluido_em).getTime()
      elapsedMs = Math.max(0, endMs - startMs)
      cursorMs = endMs
    } else if (isCurrent && startMs != null) {
      elapsedMs = Math.max(0, now - startMs)
    }

    return { ...item, isCurrent, isFuture, elapsedMs }
  })

  const todosConcluidos = ordenados.length > 0 && currentIndex === -1
  return { itens, tempoTotalCongeladoEm: todosConcluidos ? cursorMs : null }
}

interface ClienteTableProps {
  clientes: Cliente[]
  onChange: () => void
  onEdit: (cliente: Cliente) => void
  emptyMessage?: string
}

interface CaptureState {
  cliente: Cliente
  mode: "iniciar" | "finalizar"
}

interface ViewerState {
  atendimentoId: number
  momento: "inicio" | "fim"
  title: string
}

export function ClienteTable({
  clientes,
  onChange,
  onEdit,
  emptyMessage = "Nenhum cliente cadastrado ainda.",
}: ClienteTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [captureState, setCaptureState] = useState<CaptureState | null>(null)
  const [viewerState, setViewerState] = useState<ViewerState | null>(null)
  const [togglingServicoId, setTogglingServicoId] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  // Atualização otimista do check de serviço: o PATCH + refetch demoram um
  // pouco, então marcamos localmente na hora do clique e só "soltamos" o
  // valor otimista quando o dado real (vindo do refetch) já confirma.
  const [servicoOverrides, setServicoOverrides] = useState<Record<number, boolean>>({})

  useEffect(() => {
    setServicoOverrides((prev) => {
      if (Object.keys(prev).length === 0) return prev
      const next = { ...prev }
      let changed = false
      for (const cliente of clientes) {
        for (const item of cliente.servicos_status) {
          if (next[item.id] !== undefined && next[item.id] === item.concluido) {
            delete next[item.id]
            changed = true
          }
        }
      }
      return changed ? next : prev
    })
  }, [clientes])

  const temAtendimentoAtivo = useMemo(
    () => clientes.some((cliente) => cliente.atendimento_ativo_id !== null),
    [clientes],
  )

  // Só fica "ticando" (1x/s) enquanto houver algum atendimento em andamento na tela.
  useEffect(() => {
    if (!temAtendimentoAtivo) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [temAtendimentoAtivo])

  async function handleCaptureConfirm(files: File[]) {
    if (!captureState) return
    const { cliente, mode } = captureState
    setPendingId(cliente.id)
    try {
      const formData = new FormData()
      files.forEach((file) => formData.append("fotos", file))

      if (mode === "iniciar") {
        formData.append("cliente_id", String(cliente.id))
        await api.postForm("/atendimentos", formData)
        toast.success(`Atendimento iniciado para ${cliente.nome}`)
      } else {
        if (!cliente.atendimento_ativo_id) return
        await api.postForm(`/atendimentos/${cliente.atendimento_ativo_id}/finalizar`, formData)
        toast.success(`Cliente avisado — atendimento de ${cliente.nome} finalizado`)
      }
      setCaptureState(null)
      onChange()
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : mode === "iniciar"
            ? "Não foi possível iniciar o atendimento"
            : "Não foi possível finalizar o atendimento",
      )
    } finally {
      setPendingId(null)
    }
  }

  async function toggleServico(cliente: Cliente, item: ServicoStatus) {
    if (!cliente.atendimento_ativo_id) return
    const novoValor = !item.concluido
    setServicoOverrides((prev) => ({ ...prev, [item.id]: novoValor }))
    setTogglingServicoId(item.id)
    try {
      await api.patch(`/atendimentos/${cliente.atendimento_ativo_id}/servicos/${item.id}`, {
        concluido: novoValor,
      })
      onChange()
    } catch (error) {
      setServicoOverrides((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
      toast.error(error instanceof ApiError ? error.message : "Não foi possível atualizar o serviço")
    } finally {
      setTogglingServicoId(null)
    }
  }

  async function excluir(cliente: Cliente) {
    setPendingId(cliente.id)
    try {
      await api.delete(`/clientes/${cliente.id}`)
      toast.success("Cliente excluído")
      onChange()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível excluir o cliente")
    } finally {
      setPendingId(null)
      setConfirmingId(null)
    }
  }

  if (clientes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-card/60 p-8 text-center text-sm text-brand-ink/50">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {clientes.map((cliente) => {
        const emAndamento = cliente.atendimento_ativo_id !== null
        const isAguardando = cliente.status === "aguardando"
        const servicosStatusEfetivo = cliente.servicos_status.map((item) =>
          servicoOverrides[item.id] !== undefined && servicoOverrides[item.id] !== item.concluido
            ? {
                ...item,
                concluido: servicoOverrides[item.id],
                concluido_em: servicoOverrides[item.id] ? new Date().toISOString() : null,
              }
            : item,
        )
        const pendentes = servicosStatusEfetivo.filter((item) => !item.concluido).length
        const totalServicos = servicosStatusEfetivo.length
        const bloqueadoPorServicos = emAndamento && pendentes > 0
        const bloqueadoPorTermo = emAndamento && !cliente.termo_aceito
        const iniciadoEmMs = cliente.atendimento_iniciado_em
          ? parseApiDate(cliente.atendimento_iniciado_em).getTime()
          : null
        const temTimer = iniciadoEmMs != null && !isAguardando

        const previewServicos: ServicoTimelineItem[] = cliente.servicos.map((servico, index) => ({
          id: -1 - index,
          servico,
          concluido: false,
          concluido_em: null,
          isCurrent: false,
          isFuture: false,
          elapsedMs: null,
        }))
        const { itens: servicosParaExibir, tempoTotalCongeladoEm } = temTimer
          ? buildServicoTimeline(servicosStatusEfetivo, iniciadoEmMs, now)
          : { itens: previewServicos, tempoTotalCongeladoEm: null }

        const tempoTotalMs =
          iniciadoEmMs != null
            ? cliente.status === "finalizado" && cliente.atendimento_finalizado_em
              ? parseApiDate(cliente.atendimento_finalizado_em).getTime() - iniciadoEmMs
              : tempoTotalCongeladoEm != null
                ? tempoTotalCongeladoEm - iniciadoEmMs
                : now - iniciadoEmMs
            : null

        // Soma do tempo estipulado de todos os serviços do atendimento — é contra
        // essa soma que o timer grande (regressivo) conta, não por serviço.
        const expectedTotalMs = servicosParaExibir.reduce(
          (acc, item) => acc + (SERVICE_EXPECTED_MINUTES[item.servico] ?? 20) * 60000,
          0,
        )
        const isFinalizado = cliente.status === "finalizado"
        const remainingTotalMs = tempoTotalMs != null ? expectedTotalMs - tempoTotalMs : null
        const estourouTotal = remainingTotalMs != null && remainingTotalMs < 0
        // Finalizado mostra o tempo total gasto; em andamento mostra a contagem
        // regressiva (ou, se já estourou o previsto, há quanto tempo estourou).
        const tempoGrandeMs =
          tempoTotalMs == null ? null : isFinalizado ? tempoTotalMs : Math.abs(remainingTotalMs as number)

        return (
          <Card key={cliente.id} className="flex flex-col overflow-hidden">
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold uppercase tracking-wide text-brand-ink">
                    {cliente.nome} {cliente.sobrenome}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-ink/60">
                    <span className="flex items-center gap-1">
                      <Car size={13} />
                      {cliente.modelo_carro}
                      {cliente.cor_carro ? ` · ${cliente.cor_carro}` : ""}
                      {cliente.placa ? ` · ${cliente.placa}` : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={13} />
                      {cliente.telefone}
                    </span>
                  </div>
                </div>
                {confirmingId === cliente.id ? (
                  <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs">
                    <span className="text-brand-ink/60">Excluir?</span>
                    <button
                      type="button"
                      disabled={pendingId === cliente.id}
                      className="font-medium text-red-600 hover:underline disabled:opacity-50"
                      onClick={() => excluir(cliente)}
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
                      aria-label={`Editar ${cliente.nome}`}
                      className="rounded-md p-1.5 text-brand-ink/50 transition-colors hover:bg-brand-surface hover:text-brand-ink"
                      onClick={() => onEdit(cliente)}
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir ${cliente.nome}`}
                      className="rounded-md p-1.5 text-brand-ink/50 transition-colors hover:bg-brand-surface hover:text-red-600"
                      onClick={() => setConfirmingId(cliente.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "w-fit rounded-full px-2.5 py-1 text-xs font-medium",
                    statusBadgeClass[cliente.status],
                  )}
                >
                  {statusLabel[cliente.status]}
                </span>
                {emAndamento && (
                  <span
                    className={cn(
                      "w-fit rounded-full px-2 py-0.5 text-[10px] font-medium",
                      cliente.termo_aceito ? "bg-brand/10 text-brand" : "bg-amber-100 text-amber-700",
                    )}
                  >
                    {cliente.termo_aceito ? "Termo assinado" : "Termo pendente"}
                  </span>
                )}
              </div>

              {servicosParaExibir.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-ink/50">Serviços</p>
                    {emAndamento && totalServicos > 0 && (
                      <p className="text-xs font-medium text-brand-ink/50">
                        {totalServicos - pendentes}/{totalServicos}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {servicosParaExibir.map((item) => {
                      const isClickable = emAndamento && (item.concluido || item.isCurrent)

                      // Tempo por serviço é só registro: sempre crescente (tempo
                      // gasto), nunca regressivo e nunca fica vermelho — quem
                      // estoura ou não é o timer grande, contra a soma total.
                      let tempoLabel: string | null = null
                      if (item.elapsedMs != null) {
                        tempoLabel = formatDuration(item.elapsedMs)
                      } else if (item.isFuture) {
                        const expectedMinutes = SERVICE_EXPECTED_MINUTES[item.servico] ?? 20
                        tempoLabel = `~${expectedMinutes}min`
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          disabled={!isClickable || togglingServicoId === item.id}
                          onClick={() => isClickable && toggleServico(cliente, item as ServicoStatus)}
                          className={cn(
                            "flex min-h-11 items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                            item.concluido
                              ? "border-brand/30 bg-brand/10 text-brand"
                              : item.isCurrent
                                ? "border-brand-cyan/50 bg-brand-cyan/10 text-brand-ink"
                                : "border-brand-line bg-brand-surface/40 text-brand-ink/50",
                            isClickable && "cursor-pointer hover:border-brand-cyan active:scale-[0.99]",
                            !isClickable && "cursor-default",
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                item.concluido ? "border-brand bg-brand text-white" : "border-brand-ink/30",
                              )}
                            >
                              {item.concluido && <Check size={12} weight="bold" />}
                            </span>
                            {item.servico}
                          </span>
                          {tempoLabel != null && (
                            <span className="shrink-0 font-mono text-xs tabular-nums text-brand-ink/40">
                              {tempoLabel}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="mt-auto flex flex-col gap-2 pt-1">
                <Button
                  size="default"
                  className="w-full"
                  variant={emAndamento ? "primary" : "outline"}
                  disabled={pendingId === cliente.id || bloqueadoPorServicos || bloqueadoPorTermo}
                  onClick={() => setCaptureState({ cliente, mode: emAndamento ? "finalizar" : "iniciar" })}
                >
                  {emAndamento ? "Finalizar atendimento" : "Iniciar atendimento"}
                </Button>

                {tempoGrandeMs != null && (
                  <div
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2",
                      estourouTotal
                        ? "border-red-300 bg-red-50"
                        : isFinalizado
                          ? "border-brand/30 bg-brand/10"
                          : "border-brand-cyan/50 bg-brand-cyan/10",
                    )}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-brand-ink/60">
                      {isFinalizado ? "Tempo total" : "Tempo"}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-2xl font-bold tabular-nums",
                        estourouTotal ? "text-red-600" : isFinalizado ? "text-brand" : "text-brand-dark",
                      )}
                    >
                      {estourouTotal && !isFinalizado ? "+" : ""}
                      {formatDuration(tempoGrandeMs)}
                    </span>
                  </div>
                )}

                {(cliente.fotos_inicio_count > 0 || cliente.fotos_fim_count > 0) && (
                  <div className="flex flex-wrap gap-3">
                    {cliente.ultimo_atendimento_id != null && cliente.fotos_inicio_count > 0 && (
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-brand-ink/60 hover:text-brand-ink hover:underline"
                        onClick={() =>
                          setViewerState({
                            atendimentoId: cliente.ultimo_atendimento_id as number,
                            momento: "inicio",
                            title: `Fotos iniciais — ${cliente.nome}`,
                          })
                        }
                      >
                        <Images size={14} />
                        Início ({cliente.fotos_inicio_count})
                      </button>
                    )}
                    {cliente.ultimo_atendimento_id != null && cliente.fotos_fim_count > 0 && (
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs text-brand-ink/60 hover:text-brand-ink hover:underline"
                        onClick={() =>
                          setViewerState({
                            atendimentoId: cliente.ultimo_atendimento_id as number,
                            momento: "fim",
                            title: `Fotos finais — ${cliente.nome}`,
                          })
                        }
                      >
                        <Images size={14} />
                        Fim ({cliente.fotos_fim_count})
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <PhotoCaptureModal
        open={captureState !== null}
        title={
          <>
            {captureState?.mode === "finalizar" ? "Fotos do carro — finalização" : "Fotos do carro — início"}{" "}
            <span className="text-red-600">*</span>
          </>
        }
        onClose={() => setCaptureState(null)}
        onConfirm={handleCaptureConfirm}
      />

      <PhotoViewerModal
        open={viewerState !== null}
        onClose={() => setViewerState(null)}
        atendimentoId={viewerState?.atendimentoId ?? null}
        momento={viewerState?.momento ?? "inicio"}
        title={viewerState?.title ?? ""}
      />
    </div>
  )
}
