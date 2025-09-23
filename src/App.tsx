import { Layout } from "./components/Layout"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import User from "./pages/user"
import Recepcionista from "./pages/Recepcionista"
import Turnos from "./pages/Turnos"



function App() {
  return (
    <>
     <BrowserRouter >
        <Routes >
          <Route path="/" element={<Layout  />}>
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
