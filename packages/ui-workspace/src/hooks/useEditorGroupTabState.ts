import { useState, useCallback } from 'react';
import type { EditorGroupData, Tab } from '../EditorGroup';

/**
 * Local tab-bar state for {@link EditorGroup}: close / pin / reorder / context menu actions.
 * Wire the returned handlers into `EditorGroup`; use `setGroup` when opening tabs from navigation.
 */
export function useEditorGroupTabState(initial: EditorGroupData) {
  const [group, setGroup] = useState<EditorGroupData>(initial);
  const [closedStack, setClosedStack] = useState<Tab[]>([]);

  const onTabClose = useCallback((tabId: string) => {
    setGroup((g) => {
      const closed = g.tabs.find((t) => t.id === tabId);
      const next = g.tabs.filter((t) => t.id !== tabId);
      if (next.length === 0) return g;
      if (closed) {
        queueMicrotask(() => setClosedStack((s) => [...s.slice(-19), { ...closed, pinned: false }]));
      }
      return {
        ...g,
        tabs: next,
        activeTab: g.activeTab === tabId ? next[next.length - 1]!.id : g.activeTab,
      };
    });
  }, []);

  const onTabPin = useCallback((tabId: string) => {
    setGroup((g) => {
      const tabs = g.tabs.map((t) => (t.id === tabId ? { ...t, pinned: !t.pinned } : t));
      tabs.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
      return { ...g, tabs };
    });
  }, []);

  const onCloseOthers = useCallback((tabId: string) => {
    setGroup((g) => {
      const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
      return { ...g, tabs: kept, activeTab: tabId };
    });
  }, []);

  const onCloseToRight = useCallback((tabId: string) => {
    setGroup((g) => {
      const idx = g.tabs.findIndex((t) => t.id === tabId);
      if (idx < 0) return g;
      const tabs = g.tabs.filter((t, i) => i <= idx || t.pinned);
      return { ...g, tabs };
    });
  }, []);

  const onCloseAll = useCallback(() => {
    setGroup((g) => {
      const tabs = g.tabs.filter((t) => t.pinned);
      const activeTab = tabs.length > 0 ? tabs[tabs.length - 1]!.id : '';
      return { ...g, tabs, activeTab };
    });
  }, []);

  const onTabReorder = useCallback((from: number, to: number) => {
    setGroup((g) => {
      const tabs = [...g.tabs];
      const [moved] = tabs.splice(from, 1);
      tabs.splice(to, 0, moved);
      return { ...g, tabs };
    });
  }, []);

  const onReopenClosed = useCallback(() => {
    setClosedStack((stack) => {
      if (stack.length === 0) return stack;
      const tab = stack[stack.length - 1];
      setGroup((g) => {
        if (g.tabs.some((t) => t.id === tab.id)) return g;
        return { ...g, tabs: [...g.tabs, tab], activeTab: tab.id };
      });
      return stack.slice(0, -1);
    });
  }, []);

  return {
    group,
    setGroup,
    closedStack,
    onTabClose,
    onTabPin,
    onCloseOthers,
    onCloseToRight,
    onCloseAll,
    onTabReorder,
    onReopenClosed,
  };
}
