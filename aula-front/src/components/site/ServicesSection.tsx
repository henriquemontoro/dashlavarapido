import { services } from "@/data/services"
import { ServiceCard } from "@/components/site/ServiceCard"

export function ServicesSection() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-cyan">Serviços</p>
        <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-brand-ink">
          Cuidado completo para o seu carro
        </h2>
        <p className="mt-3 text-brand-ink/60">
          Cada lavagem é feita à mão, do jeito que a gente sempre fez, sem pressa e sem risco pra pintura.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  )
}
