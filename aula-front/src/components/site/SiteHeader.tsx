import { Link, useLocation } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"

export function SiteHeader() {
  const { pathname } = useLocation()
  const isHome = pathname === "/"

  // Âncoras usam <a> nativa (não o Link do router) para que o navegador
  // role até a seção de verdade — o Link só troca a URL, sem rolar.
  const anchor = (hash: string) => (isHome ? hash : `/${hash}`)

  const anchorLinks = [
    { href: anchor("#servicos"), label: "Serviços" },
    { href: anchor("#contato"), label: "Contato" },
  ]

  return (
    <header className="sticky top-0 z-10 border-b border-brand-line bg-brand-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo-lava-rapido-nogueira.jpg"
            alt="Lava-Rápido Nogueira"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="font-display text-lg font-semibold uppercase tracking-wide text-brand-ink">
            Lava-Rápido Nogueira
          </p>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-brand-ink/70 md:flex">
          <a href={anchorLinks[0].href} className="transition-colors hover:text-brand-ink">
            {anchorLinks[0].label}
          </a>
          <Link to="/planos" className="transition-colors hover:text-brand-ink">
            Planos
          </Link>
          <a href={anchorLinks[1].href} className="transition-colors hover:text-brand-ink">
            {anchorLinks[1].label}
          </a>
        </nav>

        <Link to="/login" className={buttonVariants({ variant: "outline", size: "sm", className: "w-fit" })}>
          Portal Nogueira
        </Link>
      </div>
    </header>
  )
}
