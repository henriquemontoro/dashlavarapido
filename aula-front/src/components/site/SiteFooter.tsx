import { Link, useLocation } from "react-router-dom"
import { InstagramLogo, WhatsappLogo } from "@phosphor-icons/react"
import { ADDRESS, HOURS, INSTAGRAM_HANDLE, INSTAGRAM_LINK, PHONE_DISPLAY, WHATSAPP_LINK } from "@/data/contact"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const isHome = useLocation().pathname === "/"
  const anchor = (hash: string) => (isHome ? hash : `/${hash}`)

  return (
    <footer className="border-t border-brand-line bg-brand-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo-lava-rapido-nogueira.jpg"
            alt="Lava-Rápido Nogueira"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-brand-ink">
              Lava-Rápido Nogueira
            </p>
            <p className="text-xs text-brand-ink/50">Estética automotiva desde 2006</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-brand-ink/60">
          <a href={anchor("#servicos")} className="hover:text-brand-ink">
            Serviços
          </a>
          <Link to="/planos" className="hover:text-brand-ink">
            Planos
          </Link>
          <a href={anchor("#contato")} className="hover:text-brand-ink">
            Contato
          </a>
          <Link to="/login" className="hover:text-brand-ink">
            Portal Nogueira
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm text-brand-ink/60">
          <p>{ADDRESS}</p>
          <p>{HOURS}</p>
          <div className="flex items-center gap-4 pt-1">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-ink"
            >
              <WhatsappLogo size={18} weight="fill" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-ink"
            >
              <InstagramLogo size={18} weight="fill" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-line px-6 py-4 text-center text-xs text-brand-ink/40">
        © {year} Lava-Rápido Nogueira. Todos os direitos reservados.
      </div>
    </footer>
  )
}
