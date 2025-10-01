import { Layout } from "./components/Layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import User from "./pages/User"
import Recepcionista from "./pages/Recepcionista"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PacientesPage from "./pages/Pacientes";
import { isTokenExpired } from "./lib/auth";



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
          <Route path="/login" element={<Login />} />

          {/* Rutas con Layout */}
          <Route path="/" element={<Layout/>}>
            <Route path="user" element={<ProtectedRoute><User /></ProtectedRoute>} />
            <Route path="recepcionista" element={<ProtectedRoute allowedRoles={["gerente", "recepcionista"]}><Recepcionista /></ProtectedRoute>} />
            <Route path="turnos" element={<ProtectedRoute><Turnos /></ProtectedRoute>} />
            <Route path="pacientes" element={<ProtectedRoute allowedRoles={["gerente", "medico","recepcionista"]}><PacientesPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
