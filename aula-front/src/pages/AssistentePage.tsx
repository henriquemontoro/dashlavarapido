import { useEffect, useRef, useState, type FormEvent } from "react"
import { PaperPlaneTilt, Robot, User } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const MENSAGEM_INICIAL: ChatMessage = {
  role: "assistant",
  content:
    "Oi! Sou o assistente do Portal Nogueira. Pode perguntar sobre o POP: ordem dos serviços, preços, planos de assinatura ou o que fazer em cada situação prevista no procedimento.",
}

export function AssistentePage() {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([MENSAGEM_INICIAL])
  const [texto, setTexto] = useState("")
  const [isSending, setIsSending] = useState(false)
  const fimDaListaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const pergunta = texto.trim()
    if (!pergunta || isSending) return

    const novoHistorico = [...mensagens, { role: "user", content: pergunta } as ChatMessage]
    setMensagens(novoHistorico)
    setTexto("")
    setIsSending(true)

    try {
      const { resposta } = await api.post<{ resposta: string }>("/assistente/chat", {
        mensagens: novoHistorico,
      })
      setMensagens([...novoHistorico, { role: "assistant", content: resposta }])
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível falar com o assistente")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
            Assistente
          </h1>
          <p className="text-sm text-brand-ink/60">
            Tire dúvidas sobre o POP da operação: serviços, preços, planos e procedimentos.
          </p>
        </div>

        <div className="flex h-[60vh] flex-col rounded-xl border border-brand-line bg-brand-card">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            {mensagens.map((mensagem, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2.5",
                  mensagem.role === "user" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    mensagem.role === "user" ? "bg-brand text-white" : "bg-brand-cyan/20 text-brand-dark",
                  )}
                >
                  {mensagem.role === "user" ? <User size={16} weight="bold" /> : <Robot size={16} weight="bold" />}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm",
                    mensagem.role === "user"
                      ? "bg-brand text-white"
                      : "bg-brand-surface text-brand-ink",
                  )}
                >
                  {mensagem.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-cyan/20 text-brand-dark">
                  <Robot size={16} weight="bold" />
                </div>
                <div className="rounded-xl bg-brand-surface px-4 py-2.5 text-sm text-brand-ink/50">
                  Digitando...
                </div>
              </div>
            )}
            <div ref={fimDaListaRef} />
          </div>

          <form className="flex items-center gap-2 border-t border-brand-line p-3" onSubmit={handleSubmit}>
            <Input
              placeholder="Pergunte algo sobre o procedimento..."
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              disabled={isSending}
            />
            <Button type="submit" size="default" className="w-fit gap-2" disabled={isSending || !texto.trim()}>
              <PaperPlaneTilt size={16} weight="bold" />
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
