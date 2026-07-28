export type Period = "week" | "month"

export interface DashboardSummary {
  period: Period
  status: "no_data" | "ok"
  clients_served: number | null
  sales: number | null
  operational_times: Record<string, number> | null
  productivity: Record<string, number> | null
  satisfaction: number | null
}
