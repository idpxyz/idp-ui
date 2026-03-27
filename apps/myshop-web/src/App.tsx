import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  TitleBar,
  ActivityBar,
  Sidebar,
  EditorGroup,
  StatusBar,
  CommandPalette,
  type Tab,
} from '@idpxyz/ui-workspace';
import { ThemeProvider, ToastProvider } from '@idpxyz/ui-theme-runtime';
import { orders, exceptions, navigationSections } from './data/oms';
import { omsTabIconMap, omsSidebarIconMap } from './navigation';
import PageRouter from './PageRouter';
import BottomPanel from './shell/BottomPanel';
import RightSidebar from './shell/RightSidebar';
import { buildDefaultCommandActions } from './commandActions';
import { useWorkspaceState } from './hooks/useWorkspaceState';

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
  const ws = useWorkspaceState();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [isPOSFocusMode, setIsPOSFocusMode] = useState(false);

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) ws.setSidebarVisible(!ws.sidebarVisible);
    else {
      setActiveActivity(item);
      ws.setSidebarVisible(true);
    }
  };

  const activeTabId = ws.activeTabId;
  const isActivePOSTab =
    activeTabId === 'pos-terminal' || activeTabId === 'pos-pickup' || activeTabId === 'pos-history';

  useEffect(() => {
    if (!isActivePOSTab && isPOSFocusMode) {
      setIsPOSFocusMode(false);
    }
  }, [isActivePOSTab, isPOSFocusMode]);

  const handleCloseActiveTab = useCallback(() => {
    if (!activeTabId) return;
    ws.handleTabClose(ws.activeGroupId, activeTabId);
  }, [activeTabId, ws]);

  const commandActions = useMemo(
    () =>
      buildDefaultCommandActions({
        recentObjects: ws.recentObjects,
        onOpenPage: (navId) => ws.handleFileClick(navId),
        onOpenObject: (id, name) => ws.handleOpenTab(ws.activeGroupId, id, name),
        onToggleBottomPanel: () => ws.setBottomPanelVisible((v) => !v),
        onToggleRightSidebar: () => ws.setRightSidebarVisible((v) => !v),
        onFeedback: (message) => {
          setCommandFeedback(message);
          window.setTimeout(() => setCommandFeedback(null), 2200);
        },
      }),
    [
      ws.recentObjects,
      ws.activeGroupId,
      ws.handleFileClick,
      ws.handleOpenTab,
      ws.setBottomPanelVisible,
      ws.setRightSidebarVisible,
    ]
  );

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
        ws.handleReopenClosed(ws.activeGroupId);
        return;
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, activeTabId, ws, handleCloseActiveTab]);

  return (
    <ThemeProvider product="oms">
      <ToastProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-idpxyz-bg">
          {!isPOSFocusMode && (
            <TitleBar
              rightSidebarVisible={ws.rightSidebarVisible}
              onToggleRightSidebar={() => ws.setRightSidebarVisible(!ws.rightSidebarVisible)}
              bottomPanelVisible={ws.bottomPanelVisible}
              onToggleBottomPanel={() => ws.setBottomPanelVisible(!ws.bottomPanelVisible)}
              recentObjects={ws.recentObjects}
              onOpenRecentObject={(id, name) => ws.handleOpenTab(ws.activeGroupId, id, name)}
              onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            />
          )}

          <div className="flex flex-1 overflow-hidden">
            {!isPOSFocusMode && <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />}

            {!isPOSFocusMode && ws.sidebarVisible && (
              <>
                <Sidebar
                  width={ws.sidebarResize.size}
                  onFileClick={ws.handleFileClick}
                  activeFile={ws.activeTabData?.id || ''}
                  navigationSections={navigationSections}
                  iconMap={omsSidebarIconMap}
                />
                <div className="resize-handle-h" onMouseDown={ws.sidebarResize.handleMouseDown} />
              </>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                ref={ws.activeSplitResize.containerRef}
                className={`flex-1 flex overflow-hidden ${ws.splitDirection === 'vertical' ? 'flex-col' : 'flex-row'}`}
              >
                {ws.groups.map((group, idx) => {
                  const isSplit = ws.groups.length > 1;
                  const flexStyle = !isSplit
                    ? { flex: '1 1 0%' }
                    : idx === 0
                      ? { flex: `0 0 ${ws.activeSplitResize.ratio}%` }
                      : { flex: '1 1 0%' };
                  return (
                    <Fragment key={group.id}>
                      {idx > 0 && (
                        <div
                          className={ws.splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'}
                          onMouseDown={ws.activeSplitResize.handleMouseDown}
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
                          isActive={group.id === ws.activeGroupId}
                          showSplitButtons={ws.groups.length < 2}
                          onActivate={() => ws.setActiveGroupId(group.id)}
                          onTabClick={(tabId) => ws.handleTabClick(group.id, tabId)}
                          onTabClose={(tabId) => ws.handleTabClose(group.id, tabId)}
                          onTabPin={(tabId) => ws.handleTabPin(group.id, tabId)}
                          onCloseOthers={(tabId) => ws.handleCloseOthers(group.id, tabId)}
                          onCloseToRight={(tabId) => ws.handleCloseToRight(group.id, tabId)}
                          onCloseAll={() => ws.handleCloseAll(group.id)}
                          onReopenClosed={() => ws.handleReopenClosed(group.id)}
                          onTabReorder={(from, to) => ws.handleTabReorder(group.id, from, to)}
                          onSplitRight={() => ws.handleSplit('horizontal')}
                          onSplitDown={() => ws.handleSplit('vertical')}
                          tabIconMap={omsTabIconMap}
                          getTabRiskDot={getOmsTabRiskDot}
                          renderContent={(tabId) => (
                            <PageRouter
                              tabId={tabId}
                              onSelectObject={ws.setSelectedObject}
                              onOpenTab={(tid, tname, sub) => ws.handleOpenTab(group.id, tid, tname, sub)}
                              isPOSFocusMode={isPOSFocusMode}
                              onTogglePOSFocusMode={setIsPOSFocusMode}
                            />
                          )}
                          emptyStateContent={
                            <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
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

              {!isPOSFocusMode && ws.bottomPanelVisible && (
                <div className="resize-handle-v" onMouseDown={ws.bottomPanelResize.handleMouseDown} />
              )}
              <BottomPanel
                visible={!isPOSFocusMode && ws.bottomPanelVisible}
                height={ws.bottomPanelResize.size}
                maximized={ws.bottomPanelMaximized}
                onClose={ws.collapseBottomPanel}
                onMaximize={ws.handleMaximizeBottomPanel}
                selectedObject={ws.selectedObject}
              />
            </div>

            {!isPOSFocusMode && ws.rightSidebarVisible && (
              <>
                <div className="resize-handle-h" onMouseDown={ws.rightSidebarResize.handleMouseDown} />
                <RightSidebar width={ws.rightSidebarResize.size} selectedObject={ws.selectedObject} />
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
