import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartCard, EmptyChart } from "./ChartCard"
import { BRAND_LINE, CHART_COLORS } from "./chartColors"
import type { PontoSatisfacao } from "@/types/dashboard"

function formatDia(data: string) {
  const [, mes, dia] = data.split("-")
  return `${dia}/${mes}`
}

export function SatisfacaoChart({ pontos }: { pontos: PontoSatisfacao[] }) {
  if (pontos.length === 0) {
    return (
      <ChartCard title="Evolução da satisfação">
        <EmptyChart />
      </ChartCard>
    )
  }

  const dados = pontos.map((ponto) => ({ ...ponto, diaLabel: formatDia(ponto.data) }))

  return (
    <ChartCard title="Evolução da satisfação">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_LINE} />
          <XAxis dataKey="diaLabel" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="nps" domain={[0, 10]} tick={{ fontSize: 12 }} allowDecimals={false} />
          <YAxis yAxisId="google" orientation="right" domain={[0, 5]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            yAxisId="nps"
            type="monotone"
            dataKey="nps_medio"
            name="NPS médio (0-10)"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="google"
            type="monotone"
            dataKey="nota_google_media"
            name="Nota Google (0-5)"
            stroke={CHART_COLORS[2]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
