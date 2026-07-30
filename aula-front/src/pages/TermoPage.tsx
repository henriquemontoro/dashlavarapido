import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle } from "@phosphor-icons/react"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { plans } from "@/data/plans"

interface AtendimentoAberto {
  atendimento_id: number
  cliente_nome: string
  placa: string | null
  modelo_carro: string
  cor_carro: string | null
}

export function TermoPage() {
  const [atendimentos, setAtendimentos] = useState<AtendimentoAberto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [atendimentoId, setAtendimentoId] = useState("")
  const [cpf, setCpf] = useState("")
  const [temPlano, setTemPlano] = useState<boolean | null>(null)
  const [plano, setPlano] = useState("")
  const [concordo, setConcordo] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aceito, setAceito] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<AtendimentoAberto[]>("/termo/atendimentos-abertos")
        setAtendimentos(data)
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : "Não foi possível carregar a lista de nomes")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const clienteSelecionado = atendimentos.find((item) => String(item.atendimento_id) === atendimentoId)

  const podeEnviar =
    atendimentoId !== "" &&
    cpf.trim() !== "" &&
    temPlano !== null &&
    (temPlano === false || plano !== "") &&
    concordo

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!podeEnviar) return
    setIsSubmitting(true)
    try {
      await api.post("/termo/aceitar", {
        atendimento_id: Number(atendimentoId),
        cpf: cpf.trim(),
        tem_plano: temPlano,
        plano: temPlano ? plano : null,
      })
      setAceito(true)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível registrar o aceite")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <img
            src="/logo-lava-rapido-nogueira.jpg"
            alt="Lava-Rápido Nogueira"
            className="mb-2 h-16 w-16 rounded-full object-cover"
          />
          <CardTitle className="normal-case tracking-normal text-lg text-brand-ink">Termo de Adesão</CardTitle>
        </CardHeader>
        <CardContent>
          {aceito ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle size={40} weight="fill" className="text-brand" />
              <p className="text-sm text-brand-ink/70">
                Termo assinado com sucesso. Obrigado! Pode aguardar o seu carro ficar pronto.
              </p>
            </div>
          ) : isLoading ? (
            <p className="text-sm text-brand-ink/50">Carregando...</p>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="atendimento">
                  Selecione o seu nome <span className="text-red-600">*</span>
                </Label>
                <select
                  id="atendimento"
                  required
                  value={atendimentoId}
                  onChange={(event) => setAtendimentoId(event.target.value)}
                  className="h-10 rounded-md border border-brand-line bg-brand-card px-3 text-sm text-brand-ink"
                >
                  <option value="" disabled>
                    {atendimentos.length === 0 ? "Nenhum atendimento em andamento" : "Selecione..."}
                  </option>
                  {atendimentos.map((item) => (
                    <option key={item.atendimento_id} value={item.atendimento_id}>
                      {item.cliente_nome}
                    </option>
                  ))}
                </select>
              </div>

              {clienteSelecionado && (
                <div className="rounded-md border border-brand-line bg-brand-surface/60 px-3 py-2 text-xs text-brand-ink/70">
                  <strong className="text-brand-ink">Veículo:</strong> {clienteSelecionado.modelo_carro}
                  {clienteSelecionado.cor_carro ? ` · ${clienteSelecionado.cor_carro}` : ""}
                  {clienteSelecionado.placa ? ` · Placa ${clienteSelecionado.placa}` : ""}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cpf">
                  CPF <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="cpf"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  Possui plano de assinatura? <span className="text-red-600">*</span>
                </Label>
                <div className="flex gap-4 text-sm text-brand-ink/80">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="radio"
                      name="tem_plano"
                      className="accent-brand-cyan"
                      checked={temPlano === true}
                      onChange={() => setTemPlano(true)}
                    />
                    Sim
                  </label>
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="radio"
                      name="tem_plano"
                      className="accent-brand-cyan"
                      checked={temPlano === false}
                      onChange={() => {
                        setTemPlano(false)
                        setPlano("")
                      }}
                    />
                    Não
                  </label>
                </div>
                {temPlano && (
                  <select
                    required
                    value={plano}
                    onChange={(event) => setPlano(event.target.value)}
                    className="h-10 rounded-md border border-brand-line bg-brand-card px-3 text-sm text-brand-ink"
                  >
                    <option value="" disabled>
                      Qual plano?
                    </option>
                    {plans.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} — {item.price}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col gap-3 rounded-md border border-brand-line bg-brand-surface/60 p-4 text-sm text-brand-ink/80">
                <p className="font-semibold text-brand-ink">O que você precisa saber</p>
                <p>
                  <strong>Assinatura Mensal:</strong> para quem possui plano, a cobrança se repete todo mês
                  automaticamente, no valor e forma de pagamento escolhidos, até você cancelar.
                </p>
                <p>
                  <strong>Lavagem Avulsa:</strong> modalidade destinada a clientes que contratam lavagens de forma
                  individual, com pagamento por atendimento.
                </p>
                <p>
                  <strong>Vistoria em toda lavagem:</strong> a cada visita, conferimos e fotografamos o estado do
                  seu veículo, na entrada e na saída, para sua própria segurança.
                </p>
                <p>
                  <strong>Seus objetos, sua responsabilidade:</strong> retire dinheiro, documentos e itens de valor
                  do carro antes de cada lavagem.
                </p>
                <p>
                  <strong>Cuidamos do seu carro:</strong> respondemos por arranhões, batidas ou danos
                  comprovadamente causados por nós durante o serviço.
                </p>
                <p>
                  <strong>Seus dados estão protegidos:</strong> usamos suas informações apenas para prestar o
                  serviço e cobrar sua assinatura, conforme a LGPD.
                </p>
                <p className="italic text-brand-ink/60">
                  Este resumo não substitui o contrato. As condições completas estão no Termo de Serviço e no
                  Regulamento Geral de Planos, disponíveis na recepção e na plataforma Portal Nogueira.
                </p>
                <p className="italic text-brand-ink/60">
                  O presente Termo integra-se aos demais documentos da contratação por incorporação por
                  referência, formando um único instrumento contratual, nos termos dos arts. 421, 422 e 425 do
                  Código Civil e dos arts. 30 e 46 do Código de Defesa do Consumidor.
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-brand-ink/80">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-brand-cyan"
                  checked={concordo}
                  onChange={(event) => setConcordo(event.target.checked)}
                />
                Li e concordo com este Termo de Adesão, com o Termo de Serviço completo e com o Regulamento Geral
                de Planos do Lava-Rápido Nogueira.
              </label>

              <Button type="submit" disabled={!podeEnviar || isSubmitting}>
                {isSubmitting ? "Enviando..." : "Assinar termo"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
