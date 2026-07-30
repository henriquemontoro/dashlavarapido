import { useRef, useState, type ReactNode } from "react"
import { Camera, Trash, X } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { compressImage } from "@/lib/compressImage"

interface CapturedPhoto {
  file: File
  previewUrl: string
}

interface PhotoCaptureModalProps {
  open: boolean
  title: ReactNode
  onClose: () => void
  onConfirm: (files: File[]) => Promise<void>
}

export function PhotoCaptureModal({ open, title, onClose, onConfirm }: PhotoCaptureModalProps) {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setIsProcessing(true)
    try {
      const novas: CapturedPhoto[] = []
      for (const file of Array.from(fileList)) {
        const compressed = await compressImage(file)
        novas.push({ file: compressed, previewUrl: URL.createObjectURL(compressed) })
      }
      setPhotos((prev) => [...prev, ...novas])
    } catch {
      toast.error("Não foi possível processar uma das fotos")
    } finally {
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function handleClose() {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    setPhotos([])
    onClose()
  }

  async function handleConfirm() {
    setIsSubmitting(true)
    try {
      await onConfirm(photos.map((p) => p.file))
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl))
      setPhotos([])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-ink/60">
          Anexe uma ou mais fotos do carro. É obrigatório ter pelo menos uma foto para continuar.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          className="hidden"
          onChange={(event) => handleFilesSelected(event.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="default"
          className="w-fit gap-2"
          disabled={isProcessing}
          onClick={() => inputRef.current?.click()}
        >
          <Camera size={18} />
          {isProcessing ? "Processando..." : "Tirar ou anexar foto"}
        </Button>

        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={photo.previewUrl} className="group relative aspect-square overflow-hidden rounded-md border border-brand-line">
                <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label="Remover foto"
                  className="absolute right-1 top-1 rounded-full bg-brand-ink/70 p-1 text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            size="default"
            className="w-fit gap-2"
            disabled={photos.length === 0 || isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? "Enviando..." : "Concluir e enviar"}
          </Button>
          <Button type="button" variant="ghost" size="default" className="w-fit gap-2" onClick={handleClose}>
            <Trash size={16} />
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
