import { useCallback, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import type { ProductKey } from '@idpxyz/ui-tokens';
import {
  TitleBar,
  ActivityBar,
  Sidebar,
  EditorGroup,
  StatusBar,
  CommandPalette,
  useResize,
  useEditorGroupTabState,
  type EditorGroupData,
  type NavigationSection,
} from '@idpxyz/ui-workspace';
import { ThemeProvider, ToastProvider } from '@idpxyz/ui-theme-runtime';

const PRODUCT = 'prism' as ProductKey;

const navigationSections: NavigationSection[] = [
  { title: 'Start', items: [{ id: 'welcome', label: 'Welcome', icon: 'home' }] },
];

const sidebarIconMap = {
  home: LayoutDashboard,
};

/**
 * Generated scaffold — see `idp-ui/docs/workbench-shell.md`.
 * Add `useWorkspaceState`, routing, and replace panel placeholders with real UI (see loms-web / myshop-web).
 */
export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(false);

  const {
    group,
    setGroup,
    onTabClose,
    onTabPin,
    onCloseOthers,
    onCloseToRight,
    onCloseAll,
    onTabReorder,
    onReopenClosed,
  } = useEditorGroupTabState({
    id: 'main',
    tabs: [{ id: 'welcome', name: 'Welcome' }],
    activeTab: 'welcome',
  });

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

  const handleFileClick = useCallback((navId: string) => {
    setGroup((g: EditorGroupData) => {
      if (g.tabs.some((t) => t.id === navId)) {
        return { ...g, activeTab: navId };
      }
      return {
        ...g,
        tabs: [...g.tabs, { id: navId, name: navId }],
        activeTab: navId,
      };
    });
  }, []);

  return (
    <ThemeProvider product={PRODUCT}>
      <ToastProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-idpxyz-bg">
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
                  activeFile={group.activeTab}
                  navigationSections={navigationSections}
                  iconMap={sidebarIconMap}
                />
                <div className="resize-handle-h" onMouseDown={sidebarResize.handleMouseDown} />
              </>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                <EditorGroup
                  group={group}
                  isActive={true}
                  showSplitButtons={false}
                  onActivate={() => {}}
                  onTabClick={(tabId: string) => setGroup((g: EditorGroupData) => ({ ...g, activeTab: tabId }))}
                  onTabClose={onTabClose}
                  onTabPin={onTabPin}
                  onCloseOthers={onCloseOthers}
                  onCloseToRight={onCloseToRight}
                  onCloseAll={onCloseAll}
                  onReopenClosed={onReopenClosed}
                  onTabReorder={onTabReorder}
                  onSplitRight={() => {}}
                  onSplitDown={() => {}}
                  renderContent={(tabId: string) => (
                    <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-2 p-6">
                      <p className="text-[15px] text-idpxyz-textBright font-medium">Demo Web Workbench</p>
                      <p className="text-[13px] text-center max-w-md">
                        Tab: <code className="text-idpxyz-accent">{tabId}</code> — replace this area with your{' '}
                        <code className="text-idpxyz-accent">PageRouter</code> and data.
                      </p>
                    </div>
                  )}
                  emptyStateContent={
                    <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
                      No tabs
                    </div>
                  }
                />
              </div>

              {bottomPanelVisible && (
                <>
                  <div className="resize-handle-v shrink-0" onMouseDown={bottomPanelResize.handleMouseDown} />
                  <div
                    className="shrink-0 flex flex-col border-t border-idpxyz-border bg-idpxyz-editor text-idpxyz-textMuted overflow-hidden"
                    style={{ height: bottomPanelResize.size }}
                  >
                    <div className="h-9 px-3 flex items-center border-b border-idpxyz-border text-[11px] uppercase tracking-wide text-idpxyz-textMuted shrink-0">
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
                  className="shrink-0 flex flex-col border-l border-idpxyz-border bg-idpxyz-sidebar text-idpxyz-text overflow-hidden"
                  style={{ width: rightSidebarResize.size }}
                >
                  <div className="h-9 px-3 flex items-center border-b border-idpxyz-border text-[11px] uppercase tracking-wide text-idpxyz-textMuted shrink-0">
                    Secondary sidebar
                  </div>
                  <div className="flex-1 min-h-0 px-3 py-2 text-[13px] text-idpxyz-textMuted">
                    Placeholder — swap for inspector, outline, or context details.
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
