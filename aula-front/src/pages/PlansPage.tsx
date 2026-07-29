import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { PlanCard } from "@/components/site/PlanCard"
import { plans } from "@/data/plans"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export function PlansPage() {
  useDocumentTitle("Planos | Lava-Rápido Nogueira")

  return (
    <div className="min-h-screen bg-brand-surface">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wide text-brand-cyan">Planos</p>
          <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-brand-ink sm:text-4xl">
            Assinatura para quem lava sempre
          </h1>
          <p className="mt-3 text-brand-ink/60">
            Escolha a frequência ideal pro seu carro e pare de se preocupar com agenda. A gente
            reserva seu horário toda semana.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
