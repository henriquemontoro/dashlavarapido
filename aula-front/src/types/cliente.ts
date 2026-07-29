export type ClienteStatus = "aguardando" | "em_andamento" | "finalizado"

export interface Cliente {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  modelo_carro: string
  status: ClienteStatus
  atendimento_ativo_id: number | null
  atendimento_iniciado_em: string | null
  atendimento_finalizado_em: string | null
}
