import { Layout } from "./components/Layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import User from "./pages/User"
import Recepcionista from "./pages/Recepcionista"
import Turnos from "./pages/Turnos"
import Login from "./pages/Login";




function App() {
  return (
    <>
      <BrowserRouter >
        <Routes>
          {/* Login sin sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Rutas con Layout */}
          <Route path="/" element={<Layout/>}>
            <Route path="user" element={<User />} />
            <Route path="recepcionista" element={<Recepcionista />} />
            <Route path="turnos" element={<Turnos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
