import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode; 
}

const ProtectedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>; // 👈 envolver en fragmento
};

export default ProtectedRoute;
