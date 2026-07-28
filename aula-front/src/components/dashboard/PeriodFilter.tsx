import { useSearchParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { Period } from "@/types/dashboard"

const options: { value: Period; label: string }[] = [
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
]

export function usePeriod(): [Period, (value: Period) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const period: Period = searchParams.get("periodo") === "month" ? "month" : "week"

  function setPeriod(value: Period) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("periodo", value)
      return next
    })
  }

  return [period, setPeriod]
}

export function PeriodFilter({ value, onChange }: { value: Period; onChange: (value: Period) => void }) {
  return (
    <div className="inline-flex rounded-md border border-brand-line bg-brand-card p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded px-4 py-1.5 text-sm font-medium transition-colors",
            value === option.value ? "bg-brand text-white" : "text-brand-ink/70 hover:text-brand-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
