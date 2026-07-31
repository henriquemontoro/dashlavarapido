import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { UploadSimple } from "@phosphor-icons/react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { api, ApiError } from "@/lib/api"
import type { ImportarPlanilhaResultado } from "@/types/dashboard"

const COLUNAS_ESPERADAS = [
  "id_lavagem",
  "data (AAAA-MM-DD)",
  "ano",
  "mes",
  "dia_semana",
  "cliente",
  "cpf",
  "tipo_carro",
  "funcionario_lavagem",
  "t_teto_vidros_min",
  "t_capo_parabrisa_min",
  "t_laterais_portas_min",
  "t_traseira_min",
  "t_rodas_pneus_min",
  "t_interior_min",
  "tempo_lavagem_total_min",
  "tempo_espera_antes_lavagem_min",
  "tempo_pos_lavagem_ate_retirada_min",
  "tempo_ate_pagamento_min",
  "atendente_pagamento",
  "cnpj_receita",
  "metodo_pagamento",
  "preco_reais",
  "nps_cliente",
  "nota_google",
  "shampoo_ml",
  "cera_ml",
  "pretinho_ml",
  "aromatizante_ml",
]

const TIPOS_CARRO = ["Hatch", "Picape", "Sedã", "SUV", "Utilitário"]
const METODOS_PAGAMENTO = ["Cartão de crédito", "Cartão de débito", "Dinheiro", "Pix", "Fiado/Mensal"]

interface ImportarDadosModalProps {
  open: boolean
  onClose: () => void
  onImportado: () => void
}

export function ImportarDadosModal({ open, onClose, onImportado }: ImportarDadosModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultado, setResultado] = useState<ImportarPlanilhaResultado | null>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    setIsSubmitting(true)
    setResultado(null)
    try {
      const formData = new FormData()
      formData.append("arquivo", arquivo)
      const data = await api.postForm<ImportarPlanilhaResultado>("/dashboard/importar", formData)
      setResultado(data)
      if (data.linhas_novas + data.linhas_atualizadas > 0) {
        toast.success(`${data.linhas_novas} linhas novas, ${data.linhas_atualizadas} atualizadas.`)
        onImportado()
      } else {
        toast.error("Nenhuma linha válida foi encontrada na planilha.")
      }
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível importar a planilha")
    } finally {
      setIsSubmitting(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleClose() {
    setResultado(null)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Importar dados">
      <div className="flex flex-col gap-4 text-sm text-brand-ink/80">
        <p>
          Envie um arquivo <strong>.xlsx</strong>. Cada aba da planilha é lida e incorporada ao painel — é
          assim que um novo período (nova aba gerada pela operação) entra no dashboard, sem precisar
          substituir o histórico existente.
        </p>

        <div className="rounded-md border border-brand-line bg-brand-surface p-3">
          <p className="mb-2 font-medium text-brand-ink">O arquivo precisa seguir exatamente este padrão:</p>
          <p className="mb-2">
            <span className="font-medium">Colunas obrigatórias (28), nesta grafia exata:</span>
          </p>
          <div className="mb-2 flex flex-wrap gap-1">
            {COLUNAS_ESPERADAS.map((coluna) => (
              <code key={coluna} className="rounded bg-brand-line/50 px-1.5 py-0.5 text-xs">
                {coluna}
              </code>
            ))}
          </div>
          <p className="mb-1">
            <span className="font-medium">tipo_carro</span> apenas: {TIPOS_CARRO.join(", ")}
          </p>
          <p>
            <span className="font-medium">metodo_pagamento</span> apenas: {METODOS_PAGAMENTO.join(", ")}
          </p>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-brand-line bg-brand-card p-6 text-center transition-colors hover:bg-brand-surface">
          <UploadSimple size={24} className="text-brand-cyan" />
          <span className="text-sm font-medium text-brand-ink">
            {isSubmitting ? "Importando..." : "Clique para escolher o arquivo .xlsx"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            disabled={isSubmitting}
            onChange={handleFileChange}
          />
        </label>

        {resultado && (
          <div className="rounded-md border border-brand-line p-3">
            <p className="font-medium text-brand-ink">Resultado da importação</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <li>Abas processadas: {resultado.abas_processadas}</li>
              <li>Linhas lidas: {resultado.linhas_lidas}</li>
              <li>Linhas novas: {resultado.linhas_novas}</li>
              <li>Linhas atualizadas: {resultado.linhas_atualizadas}</li>
              <li>Linhas rejeitadas: {resultado.linhas_rejeitadas}</li>
            </ul>
            {resultado.erros.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-brand-ink">
                  Motivos das rejeições ({resultado.total_erros}
                  {resultado.total_erros > resultado.erros.length ? `, mostrando ${resultado.erros.length}` : ""}
                  ):
                </p>
                <ul className="mt-1 max-h-32 list-disc space-y-0.5 overflow-y-auto pl-4 text-xs text-brand-ink/70">
                  {resultado.erros.map((erro, index) => (
                    <li key={index}>{erro}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Button type="button" variant="outline" onClick={handleClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  )
}
