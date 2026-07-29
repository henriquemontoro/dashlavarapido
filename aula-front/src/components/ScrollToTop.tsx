import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Ao trocar de rota, o React Router não reseta o scroll (mantém a posição
// da página anterior). Isso corrige, exceto quando a URL tem uma âncora
// (ex: /#servicos) — nesse caso quem cuida da rolagem é a própria página.
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
