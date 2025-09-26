// components/common/Notification.tsx
import React from 'react';
import { Check, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  notification: {
    message: string;
    type: 'success' | 'error';
  } | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
      notification.type === 'success' 
        ? 'bg-green-600 text-white' 
        : 'bg-red-600 text-white'
    }`}>
      {notification.type === 'success' ? (
        <Check className="w-5 h-5" />
      ) : (
        <AlertCircle className="w-5 h-5" />
      )}
      <span className="font-medium">{notification.message}</span>
      <button 
        onClick={onClose}
        className="text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};