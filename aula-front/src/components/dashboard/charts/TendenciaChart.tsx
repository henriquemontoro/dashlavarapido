import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatBRL } from "@/lib/formatCurrency"
import { ChartCard, EmptyChart } from "./ChartCard"
import { BRAND_LINE, CHART_COLORS } from "./chartColors"
import type { PontoTendencia } from "@/types/dashboard"

function formatDia(data: string) {
  const [, mes, dia] = data.split("-")
  return `${dia}/${mes}`
}

export function TendenciaChart({ pontos }: { pontos: PontoTendencia[] }) {
  if (pontos.length === 0) {
    return (
      <ChartCard title="Evolução de vendas e clientes atendidos">
        <EmptyChart />
      </ChartCard>
    )
  }

  const dados = pontos.map((ponto) => ({ ...ponto, diaLabel: formatDia(ponto.data) }))

  return (
    <ChartCard title="Evolução de vendas e clientes atendidos">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_LINE} />
          <XAxis dataKey="diaLabel" tick={{ fontSize: 12 }} />
          <YAxis
            yAxisId="vendas"
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => formatBRL(value)}
            width={90}
          />
          <YAxis yAxisId="lavagens" orientation="right" tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            formatter={(value, name) =>
              name === "vendas" ? [formatBRL(Number(value)), "Vendas"] : [value, "Lavagens"]
            }
            labelFormatter={(label) => `Dia ${label}`}
          />
          <Area
            yAxisId="vendas"
            type="monotone"
            dataKey="vendas"
            fill={CHART_COLORS[0]}
            stroke={CHART_COLORS[0]}
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Line
            yAxisId="lavagens"
            type="monotone"
            dataKey="lavagens"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
