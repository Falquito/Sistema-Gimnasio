import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired, getUserRole } from "../lib/auth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles = [] }: Props) => {
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

  // ✅ Token válido → verifico rol
  const userRole  = getUserRole(token); 

  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    // 🚫 Rol no permitido → redirijo al home
    console.log("Rol no permitido:", userRole);
    return <Navigate to="/" replace />;
  }


  // ✅ Si el token es válido → mostrar los hijos (la ruta protegida)
  return <>{children}</>;
};

export default ProtectedRoute;
