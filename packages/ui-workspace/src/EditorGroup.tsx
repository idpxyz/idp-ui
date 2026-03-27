import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Layers,
  SplitSquareHorizontal,
  FlipVertical2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';
import {
  runWorkspaceNavigationGuard,
  type WorkspaceNavigationGuard,
  type WorkspaceNavigationIntent,
} from './navigationGuard';

export interface Tab {
  id: string;
  name: string;
  subtitle?: string;
  modified?: boolean;
  riskLevel?: 'critical' | 'warning' | 'info';
  pinned?: boolean;
}

export interface EditorGroupData {
  id: string;
  tabs: Tab[];
  activeTab: string;
}

export interface EditorGroupProps {
  group: EditorGroupData;
  isActive: boolean;
  /** Show split-editor toolbar (↔ / ⋯). Hide when already split, e.g. `groups.length < 2`. */
  showSplitButtons: boolean;
  onActivate: () => void;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabPin: (tabId: string) => void;
  onCloseOthers: (tabId: string) => void;
  onCloseToRight: (tabId: string) => void;
  onCloseAll: () => void;
  onReopenClosed: () => void;
  onTabReorder: (fromIndex: number, toIndex: number) => void;
  onSplitRight: () => void;
  onSplitDown: () => void;
  /** Icon map: tab id -> React icon component */
  tabIconMap?: Record<string, React.ElementType>;
  /** Compute risk dot class for a tab */
  getTabRiskDot?: (tab: Tab) => string | null;
  /** Render tab content area */
  renderContent: (tabId: string) => React.ReactNode;
  /** Fallback when no tab is active */
  emptyStateContent?: React.ReactNode;
  /**
   * Optional guard before tab bar actions (click, close, context menu bulk close).
   * Return `false` or a Promise resolving to `false` to cancel (e.g. unsaved edits).
   */
  beforeNavigation?: WorkspaceNavigationGuard;
  /**
   * When `true`, keep every open tab’s content mounted and hide inactive panels (e.g. `hidden`).
   * When `false` (default), only the active tab’s content is mounted — switching tabs unmounts the previous page.
   */
  preserveInactiveTabContent?: boolean;
  /**
   * Move a tab from another editor group (split). Omit to only allow reorder within the same group.
   * `toIndex` is the insert index in the target group’s tab list (0 … tabs.length).
   */
  onTabMoveBetweenGroups?: (fromGroupId: string, tabId: string, toGroupId: string, toIndex: number) => void;
}

/** MIME type for tab drag payload (also used by hosts that need to read the payload). */
export const WORKSPACE_TAB_DRAG_MIME = 'application/x-idp-workspace-tab';

export function parseWorkspaceTabDragPayload(dt: DataTransfer): { fromGroupId: string; tabId: string; fromIndex: number } | null {
  try {
    const raw = dt.getData(WORKSPACE_TAB_DRAG_MIME);
    if (!raw) return null;
    const p = JSON.parse(raw) as { fromGroupId?: string; tabId?: string; fromIndex?: number };
    if (typeof p.fromGroupId === 'string' && typeof p.tabId === 'string' && typeof p.fromIndex === 'number') return p as { fromGroupId: string; tabId: string; fromIndex: number };
  } catch {
    /* ignore */
  }
  return null;
}

const defaultGetTabRiskDot = (tab: Tab): string | null => {
  if (tab.riskLevel === 'critical') return 'bg-red-500';
  if (tab.riskLevel === 'warning') return 'bg-yellow-500';
  if (tab.riskLevel === 'info') return 'bg-blue-500';
  return null;
};

