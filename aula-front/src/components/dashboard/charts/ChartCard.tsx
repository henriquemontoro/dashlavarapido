import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">{children}</CardContent>
    </Card>
  )
}

export function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-brand-ink/50">
      Sem dados para o período selecionado
    </div>
  )
}
