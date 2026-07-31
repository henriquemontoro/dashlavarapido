import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { AnosDisponiveis, Period, PeriodosDisponiveis } from "@/types/dashboard"

const periodOptions: { value: Period; label: string }[] = [
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
]

const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const selectClassName =
  "h-9 rounded-md border border-brand-line bg-brand-card px-2 text-sm text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"

export interface DashboardFiltros {
  period: Period
  ano: number | null
  mes: number | null
  semana: number | null
  anos: number[]
  meses: number[]
  semanas: number[]
  pronto: boolean
  setPeriod: (value: Period) => void
  setAno: (value: number) => void
  setMes: (value: number) => void
  setSemana: (value: number) => void
}

// Guarda os filtros na URL (compartilhável) e resolve os defaults (ano/mês/semana
// mais recentes com dado) consultando o backend assim que o ano muda.
export function useDashboardFiltros(): DashboardFiltros {
  const [searchParams, setSearchParams] = useSearchParams()
  const period: Period = searchParams.get("periodo") === "month" ? "month" : "week"
  const anoParam = searchParams.get("ano")
  const mesParam = searchParams.get("mes")
  const semanaParam = searchParams.get("semana")

  const [anos, setAnos] = useState<number[]>([])
  const [meses, setMeses] = useState<number[]>([])
  const [semanas, setSemanas] = useState<number[]>([])

  function updateParams(patch: Record<string, string>) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(patch).forEach(([key, value]) => next.set(key, value))
      return next
    })
  }

  useEffect(() => {
    let cancelled = false
    api.get<AnosDisponiveis>("/dashboard/anos").then((data) => {
      if (cancelled) return
      setAnos(data.anos)
      if (!anoParam && data.anos.length > 0) {
        updateParams({ ano: String(data.anos[0]) })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ano = anoParam ? Number(anoParam) : anos[0] ?? null

  useEffect(() => {
    if (!ano) return
    let cancelled = false
    api.get<PeriodosDisponiveis>(`/dashboard/periodos?ano=${ano}`).then((data) => {
      if (cancelled) return
      setMeses(data.meses)
      setSemanas(data.semanas)
      if (period === "month" && (!mesParam || !data.meses.includes(Number(mesParam)))) {
        updateParams({ mes: String(data.meses[data.meses.length - 1] ?? 1) })
      }
      if (period === "week" && (!semanaParam || !data.semanas.includes(Number(semanaParam)))) {
        updateParams({ semana: String(data.semanas[data.semanas.length - 1] ?? 1) })
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ano, period])

  const mes = mesParam ? Number(mesParam) : null
  const semana = semanaParam ? Number(semanaParam) : null
  const pronto = Boolean(ano && ((period === "month" && mes) || (period === "week" && semana)))

  return {
    period,
    ano,
    mes,
    semana,
    anos,
    meses,
    semanas,
    pronto,
    setPeriod: (value) => updateParams({ periodo: value }),
    setAno: (value) => updateParams({ ano: String(value) }),
    setMes: (value) => updateParams({ mes: String(value) }),
    setSemana: (value) => updateParams({ semana: String(value) }),
  }
}

export function PeriodFilter({ filtros }: { filtros: DashboardFiltros }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-md border border-brand-line bg-brand-card p-1">
        {periodOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => filtros.setPeriod(option.value)}
            className={cn(
              "rounded px-4 py-1.5 text-sm font-medium transition-colors",
              filtros.period === option.value ? "bg-brand text-white" : "text-brand-ink/70 hover:text-brand-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <select
        aria-label="Ano"
        value={filtros.ano ?? ""}
        onChange={(event) => filtros.setAno(Number(event.target.value))}
        className={selectClassName}
      >
        {filtros.anos.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>

      {filtros.period === "month" ? (
        <select
          aria-label="Mês"
          value={filtros.mes ?? ""}
          onChange={(event) => filtros.setMes(Number(event.target.value))}
          className={selectClassName}
        >
          {filtros.meses.map((mes) => (
            <option key={mes} value={mes}>
              {NOMES_MES[mes - 1]}
            </option>
          ))}
        </select>
      ) : (
        <select
          aria-label="Semana"
          value={filtros.semana ?? ""}
          onChange={(event) => filtros.setSemana(Number(event.target.value))}
          className={selectClassName}
        >
          {filtros.semanas.map((semana) => (
            <option key={semana} value={semana}>
              Semana {semana}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
