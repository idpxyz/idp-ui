import { Fragment, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import {
  TitleBar,
  ActivityBar,
  Sidebar,
  EditorGroup,
  StatusBar,
  CommandPalette,
  useResize,
  type EditorGroupData,
  type Tab,
  type RecentObject,
} from '@idpxyz/ui-workspace';
import { ThemeProvider, ToastProvider } from '@idpxyz/ui-theme-runtime';
import {
  type Order,
  type OMSException,
  type SidebarSelection,
  orders,
  exceptions,
  orderStatusConfig,
  navigationSections,
} from './data/oms';
import {
  omsTabIconMap,
  omsTabNameMap,
  omsSidebarIconMap,
} from './navigation';
import PageRouter from './PageRouter';
import BottomPanel from './shell/BottomPanel';
import RightSidebar from './shell/RightSidebar';
import { buildDefaultCommandActions } from './commandActions';

let groupIdCounter = 1;
function nextGroupId() {
  return `group-${groupIdCounter++}`;
}

const initialGroup: EditorGroupData = {
  id: 'group-0',
  tabs: [{ id: 'dashboard', name: 'OMS 控制台' }],
  activeTab: 'dashboard',
};

type SplitDirection = 'none' | 'horizontal' | 'vertical';

const WORKSPACE_STATE_STORAGE_KEY = 'myshop-oms.workspace-state.v1';

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
      groups, activeGroupId, splitDirection, closedTabs, recentObjects,
      sidebarVisible, rightSidebarVisible, bottomPanelVisible,
      sidebarWidth, rightSidebarWidth, bottomPanelHeight,
      splitRatioHorizontal, splitRatioVertical,
    };
  } catch {
    return fallback;
  }
}

function getOmsTabRiskDot(tab: Tab): string | null {
  if (tab.riskLevel === 'critical') return 'bg-red-500';
  if (tab.riskLevel === 'warning') return 'bg-yellow-500';
  if (tab.riskLevel === 'info') return 'bg-blue-500';
  if (tab.id === 'exceptions') {
    const critical = exceptions.filter((e) => e.severity === 'blocked' || e.severity === 'escalated').length;
    return critical > 0 ? 'bg-red-500' : 'bg-yellow-500';
  }
  if (tab.id.startsWith('order-detail-')) {
    const oid = tab.id.replace('order-detail-', '');
    const o = orders.find((od) => od.id === oid);
    if (o?.slaHoursRemaining !== undefined && o.slaHoursRemaining < 0) return 'bg-red-500';
    if (o?.riskLevel === 'high') return 'bg-red-500';
    if (o?.slaHoursRemaining !== undefined && o.slaHoursRemaining <= 6) return 'bg-yellow-500';
  }
  return null;
}

