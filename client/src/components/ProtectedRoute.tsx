// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { isTokenExpired, getUserRole } from '../lib/auth';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole(token); 
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      console.warn('Rol no permitido:', role);
      return (
        <div className="p-6">
          <div className="rounded-lg border bg-white p-6">
            <p className="text-red-600 font-semibold">Rol no permitido</p>
            <p className="text-gray-600">
              Tu rol es <code>{String(role)}</code>, y esta ruta requiere: {allowedRoles.join(', ')}.
            </p>
          </div>
        </div>
      );
      // o <Navigate to="/" replace /> si preferís redirigir
    }
  }

  return <>{children}</>;
}
