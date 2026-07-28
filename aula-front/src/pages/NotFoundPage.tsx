import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-surface px-4 text-center">
      <p className="font-display text-3xl font-semibold text-brand-ink">Página não encontrada</p>
      <Link to="/" className="text-sm text-brand hover:underline">
        Voltar para o início
      </Link>
    </div>
  )
}
