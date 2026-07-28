import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const roleLabel: Record<string, string> = {
  owner: "Dono",
  employee: "Funcionário",
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          isActive ? "bg-brand text-white" : "text-brand-ink/70 hover:text-brand-ink",
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="border-b border-brand-line bg-brand-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-lava-rapido-nogueira.jpg"
              alt="Lava-Rápido Nogueira"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-lg font-semibold uppercase tracking-wide text-brand-ink">
                Lava-Rápido Nogueira
              </p>
              <p className="text-xs text-brand-ink/60">Painel operacional</p>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              {user.role === "owner" && (
                <nav className="flex items-center gap-1">
                  <NavItem to="/dashboard">Painel</NavItem>
                  <NavItem to="/atendimentos">Atendimentos</NavItem>
                </nav>
              )}
              <div className="text-right">
                <p className="text-sm font-medium text-brand-ink">{user.name}</p>
                <p className="text-xs text-brand-ink/60">{roleLabel[user.role]}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-brand-line px-3 py-1.5 text-xs font-medium text-brand-ink transition-colors hover:bg-brand-surface"
              >
                Sair
              </button>
            </div>
          )}
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-brand-cyan via-brand to-transparent" />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
