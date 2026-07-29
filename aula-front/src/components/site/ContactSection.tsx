import { Clock, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ADDRESS, HOURS, PHONE_DISPLAY, WHATSAPP_LINK } from "@/data/contact"

const items = [
  { icon: MapPin, label: "Endereço", value: ADDRESS },
  { icon: Clock, label: "Horário", value: HOURS },
  { icon: Phone, label: "Telefone", value: PHONE_DISPLAY },
]

export function ContactSection() {
  return (
    <section id="contato" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-10 rounded-2xl bg-brand-ink px-8 py-12 sm:grid-cols-2 sm:px-12">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-cyan">Contato</p>
          <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-white">
            Traga seu carro
          </h2>
          <p className="mt-3 max-w-sm text-white/70">
            Chama no WhatsApp pra combinar o melhor horário, sem fila, sem enrolação.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "primary", size: "default" }), "mt-6 w-fit gap-2 px-6")}
          >
            <WhatsappLogo size={18} weight="fill" />
            Chamar no WhatsApp
          </a>
        </div>

        <dl className="flex flex-col gap-5">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={20} weight="bold" className="mt-0.5 shrink-0 text-brand-cyan" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/50">{label}</dt>
                <dd className="text-sm text-white/90">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
