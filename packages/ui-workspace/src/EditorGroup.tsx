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

  const getTabIcon = (id: string) => {
    const Icon = tabIconMap[id] || Layers;
    return <Icon size={13} className="mr-1.5 shrink-0 text-vscode-textMuted" />;
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
        isActive ? 'ring-1 ring-vscode-accent/30' : ''
      }`}
      onClick={onActivate}
    >
      {/* Tab bar */}
      {group.tabs.length > 0 && (
        <div className="flex items-center bg-vscode-tab h-[35px] shrink-0 select-none border-b border-vscode-border">
          {/* Scroll left button */}
          {canScrollLeft && (
            <Button
              onClick={(e) => { e.stopPropagation(); scrollTabs('left'); }}
              variant="ghost"
              size="icon"
              className="w-[24px] h-full rounded-none shrink-0 border-r border-vscode-tabBorder"
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
                className={`group flex items-center h-[35px] px-3 cursor-pointer text-[13px] border-r border-vscode-tabBorder shrink-0 relative
                  ${isOverflowing ? 'max-w-[160px]' : ''}
                  ${group.activeTab === tab.id
                    ? 'bg-vscode-tabActive text-vscode-textBright border-t-2 border-t-vscode-accent'
                    : 'bg-vscode-tab text-vscode-textMuted hover:bg-vscode-hover border-t border-t-transparent hover:text-vscode-text'
                  }
                  ${dragOverIdx === group.tabs.indexOf(tab) ? 'ring-1 ring-vscode-accent/60' : ''}
                `}
                draggable
                onDragStart={(e) => {
                  dragSrcIdx.current = group.tabs.indexOf(tab);
                  e.dataTransfer.effectAllowed = 'move';
                  e.dataTransfer.setData('text/plain', tab.id);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  const idx = group.tabs.indexOf(tab);
                  if (idx !== dragSrcIdx.current) setDragOverIdx(idx);
                }}
                onDragLeave={() => setDragOverIdx(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverIdx(null);
                  const toIdx = group.tabs.indexOf(tab);
                  if (dragSrcIdx.current !== null && dragSrcIdx.current !== toIdx) {
                    onTabReorder(dragSrcIdx.current, toIdx);
                  }
                  dragSrcIdx.current = null;
                }}
                onDragEnd={() => { dragSrcIdx.current = null; setDragOverIdx(null); }}
                onClick={(e) => { e.stopPropagation(); onTabClick(tab.id); }}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY, tabId: tab.id }); }}
              >
                {(() => {
                  const dot = getTabRiskDot(tab);
                  return dot ? <span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1.5 shrink-0`} /> : null;
                })()}
                {getTabIcon(tab.id)}
                {tab.pinned && (
                  <span className="text-vscode-accent text-[10px] mr-1 shrink-0" title="Pinned">{'\u25CF'}</span>
                )}
                <span className="truncate mr-2">
                  {tab.name}
                  {tab.subtitle && (
                    <span className={`text-[10px] ml-1 ${group.activeTab === tab.id ? 'text-vscode-text' : 'text-vscode-textMuted'}`}>
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
                    onTabClose(tab.id);
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
          </div>

          {/* Scroll right button */}
          {canScrollRight && (
            <Button
              onClick={(e) => { e.stopPropagation(); scrollTabs('right'); }}
              variant="ghost"
              size="icon"
              className="w-[24px] h-full rounded-none shrink-0 border-l border-vscode-tabBorder"
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
                className="w-[28px] h-full rounded-none border-l border-vscode-tabBorder"
                title="Open tabs list"
              >
                <ChevronDown size={14} />
              </Button>
              {tabListOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTabListOpen(false)} />
                  <div className="absolute right-0 top-full mt-0.5 z-50 bg-vscode-sidebar border border-vscode-border rounded shadow-lg py-1 min-w-[220px] max-h-[320px] overflow-y-auto">
                    {group.tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onTabClick(tab.id); setTabListOpen(false); }}
                        className={`w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] ${
                          group.activeTab === tab.id ? 'text-vscode-accent font-medium' : 'text-vscode-text'
                        }`}
                      >
                        {getTabIcon(tab.id)}
                        <span className="truncate">{tab.name}</span>
                        {tab.pinned && <span className="text-vscode-accent text-[9px] ml-auto shrink-0">{'\u25CF'}</span>}
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
                    <div className="absolute right-0 top-full mt-1 z-50 bg-vscode-sidebar border border-vscode-border rounded shadow-lg py-1 min-w-[200px]">
                      <Button
                        onClick={(e) => { e.stopPropagation(); onSplitRight(); setMenuOpen(false); }}
                        variant="ghost"
                        size="sm"
                        className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px]"
                      >
                        <SplitSquareHorizontal size={14} />
                        Split Editor Right
                        <span className="ml-auto text-vscode-textMuted text-[11px]">Ctrl+\</span>
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); onSplitDown(); setMenuOpen(false); }}
                        variant="ghost"
                        size="sm"
                        className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px]"
                      >
                        <FlipVertical2 size={14} />
                        Split Editor Down
                        <span className="ml-auto text-vscode-textMuted text-[11px]">Ctrl+K Ctrl+\</span>
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
              className="fixed z-[61] bg-vscode-sidebar border border-vscode-border rounded shadow-xl py-1 min-w-[220px]"
              style={{ left: ctxMenu.x, top: ctxMenu.y }}
            >
              <Button
                onClick={() => { onTabClose(ctxMenu.tabId); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white"
              >
                Close
                <span className="text-vscode-textMuted text-[11px]">Ctrl+F4</span>
              </Button>
              <Button
                onClick={() => { onCloseOthers(ctxMenu.tabId); setCtxMenu(null); }}
                disabled={!hasOtherTabs}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Close Others
              </Button>
              <Button
                onClick={() => { onCloseToRight(ctxMenu.tabId); setCtxMenu(null); }}
                disabled={!hasTabsToRight}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Close to the Right
              </Button>
              <Button
                onClick={() => { onCloseAll(); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white"
              >
                Close All
                <span className="text-vscode-textMuted text-[11px]">Ctrl+K W</span>
              </Button>
              <div className="h-px bg-vscode-border my-1" />
              <Button
                onClick={() => { onTabPin(ctxMenu.tabId); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white"
              >
                {ctxTab?.pinned ? 'Unpin Tab' : 'Pin Tab'}
              </Button>
              <Button
                onClick={() => { onReopenClosed(); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white"
              >
                Reopen Closed Tab
                <span className="text-vscode-textMuted text-[11px]">Ctrl+Shift+T</span>
              </Button>
              <div className="h-px bg-vscode-border my-1" />
              <Button
                onClick={() => { navigator.clipboard.writeText(ctxMenu.tabId); setCtxMenu(null); }}
                variant="ghost"
                size="sm"
                className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] hover:bg-vscode-accent hover:text-white"
              >
                Copy Tab ID
                <span className="text-vscode-textMuted text-[11px]">Shift+Alt+C</span>
              </Button>
            </div>
          </>
        );
      })()}

      {/* Page content */}
      {activeTabData ? (
        renderContent(activeTabData.id)
      ) : (
        emptyStateContent || (
          <div className="flex-1 flex items-center justify-center bg-vscode-editor text-vscode-textMuted">
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
