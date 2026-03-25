'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap = {
  info: 'border-blue-500/40 bg-blue-500/10',
  success: 'border-green-500/40 bg-green-500/10',
  warning: 'border-yellow-500/40 bg-yellow-500/10',
  error: 'border-red-500/40 bg-red-500/10',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = iconMap[toast.variant];

  React.useEffect(() => {
    const dur = toast.duration ?? 5000;
    if (dur <= 0) return;
    const timer = setTimeout(() => onDismiss(toast.id), dur);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div className={cn(
      'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] max-w-[420px]',
      'bg-vscode-sidebar text-vscode-text animate-in slide-in-from-right',
      colorMap[toast.variant]
    )}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold">{toast.title}</div>
        {toast.description && <div className="text-[11px] text-vscode-textMuted mt-0.5">{toast.description}</div>}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 p-0.5 rounded hover:bg-vscode-hover" aria-label="Dismiss">
        <X size={14} className="text-vscode-textMuted" />
      </button>
    </div>
  );
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <Toaster>');
  return ctx;
}

export { Toaster, useToast, type Toast, type ToastVariant };
