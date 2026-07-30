import { useState } from "react"
import { Images, PencilSimple, Trash } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Cliente } from "@/types/cliente"
import { PhotoCaptureModal } from "@/components/atendimentos/PhotoCaptureModal"
import { PhotoViewerModal } from "@/components/atendimentos/PhotoViewerModal"

const statusLabel: Record<Cliente["status"], string> = {
  aguardando: "Aguardando",
  em_andamento: "Em atendimento",
  finalizado: "Finalizado",
}

const statusClass: Record<Cliente["status"], string> = {
  aguardando: "text-brand-ink/50",
  em_andamento: "bg-brand-cyan/20 text-brand-dark px-2.5 py-1 rounded-full",
  finalizado: "bg-brand/10 text-brand px-2.5 py-1 rounded-full",
}

interface ClienteTableProps {
  clientes: Cliente[]
  onChange: () => void
  onEdit: (cliente: Cliente) => void
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

export function ClienteTable({ clientes, onChange, onEdit }: ClienteTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const [captureState, setCaptureState] = useState<CaptureState | null>(null)
  const [viewerState, setViewerState] = useState<ViewerState | null>(null)

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
        Nenhum cliente cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-brand-line bg-brand-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink/60">
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Telefone</th>
            <th className="px-4 py-3 font-medium">Carro</th>
            <th className="px-4 py-3 font-medium">Placa</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Ação</th>
            <th className="px-4 py-3 font-medium">Fotos</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => {
            const emAndamento = cliente.atendimento_ativo_id !== null
            return (
              <tr key={cliente.id} className="border-b border-brand-line last:border-0">
                <td className="px-4 py-3 text-brand-ink">
                  {cliente.nome} {cliente.sobrenome}
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{cliente.telefone}</td>
                <td className="px-4 py-3 text-brand-ink/70">{cliente.modelo_carro}</td>
                <td className="px-4 py-3 text-brand-ink/70">{cliente.placa ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-xs font-medium", statusClass[cliente.status])}>
                    {statusLabel[cliente.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    className="w-fit"
                    variant={emAndamento ? "primary" : "outline"}
                    disabled={pendingId === cliente.id}
                    onClick={() =>
                      setCaptureState({ cliente, mode: emAndamento ? "finalizar" : "iniciar" })
                    }
                  >
                    {emAndamento ? "Finalizar atendimento" : "Iniciar atendimento"}
                  </Button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1 whitespace-nowrap">
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
                </td>
                <td className="px-4 py-3">
                  {confirmingId === cliente.id ? (
                    <div className="flex items-center gap-2 whitespace-nowrap text-xs">
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
                        className="rounded-md p-1.5 text-brand-ink/60 transition-colors hover:bg-brand-surface hover:text-brand-ink"
                        onClick={() => onEdit(cliente)}
                      >
                        <PencilSimple size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Excluir ${cliente.nome}`}
                        className="rounded-md p-1.5 text-brand-ink/60 transition-colors hover:bg-brand-surface hover:text-red-600"
                        onClick={() => setConfirmingId(cliente.id)}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <PhotoCaptureModal
        open={captureState !== null}
        title={captureState?.mode === "finalizar" ? "Fotos do carro — finalização" : "Fotos do carro — início"}
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
