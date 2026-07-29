import type { Service } from "@/data/services"

export function ServiceCard({ icon: Icon, image, title, description }: Service) {
  return (
    <div className="group overflow-hidden rounded-xl border border-brand-line bg-brand-card transition-colors hover:border-brand-cyan">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-ink">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-cyan text-brand-ink shadow-md">
          <Icon size={20} weight="bold" />
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-base font-semibold uppercase tracking-wide text-brand-ink">
          {title}
        </h3>
        <p className="mt-2 text-sm text-brand-ink/60">{description}</p>
      </div>
    </div>
  )
}
