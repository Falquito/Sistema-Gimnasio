import React, { useState } from "react";
import logo from "../img/logo/b2c0709b7e3fd5b4d48dcdfecac9a5e1-removebg-preview.png"; // 👈 guardá tu logo en /src/assets

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login con:", email, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0d0d0d] via-[#111827] to-[#1e3a8a]">
      <div className="bg-[#1f1f1f]/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96 border border-[#2d2d2d]">
        
        {/* Logo flotante */}
        <div className="flex justify-center -mt-44">
          <img
            src={logo}
            alt="Shark Fit"
            className="h-64 w-auto drop-shadow-lg"
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          Bienvenido a <span className="text-blue-500">Shark Fit</span> 🦈
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-3 rounded-lg border border-gray-700 bg-[#101010] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 p-3 rounded-lg border border-gray-700 bg-[#101010] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300"
          >
            Ingresar
          </button>
        </form>

        {/* Extra */}
        {/* <p className="text-gray-400 text-sm text-center mt-6">
          ¿No tenés cuenta?{" "}
          <a href="#" className="text-blue-400 hover:text-blue-500">
            Registrate aquí
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
