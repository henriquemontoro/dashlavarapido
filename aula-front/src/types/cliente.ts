export type ClienteStatus = "aguardando" | "em_andamento" | "finalizado"

export interface Cliente {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  modelo_carro: string
  placa: string | null
  status: ClienteStatus
  atendimento_ativo_id: number | null
  atendimento_iniciado_em: string | null
  atendimento_finalizado_em: string | null
  ultimo_atendimento_id: number | null
  fotos_inicio_count: number
  fotos_fim_count: number
}
