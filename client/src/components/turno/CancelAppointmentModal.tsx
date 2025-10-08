import React, { useState } from 'react';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  patientName?: string;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  patientName
}) => {
  const [motivo, setMotivo] = useState('');
  const [motivoPredef, setMotivoPredef] = useState('');

  if (!isOpen) return null;

  const motivosPredefinidos = [
    'Paciente canceló',
    'Profesional no disponible',
    'Reagendado',
    'Problemas de salud del paciente',
    'Condiciones climáticas',
    'Otro motivo'
  ];

  const handleConfirm = () => {
    const motivoFinal = motivoPredef === 'Otro motivo' ? motivo : motivoPredef || motivo;
    
    if (!motivoFinal.trim()) {
      alert('Por favor, selecciona o escribe un motivo de cancelación');
      return;
    }
    
    onConfirm(motivoFinal);
    handleClose();
  };

  const handleClose = () => {
    setMotivo('');
    setMotivoPredef('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-slideUp">
        {/* Barra decorativa superior */}
        <div className="h-2 bg-gradient-to-r from-red-400 to-rose-500" />
        
        <div className="p-8">
          {/* Header con icono */}
          <div className="text-center mb-6">
            <div className="inline-flex p-4 rounded-2xl border-2 bg-red-50 border-red-500 mb-4">
              <div className="w-12 h-12 text-red-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Cancelar Turno
            </h3>
            {patientName && (
              <p className="text-gray-500 text-sm mb-3">
                Paciente: <span className="font-semibold text-gray-700">{patientName}</span>
              </p>
            )}
            <p className="text-gray-600 text-base leading-relaxed">
              Por favor, indica el motivo de la cancelación
            </p>
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-100 my-6" />

          {/* Motivos predefinidos */}
          <div className="space-y-3 mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motivo de cancelación
            </label>
            <div className="grid grid-cols-2 gap-2">
              {motivosPredefinidos.map((motivoOp) => (
                <button
                  key={motivoOp}
                  type="button"
                  onClick={() => setMotivoPredef(motivoOp)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                    motivoPredef === motivoOp
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {motivoOp}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de texto si elige "Otro motivo" o quiere especificar */}
          {(motivoPredef === 'Otro motivo' || (!motivoPredef && motivo)) && (
            <div className="mb-5 animate-slideDown">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Especifica el motivo
              </label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Escribe aquí el motivo de cancelación..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-0 text-gray-900 placeholder-gray-400 resize-none transition-colors"
              />
            </div>
          )}

          {/* Línea separadora */}
          <div className="border-t border-gray-100 my-6" />

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold transition-all duration-200 border border-gray-200"
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Confirmar cancelación
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            height: 0;
          }
          to {
            opacity: 1;
            height: auto;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};