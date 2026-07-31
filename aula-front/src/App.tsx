import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/context/AuthContext"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RequireRole } from "@/components/auth/RequireRole"
import { LoginPage } from "@/pages/LoginPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
import { TermoPage } from "@/pages/TermoPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AtendimentosPage } from "@/pages/AtendimentosPage"
import { AgendamentosPage } from "@/pages/AgendamentosPage"
import { AssistentePage } from "@/pages/AssistentePage"
import { UsersPage } from "@/pages/UsersPage"
import { TermosPage } from "@/pages/TermosPage"
import { HomePage } from "@/pages/HomePage"
import { PlansPage } from "@/pages/PlansPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planos" element={<PlansPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
          <Route path="/termo" element={<TermoPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RequireRole roles={["owner"]} />}>
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/termos" element={<TermosPage />} />
            </Route>
            <Route element={<RequireRole roles={["owner", "employee"]} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/atendimentos" element={<AtendimentosPage />} />
              <Route path="/agendamentos" element={<AgendamentosPage />} />
              <Route path="/assistente" element={<AssistentePage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
