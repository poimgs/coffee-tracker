import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-50 text-green-800 rounded-lg shadow-lg p-4 flex items-center space-x-2 z-50">
      <CheckCircle className="h-5 w-5 text-green-400" />
      <span>{message}</span>
    </div>
  );
}