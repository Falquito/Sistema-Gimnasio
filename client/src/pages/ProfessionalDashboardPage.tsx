// src/pages/ProfessionalDashboardPage.tsx
import React from 'react';
import ProfessionalDashboard from './ProfessionalDashboard';
import {
  isTokenExpired,
  getProfessionalIdFromToken,
  getProfessionalNameFromToken
} from '../lib/auth';
import { decodeJwt } from '../lib/auth';


export default function ProfessionalDashboardPage() {
  
const token = localStorage.getItem('token');
const p = decodeJwt<any>(token);


  // Si no hay token o está vencido, redirigir al login
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }

  const professionalId = getProfessionalIdFromToken(token);
  const professionalName = getProfessionalNameFromToken(token) ?? 'Profesional';


  // Si no hay professionalId — mostrar aviso
  if (!professionalId) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-red-600 font-semibold">
            No se pudo obtener el ID del profesional desde el token.
          </p>
          <p className="text-gray-600">
            Revisá el payload del JWT o, si no viene allí, implementá un <code>/auth/me</code> para obtenerlo.
          </p>
        </div>
      </div>
    );
  }

  // Si todo ok, renderizamos el dashboard con los datos correctos
  return (
    <ProfessionalDashboard professionalId={professionalId} professionalName={p?.nombre ?? 'Profesional'} />

  );
}