export default function EditorGroup({
  group,
  isActive,
  showSplitButtons,
  onActivate,
  onTabClick,
  onTabClose,
  onTabPin,
  onCloseOthers,
  onCloseToRight,
  onCloseAll,
  onTabReorder,
  onReopenClosed,
  onSplitRight,
  onSplitDown,
  tabIconMap = {},
  getTabRiskDot = defaultGetTabRiskDot,
  renderContent,
  emptyStateContent,
  beforeNavigation,
  preserveInactiveTabContent = false,
  onTabMoveBetweenGroups,
}: EditorGroupProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tabListOpen, setTabListOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragSrcIdx = useRef<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabData = group.tabs.find((t) => t.id === group.activeTab);

  const runNav = (intent: WorkspaceNavigationIntent, action: () => void) => {
    void runWorkspaceNavigationGuard(beforeNavigation, intent, action);
  };

  const handleTabDropAt = useCallback(
    (e: React.DragEvent, toIdx: number) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverIdx(null);
      dragSrcIdx.current = null;
      const payload = parseWorkspaceTabDragPayload(e.dataTransfer);
      if (!payload) return;
      if (payload.fromGroupId === group.id) {
        if (payload.fromIndex !== toIdx) onTabReorder(payload.fromIndex, toIdx);
        return;
      }
      if (onTabMoveBetweenGroups) {
        onTabMoveBetweenGroups(payload.fromGroupId, payload.tabId, group.id, toIdx);
      }
    },
    [group.id, onTabReorder, onTabMoveBetweenGroups],
  );

  const getTabIcon = (id: string) => {
    const Icon = tabIconMap[id] || Layers;
    return <Icon size={13} className="mr-1.5 shrink-0 text-idpxyz-textMuted" />;
  };

  const checkOverflow = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    el.addEventListener('scroll', checkOverflow, { passive: true });
    return () => { ro.disconnect(); el.removeEventListener('scroll', checkOverflow); };
  }, [checkOverflow, group.tabs.length]);

  // Scroll active tab into view
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const activeEl = el.querySelector(`[data-tab-id="${group.activeTab}"]`) as HTMLElement | null;
    activeEl?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [group.activeTab]);

  const scrollTabs = (dir: 'left' | 'right') => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const isOverflowing = canScrollLeft || canScrollRight;

  return (
    <div
      className={`flex-1 flex flex-col overflow-hidden min-w-0 min-h-0 ${
        isActive ? 'ring-1 ring-idpxyz-accent/30' : ''
      }`}
      onClick={onActivate}
    >
      {/* Tab bar */}
      {group.tabs.length > 0 && (
        <div className="flex items-center bg-idpxyz-tab h-[35px] shrink-0 select-none border-b border-idpxyz-border">
          {/* Scroll left button */}
          {canScrollLeft && (
            <Button
              onClick={(e) => { e.stopPropagation(); scrollTabs('left'); }}
              variant="ghost"
              size="icon"
              className="w-[24px] h-full rounded-none shrink-0 border-r border-idpxyz-tabBorder"
              title="Scroll tabs left"
            >
              <ChevronLeft size={14} />
            </Button>
          )}

          <div
            ref={tabsRef}
            className="flex items-end flex-1 overflow-x-auto h-full tab-scroll-hidden"
          >
            {group.tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                className={`group flex items-center h-[35px] min-w-0 px-3 cursor-pointer text-[13px] border-r border-idpxyz-tabBorder shrink-0 relative
                  ${isOverflowing ? 'max-w-[160px]' : ''}
                  ${group.activeTab === tab.id
                    ? 'bg-idpxyz-tabActive text-idpxyz-textBright border-t-2 border-t-idpxyz-accent'
                    : 'bg-idpxyz-tab text-idpxyz-textMuted hover:bg-idpxyz-hover border-t border-t-transparent hover:text-idpxyz-text'
                  }
                  ${dragOverIdx === group.tabs.indexOf(tab) ? 'ring-1 ring-idpxyz-accent/60' : ''}
                `}
                draggable
                onDragStart={(e) => {
                  const idx = group.tabs.indexOf(tab);
                  dragSrcIdx.current = idx;
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData(
                    WORKSPACE_TAB_DRAG_MIME,
                    JSON.stringify({ fromGroupId: group.id, tabId: tab.id, fromIndex: idx }),
                  );
                  e.dataTransfer.setData('text/plain', tab.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  const idx = group.tabs.indexOf(tab);
                  if (idx !== dragSrcIdx.current) setDragOverIdx(idx);
                }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={(e) => handleTabDropAt(e, group.tabs.indexOf(tab))}
                onDragEnd={() => { dragSrcIdx.current = null; setDragOverIdx(null); }}
                onClick={(e) => {
                  e.stopPropagation();
                  runNav(
                    {
                      kind: 'tabClick',
                      groupId: group.id,
                      fromTabId: group.activeTab,
                      toTabId: tab.id,
                    },
                    () => onTabClick(tab.id),
                  );
                }}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, tabId: tab.id }); }}
              >
                {(() => {
                  const dot = getTabRiskDot(tab);
                  return dot ? <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1.5 shrink-0`} /> : null;
                })()}
                {getTabIcon(tab.id)}
                {tab.pinned && (
                  <span className="text-idpxyz-accent text-[10px] mr-1 shrink-0" title="Pinned">{'\u25CF'}</span>
                )}
                <span className="min-w-0 flex-1 truncate whitespace-nowrap mr-2">
                  {tab.name}
                  {tab.subtitle && (
                    <span className={`text-[10px] ml-1 ${group.activeTab === tab.id ? 'text-idpxyz-text' : 'text-idpxyz-textMuted'}`}>
                      {tab.subtitle}
                    </span>
                  )}
                </span>
                {tab.modified && (
                  <span className="w-2 h-2 rounded-full bg-white mr-1 shrink-0" />
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    runNav({ kind: 'tabClose', groupId: group.id, tabId: tab.id }, () => onTabClose(tab.id));
                  }}
                  variant="ghost"
                  size="icon"
                  className={`h-5 w-5 shrink-0 transition-opacity ${
                    group.activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
            {group.tabs.length > 0 && (
              <div
                className={`flex-1 min-w-[20px] h-[35px] shrink-0 self-end ${
                  dragOverIdx === group.tabs.length ? 'ring-1 ring-idpxyz-accent/60' : ''
                }`}
                aria-hidden
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  setDragOverIdx(group.tabs.length);
                }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={(e) => handleTabDropAt(e, group.tabs.length)}
              />
            )}
          </div>

          {/* Scroll right button */}
          {canScrollRight && (
            <Button
              onClick={(e) => { e.stopPropagation(); scrollTabs('right'); }}
              variant="ghost"
              size="icon"
              className="w-[24px] h-full rounded-none shrink-0 border-l border-idpxyz-tabBorder"
              title="Scroll tabs right"
            >
              <ChevronRight size={14} />
            </Button>
          )}

          {/* Tab list dropdown */}
          {group.tabs.length > 1 && (
            <div className="relative shrink-0 h-full flex items-center">
              <Button
                onClick={(e) => { e.stopPropagation(); setTabListOpen(!tabListOpen); }}
                variant="ghost"
                size="icon"
                className="w-[28px] h-full rounded-none border-l border-idpxyz-tabBorder"
                title="Open tabs list"
              >
                <ChevronDown size={14} />
              </Button>
              {tabListOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTabListOpen(false)} />
                  <div className="absolute right-0 top-full mt-0.5 z-50 bg-idpxyz-sidebar border border-idpxyz-border rounded shadow-lg py-1 min-w-[220px] max-h-[320px] overflow-y-auto">
                    {group.tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          runNav(
                            {
                              kind: 'tabClick',
                              groupId: group.id,
                              fromTabId: group.activeTab,
                              toTabId: tab.id,
                            },
                            () => {
                              onTabClick(tab.id);
                              setTabListOpen(false);
                            },
                          );
                        }}
                        className={`w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] ${
                          group.activeTab === tab.id ? 'text-idpxyz-accent font-medium' : 'text-idpxyz-text'
                        }`}
                      >
                        {getTabIcon(tab.id)}
                        <span className="truncate">{tab.name}</span>
                        {tab.pinned && <span className="text-idpxyz-accent text-[9px] ml-auto shrink-0">{'\u25CF'}</span>}
                        {(() => { const d = getTabRiskDot(tab); return d ? <span className={`w-1.5 h-1.5 rounded-full ${d} ml-auto shrink-0`} /> : null; })()}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Split buttons */}
          {showSplitButtons && (
            <div className="flex items-center gap-0.5 px-1.5 shrink-0 h-full relative">
              <Button
                onClick={(e) => { e.stopPropagation(); onSplitRight(); }}
                variant="ghost"
                size="icon"
                title="Split Editor Right (Ctrl+\)"
              >
                <SplitSquareHorizontal size={15} />
              </Button>
              <div className="relative">
                <Button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                  variant="ghost"
                  size="icon"
                  title="More Actions..."
                >
                  <MoreHorizontal size={15} />
                </Button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 bg-idpxyz-sidebar border border-idpxyz-border rounded shadow-lg py-1 min-w-[min(100vw-24px,280px)]">
                      <Button
                        onClick={(e) => { e.stopPropagation(); onSplitRight(); setMenuOpen(false); }}
                        variant="ghost"
                        size="sm"
                        className="flex w-full flex-nowrap items-center gap-2 h-auto justify-start rounded-none px-3 py-1.5 text-[12px] whitespace-nowrap"
                      >
                        <SplitSquareHorizontal size={14} className="shrink-0" />
                        <span className="min-w-0 flex-1 text-left">Split Editor Right</span>
                        <span className="shrink-0 text-idpxyz-textMuted text-[11px] tabular-nums">
                          {'Ctrl+\\'}
                        </span>
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); onSplitDown(); setMenuOpen(false); }}
                        variant="ghost"
                        size="sm"
                        className="flex w-full flex-nowrap items-center gap-2 h-auto justify-start rounded-none px-3 py-1.5 text-[12px] whitespace-nowrap"
                      >
                        <FlipVertical2 size={14} className="shrink-0" />
                        <span className="min-w-0 flex-1 text-left">Split Editor Down</span>
                        <span className="shrink-0 text-idpxyz-textMuted text-[11px] whitespace-nowrap tabular-nums">
                          {'Ctrl+K\u00A0Ctrl+\\'}
                        </span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab context menu */}
      {ctxMenu && (() => {
        const ctxTab = group.tabs.find((t) => t.id === ctxMenu.tabId);
        const tabIdx = group.tabs.findIndex((t) => t.id === ctxMenu.tabId);
        const hasTabsToRight = tabIdx < group.tabs.length - 1;
        const hasOtherTabs = group.tabs.length > 1;
        return (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setCtxMenu(null)} onContextMenu={(e) => { e.preventDefault(); setCtxMenu(null); }} />
            <div
              className="fixed z-[61] bg-idpxyz-sidebar border border-idpxyz-border rounded shadow-xl py-1 min-w-[220px]"
              style={{ left: ctxMenu.x, top: ctxMenu.y }}
            >
              <Button
                onClick={() => {
                  runNav({ kind: 'tabClose', groupId: group.id, tabId: ctxMenu.tabId }, () => {
                    onTabClose(ctxMenu.tabId);
                    setCtxMenu(null);
                  });
                }}
                variant="ghost"
                size="sm"
                className="group flex w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white"
              >
                Close
                <span className="ml-auto shrink-0 pl-2 text-[11px] text-idpxyz-textMuted group-hover:text-white/90">
                  Ctrl+F4
                </span>
              </Button>
              <Button
                onClick={() => {
                  runNav(
                    { kind: 'closeOthers', groupId: group.id, keepTabId: ctxMenu.tabId },
                    () => {
                      onCloseOthers(ctxMenu.tabId);
                      setCtxMenu(null);
                    },
                  );
                }}
                disabled={!hasOtherTabs}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Close Others
              </Button>
              <Button
                onClick={() => {
                  runNav(
                    { kind: 'closeToRight', groupId: group.id, anchorTabId: ctxMenu.tabId },
                    () => {
                      onCloseToRight(ctxMenu.tabId);
                      setCtxMenu(null);
                    },
                  );
                }}
                disabled={!hasTabsToRight}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Close to the Right
              </Button>
              <Button
                onClick={() => {
                  runNav({ kind: 'closeAll', groupId: group.id }, () => {
                    onCloseAll();
                    setCtxMenu(null);
                  });
                }}
                variant="ghost"
                size="sm"
                className="group flex w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white"
              >
                Close All
                <span className="ml-auto shrink-0 pl-2 text-[11px] text-idpxyz-textMuted group-hover:text-white/90">
                  Ctrl+K W
                </span>
              </Button>
              <div className="h-px bg-idpxyz-border my-1" />
              <Button
                onClick={() => { onTabPin(ctxMenu.tabId); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white"
              >
                {ctxTab?.pinned ? 'Unpin Tab' : 'Pin Tab'}
              </Button>
              <Button
                onClick={() => { onReopenClosed(); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="group flex w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white"
              >
                Reopen Closed Tab
                <span className="ml-auto shrink-0 pl-2 text-[11px] text-idpxyz-textMuted group-hover:text-white/90">
                  Ctrl+Shift+T
                </span>
              </Button>
              <div className="h-px bg-idpxyz-border my-1" />
              <Button
                onClick={() => { navigator.clipboard.writeText(ctxMenu.tabId); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="group flex w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-idpxyz-accent hover:text-white"
              >
                Copy Tab ID
                <span className="ml-auto shrink-0 pl-2 text-[11px] text-idpxyz-textMuted group-hover:text-white/90">
                  Shift+Alt+C
                </span>
              </Button>
            </div>
          </>
        );
      })()}

      {/* Page content */}
      {group.tabs.length > 0 ? (
        preserveInactiveTabContent ? (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {group.tabs.map((tab) => (
              <div
                key={tab.id}
                className={
                  tab.id === group.activeTab
                    ? 'flex flex-1 flex-col min-h-0 overflow-auto'
                    : 'hidden'
                }
                aria-hidden={tab.id !== group.activeTab}
                data-tab-panel={tab.id}
              >
                {renderContent(tab.id)}
              </div>
            ))}
          </div>
        ) : activeTabData ? (
          renderContent(activeTabData.id)
        ) : (
          emptyStateContent || (
            <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
              <div className="text-center">
                <p className="text-[20px] mb-2">Operations Workbench</p>
                <p className="text-[13px]">Select a module from the navigation panel</p>
              </div>
            </div>
          )
        )
      ) : (
        emptyStateContent || (
          <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
            <div className="text-center">
              <p className="text-[20px] mb-2">Operations Workbench</p>
              <p className="text-[13px]">Select a module from the navigation panel</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
