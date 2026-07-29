import type { IconProps } from "@phosphor-icons/react"
import { Broom, Car, Drop, Engine, Sparkle, SprayBottle } from "@phosphor-icons/react"
import type { ComponentType } from "react"

// Descrições são placeholder — lista real de serviços e preços a
// confirmar com o Lava-Rápido Nogueira antes de publicar. Fotos são de
// banco gratuito (Unsplash, licença livre para uso comercial), não são
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
    title: "Lavagem simples",
    description: "Lavagem externa completa com produtos próprios para não riscar a pintura.",
  },
  {
    icon: Car,
    image: "/services/lavagem-completa.jpg",
    title: "Lavagem completa",
    description: "Externa e interna: carpetes, painel e bancos, com secagem cuidadosa à mão.",
  },
  {
    icon: Broom,
    image: "/services/higienizacao-interna.jpg",
    title: "Higienização interna",
    description: "Aspiração profunda, limpeza de estofados e eliminação de odores do interior do carro.",
  },
  {
    icon: Sparkle,
    image: "/services/enceramento-cristalizacao.jpg",
    title: "Enceramento e cristalização",
    description: "Proteção e brilho para a pintura durar mais, com produtos de cristalização.",
  },
  {
    icon: Engine,
    image: "/services/lavagem-motor.jpg",
    title: "Lavagem de motor",
    description: "Limpeza do compartimento do motor com técnica segura para as partes elétricas.",
  },
  {
    icon: SprayBottle,
    image: "/services/polimento-farois.jpg",
    title: "Polimento de faróis",
    description: "Remove a opacidade dos faróis, recuperando o brilho e a visibilidade noturna.",
  },
]
