import { useEffect, type ReactNode } from "react"
import { X } from "@phosphor-icons/react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-brand-card shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-line px-5 py-4">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-brand-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md p-1 text-brand-ink/50 hover:bg-brand-surface hover:text-brand-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
