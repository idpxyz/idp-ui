import { useState, useCallback, useEffect, useMemo } from 'react';
import TitleBar, { type RecentObject } from './components/TitleBar';
import ActivityBar from './components/ActivityBar';
import Sidebar from './components/Sidebar';
import EditorGroup, { type EditorGroupData, type Tab } from './components/EditorGroup';
import StatusBar from './components/StatusBar';
import BottomPanel from './components/BottomPanel';
import RightSidebar from './components/RightSidebar';
import CommandPalette, { buildDefaultCommandActions } from './components/CommandPalette';
import { useResize } from './hooks/useResize';
import { useSplitResize } from './hooks/useSplitResize';
import { type Shipment, type Exception } from './data/loms';
import { ToastProvider } from './contexts/ToastContext';

let groupIdCounter = 1;
function nextGroupId() {
  return `group-${groupIdCounter++}`;
}

const tabNameMap: Record<string, string> = {
  'ops-dashboard': 'Operations Dashboard',
  'sla-overview': 'SLA Overview',
  'network-health': 'Network Health',
  'shipment-monitor': 'Shipment Monitor',
  'order-list': 'Orders',
  'fulfillment': 'Fulfillment',
  'leg-monitor': 'Legs',
  'exception-queue': 'Exceptions',
  'tracking-center': 'Tracking Center',
  'carrier-ops': 'Carrier Ops',
  'routing': 'Routing',
  'billing': 'Billing',
  'reports': 'Reports',
  'saved-views': 'Saved Views',
  'recent-objects': 'Recent Objects',
  'watchlists': 'Watchlists',
  'my-queues': 'My Queues',
  'config': 'Configuration',
  'audit': 'Audit Log',
};

const initialGroup: EditorGroupData = {
  id: 'group-0',
  tabs: [{ id: 'shipment-monitor', name: 'Shipment Monitor' }],
  activeTab: 'shipment-monitor',
};

type SplitDirection = 'none' | 'horizontal' | 'vertical';

const WORKSPACE_STATE_STORAGE_KEY = 'vscode-ui.workspace-state.v1';

interface PersistedWorkspaceState {
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

    groupIdCounter = Math.max(groupIdCounter, getNextGroupCounterFromGroups(groups));
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

export default function App() {
  const initialWorkspace = useMemo(() => loadWorkspaceState(), []);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(initialWorkspace.sidebarVisible);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(initialWorkspace.bottomPanelVisible);
  const [bottomPanelMaximized, setBottomPanelMaximized] = useState(false);
  const [selectedObject, setSelectedObject] = useState<Shipment | Exception | null>(null);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(initialWorkspace.rightSidebarVisible);

  const [groups, setGroups] = useState<EditorGroupData[]>(initialWorkspace.groups);
  const [activeGroupId, setActiveGroupId] = useState(initialWorkspace.activeGroupId);
  const [splitDirection, setSplitDirection] = useState<SplitDirection>(initialWorkspace.splitDirection);
  const [closedTabs, setClosedTabs] = useState<Tab[]>(initialWorkspace.closedTabs);
  const [recentObjects, setRecentObjects] = useState<RecentObject[]>(initialWorkspace.recentObjects);

  const sidebarResize = useResize({
    direction: 'horizontal',
    initialSize: initialWorkspace.sidebarWidth,
    minSize: 170,
    maxSize: 500,
  });

  const bottomPanelResize = useResize({
    direction: 'vertical',
    initialSize: initialWorkspace.bottomPanelHeight,
    minSize: 100,
    maxSize: 500,
    reverse: true,
  });

  const handleMaximizeBottomPanel = useCallback(() => {
    const next = !bottomPanelMaximized;
    setBottomPanelMaximized(next);
    bottomPanelResize.setSize(next ? Math.floor(window.innerHeight * 0.75) : 200);
  }, [bottomPanelMaximized, bottomPanelResize]);

  const rightSidebarResize = useResize({
    direction: 'horizontal',
    initialSize: initialWorkspace.rightSidebarWidth,
    minSize: 170,
    maxSize: 500,
    reverse: true,
  });

  const splitResizeH = useSplitResize('horizontal');
  const splitResizeV = useSplitResize('vertical');
  const activeSplitResize = splitDirection === 'vertical' ? splitResizeV : splitResizeH;

  useEffect(() => {
    splitResizeH.setRatio(initialWorkspace.splitRatioHorizontal);
    splitResizeV.setRatio(initialWorkspace.splitRatioVertical);
  }, [initialWorkspace.splitRatioHorizontal, initialWorkspace.splitRatioVertical, splitResizeH, splitResizeV]);

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setActiveActivity(item);
      setSidebarVisible(true);
    }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const handleFileClick = useCallback((navId: string) => {
    const tabName = tabNameMap[navId] || navId;
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
    // Only track object workspace tabs, not static pages
    const isObjectTab = tabId.startsWith('SHP-') || tabId.startsWith('EXC-') || tabId.startsWith('CASE-') || tabId.startsWith('LEG-') || tabId.startsWith('ORD-') || tabId.startsWith('shipment-detail-');
    if (!isObjectTab) return;
    const type: RecentObject['type'] = (tabId.startsWith('SHP-') || tabId.startsWith('shipment-detail-')) ? 'shipment' : tabId.startsWith('LEG-') ? 'leg' : tabId.startsWith('ORD-') ? 'order' : 'exception';
    setRecentObjects((prev) => {
      const filtered = prev.filter((o) => o.id !== tabId);
      return [{ id: tabId, name: tabName, type }, ...filtered].slice(0, 20);
    });
  }, []);

