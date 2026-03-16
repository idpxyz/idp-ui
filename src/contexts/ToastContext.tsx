import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const icons: Record<ToastType, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const styles: Record<ToastType, { bar: string; icon: string; bg: string; border: string }> = {
  success: { bar: 'bg-green-400', icon: 'text-green-400', bg: 'bg-vscode-sidebar', border: 'border-green-500/30' },
  warning: { bar: 'bg-yellow-400', icon: 'text-yellow-400', bg: 'bg-vscode-sidebar', border: 'border-yellow-500/30' },
  error:   { bar: 'bg-red-400',   icon: 'text-red-400',   bg: 'bg-vscode-sidebar', border: 'border-red-500/30' },
  info:    { bar: 'bg-blue-400',  icon: 'text-blue-400',  bg: 'bg-vscode-sidebar', border: 'border-blue-500/30' },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const s = styles[toast.type];
  const Icon = icons[toast.type];
  return (
    <div className={`relative flex items-start gap-3 px-3 py-2.5 rounded border shadow-xl min-w-[260px] max-w-[340px] ${s.bg} ${s.border} overflow-hidden`}>
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${s.bar}`} />
      <Icon size={15} className={`shrink-0 mt-0.5 ${s.icon}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-vscode-textBright leading-tight">{toast.title}</div>
        {toast.message && <div className="text-[11px] text-vscode-textMuted mt-0.5 leading-snug">{toast.message}</div>}
      </div>
      <button onClick={onRemove} className="shrink-0 text-vscode-textMuted hover:text-vscode-text p-0.5 rounded hover:bg-vscode-hover mt-0.5">
        <X size={12} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
    const duration = toast.duration ?? (toast.type === 'error' ? 6000 : 3500);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container 鈥?bottom-right, above status bar */}
      <div className="fixed bottom-[26px] right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-200">
            <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

