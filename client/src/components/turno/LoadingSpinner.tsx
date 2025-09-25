// components/LoadingSpinner.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando turnos...' 
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-green-400" />
        <span className="text-lg">{message}</span>
      </div>
    </div>
  );
};

export const LoadingSpinner2: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando pacientes...' 
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <RefreshCw className="w-6 h-6 animate-spin text-green-400" />
        <span className="text-lg">{message}</span>
      </div>
    </div>
  );
};