import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useResize,
  useSplitResize,
  type EditorGroupData,
  type Tab,
  type RecentObject,
} from '@idpxyz/ui-workspace';
import type { SidebarSelection } from '../data/oms';
import { omsTabNameMap } from '../navigation';

export type SplitDirection = 'none' | 'horizontal' | 'vertical';

const WORKSPACE_STATE_STORAGE_KEY = 'myshop-oms.workspace-state.v1';

export interface PersistedWorkspaceState {
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

const initialGroup: EditorGroupData = {
  id: 'group-0',
  tabs: [{ id: 'dashboard', name: 'OMS 控制台' }],
  activeTab: 'dashboard',
};

function getDefaultWorkspaceState(): PersistedWorkspaceState {
  return {
    groups: [initialGroup],
    activeGroupId: 'group-0',
    splitDirection: 'none',
    closedTabs: [],
    recentObjects: [],
    sidebarVisible: true,
    rightSidebarVisible: true,
    bottomPanelVisible: true,
    sidebarWidth: 240,
    rightSidebarWidth: 240,
    bottomPanelHeight: 200,
    splitRatioHorizontal: 50,
    splitRatioVertical: 50,
  };
}

function getNextGroupCounterFromGroups(groups: EditorGroupData[]): number {
  const maxIndex = groups.reduce((max, group) => {
    const match = /^group-(\d+)$/.exec(group.id);
    if (!match) return max;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
  return maxIndex + 1;
}

function loadWorkspaceState(): PersistedWorkspaceState {
  const fallback = getDefaultWorkspaceState();
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STATE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedWorkspaceState>;
    const groups = Array.isArray(parsed.groups) && parsed.groups.length > 0 ? parsed.groups : fallback.groups;
    const activeGroupId =
      typeof parsed.activeGroupId === 'string' && groups.some((g) => g.id === parsed.activeGroupId)
        ? parsed.activeGroupId
        : groups[0].id;
    const splitDirection: SplitDirection =
      parsed.splitDirection === 'horizontal' || parsed.splitDirection === 'vertical' || parsed.splitDirection === 'none'
        ? parsed.splitDirection
        : 'none';
    const closedTabs = Array.isArray(parsed.closedTabs) ? parsed.closedTabs : [];
    const recentObjects = Array.isArray(parsed.recentObjects) ? parsed.recentObjects : [];
    const sidebarVisible = typeof parsed.sidebarVisible === 'boolean' ? parsed.sidebarVisible : true;
    const rightSidebarVisible = typeof parsed.rightSidebarVisible === 'boolean' ? parsed.rightSidebarVisible : true;
    const bottomPanelVisible = typeof parsed.bottomPanelVisible === 'boolean' ? parsed.bottomPanelVisible : true;
    const sidebarWidth = typeof parsed.sidebarWidth === 'number' ? parsed.sidebarWidth : 240;
    const rightSidebarWidth = typeof parsed.rightSidebarWidth === 'number' ? parsed.rightSidebarWidth : 240;
    const bottomPanelHeight = typeof parsed.bottomPanelHeight === 'number' ? parsed.bottomPanelHeight : 200;
    const splitRatioHorizontal = typeof parsed.splitRatioHorizontal === 'number' ? parsed.splitRatioHorizontal : 50;
    const splitRatioVertical = typeof parsed.splitRatioVertical === 'number' ? parsed.splitRatioVertical : 50;

    return {
      groups,
      activeGroupId,
      splitDirection,
      closedTabs,
      recentObjects,
      sidebarVisible,
      rightSidebarVisible,
      bottomPanelVisible,
      sidebarWidth,
      rightSidebarWidth,
      bottomPanelHeight,
      splitRatioHorizontal,
      splitRatioVertical,
    };
  } catch {
    return fallback;
  }
}

export function useWorkspaceState() {
  const initial = useMemo(() => loadWorkspaceState(), []);
  const groupIdCounterRef = useRef(getNextGroupCounterFromGroups(initial.groups));
  const nextGroupId = useCallback(() => `group-${groupIdCounterRef.current++}`, []);

  const [groups, setGroups] = useState<EditorGroupData[]>(initial.groups);
  const [activeGroupId, setActiveGroupId] = useState(initial.activeGroupId);
  const [splitDirection, setSplitDirection] = useState<SplitDirection>(initial.splitDirection);
  const [closedTabs, setClosedTabs] = useState<Tab[]>(initial.closedTabs);
  const [recentObjects, setRecentObjects] = useState<RecentObject[]>(initial.recentObjects);
  const [sidebarVisible, setSidebarVisible] = useState(initial.sidebarVisible);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(initial.rightSidebarVisible);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(initial.bottomPanelVisible);
  const [bottomPanelMaximized, setBottomPanelMaximized] = useState(false);
  const [selectedObject, setSelectedObject] = useState<SidebarSelection | null>(null);

  const sidebarResize = useResize({
    direction: 'horizontal',
    initialSize: initial.sidebarWidth,
    minSize: 170,
    maxSize: 500,
  });
  const bottomPanelResize = useResize({
    direction: 'vertical',
    initialSize: initial.bottomPanelHeight,
    minSize: 100,
    maxSize: 500,
    reverse: true,
  });
  const rightSidebarResize = useResize({
    direction: 'horizontal',
    initialSize: initial.rightSidebarWidth,
    minSize: 170,
    maxSize: 500,
    reverse: true,
  });

  const splitResizeH = useSplitResize('horizontal');
  const splitResizeV = useSplitResize('vertical');

  useEffect(() => {
    splitResizeH.setRatio(initial.splitRatioHorizontal);
    splitResizeV.setRatio(initial.splitRatioVertical);
  }, []);

  const activeSplitResize = splitDirection === 'vertical' ? splitResizeV : splitResizeH;

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const activeTabData = activeGroup?.tabs.find((t) => t.id === activeGroup.activeTab);
  const activeTabId = activeTabData?.id;

  const handleMaximizeBottomPanel = useCallback(() => {
    const next = !bottomPanelMaximized;
    setBottomPanelMaximized(next);
    bottomPanelResize.setSize(next ? Math.floor(window.innerHeight * 0.75) : 200);
  }, [bottomPanelMaximized, bottomPanelResize]);

  const collapseBottomPanel = useCallback(() => {
    setBottomPanelVisible(false);
    setBottomPanelMaximized(false);
  }, []);

  const handleFileClick = useCallback((navId: string) => {
      const tabName = omsTabNameMap[navId] || navId;
      setGroups((prev) => {
        const gIdx = prev.findIndex((g) => g.id === activeGroupId);
        if (gIdx === -1) return prev;
        const group = prev[gIdx];
        const existingTab = group.tabs.find((t) => t.id === navId);
        if (existingTab) {
          const updated = [...prev];
          updated[gIdx] = { ...group, activeTab: existingTab.id };
          return updated;
        }
        const newTab: Tab = { id: navId, name: tabName };
        const updated = [...prev];
        updated[gIdx] = { ...group, tabs: [...group.tabs, newTab], activeTab: navId };
        return updated;
      });
  }, [activeGroupId]);

  const addRecentObject = useCallback((tabId: string, tabName: string) => {
    const isObjectTab = tabId.startsWith('order-detail-') || tabId.startsWith('EXC-') || tabId.startsWith('ORD-');
    if (!isObjectTab) return;
    const type: RecentObject['type'] =
      tabId.startsWith('order-detail-') || tabId.startsWith('ORD-') ? 'order' : 'exception';
    setRecentObjects((prev) => {
      const filtered = prev.filter((o) => o.id !== tabId);
      return [{ id: tabId, name: tabName, type }, ...filtered].slice(0, 20);
    });
  }, []);

  const handleOpenTab = useCallback(
    (groupId: string, tabId: string, tabName: string, subtitle?: string) => {
      addRecentObject(tabId, tabName);
      setGroups((prev) => {
        for (let i = 0; i < prev.length; i++) {
          const existingTab = prev[i].tabs.find((t) => t.id === tabId);
          if (existingTab) {
            const updated = [...prev];
            updated[i] = { ...prev[i], activeTab: tabId };
            setActiveGroupId(prev[i].id);
            return updated;
          }
        }
        const gIdx = prev.findIndex((g) => g.id === groupId);
        if (gIdx === -1) return prev;
        const group = prev[gIdx];
        const updated = [...prev];
        updated[gIdx] = { ...group, tabs: [...group.tabs, { id: tabId, name: tabName, subtitle }], activeTab: tabId };
        return updated;
      });
    },
    [addRecentObject]
  );

  const handleTabClick = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, activeTab: tabId } : g)));
    setActiveGroupId(groupId);
  }, []);

  const handleTabPin = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newTabs = g.tabs.map((t) => (t.id === tabId ? { ...t, pinned: !t.pinned } : t));
        newTabs.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
        return { ...g, tabs: newTabs };
      })
    );
  }, []);

  const handleTabClose = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const closedTab = group?.tabs.find((t) => t.id === tabId);
      if (closedTab) setClosedTabs((ct) => [...ct.slice(-19), { ...closedTab, pinned: false }]);
      const updated = prev.map((g) => {
        if (g.id !== groupId) return g;
        const newTabs = g.tabs.filter((t) => t.id !== tabId);
        const newActive = g.activeTab === tabId && newTabs.length > 0 ? newTabs[newTabs.length - 1].id : g.activeTab;
        return { ...g, tabs: newTabs, activeTab: newActive };
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

  const handleCloseOthers = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
        const closed = g.tabs.filter((t) => t.id !== tabId && !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        return { ...g, tabs: kept, activeTab: tabId };
      })
    );
  }, []);

  const handleCloseToRight = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const idx = g.tabs.findIndex((t) => t.id === tabId);
        if (idx === -1) return g;
        const kept = g.tabs.filter((t, i) => i <= idx || t.pinned);
        const closed = g.tabs.filter((t, i) => i > idx && !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        const newActive = kept.find((t) => t.id === g.activeTab) ? g.activeTab : tabId;
        return { ...g, tabs: kept, activeTab: newActive };
      })
    );
  }, []);

  const handleTabReorder = useCallback((groupId: string, fromIndex: number, toIndex: number) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newTabs = [...g.tabs];
        const [moved] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, moved);
        return { ...g, tabs: newTabs };
      })
    );
  }, []);

  const handleCloseAll = useCallback((groupId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      if (group) {
        const pinned = group.tabs.filter((t) => t.pinned);
        const closed = group.tabs.filter((t) => !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        if (pinned.length > 0) {
          return prev.map((g) => (g.id !== groupId ? g : { ...g, tabs: pinned, activeTab: pinned[0].id }));
        }
      }
      const updated = prev.map((g) => (g.id !== groupId ? g : { ...g, tabs: [], activeTab: '' }));
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]];
      if (nonEmpty.length === 1 && updated.length > 1) {
        setSplitDirection('none');
        return nonEmpty;
      }
      return updated;
    });
  }, []);

  const handleReopenClosed = useCallback((groupId: string) => {
    setClosedTabs((prev) => {
      if (prev.length === 0) return prev;
      const tab = prev[prev.length - 1];
      setGroups((gs) =>
        gs.map((g) => {
          if (g.id !== groupId) return g;
          if (g.tabs.find((t) => t.id === tab.id)) return { ...g, activeTab: tab.id };
          return { ...g, tabs: [...g.tabs, tab], activeTab: tab.id };
        })
      );
      return prev.slice(0, -1);
    });
  }, []);

  const handleSplit = useCallback(
    (direction: 'horizontal' | 'vertical') => {
      setGroups((prev) => {
        if (prev.length >= 2) return prev;
        const current = prev.find((g) => g.id === activeGroupId) || prev[0];
        const activeTab = current.tabs.find((t) => t.id === current.activeTab);
        const newGroup: EditorGroupData = {
          id: nextGroupId(),
          tabs: activeTab ? [{ ...activeTab }] : [],
          activeTab: activeTab?.id || '',
        };
        return [...prev, newGroup];
      });
      setSplitDirection(direction);
    },
    [activeGroupId, nextGroupId]
  );

  useEffect(() => {
    if (selectedObject) {
      setRightSidebarVisible(true);
    }
  }, [selectedObject]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stateToPersist: PersistedWorkspaceState = {
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
    };
    try {
      window.localStorage.setItem(WORKSPACE_STATE_STORAGE_KEY, JSON.stringify(stateToPersist));
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
    setActiveGroupId,
    splitDirection,
    activeGroup,
    activeTabData,
    activeTabId,
    closedTabs,
    recentObjects,
    sidebarVisible,
    setSidebarVisible,
    rightSidebarVisible,
    setRightSidebarVisible,
    bottomPanelVisible,
    setBottomPanelVisible,
    bottomPanelMaximized,
    selectedObject,
    setSelectedObject,
    sidebarResize,
    rightSidebarResize,
    bottomPanelResize,
    activeSplitResize,
    handleMaximizeBottomPanel,
    handleFileClick,
    handleOpenTab,
    handleTabClick,
    handleTabPin,
    handleTabClose,
    handleCloseOthers,
    handleCloseToRight,
    handleTabReorder,
    handleCloseAll,
    handleReopenClosed,
    handleSplit,
    collapseBottomPanel,
  };
}
