import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartCard, EmptyChart } from "./ChartCard"
import { BRAND_LINE, CHART_COLORS } from "./chartColors"
import type { TempoEtapa } from "@/types/dashboard"

export function TempoEtapaChart({ etapas }: { etapas: TempoEtapa[] }) {
  if (etapas.length === 0) {
    return (
      <ChartCard title="Tempo médio por etapa da lavagem">
        <EmptyChart />
      </ChartCard>
    )
  }

  // Uma única barra empilhada: cada segmento é o tempo médio de uma etapa,
  // então o comprimento total da barra é o tempo médio de lavagem completo.
  const linhaUnica = [
    etapas.reduce<Record<string, number | string>>(
      (acc, etapa) => ({ ...acc, [etapa.etapa]: etapa.minutos_medios }),
      { periodo: "Tempo médio (min)" },
    ),
  ]

  return (
    <ChartCard title="Tempo médio por etapa da lavagem">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={linhaUnica} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={BRAND_LINE} />
          <XAxis type="number" tick={{ fontSize: 12 }} unit=" min" />
          <YAxis type="category" dataKey="periodo" tick={{ fontSize: 12 }} width={110} />
          <Tooltip formatter={(value) => `${value} min`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {etapas.map((etapa, index) => (
            <Bar
              key={etapa.etapa}
              dataKey={etapa.etapa}
              stackId="tempo"
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
