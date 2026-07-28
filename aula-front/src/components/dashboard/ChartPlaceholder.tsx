export function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-line bg-brand-card/60 p-8 text-center">
      <p className="font-display text-sm uppercase tracking-wide text-brand-ink/60">{title}</p>
      <p className="mt-2 text-sm text-brand-ink/50">
        O gráfico será exibido assim que a base de dados operacional estiver conectada.
      </p>
    </div>
  )
}
