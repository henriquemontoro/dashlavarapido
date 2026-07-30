import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Modal } from "@/components/ui/modal"
import { api, ApiError } from "@/lib/api"
import { parseApiDate } from "@/lib/parseApiDate"

interface FotoMetadata {
  id: number
  registrada_em: string
  registrada_por: string | null
}

interface FotoComPreview extends FotoMetadata {
  previewUrl: string
}

interface PhotoViewerModalProps {
  open: boolean
  onClose: () => void
  atendimentoId: number | null
  momento: "inicio" | "fim"
  title: string
}

export function PhotoViewerModal({ open, onClose, atendimentoId, momento, title }: PhotoViewerModalProps) {
  const [fotos, setFotos] = useState<FotoComPreview[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open || atendimentoId == null) return

    let cancelled = false
    const objectUrls: string[] = []

    async function load() {
      setIsLoading(true)
      try {
        const metadata = await api.get<FotoMetadata[]>(
          `/atendimentos/${atendimentoId}/fotos?momento=${momento}`,
        )
        const comPreview = await Promise.all(
          metadata.map(async (foto) => {
            const blob = await api.getBlob(`/fotos/${foto.id}`)
            const previewUrl = URL.createObjectURL(blob)
            objectUrls.push(previewUrl)
            return { ...foto, previewUrl }
          }),
        )
        if (!cancelled) setFotos(comPreview)
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar as fotos")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [open, atendimentoId, momento])

  function handleClose() {
    setFotos([])
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="flex flex-col gap-4">
        {isLoading && <p className="text-sm text-brand-ink/60">Carregando fotos...</p>}
        {!isLoading && fotos.length === 0 && (
          <p className="text-sm text-brand-ink/60">Nenhuma foto registrada.</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="flex flex-col gap-1 overflow-hidden rounded-md border border-brand-line">
              <img src={foto.previewUrl} alt="" className="aspect-square w-full object-cover" />
              <div className="px-2 pb-2 text-xs text-brand-ink/60">
                <p>{parseApiDate(foto.registrada_em).toLocaleString("pt-BR")}</p>
                {foto.registrada_por && <p>Por {foto.registrada_por}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
