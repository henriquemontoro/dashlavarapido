export type Period = "week" | "month"

export interface DashboardSummary {
  period: Period
  ano: number
  mes: number | null
  semana: number | null
  inicio: string
  fim: string
  status: "no_data" | "ok"
  clientes_atendidos: number
  total_lavagens: number
  vendas_total: number
  ticket_medio: number
  tempo_operacional_medio_min: number
  produtividade_media_por_funcionario: number
  nps_medio: number
  nota_google_media: number
}

export interface PontoTendencia {
  data: string
  vendas: number
  lavagens: number
}

export interface PontoSatisfacao {
  data: string
  nps_medio: number
  nota_google_media: number
}

export interface Contagem {
  chave: string
  quantidade: number
}

export interface TempoEtapa {
  etapa: string
  minutos_medios: number
}

export interface DashboardGraficos {
  tendencia: PontoTendencia[]
  tempo_por_etapa: TempoEtapa[]
  metodo_pagamento: Contagem[]
  produtividade_funcionario: Contagem[]
  tipo_carro: Contagem[]
  satisfacao_tendencia: PontoSatisfacao[]
  volume_dia_semana: Contagem[]
}

export interface AnosDisponiveis {
  anos: number[]
}

export interface PeriodosDisponiveis {
  meses: number[]
  semanas: number[]
}

export interface ImportarPlanilhaResultado {
  abas_processadas: number
  linhas_lidas: number
  linhas_importadas: number
  linhas_novas: number
  linhas_atualizadas: number
  linhas_rejeitadas: number
  erros: string[]
  total_erros: number
}
