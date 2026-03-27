import { useCallback, useRef, useState } from 'react';
import { ConfirmDialog } from '@idpxyz/ui-primitives';
import type { WorkspaceNavigationIntent } from '../navigationGuard';

/**
 * Storybook-only: drive {@link WorkspaceNavigationGuard} with {@link ConfirmDialog} instead of `window.confirm`.
 * Workspace itself stays headless — apps bring their own confirm UI; stories use this helper.
 */
export function useStoryConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const ask = useCallback((text: string) => {
    setMessage(text);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setOpen(true);
    });
  }, []);

  const dialog = (
    <ConfirmDialog
      open={open}
      tone="warning"
      title="Navigation guard (Storybook)"
      message={message}
      confirmLabel="Continue"
      cancelLabel="Cancel"
      onConfirm={() => {
        resolveRef.current?.(true);
        resolveRef.current = null;
        setOpen(false);
      }}
      onCancel={() => {
        resolveRef.current?.(false);
        resolveRef.current = null;
        setOpen(false);
      }}
    />
  );

  return { ask, dialog };
}

/** Human-readable copy for {@link WorkspaceNavigationIntent} in stories. */
export function formatWorkspaceNavigationIntentForStory(intent: WorkspaceNavigationIntent): string {
  switch (intent.kind) {
    case 'tabClick':
      return `Switch tab (${intent.fromTabId} → ${intent.toTabId})?`;
    case 'tabClose':
      return `Close tab "${intent.tabId}"?`;
    case 'closeOthers':
      return `Close other tabs (keep ${intent.keepTabId})?`;
    case 'closeToRight':
      return `Close tabs to the right of "${intent.anchorTabId}"?`;
    case 'closeAll':
      return 'Close all tabs?';
    case 'sidebarNav':
      return `Open sidebar item "${intent.navId}"?`;
  }
}
