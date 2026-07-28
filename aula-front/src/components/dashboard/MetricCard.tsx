import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  icon: ReactNode
  value: string | null
  unit?: string
  state: "empty" | "ready"
}

export function MetricCard({ title, icon, value, unit, state }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden pl-1">
      <div className="absolute inset-y-0 left-0 w-1 bg-brand-cyan" />
      <CardHeader className="flex-row items-center justify-between pl-5">
        <CardTitle>{title}</CardTitle>
        <span className="text-brand-cyan">{icon}</span>
      </CardHeader>
      <CardContent className="pl-5">
        {state === "ready" && value !== null ? (
          <p className="font-display text-3xl font-semibold tabular-nums text-brand-ink">
            {value}
            {unit && <span className="ml-1 text-base font-normal text-brand-ink/50">{unit}</span>}
          </p>
        ) : (
          <p className="text-sm text-brand-ink/50">Aguardando integração de dados</p>
        )}
      </CardContent>
    </Card>
  )
}
