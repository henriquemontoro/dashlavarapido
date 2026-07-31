export type AgendamentoStatus = "confirmado" | "cancelado"

export interface Agendamento {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  modelo_carro: string
  placa: string | null
  servicos: string[]
  preco_total: number
  data: string
  horario_inicio: string
  horario_fim: string
  status: AgendamentoStatus
  criado_em: string | null
}
