import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../lib/auth"; // 👈 asegúrate de que la ruta sea correcta

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  // ❌ Si no hay token → mandar al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Si el token existe pero está vencido → borrarlo y mandar al login
  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // ✅ Si el token es válido → mostrar los hijos (la ruta protegida)
  return <>{children}</>;
};

export default ProtectedRoute;
