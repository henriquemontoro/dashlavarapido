import { useEffect, useState } from "react"
import { Car, ClockCounterClockwise, CurrencyDollar, Star, TrendUp } from "@phosphor-icons/react"
import { AppShell } from "@/components/layout/AppShell"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { PeriodFilter, usePeriod } from "@/components/dashboard/PeriodFilter"
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder"
import { api, ApiError } from "@/lib/api"
import type { DashboardSummary } from "@/types/dashboard"

export function DashboardPage() {
  const [period, setPeriod] = usePeriod()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    api
      .get<DashboardSummary>(`/dashboard/summary?period=${period}`)
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Não foi possível carregar o painel")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [period])

  const state = !isLoading && summary?.status === "ok" ? "ready" : "empty"

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
              Painel operacional
            </h1>
            <p className="text-sm text-brand-ink/60">
              Clientes atendidos, vendas, tempos, produtividade e satisfação.
            </p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {error ? (
          <div className="rounded-md border border-brand-line bg-brand-card p-4 text-sm text-brand-ink/70">
            {error}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Clientes atendidos"
              icon={<Car size={20} weight="bold" />}
              value={summary?.clients_served != null ? String(summary.clients_served) : null}
              state={state}
            />
            <MetricCard
              title="Vendas"
              icon={<CurrencyDollar size={20} weight="bold" />}
              value={summary?.sales != null ? summary.sales.toString() : null}
              unit="R$"
              state={state}
            />
            <MetricCard
              title="Tempo operacional médio"
              icon={<ClockCounterClockwise size={20} weight="bold" />}
              value={null}
              state={state}
            />
            <MetricCard
              title="Produtividade"
              icon={<TrendUp size={20} weight="bold" />}
              value={null}
              state={state}
            />
            <MetricCard
              title="Satisfação"
              icon={<Star size={20} weight="bold" />}
              value={summary?.satisfaction != null ? summary.satisfaction.toString() : null}
              state={state}
            />
          </div>
        )}

        <ChartPlaceholder title="Evolução do período" />
      </div>
    </AppShell>
  )
}
