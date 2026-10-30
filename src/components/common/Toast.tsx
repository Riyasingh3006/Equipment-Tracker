import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, dismissToast } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white shadow-emerald-500/10',
    error: 'border-rose-200 bg-white shadow-rose-500/10',
    info: 'border-blue-200 bg-white shadow-blue-500/10'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`p-4 rounded-2xl border shadow-xl flex items-center space-x-3 ${bgStyles[toastMessage.type]}`}>
        {icons[toastMessage.type]}
        <p className="text-xs sm:text-sm font-medium text-slate-800 flex-1 leading-snug">
          {toastMessage.text}
        </p>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
