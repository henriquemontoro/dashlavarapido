import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartCard, EmptyChart } from "./ChartCard"
import { BRAND_LINE, CHART_COLORS } from "./chartColors"
import type { Contagem } from "@/types/dashboard"

const MAX_FUNCIONARIOS = 8

export function ProdutividadeFuncionarioChart({ dados }: { dados: Contagem[] }) {
  if (dados.length === 0) {
    return (
      <ChartCard title="Produtividade por funcionário">
        <EmptyChart />
      </ChartCard>
    )
  }

  const top = [...dados].sort((a, b) => b.quantidade - a.quantidade).slice(0, MAX_FUNCIONARIOS)

  return (
    <ChartCard title="Produtividade por funcionário">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_LINE} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="chave" tick={{ fontSize: 12 }} width={90} />
          <Tooltip formatter={(value) => [`${value} lavagens`, "Lavagens"]} />
          <Bar dataKey="quantidade" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
