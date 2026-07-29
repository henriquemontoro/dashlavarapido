import { Car, Drop, MapPin, ShieldCheck } from "@phosphor-icons/react"

const highlights = [
  { icon: ShieldCheck, label: "Desde 2006", detail: "Vinte anos cuidando de carro em Moema" },
  { icon: Drop, label: "100% manual", detail: "Nada de máquina automática, só mão de obra atenta" },
  { icon: Car, label: "Clientes de longa data", detail: "A maior parte chega até nós por indicação" },
  { icon: MapPin, label: "Moema, São Paulo", detail: "Um único endereço, sempre o mesmo time" },
]

export function TrustStrip() {
  return (
    <section className="border-y border-brand-line bg-brand-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex flex-col gap-2">
            <Icon size={24} weight="duotone" className="text-brand" />
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand-ink">
              {label}
            </p>
            <p className="text-sm text-brand-ink/60">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