  const handleOpenTab = useCallback((groupId: string, tabId: string, tabName: string, subtitle?: string) => {
    addRecentObject(tabId, tabName);
    setGroups((prev) => {
      // Section 16.5.3: Check across ALL groups for tab uniqueness
      for (let i = 0; i < prev.length; i++) {
        const existingTab = prev[i].tabs.find((t) => t.id === tabId);
        if (existingTab) {
          // Tab already exists in some group 鈥?just activate it there
          const updated = [...prev];
          updated[i] = { ...prev[i], activeTab: tabId };
          setActiveGroupId(prev[i].id);
          return updated;
        }
      }
      // Not found anywhere 鈥?create in requested group
      const gIdx = prev.findIndex((g) => g.id === groupId);
      if (gIdx === -1) return prev;
      const group = prev[gIdx];
      const updated = [...prev];
      updated[gIdx] = { ...group, tabs: [...group.tabs, { id: tabId, name: tabName, subtitle }], activeTab: tabId };
      return updated;
    });
  }, [addRecentObject]);

  const handleTabClick = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, activeTab: tabId } : g))
    );
    setActiveGroupId(groupId);
  }, []);

  const handleTabPin = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const newTabs = g.tabs.map((t) =>
          t.id === tabId ? { ...t, pinned: !t.pinned } : t
        );
        // Sort: pinned tabs first
        newTabs.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
        return { ...g, tabs: newTabs };
      })
    );
  }, []);

  const handleTabClose = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      const closedTab = group?.tabs.find((t) => t.id === tabId);
      if (closedTab) {
        setClosedTabs((ct) => [...ct.slice(-19), { ...closedTab, pinned: false }]);
      }
      const updated = prev.map((g) => {
        if (g.id !== groupId) return g;
        const newTabs = g.tabs.filter((t) => t.id !== tabId);
        const newActive =
          g.activeTab === tabId && newTabs.length > 0
            ? newTabs[newTabs.length - 1].id
            : g.activeTab;
        return { ...g, tabs: newTabs, activeTab: newActive };
      });
      // If a split group becomes empty, remove it and unsplit
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) {
        // Keep at least one empty group
        return [updated[0]];
      }
      if (nonEmpty.length === 1 && updated.length > 1) {
        setSplitDirection('none');
        return nonEmpty;
      }
      return updated;
    });
  }, []);

  const handleCloseOthers = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      return prev.map((g) => {
        if (g.id !== groupId) return g;
        const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
        const closed = g.tabs.filter((t) => t.id !== tabId && !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        return { ...g, tabs: kept, activeTab: tabId };
      });
    });
  }, []);

  const handleCloseToRight = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => {
      return prev.map((g) => {
        if (g.id !== groupId) return g;
        const idx = g.tabs.findIndex((t) => t.id === tabId);
        if (idx === -1) return g;
        const kept = g.tabs.filter((t, i) => i <= idx || t.pinned);
        const closed = g.tabs.filter((t, i) => i > idx && !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        const newActive = kept.find((t) => t.id === g.activeTab) ? g.activeTab : tabId;
        return { ...g, tabs: kept, activeTab: newActive };
      });
    });
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
          return prev.map((g) => g.id !== groupId ? g : { ...g, tabs: pinned, activeTab: pinned[0].id });
        }
      }
      const updated = prev.map((g) => g.id !== groupId ? g : { ...g, tabs: [], activeTab: '' });
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

  const handleSplit = useCallback((direction: 'horizontal' | 'vertical') => {
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
  }, [activeGroupId]);

  const activeTabData = activeGroup?.tabs.find((t) => t.id === activeGroup.activeTab);
  const activeTabId = activeTabData?.id;

  const handleCloseActiveTab = useCallback(() => {
    if (!activeTabId) return;
    handleTabClose(activeGroupId, activeTabId);
  }, [activeGroupId, activeTabId, handleTabClose]);

  const commandActions = useMemo(
    () =>
      buildDefaultCommandActions({
        recentObjects,
        onOpenPage: (navId) => handleFileClick(navId),
        onOpenObject: (id, name) => handleOpenTab(activeGroupId, id, name),
        onToggleBottomPanel: () => setBottomPanelVisible((v) => !v),
        onToggleRightSidebar: () => setRightSidebarVisible((v) => !v),
        onFeedback: (message) => {
          setCommandFeedback(message);
          window.setTimeout(() => setCommandFeedback(null), 2200);
        },
      }),
    [recentObjects, handleFileClick, handleOpenTab, activeGroupId]
  );

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
      // ignore localStorage write errors
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        if (activeTabId) {
          e.preventDefault();
          handleCloseActiveTab();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleReopenClosed(activeGroupId);
        return;
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    commandPaletteOpen,
    activeTabId,
    activeGroupId,
    handleCloseActiveTab,
    handleReopenClosed,
  ]);

  return (
    <ToastProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-vscode-bg">
      {/* Title Bar */}
      <TitleBar
        rightSidebarVisible={rightSidebarVisible}
        onToggleRightSidebar={() => setRightSidebarVisible(!rightSidebarVisible)}
        bottomPanelVisible={bottomPanelVisible}
        onToggleBottomPanel={() => setBottomPanelVisible(!bottomPanelVisible)}
        recentObjects={recentObjects}
        onOpenRecentObject={(id, name) => handleOpenTab(activeGroupId, id, name)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />

        {/* Sidebar */}
        {sidebarVisible && (
          <>
            <Sidebar
              width={sidebarResize.size}
              onFileClick={handleFileClick}
              activeFile={activeTabData?.id || ''}
            />
            <div
              className="resize-handle-h"
              onMouseDown={sidebarResize.handleMouseDown}
            />
          </>
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Split editor container */}
          <div
            ref={activeSplitResize.containerRef}
            className={`flex-1 flex overflow-hidden ${
              splitDirection === 'vertical' ? 'flex-col' : 'flex-row'
            }`}
          >
            {groups.map((group, idx) => {
              const isSplit = groups.length > 1;
              // First pane: fixed at ratio%, second pane: fill remaining
              const flexStyle = !isSplit
                ? { flex: '1 1 0%' }
                : idx === 0
                  ? { flex: `0 0 ${activeSplitResize.ratio}%` }
                  : { flex: '1 1 0%' };
              return (
                <div key={group.id} className="contents">
                  {idx > 0 && (
                    <div
                      className={splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'}
                      onMouseDown={activeSplitResize.handleMouseDown}
                    />
                  )}
                  <div style={{ ...flexStyle, overflow: 'hidden', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <EditorGroup
                      group={group}
                      isActive={group.id === activeGroupId}
                      showSplitButtons={true}
                      onActivate={() => setActiveGroupId(group.id)}
                      onTabClick={(tabId) => handleTabClick(group.id, tabId)}
                      onTabClose={(tabId) => handleTabClose(group.id, tabId)}
                      onTabPin={(tabId) => handleTabPin(group.id, tabId)}
                      onCloseOthers={(tabId) => handleCloseOthers(group.id, tabId)}
                      onCloseToRight={(tabId) => handleCloseToRight(group.id, tabId)}
                      onCloseAll={() => handleCloseAll(group.id)}
                      onReopenClosed={() => handleReopenClosed(group.id)}
                      onSelectObject={setSelectedObject}
                      onOpenTab={(tabId, tabName, subtitle) => handleOpenTab(group.id, tabId, tabName, subtitle)}
                      onTabReorder={(from, to) => handleTabReorder(group.id, from, to)}
                      onSplitRight={() => handleSplit('horizontal')}
                      onSplitDown={() => handleSplit('vertical')}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Panel */}
          {bottomPanelVisible && (
            <div
              className="resize-handle-v"
              onMouseDown={bottomPanelResize.handleMouseDown}
            />
          )}
          <BottomPanel
            visible={bottomPanelVisible}
            height={bottomPanelResize.size}
            maximized={bottomPanelMaximized}
            onClose={() => { setBottomPanelVisible(false); setBottomPanelMaximized(false); }}
            onMaximize={handleMaximizeBottomPanel}
            selectedObject={selectedObject}
          />
        </div>

        {/* Right Sidebar */}
        {rightSidebarVisible && (
          <>
            <div
              className="resize-handle-h"
              onMouseDown={rightSidebarResize.handleMouseDown}
            />
            <RightSidebar width={rightSidebarResize.size} selectedObject={selectedObject} />
          </>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar commandFeedback={commandFeedback} />
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        actions={commandActions}
      />
    </div>
    </ToastProvider>
  );
}


