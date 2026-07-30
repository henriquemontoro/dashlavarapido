import { Clock, CurrencyDollar, Wrench } from "@phosphor-icons/react"
import { SERVICE_CATALOG } from "@/data/services"
import { formatBRL } from "@/lib/formatCurrency"

function formatMinutes(minutes: number): string {
  if (minutes % 60 === 0) return `${minutes / 60}h`
  if (minutes > 60) return `${Math.floor(minutes / 60)}h${minutes % 60}min`
  return `${minutes}min`
}

export function ServicesPriceTable() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-cyan">Tabela de preços</p>
        <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-brand-ink">
          Serviço, tempo e valor
        </h2>
        <p className="mt-3 text-brand-ink/60">
          Tempo médio de execução e preço de cada serviço, iguais para qualquer porte de veículo.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-brand-line bg-brand-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 bg-brand-ink px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/70">
          <span className="flex items-center gap-2">
            <Wrench size={14} />
            Serviço
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            Tempo
          </span>
          <span className="flex items-center gap-2">
            <CurrencyDollar size={14} />
            Preço
          </span>
        </div>

        {SERVICE_CATALOG.map((service, index) => (
          <div
            key={service.title}
            className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 text-sm ${
              index % 2 === 1 ? "bg-brand-surface/50" : ""
            } ${index > 0 ? "border-t border-brand-line" : ""}`}
          >
            <span className="font-medium text-brand-ink">{service.title}</span>
            <span className="font-mono text-brand-ink/60 tabular-nums">{formatMinutes(service.minutes)}</span>
            <span className="font-display text-base font-semibold text-brand">{formatBRL(service.price)}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-brand-ink/40">
        Lavagem Detalhada tem escopo variável, sem preço de tabela — orçada na hora.
      </p>
    </section>
  )
}
