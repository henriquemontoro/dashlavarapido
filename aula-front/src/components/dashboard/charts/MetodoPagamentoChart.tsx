import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartCard, EmptyChart } from "./ChartCard"
import { CHART_COLORS } from "./chartColors"
import type { Contagem } from "@/types/dashboard"

export function MetodoPagamentoChart({ dados }: { dados: Contagem[] }) {
  if (dados.length === 0) {
    return (
      <ChartCard title="Mix de método de pagamento">
        <EmptyChart />
      </ChartCard>
    )
  }

  return (
    <ChartCard title="Mix de método de pagamento">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="quantidade"
            nameKey="chave"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {dados.map((entrada, index) => (
              <Cell key={entrada.chave} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} lavagens`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
