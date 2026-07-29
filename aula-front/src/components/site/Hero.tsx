import { Sparkle } from "@phosphor-icons/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WHATSAPP_LINK } from "@/data/contact"
import { HeroBackground } from "@/components/site/HeroBackground"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-ink">
      <HeroBackground />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
            Estética automotiva em Moema
          </p>

          <h1 className="max-w-2xl font-display text-5xl font-semibold uppercase leading-tight tracking-wide text-white sm:text-6xl">
            Lava-Rápido Nogueira
          </h1>

          <p className="max-w-xl text-base text-white/70 sm:text-lg">
            Há mais de vinte anos lavando carro à mão em Moema. Sem correria, sem risco na pintura,
            só atenção aos detalhes que sua lataria merece.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "primary", size: "default" }), "w-fit px-6")}
            >
              Agendar pelo WhatsApp
            </a>
            <a href="#servicos" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white">
              <Sparkle size={16} weight="fill" />
              Ver serviços
            </a>
          </div>
        </div>

        <div className="hidden justify-center lg:flex">
          <img
            src="/logo-mark.png"
            alt="Lava-Rápido Nogueira"
            className="w-full max-w-md drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
