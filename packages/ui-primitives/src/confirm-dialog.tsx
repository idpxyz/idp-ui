'use client';

import * as React from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button, type ButtonProps } from './button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog';
import { Spinner } from './progress';

export type ConfirmDialogTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Context passed to `renderFooter` so custom footers can reuse loading + variants. */
export interface ConfirmDialogRenderFooterContext {
  pending: boolean;
  confirmVariant: NonNullable<ButtonProps['variant']>;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  /** Same handler as the default primary button (async + pending). */
  onConfirm: () => void;
}

/**
 * Opinionated confirm modal on top of Radix `Dialog`.
 *
 * - **Overlay / Escape**: Controlled by `dismissable`; while `onConfirm` is awaiting a Promise, dismiss is blocked.
 * - **Default footer**: Cancel + Confirm; use `renderFooter` for extra actions or full layout control.
 * - **Message**: Rendered as Radix `DialogDescription` for accessible pairing with `DialogTitle`.
 */
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual intent: default icon, tint, and primary button variant (when using the default footer). */
  tone?: ConfirmDialogTone;
  /**
   * Sync or async. If a Promise is returned, the default primary button shows a spinner until settled;
   * both actions are disabled and outside dismiss is blocked until then.
   */
  onConfirm: () => void | Promise<void>;
  /** Called when the user dismisses via Cancel, overlay (if `dismissable`), or `onOpenChange(false)`. */
  onCancel: () => void;
  /**
   * When `false`, overlay click and Escape do not close the dialog (user must use your actions).
   * @default true
   */
  dismissable?: boolean;
  /** Replace the tone default icon. */
  icon?: React.ReactNode;
  /** Hide the leading icon column entirely. */
  hideIcon?: boolean;
  /** Extra content between the message and the footer. */
  extraContent?: React.ReactNode;
  /**
   * Replace the default Cancel/Confirm row. Use for multiple buttons or custom layouts.
   * Receives `pending` / `onConfirm` so you can mirror async behavior if needed.
   */
  renderFooter?: (ctx: ConfirmDialogRenderFooterContext) => React.ReactNode;
}

function toneParts(tone: ConfirmDialogTone): {
  Icon: LucideIcon;
  iconWrap: string;
  confirmVariant: NonNullable<ButtonProps['variant']>;
} {
  switch (tone) {
    case 'danger':
      return {
        Icon: AlertTriangle,
        iconWrap: 'bg-red-500/15 text-red-400',
        confirmVariant: 'danger',
      };
    case 'warning':
      return {
        Icon: AlertTriangle,
        iconWrap: 'bg-yellow-500/15 text-yellow-400',
        confirmVariant: 'default',
      };
    case 'info':
      return {
        Icon: Info,
        iconWrap: 'bg-blue-500/15 text-blue-400',
        confirmVariant: 'default',
      };
    case 'success':
      return {
        Icon: CheckCircle2,
        iconWrap: 'bg-emerald-500/15 text-emerald-400',
        confirmVariant: 'default',
      };
    case 'neutral':
      return {
        Icon: HelpCircle,
        iconWrap: 'bg-idpxyz-hover text-idpxyz-textMuted',
        confirmVariant: 'default',
      };
    default: {
      const _exhaustive: never = tone;
      return _exhaustive;
    }
  }
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
  dismissable = true,
  icon,
  hideIcon = false,
  extraContent,
  renderFooter,
}: ConfirmDialogProps) {
  const { Icon, iconWrap, confirmVariant } = toneParts(tone);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    if (!open) setPending(false);
  }, [open]);

  const handleConfirm = () => {
    void (async () => {
      try {
        setPending(true);
        await Promise.resolve(onConfirm());
      } finally {
        setPending(false);
      }
    })();
  };

  const blockOutsideDismiss = !dismissable || pending;

  const footerCtx: ConfirmDialogRenderFooterContext = {
    pending,
    confirmVariant,
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm: handleConfirm,
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !pending && onCancel()}>
      <DialogContent
        size="sm"
        className="max-w-[420px] gap-0 p-0 overflow-hidden"
        onPointerDownOutside={(e) => {
          if (blockOutsideDismiss) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (blockOutsideDismiss) e.preventDefault();
        }}
      >
        <div className="flex items-start gap-3 px-4 py-4">
          {!hideIcon && (
            <div className={`mt-0.5 shrink-0 rounded-full p-1.5 ${iconWrap}`}>
              {icon ?? <Icon size={14} strokeWidth={2} aria-hidden />}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-[14px] font-semibold text-idpxyz-textBright">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-[12px] leading-5">{message}</DialogDescription>
            {extraContent != null && <div className="mt-3 text-[12px] text-idpxyz-text">{extraContent}</div>}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-idpxyz-border px-4 py-3">
          {renderFooter ? (
            renderFooter(footerCtx)
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onCancel} disabled={pending}>
                {cancelLabel}
              </Button>
              <Button
                variant={confirmVariant}
                size="sm"
                onClick={handleConfirm}
                disabled={pending}
                aria-busy={pending}
              >
                {pending ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Spinner size="sm" className="!h-3 !w-3 shrink-0 text-current" />
                    {confirmLabel}
                  </span>
                ) : (
                  confirmLabel
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
