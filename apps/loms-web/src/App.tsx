import { useState, useCallback, useEffect, useMemo } from 'react';
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
import {
  type Shipment,
  type Exception,
  navigationSections,
  lomsTabIconMap,
  lomsTabNameMap,
  lomsSidebarIconMap,
  shipments,
  exceptions,
  PageRouter,
  BottomPanel,
  RightSidebar,
  buildDefaultCommandActions,
} from './loms';
import { useWorkspaceState } from './hooks/useWorkspaceState';

function getLomsTabRiskDot(tab: Tab): string | null {
  if (tab.riskLevel === 'critical') return 'bg-red-500';
  if (tab.riskLevel === 'warning') return 'bg-yellow-500';
  if (tab.riskLevel === 'info') return 'bg-blue-500';
  if (tab.id === 'exception-queue') {
    const critical = exceptions.filter((e) => e.severity === 'critical' && e.status !== 'resolved').length;
    return critical > 0 ? 'bg-red-500' : 'bg-yellow-500';
  }
  if (tab.id.startsWith('shipment-detail-')) {
    const sid = tab.id.replace('shipment-detail-', '');
    const s = shipments.find((sh) => sh.id === sid);
    if (s?.slaStatus === 'breached') return 'bg-red-500';
    if (s?.slaStatus === 'at_risk') return 'bg-yellow-500';
    if (s?.status === 'exception') return 'bg-red-500';
  }
  return null;
}

export default function App() {
  const ws = useWorkspaceState();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [selectedObject, setSelectedObject] = useState<Shipment | Exception | null>(null);

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) ws.setSidebarVisible(!ws.sidebarVisible);
    else { setActiveActivity(item); ws.setSidebarVisible(true); }
  };

  const handleFileClick = useCallback((navId: string) => {
    ws.openNavTab(navId, lomsTabNameMap[navId] || navId);
  }, [ws]);

  const handleCloseActiveTab = useCallback(() => {
    if (!ws.activeTabData?.id) return;
    ws.closeTab(ws.activeGroupId, ws.activeTabData.id);
  }, [ws]);

  const commandActions = useMemo(
    () => buildDefaultCommandActions({
      recentObjects: ws.recentObjects,
      onOpenPage: handleFileClick,
      onOpenObject: (id, name) => ws.openTab(ws.activeGroupId, id, name),
      onToggleBottomPanel: () => ws.setBottomPanelVisible(v => !v),
      onToggleRightSidebar: () => ws.setRightSidebarVisible(v => !v),
      onFeedback: (msg) => { setCommandFeedback(msg); setTimeout(() => setCommandFeedback(null), 2200); },
    }),
    [ws.recentObjects, handleFileClick, ws]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCommandPaletteOpen(true); return; }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { if (ws.activeTabData?.id) { e.preventDefault(); handleCloseActiveTab(); } return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') { e.preventDefault(); ws.reopenClosed(ws.activeGroupId); return; }
      if (e.key === 'Escape' && commandPaletteOpen) { e.preventDefault(); setCommandPaletteOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, ws, handleCloseActiveTab]);

  return (
    <ThemeProvider product="loms">
    <ToastProvider>
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-vscode-bg">
      <TitleBar
        rightSidebarVisible={ws.rightSidebarVisible}
        onToggleRightSidebar={() => ws.setRightSidebarVisible(!ws.rightSidebarVisible)}
        bottomPanelVisible={ws.bottomPanelVisible}
        onToggleBottomPanel={() => ws.setBottomPanelVisible(!ws.bottomPanelVisible)}
        recentObjects={ws.recentObjects}
        onOpenRecentObject={(id, name) => ws.openTab(ws.activeGroupId, id, name)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />

        {ws.sidebarVisible && (
          <>
            <Sidebar
              width={ws.sidebarResize.size}
              onFileClick={handleFileClick}
              activeFile={ws.activeTabData?.id || ''}
              navigationSections={navigationSections}
              iconMap={lomsSidebarIconMap}
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
                : idx === 0 ? { flex: `0 0 ${ws.activeSplitResize.ratio}%` } : { flex: '1 1 0%' };
              return (
                <div key={group.id} className="contents">
                  {idx > 0 && (
                    <div
                      className={ws.splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'}
                      onMouseDown={ws.activeSplitResize.handleMouseDown}
                    />
                  )}
                  <div style={{ ...flexStyle, overflow: 'hidden', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <EditorGroup
                      group={group}
                      isActive={group.id === ws.activeGroupId}
                      showSplitButtons={ws.groups.length < 2}
                      onActivate={() => ws.setActiveGroupId(group.id)}
                      onTabClick={(tabId) => ws.clickTab(group.id, tabId)}
                      onTabClose={(tabId) => ws.closeTab(group.id, tabId)}
                      onTabPin={(tabId) => ws.pinTab(group.id, tabId)}
                      onCloseOthers={(tabId) => ws.closeOthers(group.id, tabId)}
                      onCloseToRight={(tabId) => ws.closeToRight(group.id, tabId)}
                      onCloseAll={() => ws.closeAll(group.id)}
                      onReopenClosed={() => ws.reopenClosed(group.id)}
                      onTabReorder={(from, to) => ws.reorderTab(group.id, from, to)}
                      onSplitRight={() => ws.split('horizontal')}
                      onSplitDown={() => ws.split('vertical')}
                      tabIconMap={lomsTabIconMap}
                      getTabRiskDot={getLomsTabRiskDot}
                      renderContent={(tabId) => (
                        <PageRouter
                          tabId={tabId}
                          onSelectObject={setSelectedObject}
                          onOpenTab={(tid, tname, sub) => ws.openTab(group.id, tid, tname, sub)}
                        />
                      )}
                      emptyStateContent={
                        <div className="flex-1 flex items-center justify-center bg-vscode-editor text-vscode-textMuted">
                          <div className="text-center">
                            <p className="text-[20px] mb-2">LOMS Operations Workbench</p>
                            <p className="text-[13px]">Select a module from the navigation panel</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {ws.bottomPanelVisible && (
            <div className="resize-handle-v" onMouseDown={ws.bottomPanelResize.handleMouseDown} />
          )}
          <BottomPanel
            visible={ws.bottomPanelVisible}
            height={ws.bottomPanelResize.size}
            maximized={ws.bottomPanelMaximized}
            onClose={() => { ws.setBottomPanelVisible(false); }}
            onMaximize={ws.toggleMaximizeBottomPanel}
            selectedObject={selectedObject}
          />
        </div>

        {ws.rightSidebarVisible && (
          <>
            <div className="resize-handle-h" onMouseDown={ws.rightSidebarResize.handleMouseDown} />
            <RightSidebar width={ws.rightSidebarResize.size} selectedObject={selectedObject} />
          </>
        )}
      </div>

      <StatusBar commandFeedback={commandFeedback} />
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
