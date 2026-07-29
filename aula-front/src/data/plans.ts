// Conteúdo placeholder — preços e periodicidade a confirmar com o
// Lava-Rápido Nogueira antes de publicar.
export interface Plan {
  name: string
  price: string
  frequency: string
  features: string[]
  highlighted?: boolean
}

export const plans: Plan[] = [
  {
    name: "Essencial",
    price: "R$ 119/mês",
    frequency: "1 lavagem simples por semana",
    features: ["Lavagem externa completa", "Secagem à mão", "Sem taxa de adesão"],
  },
  {
    name: "Completo",
    price: "R$ 219/mês",
    frequency: "1 lavagem completa por semana",
    features: [
      "Lavagem externa e interna",
      "Aspiração e limpeza de estofados",
      "1 higienização interna por mês",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    price: "R$ 349/mês",
    frequency: "2 lavagens completas por semana",
    features: [
      "Tudo do plano Completo",
      "Enceramento mensal incluso",
      "Prioridade de horário no balcão",
    ],
  },
]
