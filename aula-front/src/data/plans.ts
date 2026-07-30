// Planos de assinatura reais do Lava-Rápido Nogueira (POP-OPE-001). Contemplam
// exclusivamente Lavagem Completa e Cera — os demais serviços do catálogo
// nunca entram em nenhum plano, sempre cobrados avulso (nota única na
// página de planos, não repetida em cada card).
export interface PlanoServico {
  nome: string
  quantidade: number
}

export interface Plan {
  name: string
  price: string
  highlighted?: boolean
  servicos: PlanoServico[]
}

function montarServicos(lavagensCompletas: number, ceras: number): PlanoServico[] {
  return [
    { nome: "Lavagem Completa", quantidade: lavagensCompletas },
    { nome: "Cera", quantidade: ceras },
  ]
}

export const plans: Plan[] = [
  {
    name: "Bronze",
    price: "R$ 129,99/mês",
    servicos: montarServicos(2, 1),
  },
  {
    name: "Prata",
    price: "R$ 229,99/mês",
    highlighted: true,
    servicos: montarServicos(4, 2),
  },
  {
    name: "Ouro",
    price: "R$ 259,99/mês",
    servicos: montarServicos(6, 3),
  },
]
