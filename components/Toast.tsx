import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 transition-all duration-300 z-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium">{message}</span>
      </div>
  );
};