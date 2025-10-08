import { Layout } from "./components/Layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import User from "./pages/User"
import Recepcionista from "./pages/Recepcionista"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PacientesPage from "./pages/Pacientes";
import { isTokenExpired } from "./lib/auth";
import { Home } from "./pages/Home"
import { BackgroundBeamsWithCollision } from "./components/ui/background-beams-with-collision"
import { BackgroundGradientAnimation } from "./components/ui/background-gradient-animation"
import { Profesionales } from "./pages/Profesionales"
import { NewLogin } from "./pages/NewLogin"
import ProfessionalDashboard from "./pages/ProfessionalDashboard"
import EstadisticasPage from "./pages/EstadisticasPage"
import ProfessionalDashboardPage from "./pages/ProfessionalDashboardPage"

function App() {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      <BrowserRouter >
        <Routes>
          {/* Login sin sidebar */}
          <Route path="/login" element={<NewLogin />} />

          {/* Rutas con Layout */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="" element={
              <ProtectedRoute allowedRoles={["gerente", "recepcionista", "medico"]}>
                <div className="relative h-screen w-full overflow-hidden">
                  <BackgroundGradientAnimation circleRadius="10%" gradientBackgroundStart="rgb(16, 185, 129)"   // emerald-500
                    gradientBackgroundEnd="rgb(5, 46, 22)"       // emerald-950 (oscuro)
                    firstColor="16, 185, 129"   // emerald-500
                    secondColor="110, 231, 183" // emerald-300
                    thirdColor="52, 211, 153"   // emerald-400
                    fourthColor="5, 150, 105"   // emerald-600
                    fifthColor="4, 120, 87"     // emerald-700
                    pointerColor="16, 185, 129" // emerald-500
                    size="50%" className="absolute inset-0">

                    {/* tu contenido */}
                    <BackgroundBeamsWithCollision>

                      <Home />

                    </BackgroundBeamsWithCollision>
                  </BackgroundGradientAnimation>

                </div>
              </ProtectedRoute>} />
            <Route path="user" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="recepcionista" element={<ProtectedRoute allowedRoles={["gerente", "recepcionista"]}><Recepcionista /></ProtectedRoute>} />
            <Route path="turnos" element={<ProtectedRoute><Turnos /></ProtectedRoute>} />
            <Route path="pacientes" element={<ProtectedRoute allowedRoles={["gerente", "medico", "recepcionista"]}><PacientesPage /></ProtectedRoute>} />
            <Route path="profesionales" element={<ProtectedRoute allowedRoles={["gerente", "medico"]}><Profesionales /></ProtectedRoute>} />
            <Route
              path="/professional/dashboard"
              element={
                <ProtectedRoute allowedRoles={["medico"]}>
                  <ProfessionalDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="estadisticas"
              element={
                <EstadisticasPage />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
