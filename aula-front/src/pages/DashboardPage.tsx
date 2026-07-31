import { useCallback, useEffect, useState } from "react"
import { Car, ClockCounterClockwise, CurrencyDollar, Star, TrendUp, UploadSimple } from "@phosphor-icons/react"
import { AppShell } from "@/components/layout/AppShell"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { PeriodFilter, useDashboardFiltros } from "@/components/dashboard/PeriodFilter"
import { ImportarDadosModal } from "@/components/dashboard/ImportarDadosModal"
import { TendenciaChart } from "@/components/dashboard/charts/TendenciaChart"
import { TempoEtapaChart } from "@/components/dashboard/charts/TempoEtapaChart"
import { MetodoPagamentoChart } from "@/components/dashboard/charts/MetodoPagamentoChart"
import { ProdutividadeFuncionarioChart } from "@/components/dashboard/charts/ProdutividadeFuncionarioChart"
import { TipoCarroChart } from "@/components/dashboard/charts/TipoCarroChart"
import { SatisfacaoChart } from "@/components/dashboard/charts/SatisfacaoChart"
import { VolumeDiaSemanaChart } from "@/components/dashboard/charts/VolumeDiaSemanaChart"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { api, ApiError } from "@/lib/api"
import { formatBRL } from "@/lib/formatCurrency"
import type { DashboardGraficos, DashboardSummary } from "@/types/dashboard"

export function DashboardPage() {
  const { user } = useAuth()
  const filtros = useDashboardFiltros()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [graficos, setGraficos] = useState<DashboardGraficos | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [importOpen, setImportOpen] = useState(false)

  const queryString = useCallback(() => {
    const params = new URLSearchParams({ ano: String(filtros.ano), period: filtros.period })
    if (filtros.period === "month" && filtros.mes) params.set("mes", String(filtros.mes))
    if (filtros.period === "week" && filtros.semana) params.set("semana", String(filtros.semana))
    return params.toString()
  }, [filtros.ano, filtros.period, filtros.mes, filtros.semana])

  const load = useCallback(() => {
    if (!filtros.pronto) return
    setIsLoading(true)
    setError(null)
    const qs = queryString()

    Promise.all([
      api.get<DashboardSummary>(`/dashboard/summary?${qs}`),
      api.get<DashboardGraficos>(`/dashboard/graficos?${qs}`),
    ])
      .then(([summaryData, graficosData]) => {
        setSummary(summaryData)
        setGraficos(graficosData)
      })
      .catch((err: unknown) => {
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar o painel")
      })
      .finally(() => setIsLoading(false))
  }, [filtros.pronto, queryString])

  useEffect(() => {
    load()
  }, [load])

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
          <div className="flex flex-wrap items-center gap-2">
            <PeriodFilter filtros={filtros} />
            {user?.role === "owner" && (
              <Button type="button" variant="outline" size="sm" onClick={() => setImportOpen(true)}>
                <UploadSimple size={16} weight="bold" />
                Importar dados
              </Button>
            )}
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-brand-line bg-brand-card p-4 text-sm text-brand-ink/70">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Clientes atendidos"
                icon={<Car size={20} weight="bold" />}
                value={summary?.clientes_atendidos != null ? String(summary.clientes_atendidos) : null}
                state={state}
              />
              <MetricCard
                title="Vendas"
                icon={<CurrencyDollar size={20} weight="bold" />}
                value={summary?.vendas_total != null ? formatBRL(summary.vendas_total) : null}
                state={state}
              />
              <MetricCard
                title="Tempo operacional médio"
                icon={<ClockCounterClockwise size={20} weight="bold" />}
                value={
                  summary?.tempo_operacional_medio_min != null ? String(summary.tempo_operacional_medio_min) : null
                }
                unit="min"
                state={state}
              />
              <MetricCard
                title="Produtividade"
                icon={<TrendUp size={20} weight="bold" />}
                value={
                  summary?.produtividade_media_por_funcionario != null
                    ? String(summary.produtividade_media_por_funcionario)
                    : null
                }
                unit="lavagens/func."
                state={state}
              />
              <MetricCard
                title="Satisfação (NPS)"
                icon={<Star size={20} weight="bold" />}
                value={summary?.nps_medio != null ? String(summary.nps_medio) : null}
                unit="/ 10"
                state={state}
              />
            </div>

            {graficos && state === "ready" ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <TendenciaChart pontos={graficos.tendencia} />
                <SatisfacaoChart pontos={graficos.satisfacao_tendencia} />
                <TempoEtapaChart etapas={graficos.tempo_por_etapa} />
                <MetodoPagamentoChart dados={graficos.metodo_pagamento} />
                <ProdutividadeFuncionarioChart dados={graficos.produtividade_funcionario} />
                <TipoCarroChart dados={graficos.tipo_carro} />
                <VolumeDiaSemanaChart dados={graficos.volume_dia_semana} />
              </div>
            ) : (
              !isLoading && (
                <div className="rounded-xl border border-dashed border-brand-line bg-brand-card/60 p-8 text-center">
                  <p className="text-sm text-brand-ink/50">Sem dados para o período selecionado.</p>
                </div>
              )
            )}
          </>
        )}
      </div>

      <ImportarDadosModal open={importOpen} onClose={() => setImportOpen(false)} onImportado={load} />
    </AppShell>
  )
}
