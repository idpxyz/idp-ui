import { useState, useEffect, useCallback } from 'react';
import { IconClose } from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';

export interface ActionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: 'default' | 'danger';
  hideFooter?: boolean;
}

export function ActionModal({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = '确认',
  cancelLabel = '取消',
  onConfirm,
  variant = 'default',
  hideFooter = false,
}: ActionModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-vscode-sidebar border border-vscode-border rounded-lg shadow-xl w-full max-w-[480px] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-vscode-border">
          <h3 className="text-[13px] font-semibold text-vscode-textBright">{title}</h3>
          <button onClick={onClose} className="text-vscode-textMuted hover:text-vscode-text transition-colors">
            <IconClose size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          {description && <p className="text-[12px] text-vscode-textMuted mb-3">{description}</p>}
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-vscode-border">
            <Button variant="ghost" size="sm" onClick={onClose}>{cancelLabel}</Button>
            <Button
              variant={variant === 'danger' ? 'danger' : 'default'}
              size="sm"
              onClick={() => { onConfirm?.(); onClose(); }}
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Form building blocks ──

export function ModalInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-vscode-textMuted mb-1">{label}</label>
      <input
        type={type}
        className="w-full bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1.5 text-[12px] text-vscode-text outline-none focus:border-vscode-accent"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export function ModalTextarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-vscode-textMuted mb-1">{label}</label>
      <textarea
        className="w-full bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1.5 text-[12px] text-vscode-text outline-none focus:border-vscode-accent resize-none"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
      />
    </div>
  );
}

export function ModalSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] text-vscode-textMuted mb-1">{label}</label>
      <select
        className="w-full bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1.5 text-[12px] text-vscode-text outline-none focus:border-vscode-accent"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

