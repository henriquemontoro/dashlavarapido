export interface Cliente {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  modelo_carro: string
  atendimento_ativo_id: number | null
  atendimento_iniciado_em: string | null
}
