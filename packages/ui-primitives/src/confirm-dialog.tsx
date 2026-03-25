import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[120] bg-black/45" onClick={onCancel} />
      <div className="fixed inset-0 z-[121] flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] rounded-md border border-vscode-border bg-vscode-sidebar shadow-xl">
          <div className="flex items-start gap-3 px-4 py-4">
            <div className={`mt-0.5 rounded-full p-1.5 ${tone === 'danger' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
              <AlertTriangle size={14} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-vscode-textBright">{title}</h3>
              <p className="mt-1 text-[12px] leading-5 text-vscode-textMuted">{message}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-vscode-border px-4 py-3">
            <Button variant="outline" size="sm" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant={tone === 'danger' ? 'danger' : 'default'} size="sm" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
