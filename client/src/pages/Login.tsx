import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo/Logo_Muestra Sin fondo.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        // ⚠️ Cambiá la URL según tu backend real
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      // Redirigir al dashboard (ejemplo: /user)
      navigate("/user");
    } catch (err: any) {
      setError(err.message);
    }

    
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#a7d7c5] via-[#c7d9f4] to-[#f0f4f8]">
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 border border-[#e0e0e0]   mt-13">
        
        {/* Logo flotante */}
        <div className="flex justify-center -mt-40">
          <img
            src={logo}
            alt="Shark Fit"
            className="h-64 w-auto drop-shadow-lg"
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Bienvenido a <span className="text-[#4aa398]">Neuro Salud</span>
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4aa398]"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 p-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4aa398]"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#4aa398] hover:bg-[#3a8279] text-white font-bold rounded-lg transition-colors duration-300"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
