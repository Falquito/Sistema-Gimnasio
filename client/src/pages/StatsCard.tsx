import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'green' | 'blue' | 'purple' | 'orange';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'green'
}) => {
  const colorStyles = {
    green: {
      gradient: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-500',
      accentGlow: 'shadow-green-500/20'
    },
    blue: {
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-500',
      accentGlow: 'shadow-blue-500/20'
    },
    purple: {
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-500',
      accentGlow: 'shadow-purple-500/20'
    },
    orange: {
      gradient: 'from-orange-500/20 to-amber-500/20',
      border: 'border-orange-500/30',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-500',
      accentGlow: 'shadow-orange-500/20'
    }
  };

  const currentStyle = colorStyles[color];

  const defaultIcon = (
    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  return (
    <div className="group relative">
      {/* Glow effect en hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentStyle.gradient} rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300`} />
      
      {/* Card principal */}
      <div className={`relative bg-white rounded-2xl border ${currentStyle.border} p-6 transition-all duration-300 hover:shadow-xl ${currentStyle.accentGlow} hover:-translate-y-1`}>
        <div className="flex items-start justify-between">
          {/* Contenido izquierdo */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-gray-900">
                {value}
              </h3>
              {trend && (
                <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
          </div>

          {/* Ícono decorativo */}
          <div className={`${currentStyle.iconBg} ${currentStyle.iconColor} p-3 rounded-xl border ${currentStyle.border}`}>
            <div className="w-8 h-8">
              {icon || defaultIcon}
            </div>
          </div>
        </div>

        {/* Barra de progreso decorativa (opcional) */}
        <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${currentStyle.gradient.replace('/20', '')} transition-all duration-500`}
            style={{ width: '70%' }}
          />
        </div>
      </div>
    </div>
  );
};

// Componente con iconos predefinidos
export const PacientesActivosCard: React.FC<{ value: number }> = ({ value }) => (
  <StatsCard
    title="Pacientes Activos"
    value={value}
    color="green"
    icon={
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    }
  />
);

export const CitasDelDiaCard: React.FC<{ value: number }> = ({ value }) => (
  <StatsCard
    title="Citas del día"
    value={value}
    color="blue"
    icon={
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    }
  />
);

export const MedicosActivosCard: React.FC<{ value: number }> = ({ value }) => (
  <StatsCard
    title="Médicos activos"
    value={value}
    color="purple"
    icon={
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    }
  />
);

export const RecepcionistasCard: React.FC<{ value: number }> = ({ value }) => (
  <StatsCard
    title="Recepcionistas"
    value={value}
    color="orange"
    icon={
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    }
  />
);