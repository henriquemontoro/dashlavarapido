import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUp, Robot, Sparkle, User } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { AppShell } from "@/components/layout/AppShell"
import { api, ApiError } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SUGESTOES = [
  "Qual a ordem de execução dos serviços?",
  "Quais são os planos de assinatura?",
  "O que fazer se a chave sumir do gancho?",
]

export function AssistentePage() {
  const { user } = useAuth()
  const [mensagens, setMensagens] = useState<ChatMessage[]>([])
  const [texto, setTexto] = useState("")
  const [isSending, setIsSending] = useState(false)
  const fimDaListaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimDaListaRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensagens, isSending])

  async function enviarPergunta(pergunta: string) {
    if (!pergunta.trim() || isSending) return

    const novoHistorico = [...mensagens, { role: "user", content: pergunta.trim() } as ChatMessage]
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    enviarPergunta(texto)
  }

  const primeiroNome = user?.name.split(" ")[0] ?? ""

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

        <div className="flex h-[65vh] flex-col overflow-hidden rounded-xl border border-brand-line bg-brand-card">
          {mensagens.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan/15">
                <Sparkle size={28} weight="fill" className="text-brand-cyan" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-brand-ink">Olá, {primeiroNome}!</h2>
                <p className="mt-2 max-w-md text-sm text-brand-ink/60">
                  Sou o assistente do Portal Nogueira. Respondo com base no POP da operação: ordem dos
                  serviços, preços, planos de assinatura e o que fazer em cada situação prevista no
                  procedimento.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGESTOES.map((sugestao) => (
                  <button
                    key={sugestao}
                    type="button"
                    onClick={() => enviarPergunta(sugestao)}
                    className="rounded-full border border-brand-line px-3.5 py-1.5 text-xs font-medium text-brand-ink/70 transition-colors hover:border-brand-cyan hover:text-brand-ink"
                  >
                    {sugestao}
                  </button>
                ))}
              </div>
            </div>
          ) : (
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
                    {mensagem.role === "user" ? (
                      <User size={16} weight="bold" />
                    ) : (
                      <Robot size={16} weight="bold" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[75%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm",
                      mensagem.role === "user" ? "bg-brand text-white" : "bg-brand-surface text-brand-ink",
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
          )}

          <form className="flex items-center gap-2 border-t border-brand-line p-3" onSubmit={handleSubmit}>
            <input
              placeholder="Pergunte algo sobre o procedimento..."
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              disabled={isSending}
              className="h-10 flex-1 rounded-full border border-brand-line bg-brand-surface/60 px-4 text-sm text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-cyan focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !texto.trim()}
              aria-label="Enviar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-opacity disabled:opacity-40"
            >
              <ArrowUp size={18} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
