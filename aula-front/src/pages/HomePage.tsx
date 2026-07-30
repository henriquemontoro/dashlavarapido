import { useEffect } from "react"
import { SiteHeader } from "@/components/site/SiteHeader"
import { Hero } from "@/components/site/Hero"
import { ServicesSection } from "@/components/site/ServicesSection"
import { ServicesPriceTable } from "@/components/site/ServicesPriceTable"
import { TrustStrip } from "@/components/site/TrustStrip"
import { ContactSection } from "@/components/site/ContactSection"
import { SiteFooter } from "@/components/site/SiteFooter"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"

export function HomePage() {
  useDocumentTitle("Lava-Rápido Nogueira | Estética automotiva em Moema")

  // Ao chegar em "/#servicos" vindo de outra página, o navegador tenta
  // rolar até a seção antes dela existir no DOM (React ainda não montou) e
  // antes das fontes carregarem (o que muda a altura do layout). Espera um
  // instante para o layout estabilizar antes de rolar.
  useEffect(() => {
    if (!window.location.hash) return
    const id = window.location.hash
    const timer = setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" })
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-brand-surface">
      <SiteHeader />
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <ServicesPriceTable />
      <ContactSection />
      <SiteFooter />
    </div>
  )
}
