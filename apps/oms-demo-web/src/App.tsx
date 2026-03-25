import { useCallback, useEffect, useState } from 'react';
import { Package, AlertTriangle, Truck } from 'lucide-react';
import type { ProductKey } from '@idpxyz/ui-tokens';
import {
  TitleBar,
  ActivityBar,
  Sidebar,
  EditorGroup,
  StatusBar,
  CommandPalette,
  useResize,
  type NavigationSection,
} from '@idpxyz/ui-workspace';
import { ThemeProvider, ToastProvider } from '@idpxyz/ui-theme-runtime';
import { OrdersOverviewPage } from './pages/OrdersOverviewPage';
import { InventoryAlertsPage } from './pages/InventoryAlertsPage';
import { FulfillmentQueuePage } from './pages/FulfillmentQueuePage';
import { tabTitles } from './mock/oms';
import { useOmsWorkbenchState } from './hooks/useOmsWorkbenchState';

const PRODUCT = 'oms' as ProductKey;

const navIconMap = {
  'orders-overview': Package,
  'inventory-alerts': AlertTriangle,
  'fulfillment-queue': Truck,
};

const navigationSections: NavigationSection[] = [
  {
    title: 'OMS',
    items: [
      { id: 'orders-overview', label: '订单概览', icon: 'orders-overview' },
      { id: 'inventory-alerts', label: '库存预警', icon: 'inventory-alerts' },
      { id: 'fulfillment-queue', label: '发货队列', icon: 'fulfillment-queue' },
    ],
  },
];

