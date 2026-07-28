import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { RequireRole } from "@/components/auth/RequireRole"
import { LoginPage } from "@/pages/LoginPage"
import { ResetPasswordPage } from "@/pages/ResetPasswordPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { AtendimentosPage } from "@/pages/AtendimentosPage"
import { RoleHomePage } from "@/pages/RoleHomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RoleHomePage />} />
            <Route element={<RequireRole roles={["owner"]} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route element={<RequireRole roles={["owner", "employee"]} />}>
              <Route path="/atendimentos" element={<AtendimentosPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
