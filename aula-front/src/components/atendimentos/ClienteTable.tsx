import { useState } from "react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Cliente } from "@/types/cliente"

export function ClienteTable({ clientes, onChange }: { clientes: Cliente[]; onChange: () => void }) {
  const [pendingId, setPendingId] = useState<number | null>(null)

  async function iniciar(cliente: Cliente) {
    setPendingId(cliente.id)
    try {
      await api.post("/atendimentos", { cliente_id: cliente.id })
      toast.success(`Atendimento iniciado para ${cliente.nome}`)
      onChange()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível iniciar o atendimento")
    } finally {
      setPendingId(null)
    }
  }

  async function finalizar(cliente: Cliente) {
    if (!cliente.atendimento_ativo_id) return
    setPendingId(cliente.id)
    try {
      await api.post(`/atendimentos/${cliente.atendimento_ativo_id}/finalizar`)
      toast.success(`Cliente avisado — atendimento de ${cliente.nome} finalizado`)
      onChange()
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível finalizar o atendimento")
    } finally {
      setPendingId(null)
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
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Ação</th>
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
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      emAndamento ? "bg-brand-cyan/20 text-brand-dark" : "text-brand-ink/50",
                    )}
                  >
                    {emAndamento ? "Em atendimento" : "Aguardando"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    className="w-fit"
                    variant={emAndamento ? "primary" : "outline"}
                    disabled={pendingId === cliente.id}
                    onClick={() => (emAndamento ? finalizar(cliente) : iniciar(cliente))}
                  >
                    {emAndamento ? "Finalizar atendimento" : "Iniciar atendimento"}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