function renderOmsPage(tabId: string) {
  switch (tabId) {
    case 'orders-overview':
      return <OrdersOverviewPage />;
    case 'inventory-alerts':
      return <InventoryAlertsPage />;
    case 'fulfillment-queue':
      return <FulfillmentQueuePage />;
    default:
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-vscode-editor text-vscode-textMuted gap-2 p-6">
          <p className="text-[15px] text-vscode-textBright font-medium">Oms Demo Web Workbench</p>
          <p className="text-[13px]">
            未知页面 <code className="text-vscode-accent">{tabId}</code>
          </p>
        </div>
      );
  }
}

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(false);

  const {
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
  } = useOmsWorkbenchState();

  const sidebarResize = useResize({
    direction: 'horizontal',
    initialSize: 240,
    minSize: 170,
    maxSize: 500,
  });

  const bottomPanelResize = useResize({
    direction: 'vertical',
    initialSize: 200,
    minSize: 80,
    maxSize: 500,
    reverse: true,
  });

  const rightSidebarResize = useResize({
    direction: 'horizontal',
    initialSize: 280,
    minSize: 170,
    maxSize: 500,
    reverse: true,
  });

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) setSidebarVisible((v) => !v);
    else {
      setActiveActivity(item);
      setSidebarVisible(true);
    }
  };

  const handleFileClick = useCallback(
    (navId: string) => {
      openNavTab(navId);
    },
    [openNavTab]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest?.('input, textarea, [contenteditable="true"]')) return;

      const tab = activeGroup.activeTab;

      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w' && !e.shiftKey) {
        if (tab) {
          e.preventDefault();
          closeTab(activeGroup.id, tab);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        reopenClosed(activeGroupId);
        return;
      }
      if (e.ctrlKey && e.key === 'F4') {
        if (tab) {
          e.preventDefault();
          closeTab(activeGroup.id, tab);
        }
        return;
      }
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'c') {
        if (tab) {
          e.preventDefault();
          void navigator.clipboard?.writeText(tab);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    commandPaletteOpen,
    activeGroup.id,
    activeGroup.activeTab,
    activeGroupId,
    closeTab,
    reopenClosed,
  ]);

  return (
    <ThemeProvider product={PRODUCT}>
      <ToastProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-vscode-bg">
          <TitleBar
            rightSidebarVisible={rightSidebarVisible}
            onToggleRightSidebar={() => setRightSidebarVisible((v) => !v)}
            bottomPanelVisible={bottomPanelVisible}
            onToggleBottomPanel={() => setBottomPanelVisible((v) => !v)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          <div className="flex flex-1 overflow-hidden">
            <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />

            {sidebarVisible && (
              <>
                <Sidebar
                  width={sidebarResize.size}
                  onFileClick={handleFileClick}
                  activeFile={activeTabData?.id ?? ''}
                  navigationSections={navigationSections}
                  iconMap={navIconMap}
                />
                <div className="resize-handle-h" onMouseDown={sidebarResize.handleMouseDown} />
              </>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
              <div
                ref={activeSplitResize.containerRef}
                className={`flex-1 flex overflow-hidden min-h-0 ${
                  splitDirection === 'vertical' ? 'flex-col' : 'flex-row'
                }`}
              >
                {groups.map((group, idx) => {
                  const isSplit = groups.length > 1;
                  const flexStyle = !isSplit
                    ? { flex: '1 1 0%' as const }
                    : idx === 0
                      ? { flex: `0 0 ${activeSplitResize.ratio}%` as const }
                      : { flex: '1 1 0%' as const };
                  return (
                    <div key={group.id} className="contents">
                      {idx > 0 && (
                        <div
                          className={
                            splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'
                          }
                          onMouseDown={activeSplitResize.handleMouseDown}
                        />
                      )}
                      <div
                        style={{
                          ...flexStyle,
                          overflow: 'hidden',
                          minWidth: 0,
                          minHeight: 0,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <EditorGroup
                          group={group}
                          isActive={group.id === activeGroupId}
                          showSplitButtons={groups.length < 2}
                          tabIconMap={navIconMap}
                          onActivate={() => setActiveGroupId(group.id)}
                          onTabClick={(tabId) => clickTab(group.id, tabId)}
                          onTabClose={(tabId) => closeTab(group.id, tabId)}
                          onTabPin={(tabId) => pinTab(group.id, tabId)}
                          onCloseOthers={(tabId) => closeOthers(group.id, tabId)}
                          onCloseToRight={(tabId) => closeToRight(group.id, tabId)}
                          onCloseAll={() => closeAll(group.id)}
                          onReopenClosed={() => reopenClosed(group.id)}
                          onTabReorder={(from, to) => reorderTab(group.id, from, to)}
                          onSplitRight={() => split('horizontal')}
                          onSplitDown={() => split('vertical')}
                          renderContent={(tabId) => renderOmsPage(tabId)}
                          emptyStateContent={
                            <div className="flex-1 flex items-center justify-center bg-vscode-editor text-vscode-textMuted">
                              No tabs
                            </div>
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {bottomPanelVisible && (
                <>
                  <div className="resize-handle-v shrink-0" onMouseDown={bottomPanelResize.handleMouseDown} />
                  <div
                    className="shrink-0 flex flex-col border-t border-vscode-border bg-vscode-editor text-vscode-textMuted overflow-hidden"
                    style={{ height: bottomPanelResize.size }}
                  >
                    <div className="h-9 px-3 flex items-center border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-textMuted shrink-0">
                      Bottom panel
                    </div>
                    <div className="flex-1 min-h-0 px-3 py-2 text-[13px]">
                      Placeholder — swap for terminal, logs, or a custom panel component.
                    </div>
                  </div>
                </>
              )}
            </div>

            {rightSidebarVisible && (
              <>
                <div className="resize-handle-h shrink-0" onMouseDown={rightSidebarResize.handleMouseDown} />
                <aside
                  className="shrink-0 flex flex-col border-l border-vscode-border bg-vscode-sidebar text-vscode-text overflow-hidden"
                  style={{ width: rightSidebarResize.size }}
                >
                  <div className="h-9 px-3 flex items-center border-b border-vscode-border text-[11px] uppercase tracking-wide text-vscode-textMuted shrink-0">
                    Secondary sidebar
                  </div>
                  <div className="flex-1 min-h-0 px-3 py-2 text-[13px] text-vscode-textMuted space-y-2">
                    <p>
                      当前页：
                      <span className="text-vscode-text">
                        {tabTitles[activeGroup.activeTab] ?? activeGroup.activeTab}
                      </span>
                    </p>
                    <p className="text-[12px] leading-relaxed">
                      分屏后点击某一 pane 可切换激活组；侧栏打开新页签会加在当前激活组。
                    </p>
                  </div>
                </aside>
              </>
            )}
          </div>

          <StatusBar />
          <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} actions={[]} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
