import type { IconProps } from "@phosphor-icons/react"
import {
  Armchair,
  Broom,
  Car,
  Drop,
  Engine,
  Fan,
  PaintBrush,
  Sparkle,
  SquareHalf,
  Tire,
  Umbrella,
  Wind,
} from "@phosphor-icons/react"
import type { ComponentType } from "react"

// Lista de serviços real, confirmada com o Lava-Rápido Nogueira. Fotos são
// de banco gratuito (Unsplash, licença livre para uso comercial), não são
// fotos do estabelecimento — trocar por fotos reais quando disponíveis.
export interface Service {
  icon: ComponentType<IconProps>
  image: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    icon: Drop,
    image: "/services/lavagem-simples.jpg",
    title: "Lavagem Simples",
    description: "Limpeza externa do veículo com shampoo automotivo, enxágue e secagem manual.",
  },
  {
    icon: Car,
    image: "/services/lavagem-completa.jpg",
    title: "Lavagem Completa",
    description: "Limpeza externa e interna, incluindo aspiração, limpeza de painéis, vidros e secagem.",
  },
  {
    icon: Engine,
    image: "/services/lavagem-motor.jpg",
    title: "Lavagem de Motor",
    description: "Limpeza do compartimento do motor com produtos adequados e técnicas que preservem seus componentes.",
  },
  {
    icon: Fan,
    image: "/services/aspiracao-interna.jpg",
    title: "Aspiração Interna",
    description: "Aspiração de bancos, carpetes, tapetes e porta-malas para remoção de poeira e resíduos.",
  },
  {
    icon: Wind,
    image: "/services/secagem.jpg",
    title: "Secagem",
    description: "Secagem manual com toalhas de microfibra e/ou soprador de ar para evitar manchas e acúmulo de água.",
  },
  {
    icon: Sparkle,
    image: "/services/enceramento-cristalizacao.jpg",
    title: "Enceramento",
    description: "Aplicação de cera automotiva para proporcionar brilho e proteção temporária da pintura.",
  },
  {
    icon: PaintBrush,
    image: "/services/polimento-farois.jpg",
    title: "Polimento",
    description: "Tratamento da pintura para reduzir riscos superficiais, restaurar o brilho e melhorar o acabamento estético.",
  },
  {
    icon: Broom,
    image: "/services/higienizacao-interna.jpg",
    title: "Higienização Interna",
    description: "Limpeza completa do interior do veículo com produtos específicos para eliminação de sujeiras, odores e microrganismos.",
  },
  {
    icon: Armchair,
    image: "/services/hidratacao-couro.jpg",
    title: "Hidratação de Couro",
    description: "Limpeza e aplicação de hidratante específico para conservação dos revestimentos em couro.",
  },
  {
    icon: Tire,
    image: "/services/limpeza-rodas-pneus.jpg",
    title: "Limpeza de Rodas e Pneus",
    description: "Limpeza detalhada das rodas e pneus, com aplicação de produto para acabamento e proteção quando contratado.",
  },
  {
    icon: SquareHalf,
    image: "/services/limpeza-vidros.jpg",
    title: "Limpeza de Vidros",
    description: "Limpeza interna e externa dos vidros para remoção de manchas, resíduos e melhoria da visibilidade.",
  },
  {
    icon: Umbrella,
    image: "/services/impermeabilizacao-bancos.jpg",
    title: "Impermeabilização de Bancos",
    description: "Aplicação de impermeabilizante para aumentar a proteção dos estofados contra líquidos e sujeiras.",
  },
]

// Fonte única dos nomes de serviço usados no checklist de atendimento
// (cadastro de cliente e progresso do Portal Nogueira).
export const SERVICE_NAMES: string[] = services.map((service) => service.title)

// Tempo esperado (minutos) por serviço — usado tanto pra saber o tamanho da
// contagem regressiva quanto pra colorir o timer quando estoura o previsto.
// Estimativa inicial, ajustável.
export const SERVICE_EXPECTED_MINUTES: Record<string, number> = {
  "Lavagem Simples": 15,
  "Lavagem Completa": 30,
  "Lavagem de Motor": 15,
  "Aspiração Interna": 10,
  Secagem: 10,
  Enceramento: 20,
  Polimento: 30,
  "Higienização Interna": 25,
  "Hidratação de Couro": 15,
  "Limpeza de Rodas e Pneus": 10,
  "Limpeza de Vidros": 10,
  "Impermeabilização de Bancos": 15,
}

// Ordem operacional de execução dos serviços (não é a ordem de exibição dos
// cards do site institucional). Define qual serviço "é a vez" no checklist:
// os timers rodam um de cada vez, nessa sequência, não todos juntos.
export const SERVICE_ORDER: string[] = [
  "Lavagem Simples",
  "Lavagem Completa",
  "Lavagem de Motor",
  "Limpeza de Rodas e Pneus",
  "Secagem",
  "Aspiração Interna",
  "Higienização Interna",
  "Limpeza de Vidros",
  "Hidratação de Couro",
  "Impermeabilização de Bancos",
  "Polimento",
  "Enceramento",
]