export default function App() {
  const initialWorkspace = useMemo(() => loadWorkspaceState(), []);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(initialWorkspace.sidebarVisible);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(initialWorkspace.bottomPanelVisible);
  const [bottomPanelMaximized, setBottomPanelMaximized] = useState(false);
  const [selectedObject, setSelectedObject] = useState<SidebarSelection | null>(null);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(initialWorkspace.rightSidebarVisible);
  const [isPOSFocusMode, setIsPOSFocusMode] = useState(false);

  const [groups, setGroups] = useState<EditorGroupData[]>(initialWorkspace.groups);
  const [activeGroupId, setActiveGroupId] = useState(initialWorkspace.activeGroupId);
  const [splitDirection, setSplitDirection] = useState<SplitDirection>(initialWorkspace.splitDirection);
  const [closedTabs, setClosedTabs] = useState<Tab[]>(initialWorkspace.closedTabs);
  const [recentObjects, setRecentObjects] = useState<RecentObject[]>(initialWorkspace.recentObjects);

  const sidebarResize = useResize({ direction: 'horizontal', initialSize: initialWorkspace.sidebarWidth, minSize: 170, maxSize: 500 });
  const bottomPanelResize = useResize({ direction: 'vertical', initialSize: initialWorkspace.bottomPanelHeight, minSize: 100, maxSize: 500, reverse: true });
  const handleMaximizeBottomPanel = useCallback(() => {
    const next = !bottomPanelMaximized;
    setBottomPanelMaximized(next);
    bottomPanelResize.setSize(next ? Math.floor(window.innerHeight * 0.75) : 200);
  }, [bottomPanelMaximized, bottomPanelResize]);
  const rightSidebarResize = useResize({ direction: 'horizontal', initialSize: initialWorkspace.rightSidebarWidth, minSize: 170, maxSize: 500, reverse: true });

  const splitContainerRef = useRef<HTMLDivElement>(null);
  const splitDragDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);
  const [splitRatioH, setSplitRatioH] = useState(initialWorkspace.splitRatioHorizontal);
  const [splitRatioV, setSplitRatioV] = useState(initialWorkspace.splitRatioVertical);
  const activeSplitRatio = splitDirection === 'vertical' ? splitRatioV : splitRatioH;

  const handleSplitMouseDown = useCallback((direction: 'horizontal' | 'vertical', e: React.MouseEvent) => {
    e.preventDefault();
    splitDragDirectionRef.current = direction;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!splitDragDirectionRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const direction = splitDragDirectionRef.current;
      const pos = direction === 'horizontal' ? e.clientX - rect.left : e.clientY - rect.top;
      const total = direction === 'horizontal' ? rect.width : rect.height;
      if (total <= 0) return;
      const ratio = Math.min(80, Math.max(20, (pos / total) * 100));
      if (direction === 'horizontal') setSplitRatioH(ratio);
      else setSplitRatioV(ratio);
    };

    const handleMouseUp = () => {
      if (!splitDragDirectionRef.current) return;
      splitDragDirectionRef.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) setSidebarVisible(!sidebarVisible);
    else { setActiveActivity(item); setSidebarVisible(true); }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

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
    const type: RecentObject['type'] = tabId.startsWith('order-detail-') || tabId.startsWith('ORD-') ? 'order' : 'exception';
    setRecentObjects((prev) => {
      const filtered = prev.filter((o) => o.id !== tabId);
      return [{ id: tabId, name: tabName, type }, ...filtered].slice(0, 20);
    });
  }, []);

  const handleOpenTab = useCallback((groupId: string, tabId: string, tabName: string, subtitle?: string) => {
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
  }, [addRecentObject]);

  const handleTabClick = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, activeTab: tabId } : g)));
    setActiveGroupId(groupId);
  }, []);

  const handleTabPin = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      const newTabs = g.tabs.map((t) => t.id === tabId ? { ...t, pinned: !t.pinned } : t);
      newTabs.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
      return { ...g, tabs: newTabs };
    }));
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
      if (nonEmpty.length === 1 && updated.length > 1) { setSplitDirection('none'); return nonEmpty; }
      return updated;
    });
  }, []);

  const handleCloseOthers = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      const kept = g.tabs.filter((t) => t.id === tabId || t.pinned);
      const closed = g.tabs.filter((t) => t.id !== tabId && !t.pinned);
      setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
      return { ...g, tabs: kept, activeTab: tabId };
    }));
  }, []);

  const handleCloseToRight = useCallback((groupId: string, tabId: string) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      const idx = g.tabs.findIndex((t) => t.id === tabId);
      if (idx === -1) return g;
      const kept = g.tabs.filter((t, i) => i <= idx || t.pinned);
      const closed = g.tabs.filter((t, i) => i > idx && !t.pinned);
      setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
      const newActive = kept.find((t) => t.id === g.activeTab) ? g.activeTab : tabId;
      return { ...g, tabs: kept, activeTab: newActive };
    }));
  }, []);

  const handleTabReorder = useCallback((groupId: string, fromIndex: number, toIndex: number) => {
    setGroups((prev) => prev.map((g) => {
      if (g.id !== groupId) return g;
      const newTabs = [...g.tabs];
      const [moved] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, moved);
      return { ...g, tabs: newTabs };
    }));
  }, []);

  const handleCloseAll = useCallback((groupId: string) => {
    setGroups((prev) => {
      const group = prev.find((g) => g.id === groupId);
      if (group) {
        const pinned = group.tabs.filter((t) => t.pinned);
        const closed = group.tabs.filter((t) => !t.pinned);
        setClosedTabs((ct) => [...ct.slice(-(20 - closed.length)), ...closed.map((t) => ({ ...t, pinned: false }))]);
        if (pinned.length > 0) return prev.map((g) => g.id !== groupId ? g : { ...g, tabs: pinned, activeTab: pinned[0].id });
      }
      const updated = prev.map((g) => g.id !== groupId ? g : { ...g, tabs: [], activeTab: '' });
      const nonEmpty = updated.filter((g) => g.tabs.length > 0);
      if (nonEmpty.length === 0) return [updated[0]];
      if (nonEmpty.length === 1 && updated.length > 1) { setSplitDirection('none'); return nonEmpty; }
      return updated;
    });
  }, []);

  const handleReopenClosed = useCallback((groupId: string) => {
    setClosedTabs((prev) => {
      if (prev.length === 0) return prev;
      const tab = prev[prev.length - 1];
      setGroups((gs) => gs.map((g) => {
        if (g.id !== groupId) return g;
        if (g.tabs.find((t) => t.id === tab.id)) return { ...g, activeTab: tab.id };
        return { ...g, tabs: [...g.tabs, tab], activeTab: tab.id };
      }));
      return prev.slice(0, -1);
    });
  }, []);

  const handleSplit = useCallback((direction: 'horizontal' | 'vertical') => {
    setGroups((prev) => {
      if (prev.length >= 2) return prev;
      const current = prev.find((g) => g.id === activeGroupId) || prev[0];
      const activeTab = current.tabs.find((t) => t.id === current.activeTab);
      const newGroup: EditorGroupData = { id: nextGroupId(), tabs: activeTab ? [{ ...activeTab }] : [], activeTab: activeTab?.id || '' };
      return [...prev, newGroup];
    });
    setSplitDirection(direction);
  }, [activeGroupId]);

  const activeTabData = activeGroup?.tabs.find((t) => t.id === activeGroup.activeTab);
  const activeTabId = activeTabData?.id;
  const isActivePOSTab = activeTabId === 'pos-terminal' || activeTabId === 'pos-pickup' || activeTabId === 'pos-history';

  useEffect(() => {
    if (!isActivePOSTab && isPOSFocusMode) {
      setIsPOSFocusMode(false);
    }
  }, [isActivePOSTab, isPOSFocusMode]);

  const handleCloseActiveTab = useCallback(() => {
    if (!activeTabId) return;
    handleTabClose(activeGroupId, activeTabId);
  }, [activeGroupId, activeTabId, handleTabClose]);

  const commandActions = useMemo(
    () => buildDefaultCommandActions({
      recentObjects,
      onOpenPage: (navId) => handleFileClick(navId),
      onOpenObject: (id, name) => handleOpenTab(activeGroupId, id, name),
      onToggleBottomPanel: () => setBottomPanelVisible((v) => !v),
      onToggleRightSidebar: () => setRightSidebarVisible((v) => !v),
      onFeedback: (message) => { setCommandFeedback(message); window.setTimeout(() => setCommandFeedback(null), 2200); },
    }),
    [recentObjects, handleFileClick, handleOpenTab, activeGroupId]
  );

  useEffect(() => {
    if (selectedObject) {
      setRightSidebarVisible(true);
    }
  }, [selectedObject]);

  // Persist workspace state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stateToPersist: PersistedWorkspaceState = {
      groups, activeGroupId, splitDirection, closedTabs, recentObjects,
      sidebarVisible, rightSidebarVisible, bottomPanelVisible,
      sidebarWidth: sidebarResize.size, rightSidebarWidth: rightSidebarResize.size,
      bottomPanelHeight: bottomPanelResize.size,
      splitRatioHorizontal: splitRatioH, splitRatioVertical: splitRatioV,
    };
    try { window.localStorage.setItem(WORKSPACE_STATE_STORAGE_KEY, JSON.stringify(stateToPersist)); } catch { /* ignore */ }
  }, [groups, activeGroupId, splitDirection, closedTabs, recentObjects, sidebarVisible, rightSidebarVisible, bottomPanelVisible, sidebarResize.size, rightSidebarResize.size, bottomPanelResize.size, splitRatioH, splitRatioV]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandPaletteOpen(true); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { if (activeTabId) { e.preventDefault(); handleCloseActiveTab(); } return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') { e.preventDefault(); handleReopenClosed(activeGroupId); return; }
      if (e.key === 'Escape' && commandPaletteOpen) { e.preventDefault(); setCommandPaletteOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, activeTabId, activeGroupId, handleCloseActiveTab, handleReopenClosed]);

  return (
    <ThemeProvider product="oms">
    <ToastProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-vscode-bg">
      {!isPOSFocusMode && (
        <TitleBar
          rightSidebarVisible={rightSidebarVisible}
          onToggleRightSidebar={() => setRightSidebarVisible(!rightSidebarVisible)}
          bottomPanelVisible={bottomPanelVisible}
          onToggleBottomPanel={() => setBottomPanelVisible(!bottomPanelVisible)}
          recentObjects={recentObjects}
          onOpenRecentObject={(id, name) => handleOpenTab(activeGroupId, id, name)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isPOSFocusMode && <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />}

        {!isPOSFocusMode && sidebarVisible && (
          <>
            <Sidebar
              width={sidebarResize.size}
              onFileClick={handleFileClick}
              activeFile={activeTabData?.id || ''}
              navigationSections={navigationSections}
              iconMap={omsSidebarIconMap}
            />
            <div className="resize-handle-h" onMouseDown={sidebarResize.handleMouseDown} />
          </>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            ref={splitContainerRef}
            className={`flex-1 flex overflow-hidden ${splitDirection === 'vertical' ? 'flex-col' : 'flex-row'}`}
          >
            {groups.map((group, idx) => {
              const isSplit = groups.length > 1;
              const flexStyle = !isSplit
                ? { flex: '1 1 0%' }
                : idx === 0 ? { flex: `0 0 ${activeSplitRatio}%` } : { flex: '1 1 0%' };
              return (
                <Fragment key={group.id}>
                  {idx > 0 && (
                    <div
                      className={splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'}
                      onMouseDown={(e) => handleSplitMouseDown(splitDirection === 'vertical' ? 'vertical' : 'horizontal', e)}
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
                      onTabReorder={(from, to) => handleTabReorder(group.id, from, to)}
                      onSplitRight={() => handleSplit('horizontal')}
                      onSplitDown={() => handleSplit('vertical')}
                      tabIconMap={omsTabIconMap}
                      getTabRiskDot={getOmsTabRiskDot}
                      renderContent={(tabId) => (
                        <PageRouter
                          tabId={tabId}
                          onSelectObject={setSelectedObject}
                          onOpenTab={(tid, tname, sub) => handleOpenTab(group.id, tid, tname, sub)}
                          isPOSFocusMode={isPOSFocusMode}
                          onTogglePOSFocusMode={setIsPOSFocusMode}
                        />
                      )}
                      emptyStateContent={
                        <div className="flex-1 flex items-center justify-center bg-vscode-editor text-vscode-textMuted">
                          <div className="text-center">
                            <p className="text-[20px] mb-2">MyShop 订单管理工作台</p>
                            <p className="text-[13px]">从左侧导航选择模块开始工作</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </Fragment>
              );
            })}
          </div>

          {!isPOSFocusMode && bottomPanelVisible && (
            <div className="resize-handle-v" onMouseDown={bottomPanelResize.handleMouseDown} />
          )}
          <BottomPanel
            visible={!isPOSFocusMode && bottomPanelVisible}
            height={bottomPanelResize.size}
            maximized={bottomPanelMaximized}
            onClose={() => { setBottomPanelVisible(false); setBottomPanelMaximized(false); }}
            onMaximize={handleMaximizeBottomPanel}
            selectedObject={selectedObject}
          />
        </div>

        {!isPOSFocusMode && rightSidebarVisible && (
          <>
            <div className="resize-handle-h" onMouseDown={rightSidebarResize.handleMouseDown} />
            <RightSidebar width={rightSidebarResize.size} selectedObject={selectedObject} />
          </>
        )}
      </div>

      {!isPOSFocusMode && <StatusBar commandFeedback={commandFeedback} />}
      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        actions={commandActions}
      />
    </div>
    </ToastProvider>
    </ThemeProvider>
  );
}
