import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useResize, useSplitResize, type EditorGroupData, type Tab, type RecentObject } from '@idpxyz/ui-workspace';

type SplitDirection = 'none' | 'horizontal' | 'vertical';

const STORAGE_KEY = 'idpxyz-parcel.workspace-state.v1';

interface PersistedState {
  groups: EditorGroupData[];
  activeGroupId: string;
  splitDirection: SplitDirection;
  closedTabs: Tab[];
  recentObjects: RecentObject[];
  sidebarVisible: boolean;
  rightSidebarVisible: boolean;
  bottomPanelVisible: boolean;
  sidebarWidth: number;
  rightSidebarWidth: number;
  bottomPanelHeight: number;
  splitRatioHorizontal: number;
  splitRatioVertical: number;
}

const DEFAULTS: PersistedState = {
  groups: [{ id: 'group-0', tabs: [{ id: 'product-catalog', name: 'Product catalog' }], activeTab: 'product-catalog' }],
  activeGroupId: 'group-0',
  splitDirection: 'none',
  closedTabs: [],
  recentObjects: [],
  sidebarVisible: true,
  rightSidebarVisible: false,
  bottomPanelVisible: false,
  sidebarWidth: 240,
  rightSidebarWidth: 280,
  bottomPanelHeight: 200,
  splitRatioHorizontal: 50,
  splitRatioVertical: 50,
};

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function useWorkspaceState() {
  const groupCounter = useRef(1);
  const nextGroupId = useCallback(() => `group-${groupCounter.current++}`, []);

  const initial = useMemo(() => loadState(), []);

  const [groups, setGroups] = useState<EditorGroupData[]>(initial.groups);
  const [activeGroupId, setActiveGroupId] = useState(initial.activeGroupId);
  const [splitDirection, setSplitDirection] = useState<SplitDirection>(initial.splitDirection);
  const [closedTabs, setClosedTabs] = useState<Tab[]>(initial.closedTabs);
  const [recentObjects, setRecentObjects] = useState<RecentObject[]>(initial.recentObjects);
  const [sidebarVisible, setSidebarVisible] = useState(initial.sidebarVisible);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(initial.rightSidebarVisible);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(initial.bottomPanelVisible);

  const sidebarResize = useResize({ direction: 'horizontal', initialSize: initial.sidebarWidth, minSize: 170, maxSize: 500 });
  const bottomPanelResize = useResize({ direction: 'vertical', initialSize: initial.bottomPanelHeight, minSize: 80, maxSize: 500, reverse: true });
  const rightSidebarResize = useResize({ direction: 'horizontal', initialSize: initial.rightSidebarWidth, minSize: 170, maxSize: 500, reverse: true });
  const splitResizeH = useSplitResize('horizontal');
  const splitResizeV = useSplitResize('vertical');

  useEffect(() => {
    splitResizeH.setRatio(initial.splitRatioHorizontal);
    splitResizeV.setRatio(initial.splitRatioVertical);
  }, []);

  /** After closing a split pane, `activeGroupId` may still point at a removed group — fix so sidebar / openNavTab work. */
  useEffect(() => {
    setActiveGroupId((current) => {
      if (groups.some((g) => g.id === current)) return current;
      return groups[0]?.id ?? current;
    });
  }, [groups]);

  const activeSplitResize = splitDirection === 'vertical' ? splitResizeV : splitResizeH;
  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const activeTabData = activeGroup?.tabs.find((t) => t.id === activeGroup.activeTab);

  const openTab = useCallback((groupId: string, tabId: string, tabName: string, subtitle?: string) => {
    setGroups((prev) => {
      for (const g of prev) {
        if (g.tabs.find((t) => t.id === tabId)) {
          setActiveGroupId(g.id);
          return prev.map((gr) => (gr.id === g.id ? { ...gr, activeTab: tabId } : gr));
        }
      }
      return prev.map((g) =>
        g.id === groupId ? { ...g, tabs: [...g.tabs, { id: tabId, name: tabName, subtitle }], activeTab: tabId } : g,
      );
    });
  }, []);

  const openNavTab = useCallback(
    (navId: string, tabName: string) => {
      setGroups((prev) => {
        if (prev.length === 0) return prev;
        let gIdx = prev.findIndex((g) => g.id === activeGroupId);
        if (gIdx === -1) gIdx = 0;
        const group = prev[gIdx];
        if (group.tabs.find((t) => t.id === navId)) {
          const updated = [...prev];
          updated[gIdx] = { ...group, activeTab: navId };
          return updated;
        }
        const updated = [...prev];
        updated[gIdx] = { ...group, tabs: [...group.tabs, { id: navId, name: tabName }], activeTab: navId };
        return updated;
      });
    },
    [activeGroupId],
  );

  const clickTab = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, activeTab: tabId } : g)));
    setActiveGroupId(groupId);
  }, []);

  const closeTab = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const closed = group?.tabs.find((t) => t.id === tabId);
      if (closed) setClosedTabs((ct) => [...ct.slice(-19), { ...closed, pinned: false }]);
      const updated = prev.map((g) => {
        if (g.id !== groupId) return g;
        const tabs = g.tabs.filter((t) => t.id !== tabId);
        const active = g.activeTab === tabId && tabs.length > 0 ? tabs[tabs.length - 1].id : g.activeTab;
        return { ...g, tabs, activeTab: active };
      });
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]];
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
      }),
    );
  }, []);

  const closeOthers = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
        return { ...g, tabs: kept, activeTab: tabId };
      }),
    );
  }, []);

  const closeToRight = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const idx = g.tabs.findIndex((t) => t.id === tabId);
        return { ...g, tabs: g.tabs.filter((_, i) => i <= idx || g.tabs[i].pinned) };
      }),
    );
  }, []);

  const closeAll = useCallback((groupId: string) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id !== groupId ? g : { ...g, tabs: g.tabs.filter((t) => t.pinned), activeTab: '' }));
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]];
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
        tabs.splice(to, 0, moved);
        return { ...g, tabs };
      }),
    );
  }, []);

  const reopenClosed = useCallback((groupId: string) => {
    setClosedTabs((prev) => {
      if (prev.length === 0) return prev;
      const tab = prev[prev.length - 1];
      setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, tabs: [...g.tabs, tab], activeTab: tab.id } : g)));
      return prev.slice(0, -1);
    });
  }, []);

  const split = useCallback(
    (direction: 'horizontal' | 'vertical') => {
      setGroups((prev) => {
        if (prev.length >= 2) return prev;
        const current = prev.find((g) => g.id === activeGroupId) || prev[0];
        const activeTab = current.tabs.find((t) => t.id === current.activeTab);
        return [...prev, { id: nextGroupId(), tabs: activeTab ? [{ ...activeTab }] : [], activeTab: activeTab?.id || '' }];
      });
      setSplitDirection(direction);
    },
    [activeGroupId, nextGroupId],
  );

  /** Recompute `tab.name` from `tab.id` when locale changes — EditorGroup only displays stored `name`. */
  const syncTabLabels = useCallback((resolve: (tabId: string) => string) => {
    setGroups((prev) => {
      let changed = false;
      const next = prev.map((g) => ({
        ...g,
        tabs: g.tabs.map((tab) => {
          const name = resolve(tab.id);
          if (name !== tab.name) changed = true;
          return { ...tab, name };
        }),
      }));
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          groups,
          activeGroupId,
          splitDirection,
          closedTabs,
          recentObjects,
          sidebarVisible,
          rightSidebarVisible,
          bottomPanelVisible,
          sidebarWidth: sidebarResize.size,
          rightSidebarWidth: rightSidebarResize.size,
          bottomPanelHeight: bottomPanelResize.size,
          splitRatioHorizontal: splitResizeH.ratio,
          splitRatioVertical: splitResizeV.ratio,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [
    groups,
    activeGroupId,
    splitDirection,
    closedTabs,
    recentObjects,
    sidebarVisible,
    rightSidebarVisible,
    bottomPanelVisible,
    sidebarResize.size,
    rightSidebarResize.size,
    bottomPanelResize.size,
    splitResizeH.ratio,
    splitResizeV.ratio,
  ]);

  return {
    groups,
    activeGroupId,
    activeGroup,
    activeTabData,
    splitDirection,
    closedTabs,
    recentObjects,
    sidebarVisible,
    setSidebarVisible,
    rightSidebarVisible,
    setRightSidebarVisible,
    bottomPanelVisible,
    setBottomPanelVisible,
    sidebarResize,
    rightSidebarResize,
    bottomPanelResize,
    activeSplitResize,
    openTab,
    openNavTab,
    clickTab,
    closeTab,
    pinTab,
    closeOthers,
    closeToRight,
    closeAll,
    reorderTab,
    reopenClosed,
    split,
    setActiveGroupId,
    syncTabLabels,
  };
}
