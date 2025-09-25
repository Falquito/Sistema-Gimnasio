// components/ErrorAlert.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <span className="text-red-300">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};