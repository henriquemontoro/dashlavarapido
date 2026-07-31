import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartCard, EmptyChart } from "./ChartCard"
import { BRAND_LINE, CHART_COLORS } from "./chartColors"
import type { Contagem } from "@/types/dashboard"

export function VolumeDiaSemanaChart({ dados }: { dados: Contagem[] }) {
  if (dados.length === 0) {
    return (
      <ChartCard title="Volume de lavagens por dia da semana">
        <EmptyChart />
      </ChartCard>
    )
  }

  return (
    <ChartCard title="Volume de lavagens por dia da semana">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_LINE} />
          <XAxis dataKey="chave" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${value} lavagens`, "Lavagens"]} />
          <Bar dataKey="quantidade" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
