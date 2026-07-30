import type { IconProps } from "@phosphor-icons/react"
import { Armchair, Broom, Car, Engine, PaintBrush, Sparkle } from "@phosphor-icons/react"
import type { ComponentType } from "react"

// Catálogo real de serviços do Lava-Rápido Nogueira. A ORDEM da lista é a
// ordem operacional de execução (o que é feito primeiro), usada tanto na
// seleção de serviços do atendimento quanto no checklist do card. Pacotes
// com "detalhamento" viram várias etapas checáveis (uma por item da lista);
// sem detalhamento, o pacote inteiro é uma única etapa.
export interface ServiceOffering {
  title: string
  minutes: number
  price: number
  detalhamento?: string[]
}

export const SERVICE_CATALOG: ServiceOffering[] = [
  { title: "Lavagem do Motor", minutes: 60, price: 35 },
  {
    title: "Lavagem Simples",
    minutes: 20,
    price: 50,
    detalhamento: [
      "Lavagem do tapete",
      "Aspiração",
      "Pano úmido",
      "Limpeza vidro",
      "Secagem do tapete",
      "Pretinho",
      "Cheirinho",
    ],
  },
  {
    title: "Lavagem Completa",
    minutes: 60,
    price: 90,
    detalhamento: [
      "Jato de alta pressão",
      "Shampoo de cima a baixo",
      "Enxágue",
      "Secagem",
      "Sopro de ar",
      "Lavagem do tapete",
      "Aspiração",
      "Pano úmido",
      "Limpeza vidro",
      "Secagem do tapete",
      "Pretinho",
      "Cheirinho",
    ],
  },
  { title: "Polimento", minutes: 240, price: 500 },
  { title: "Cera", minutes: 20, price: 30 },
  { title: "Higienização do Couro", minutes: 120, price: 75 },
  { title: "Higienização do Tecido", minutes: 100, price: 50 },
]

export const SERVICE_NAMES: string[] = SERVICE_CATALOG.map((service) => service.title)

const CATALOG_BY_TITLE = new Map(SERVICE_CATALOG.map((service) => [service.title, service]))
const CATALOG_ORDER_INDEX = new Map(SERVICE_CATALOG.map((service, index) => [service.title, index]))

export function getServiceOrderIndex(title: string): number {
  return CATALOG_ORDER_INDEX.get(title) ?? SERVICE_CATALOG.length
}

export function getServicePrice(title: string): number {
  return CATALOG_BY_TITLE.get(title)?.price ?? 0
}

export function calcularPrecoTotal(servicos: string[]): number {
  return servicos.reduce((total, title) => total + getServicePrice(title), 0)
}

// Minutos esperados de uma ETAPA já expandida do checklist (rótulo completo
// vindo do backend, ex.: "Lavagem Completa · Jato de alta pressão"). Pacotes
// com detalhamento dividem o tempo total igualmente entre as etapas.
const STEP_EXPECTED_MINUTES: Record<string, number> = (() => {
  const map: Record<string, number> = {}
  for (const service of SERVICE_CATALOG) {
    if (service.detalhamento && service.detalhamento.length > 0) {
      const perStep = Math.max(1, Math.round(service.minutes / service.detalhamento.length))
      for (const passo of service.detalhamento) {
        map[`${service.title} · ${passo}`] = perStep
      }
    } else {
      map[service.title] = service.minutes
    }
  }
  return map
})()

export function getStepExpectedMinutes(stepLabel: string): number {
  return STEP_EXPECTED_MINUTES[stepLabel] ?? 20
}

// Cards do site institucional — um por pacote (não um por item de
// detalhamento). Fotos são de banco gratuito (Unsplash, licença livre para
// uso comercial), não são fotos do estabelecimento.
export interface Service {
  icon: ComponentType<IconProps>
  image: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    icon: Engine,
    image: "/services/lavagem-motor.jpg",
    title: "Lavagem do Motor",
    description: "Limpeza do compartimento do motor com produtos adequados e técnicas que preservem seus componentes.",
  },
  {
    icon: Car,
    image: "/services/lavagem-simples.jpg",
    title: "Lavagem Simples",
    description:
      "Lavagem externa completa: lavagem e secagem do tapete, aspiração, pano úmido, limpeza de vidros, pretinho nos pneus e cheirinho.",
  },
  {
    icon: Car,
    image: "/services/lavagem-completa.jpg",
    title: "Lavagem Completa",
    description:
      "Externa e interna: jato de alta pressão, shampoo, enxágue, secagem e sopro de ar, além de lavagem e secagem do tapete, aspiração, pano úmido, limpeza de vidros, pretinho e cheirinho.",
  },
  {
    icon: PaintBrush,
    image: "/services/polimento-farois.jpg",
    title: "Polimento",
    description: "Tratamento da pintura para reduzir riscos superficiais, restaurar o brilho e melhorar o acabamento estético.",
  },
  {
    icon: Sparkle,
    image: "/services/enceramento-cristalizacao.jpg",
    title: "Cera",
    description: "Aplicação de cera automotiva para proporcionar brilho e proteção temporária da pintura.",
  },
  {
    icon: Armchair,
    image: "/services/hidratacao-couro.jpg",
    title: "Higienização do Couro",
    description: "Limpeza e hidratação específica para conservação e renovação dos revestimentos em couro.",
  },
  {
    icon: Broom,
    image: "/services/higienizacao-interna.jpg",
    title: "Higienização do Tecido",
    description: "Limpeza profunda de bancos e carpetes de tecido, eliminando sujeiras, odores e microrganismos.",
  },
]
