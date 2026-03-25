import { useCallback, useMemo, useRef, useState } from 'react';
import {
  useSplitResize,
  type EditorGroupData,
  type Tab,
} from '@idpxyz/ui-workspace';
import { tabTitles } from '../mock/oms';

type SplitDirection = 'none' | 'horizontal' | 'vertical';

const initialTabs: EditorGroupData['tabs'] = [
  { id: 'orders-overview', name: tabTitles['orders-overview'] },
  { id: 'inventory-alerts', name: tabTitles['inventory-alerts'] },
  { id: 'fulfillment-queue', name: tabTitles['fulfillment-queue'] },
];

export function useOmsWorkbenchState() {
  const groupCounter = useRef(1);
  const nextGroupId = useCallback(() => `group-${groupCounter.current++}`, []);

  const [groups, setGroups] = useState<EditorGroupData[]>([
    { id: 'group-0', tabs: initialTabs, activeTab: 'orders-overview' },
  ]);
  const [activeGroupId, setActiveGroupId] = useState('group-0');
  const [splitDirection, setSplitDirection] = useState<SplitDirection>('none');
  const [closedStack, setClosedStack] = useState<Tab[]>([]);

  const splitResizeH = useSplitResize('horizontal');
  const splitResizeV = useSplitResize('vertical');
  const activeSplitResize = splitDirection === 'vertical' ? splitResizeV : splitResizeH;

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) ?? groups[0],
    [groups, activeGroupId]
  );
  const activeTabData = activeGroup?.tabs.find((t) => t.id === activeGroup.activeTab);

  const clickTab = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, activeTab: tabId } : g)));
    setActiveGroupId(groupId);
  }, []);

  const closeTab = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const closed = group?.tabs.find((t) => t.id === tabId);
      const updated = prev.map((g) => {
        if (g.id !== groupId) return g;
        const tabs = g.tabs.filter((t) => t.id !== tabId);
        const active =
          g.activeTab === tabId && tabs.length > 0 ? tabs[tabs.length - 1]!.id : g.activeTab;
        return { ...g, tabs, activeTab: active };
      });
      if (closed) {
        queueMicrotask(() =>
          setClosedStack((s) => [...s.slice(-19), { ...closed, pinned: false }])
        );
      }
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]!];
      if (nonEmpty.length === 1 && updated.length > 1) {
        setSplitDirection('none');
        return nonEmpty;
      }
      return updated;
    });
  }, []);

  const pinTab = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const tabs = g.tabs.map((t) => (t.id === tabId ? { ...t, pinned: !t.pinned } : t));
        tabs.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
        return { ...g, tabs };
      })
    );
  }, []);

  const closeOthers = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
        return { ...g, tabs: kept, activeTab: tabId };
      })
    );
  }, []);

  const closeToRight = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const idx = g.tabs.findIndex((t) => t.id === tabId);
        return { ...g, tabs: g.tabs.filter((_, i) => i <= idx || g.tabs[i]!.pinned) };
      })
    );
  }, []);

  const closeAll = useCallback((groupId: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) =>
        g.id !== groupId ? g : { ...g, tabs: g.tabs.filter((t) => t.pinned), activeTab: '' }
      );
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]!];
      if (nonEmpty.length === 1 && updated.length > 1) {
        setSplitDirection('none');
        return nonEmpty;
      }
      return updated;
    });
  }, []);

  const reorderTab = useCallback((groupId: string, from: number, to: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const tabs = [...g.tabs];
        const [moved] = tabs.splice(from, 1);
        tabs.splice(to, 0, moved!);
        return { ...g, tabs };
      })
    );
  }, []);

  const reopenClosed = useCallback((groupId: string) => {
    setClosedStack((stack) => {
      if (stack.length === 0) return stack;
      const tab = stack[stack.length - 1]!;
      setGroups((gs) =>
        gs.map((g) =>
          g.id === groupId ? { ...g, tabs: [...g.tabs, tab], activeTab: tab.id } : g
        )
      );
      return stack.slice(0, -1);
    });
  }, []);

  const split = useCallback(
    (direction: 'horizontal' | 'vertical') => {
      setGroups((prev) => {
        if (prev.length >= 2) return prev;
        const current = prev.find((g) => g.id === activeGroupId) ?? prev[0];
        const activeTab = current.tabs.find((t) => t.id === current.activeTab);
        return [
          ...prev,
          {
            id: nextGroupId(),
            tabs: activeTab ? [{ ...activeTab }] : [],
            activeTab: activeTab?.id ?? '',
          },
        ];
      });
      setSplitDirection(direction);
    },
    [activeGroupId, nextGroupId]
  );

  const openNavTab = useCallback(
    (navId: string) => {
      const name = tabTitles[navId] ?? navId;
      setGroups((prev) => {
        const gIdx = prev.findIndex((g) => g.id === activeGroupId);
        if (gIdx === -1) return prev;
        const g = prev[gIdx]!;
        if (g.tabs.some((t) => t.id === navId)) {
          const next = [...prev];
          next[gIdx] = { ...g, activeTab: navId };
          return next;
        }
        const next = [...prev];
        next[gIdx] = { ...g, tabs: [...g.tabs, { id: navId, name }], activeTab: navId };
        return next;
      });
    },
    [activeGroupId]
  );

  return {
    groups,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    activeTabData,
    splitDirection,
    activeSplitResize,
    clickTab,
    closeTab,
    pinTab,
    closeOthers,
    closeToRight,
    closeAll,
    reorderTab,
    reopenClosed,
    split,
    openNavTab,
  };
}
