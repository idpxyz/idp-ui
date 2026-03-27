/**
 * Describes a tab-bar or sidebar navigation that is about to occur.
 * Apps implement {@link WorkspaceNavigationGuard} to block or allow (e.g. unsaved edits).
 *
 * Workspace stays domain-agnostic: no product-specific ids — only `groupId` and tab/nav ids.
 */

export type WorkspaceNavigationIntent =
  | {
      kind: 'tabClick';
      groupId: string;
      /** Active tab in this group before the click. */
      fromTabId: string;
      /** Tab being activated. */
      toTabId: string;
    }
  | {
      kind: 'tabClose';
      groupId: string;
      tabId: string;
    }
  | {
      kind: 'closeOthers';
      groupId: string;
      /** Tab id kept open. */
      keepTabId: string;
    }
  | {
      kind: 'closeToRight';
      groupId: string;
      /** Anchor tab; tabs to its right are closed. */
      anchorTabId: string;
    }
  | {
      kind: 'closeAll';
      groupId: string;
    }
  | {
      kind: 'sidebarNav';
      /** Navigation item id (typically matches editor tab id). */
      navId: string;
    };

/**
 * Return `true` to allow the navigation, `false` to cancel.
 * May be async (e.g. show a confirm dialog and resolve when the user chooses).
 */
export type WorkspaceNavigationGuard = (intent: WorkspaceNavigationIntent) => boolean | Promise<boolean>;

/**
 * Runs `action` only if `guard` is absent or returns a truthy result for `intent`.
 */
export async function runWorkspaceNavigationGuard(
  guard: WorkspaceNavigationGuard | undefined,
  intent: WorkspaceNavigationIntent,
  action: () => void,
): Promise<void> {
  if (!guard) {
    action();
    return;
  }
  const ok = await Promise.resolve(guard(intent));
  if (ok) action();
}
