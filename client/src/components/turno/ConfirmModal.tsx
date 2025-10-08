import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'success'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    success: {
      iconBg: 'bg-green-500/20',
      iconBorder: 'border-green-500/30',
      iconColor: 'text-green-400',
      buttonBg: 'bg-green-500 hover:bg-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    danger: {
      iconBg: 'bg-red-500/20',
      iconBorder: 'border-red-500/30',
      iconColor: 'text-red-400',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    warning: {
      iconBg: 'bg-yellow-500/20',
      iconBorder: 'border-yellow-500/30',
      iconColor: 'text-yellow-400',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-lg w-full overflow-hidden animate-slideUp">
        {/* Decoración superior con gradiente */}
        <div className={`h-2 bg-gradient-to-r ${
          type === 'success' ? 'from-green-400 to-emerald-500' :
          type === 'danger' ? 'from-red-400 to-rose-500' :
          'from-yellow-400 to-amber-500'
        }`} />
        
        <div className="p-8">
          {/* Header con icono más grande y centrado */}
          <div className="text-center mb-6">
            <div className={`inline-flex p-4 rounded-2xl border-2 ${currentStyle.iconBg} ${currentStyle.iconBorder} mb-4`}>
              <div className={`w-12 h-12 ${currentStyle.iconColor}`}>
                {currentStyle.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {title}
            </h3>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm mx-auto">
              {message}
            </p>
          </div>

          {/* Línea separadora sutil */}
          <div className="border-t border-gray-100 my-6" />

          {/* Botones de acción con mejor jerarquía visual */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold transition-all duration-200 border border-gray-200"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3.5 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] ${currentStyle.buttonBg}`}
            >
              {confirmText}
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
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};