import { useCallback, useLayoutEffect, useMemo, useState, type ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import type { ProductKey } from '@idpxyz/ui-tokens';
import type { NavigationSection } from '@idpxyz/ui-workspace';
import {
  TitleBar,
  ActivityBar,
  Sidebar,
  EditorGroup,
  StatusBar,
  CommandPalette,
} from '@idpxyz/ui-workspace';
import { ThemeProvider, ToastProvider } from '@idpxyz/ui-theme-runtime';
import { useWorkspaceState } from './hooks/useWorkspaceState';
import PageRouter from './features/routing/PageRouter';
import ProductInspector from './features/inspector/ProductInspector';
import { PRODUCT_CATALOG } from './mocks/products';
import LanguageSwitcher from './components/LanguageSwitcher';
import {
  parcelSidebarIconMap,
  parcelTabIconMap,
  PARCEL_NAV_TAB_KEYS,
  productDetailTabId,
} from './features/routing/navigation';
import { resolveParcelTabTitle } from './features/routing/tabTitles';
import { useProductCatalogQuery } from './shared/api/hooks/useProducts';

const PRODUCT = 'oms' as ProductKey;

/**
 * Parcel workbench — shell from `@idpxyz/ui-workspace`, pages use `@idpxyz/ui-primitives` + `@idpxyz/ui-patterns`.
 */
export default function App() {
  const { t, i18n } = useTranslation();
  const ws = useWorkspaceState();
  const { data: catalogData } = useProductCatalogQuery();

  /** EditorGroup reads `tab.name` from state; refresh when i18n language or product locale changes */
  useLayoutEffect(() => {
    ws.syncTabLabels((tabId) => resolveParcelTabTitle(tabId, t, i18n));
  }, [ws.syncTabLabels, t, i18n, i18n.language, catalogData]);

  const navigationSections = useMemo((): NavigationSection[] => {
    return [
      {
        title: t('nav.sectionParcel'),
        items: [
          { id: 'welcome', label: t('nav.welcome'), icon: 'home' },
          { id: 'product-catalog', label: t('nav.products'), icon: 'package' },
          { id: 'zones', label: t('nav.zones'), icon: 'map' },
        ],
      },
    ];
  }, [t]);

  const editorTabIconMap = useMemo(() => {
    const m: Record<string, ElementType> = { ...parcelTabIconMap };
    const list = catalogData ?? PRODUCT_CATALOG;
    for (const e of list) {
      m[productDetailTabId(e.product.id)] = Package;
    }
    return m;
  }, [catalogData]);

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState('explorer');

  const handleActivityClick = (item: string) => {
    if (item === activeActivity) ws.setSidebarVisible(!ws.sidebarVisible);
    else {
      setActiveActivity(item);
      ws.setSidebarVisible(true);
    }
  };

  const handleFileClick = useCallback(
    (navId: string) => {
      const key = PARCEL_NAV_TAB_KEYS[navId];
      ws.openNavTab(navId, key ? t(key) : navId);
    },
    [ws, t],
  );

  return (
    <ThemeProvider product={PRODUCT}>
      <ToastProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-idpxyz-bg">
          <TitleBar
            rightSidebarVisible={ws.rightSidebarVisible}
            onToggleRightSidebar={() => ws.setRightSidebarVisible(!ws.rightSidebarVisible)}
            bottomPanelVisible={ws.bottomPanelVisible}
            onToggleBottomPanel={() => ws.setBottomPanelVisible(!ws.bottomPanelVisible)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          <div className="h-8 shrink-0 flex items-center justify-end gap-2 px-3 border-b border-idpxyz-border bg-idpxyz-bg">
            <LanguageSwitcher />
          </div>

          <div className="flex flex-1 overflow-hidden min-h-0">
            <ActivityBar activeItem={activeActivity} onItemClick={handleActivityClick} />

            {ws.sidebarVisible && (
              <>
                <Sidebar
                  width={ws.sidebarResize.size}
                  onFileClick={handleFileClick}
                  activeFile={ws.activeTabData?.id || ''}
                  navigationSections={navigationSections}
                  iconMap={parcelSidebarIconMap}
                />
                <div className="resize-handle-h" onMouseDown={ws.sidebarResize.handleMouseDown} />
              </>
            )}

            <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
              <div
                ref={ws.activeSplitResize.containerRef}
                className={`flex-1 flex overflow-hidden min-h-0 ${ws.splitDirection === 'vertical' ? 'flex-col' : 'flex-row'}`}
              >
                {ws.groups.map((group, idx) => {
                  const isSplit = ws.groups.length > 1;
                  const flexStyle = !isSplit
                    ? { flex: '1 1 0%' }
                    : idx === 0
                      ? { flex: `0 0 ${ws.activeSplitResize.ratio}%` }
                      : { flex: '1 1 0%' };
                  return (
                    <div key={group.id} className="contents">
                      {idx > 0 && (
                        <div
                          className={ws.splitDirection === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'}
                          onMouseDown={ws.activeSplitResize.handleMouseDown}
                        />
                      )}
                      <div
                        style={{ ...flexStyle, overflow: 'hidden', minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}
                      >
                        <EditorGroup
                          group={group}
                          isActive={group.id === ws.activeGroupId}
                          showSplitButtons={ws.groups.length < 2}
                          onActivate={() => ws.setActiveGroupId(group.id)}
                          onTabClick={(tabId: string) => ws.clickTab(group.id, tabId)}
                          onTabClose={(tabId) => ws.closeTab(group.id, tabId)}
                          onTabPin={(tabId) => ws.pinTab(group.id, tabId)}
                          onCloseOthers={(tabId) => ws.closeOthers(group.id, tabId)}
                          onCloseToRight={(tabId) => ws.closeToRight(group.id, tabId)}
                          onCloseAll={() => ws.closeAll(group.id)}
                          onReopenClosed={() => ws.reopenClosed(group.id)}
                          onTabReorder={(from, to) => ws.reorderTab(group.id, from, to)}
                          onSplitRight={() => ws.split('horizontal')}
                          onSplitDown={() => ws.split('vertical')}
                          tabIconMap={editorTabIconMap}
                          renderContent={(tabId: string) => (
                            <PageRouter
                              tabId={tabId}
                              onOpenTab={(tid, tname, sub) => ws.openTab(group.id, tid, tname, sub)}
                            />
                          )}
                          emptyStateContent={
                            <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
                              {t('app.emptyTabs')}
                            </div>
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {ws.bottomPanelVisible && (
                <>
                  <div className="resize-handle-v shrink-0" onMouseDown={ws.bottomPanelResize.handleMouseDown} />
                  <div
                    className="shrink-0 flex flex-col border-t border-idpxyz-border bg-idpxyz-editor text-idpxyz-textMuted overflow-hidden"
                    style={{ height: ws.bottomPanelResize.size }}
                  >
                    <div className="h-9 px-3 flex items-center border-b border-idpxyz-border text-[11px] uppercase tracking-wide text-idpxyz-textMuted shrink-0">
                      {t('app.bottomPanelTitle')}
                    </div>
                    <div className="flex-1 min-h-0 px-3 py-2 text-[12px] font-mono text-idpxyz-textMuted">
                      {t('app.bottomPanelBody')}
                    </div>
                  </div>
                </>
              )}
            </div>

            {ws.rightSidebarVisible && (
              <>
                <div className="resize-handle-h shrink-0" onMouseDown={ws.rightSidebarResize.handleMouseDown} />
                <aside
                  className="shrink-0 flex flex-col border-l border-idpxyz-border bg-idpxyz-sidebar text-idpxyz-text overflow-hidden"
                  style={{ width: ws.rightSidebarResize.size }}
                >
                  <div className="h-9 px-3 flex items-center border-b border-idpxyz-border text-[11px] uppercase tracking-wide text-idpxyz-textMuted shrink-0">
                    {t('app.inspectorTitle')}
                  </div>
                  <div className="flex-1 min-h-0 px-3 py-2 overflow-auto">
                    <ProductInspector activeTabId={ws.activeTabData?.id ?? ''} />
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
