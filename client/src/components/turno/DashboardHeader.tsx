// components/turno/DashboardHeader.tsx
import React from 'react';
import { Plus, RefreshCw, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onNewSession: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  loading,
  onRefresh,
  onNewSession
}) => {
  return (
    <div className="border-b border-gray-800/50 backdrop-blur-sm bg-black/90">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                FitManager
              </h1>
              <p className="text-gray-400 text-sm">Panel de gestión de entrenamientos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800/50 rounded-xl transition-all duration-200 border border-gray-700/50 backdrop-blur-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button 
              onClick={onNewSession}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};