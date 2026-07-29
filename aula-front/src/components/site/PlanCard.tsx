import { CheckCircle, Star } from "@phosphor-icons/react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { WHATSAPP_LINK } from "@/data/contact"
import type { Plan } from "@/data/plans"

export function PlanCard({ name, price, frequency, features, highlighted }: Plan) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-8",
        highlighted ? "border-brand bg-brand-ink text-white" : "border-brand-line bg-brand-card",
      )}
    >
      {highlighted && (
        <div className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-brand-cyan/20 px-3 py-1 text-xs font-medium text-brand-cyan">
          <Star size={14} weight="fill" />
          Mais popular
        </div>
      )}

      <h3
        className={cn(
          "font-display text-lg font-semibold uppercase tracking-wide",
          highlighted ? "text-white" : "text-brand-ink",
        )}
      >
        {name}
      </h3>
      <p className={cn("mt-2 font-display text-3xl font-semibold", highlighted ? "text-white" : "text-brand-ink")}>
        {price}
      </p>
      <p className={cn("mt-1 text-sm", highlighted ? "text-white/70" : "text-brand-ink/60")}>{frequency}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className={cn("flex items-start gap-2 text-sm", highlighted ? "text-white/80" : "text-brand-ink/70")}
          >
            <CheckCircle size={18} weight="fill" className={highlighted ? "text-brand-cyan" : "text-brand"} />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({ variant: highlighted ? "primary" : "outline", size: "default" }),
          "mt-8",
        )}
      >
        Assinar
      </a>
    </div>
  )
}
