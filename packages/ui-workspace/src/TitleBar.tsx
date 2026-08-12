import { useState } from 'react';
import {
  PanelLeft,
  PanelRight,
  PanelBottom,
  Search,
  Command,
  Bell,
  ChevronDown,
  Clock,
  User,
  Truck,
  AlertTriangle,
  MapPin,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';
import { ShellColumnEdgeTitle } from './ShellColumnEdge';

export interface RecentObject {
  id: string;
  name: string;
  type: 'shipment' | 'exception' | 'leg' | 'order';
}

const recentTypeIcons: Record<string, React.ElementType> = {
  shipment: Truck,
  exception: AlertTriangle,
  leg: MapPin,
  order: ShoppingCart,
};

export interface ScopeFilterOption {
  id: string;
  label: string;
}

export interface ScopeFilter {
  key: string;
  label: string;
  options?: ScopeFilterOption[];
  value?: string | null;
  onChange?: (value: string | null) => void;
}

export interface TitleBarMenuItem {
  id: string;
  label: string;
}

export interface TitleBarUserMenuItem {
  id: string;
  label: string;
  /** Renders the entry in the destructive color (e.g. sign out). */
  danger?: boolean;
}

interface TitleBarProps {
  rightSidebarVisible: boolean;
  onToggleRightSidebar: () => void;
  bottomPanelVisible: boolean;
  onToggleBottomPanel: () => void;
  onOpenCommandPalette?: () => void;
  recentObjects?: RecentObject[];
  onOpenRecentObject?: (id: string, name: string) => void;
  scopeFilters?: ScopeFilter[];
  /** Top menu entries; pass [] to hide the menu. Defaults to the legacy four
   *  labels (highlight-only) so existing consumers are unaffected. */
  mainMenuItems?: TitleBarMenuItem[];
  /** Called with the item id on click — this is what makes the menu real. */
  onMainMenuSelect?: (id: string) => void;
  /** Makes the alert bell a live control. Without it the bell stays the
   *  legacy decorative icon. */
  onAlertsClick?: () => void;
  /** Numeric badge for the bell; 0 renders no badge. Ignored without
   *  onAlertsClick. */
  alertsCount?: number;
  /** Label for the user button (defaults to the legacy placeholder). */
  userLabel?: string;
  /** When provided, the user button opens this menu instead of doing nothing. */
  userMenuItems?: TitleBarUserMenuItem[];
  onUserMenuSelect?: (id: string) => void;
}

const DEFAULT_SCOPE_FILTERS: ScopeFilter[] = [
  { key: 'tenant', label: 'All Tenants' },
  { key: 'network', label: 'All Networks' },
  { key: 'site', label: 'All Sites' },
  { key: 'date', label: 'Today' },
];

const DEFAULT_MAIN_MENU: TitleBarMenuItem[] = [
  { id: 'operations', label: 'Operations' },
  { id: 'view', label: 'View' },
  { id: 'reports', label: 'Reports' },
  { id: 'admin', label: 'Admin' },
];

export default function TitleBar({
  rightSidebarVisible,
  onToggleRightSidebar,
  bottomPanelVisible,
  onToggleBottomPanel,
  onOpenCommandPalette,
  recentObjects = [],
  onOpenRecentObject,
  scopeFilters,
  mainMenuItems,
  onMainMenuSelect,
  onAlertsClick,
  alertsCount,
  userLabel = 'Ops Controller',
  userMenuItems,
  onUserMenuSelect,
}: TitleBarProps) {
  const filters = scopeFilters ?? DEFAULT_SCOPE_FILTERS;
  const [recentOpen, setRecentOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuItems = mainMenuItems ?? DEFAULT_MAIN_MENU;
  const [mainMenuActive, setMainMenuActive] = useState(menuItems[0]?.id ?? '');
  return (
    <div className="h-[32px] bg-idpxyz-titleBar border-b border-idpxyz-border flex items-center justify-between select-none shrink-0 text-[13px] relative">
      {/* Left — app menu (logistics shell style) */}
      <div className="flex items-center h-full min-w-0">
        <div className="w-[52px] shrink-0 flex items-center justify-center h-full relative">
          <PanelLeft size={16} className="text-idpxyz-textMuted" />
          <ShellColumnEdgeTitle />
        </div>
        {menuItems.length > 0 && (
          <div className="flex items-center gap-0 h-full text-idpxyz-text">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMainMenuActive(item.id);
                  onMainMenuSelect?.(item.id);
                }}
                className={`px-3 h-full flex items-center cursor-pointer text-[13px] border-b-2 transition-colors
                  ${mainMenuActive === item.id
                    ? 'text-idpxyz-textBright border-idpxyz-textBright bg-idpxyz-hover/40'
                    : 'text-idpxyz-textMuted border-transparent hover:text-idpxyz-text hover:bg-idpxyz-hover/30'}
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center - Global Search + Command Palette + Scope */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {/* Global Search */}
        <div
          className="flex items-center gap-1.5 bg-idpxyz-sidebar/60 border border-idpxyz-border rounded px-2 py-0.5 min-w-[280px] cursor-pointer hover:bg-idpxyz-sidebar"
          onClick={onOpenCommandPalette}
          title="Open Command Palette"
        >
          <Search size={12} className="text-idpxyz-textMuted shrink-0" />
          <span className="text-[12px] text-idpxyz-textMuted flex-1">Search shipments, orders, cases...</span>
          <span className="text-[10px] text-idpxyz-textMuted bg-idpxyz-hover px-1 rounded flex items-center gap-1">
            <Command size={10} />
            <span>K</span>
          </span>
        </div>
        {/* Scope Switcher */}
        <div className="flex items-center gap-0.5">
          {filters.map((scope) =>
            scope.options && scope.options.length > 0 && scope.onChange ? (
              <select
                key={scope.key}
                className="bg-transparent border-none outline-none text-[11px] text-idpxyz-textMuted hover:text-idpxyz-text cursor-pointer px-1.5 py-0.5 rounded hover:bg-idpxyz-hover appearance-none pr-4"
                style={{ backgroundImage: 'none' }}
                value={scope.value ?? ''}
                onChange={(e) => scope.onChange!(e.target.value || null)}
              >
                <option value="">{scope.label}</option>
                {scope.options.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <div key={scope.key} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-idpxyz-hover cursor-pointer text-[11px] text-idpxyz-textMuted">
                <span>{scope.label}</span>
                <ChevronDown size={10} />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Right - Alert Center + Recent + Layout controls + User */}
      <div className="flex items-center h-full">
        <div className="relative h-full">
          <Button
            onClick={() => setRecentOpen(!recentOpen)}
            variant="ghost"
            size="icon"
            className="h-full w-[36px] rounded-none"
            title="Recent Objects"
          >
            <Clock size={15} />
          </Button>
          {recentOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRecentOpen(false)} />
              <div className="absolute right-0 top-full mt-0.5 z-50 bg-idpxyz-sidebar border border-idpxyz-border rounded shadow-lg py-1 min-w-[240px] max-h-[300px] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-idpxyz-textMuted font-semibold border-b border-idpxyz-border">Recent Objects</div>
                {recentObjects.length === 0 ? (
                  <div className="px-3 py-3 text-[12px] text-idpxyz-textMuted text-center">No recent objects</div>
                ) : (
                  recentObjects.slice(0, 10).map((obj) => {
                    const Icon = recentTypeIcons[obj.type] || Truck;
                    return (
                      <Button
                        key={obj.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => { onOpenRecentObject?.(obj.id, obj.name); setRecentOpen(false); }}
                        className="w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px]"
                      >
                        <Icon size={13} className="text-idpxyz-textMuted shrink-0" />
                        <span className="truncate">{obj.name}</span>
                        <span className="text-[10px] text-idpxyz-textMuted ml-auto shrink-0 capitalize">{obj.type}</span>
                      </Button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
        <Button
          onClick={onAlertsClick}
          variant="ghost"
          size="icon"
          className="h-full w-[36px] rounded-none relative"
          title="Alert Center"
        >
          <Bell size={15} />
          {onAlertsClick ? (
            typeof alertsCount === 'number' ? (
              alertsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-red-500 text-white text-[9px] leading-[14px] text-center font-semibold">
                  {alertsCount > 99 ? '99+' : alertsCount}
                </span>
              )
            ) : (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )
          ) : (
            <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          )}
        </Button>
        <div className="w-px h-3 bg-idpxyz-border mx-1" />
        <Button
          onClick={onToggleBottomPanel}
          variant="ghost"
          size="icon"
          className={`h-full w-[36px] rounded-none ${
            bottomPanelVisible ? 'text-idpxyz-text' : 'text-idpxyz-textMuted'
          }`}
          title="Toggle Bottom Panel"
        >
          <PanelBottom size={16} />
        </Button>
        <Button
          onClick={onToggleRightSidebar}
          variant="ghost"
          size="icon"
          className={`h-full w-[36px] rounded-none ${
            rightSidebarVisible ? 'text-idpxyz-text' : 'text-idpxyz-textMuted'
          }`}
          title="Toggle Right Sidebar"
        >
          <PanelRight size={16} />
        </Button>
        <div className="w-px h-3 bg-idpxyz-border mx-1" />
        <div className="relative h-full">
          <Button
            onClick={userMenuItems && userMenuItems.length > 0 ? () => setUserMenuOpen(!userMenuOpen) : undefined}
            variant="ghost"
            size="sm"
            className="h-full rounded-none px-2 text-idpxyz-textMuted hover:text-idpxyz-text"
            title="User Menu"
          >
            <User size={14} />
            <span className="text-[11px]">{userLabel}</span>
          </Button>
          {userMenuOpen && userMenuItems && userMenuItems.length > 0 && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-0.5 z-50 bg-idpxyz-sidebar border border-idpxyz-border rounded shadow-lg py-1 min-w-[160px]">
                {userMenuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onUserMenuSelect?.(item.id);
                    }}
                    className={`w-full h-auto justify-start rounded-none px-3 py-1.5 text-[12px] ${item.danger ? 'text-red-400 hover:text-red-300' : ''}`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
