import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { api, ApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sentMessage, setSentMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await api.post<{ detail: string }>("/auth/reset", { email })
      setSentMessage(response.detail)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Não foi possível enviar o e-mail")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-surface px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="normal-case tracking-normal text-base text-brand-ink">
            Redefinir senha
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {sentMessage ? (
            <p className="text-sm text-brand-ink/70">{sentMessage}</p>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail cadastrado</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar nova senha"}
              </Button>
            </form>
          )}
          <Link to="/login" className="text-center text-xs text-brand-ink/60 hover:text-brand-ink">
            Voltar para o login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
