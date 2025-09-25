// components/DailySummary.tsx
import React from 'react';
import { Activity, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { DashboardStats } from '../../types/dashboard';

interface DailySummaryProps {
  stats: DashboardStats;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ stats }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
            <Calendar className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Resumen del Día</h2>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{stats.hoyTurnos}</p>
          <p className="text-gray-400 text-sm">turnos programados</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{stats.completados}</p>
          <p className="text-green-300 text-xs">Completados</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{stats.pendientes}</p>
          <p className="text-yellow-300 text-xs">Pendientes</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{stats.cancelados}</p>
          <p className="text-red-300 text-xs">Cancelados</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
          <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-lg font-bold text-white">{stats.total}</p>
          <p className="text-blue-300 text-xs">Total</p>
        </div>
      </div>
    </div>
  );
};