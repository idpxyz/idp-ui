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

interface TitleBarProps {
  rightSidebarVisible: boolean;
  onToggleRightSidebar: () => void;
  bottomPanelVisible: boolean;
  onToggleBottomPanel: () => void;
  onOpenCommandPalette?: () => void;
  recentObjects?: RecentObject[];
  onOpenRecentObject?: (id: string, name: string) => void;
}

export default function TitleBar({
  rightSidebarVisible,
  onToggleRightSidebar,
  bottomPanelVisible,
  onToggleBottomPanel,
  onOpenCommandPalette,
  recentObjects = [],
  onOpenRecentObject,
}: TitleBarProps) {
  const [recentOpen, setRecentOpen] = useState(false);
  const [mainMenuActive, setMainMenuActive] = useState('Operations');
  const mainMenuItems = ['Operations', 'View', 'Reports', 'Admin'] as const;
  return (
    <div className="h-[32px] bg-vscode-titleBar border-b border-vscode-border flex items-center justify-between select-none shrink-0 text-[13px] relative">
      {/* Left — app menu (logistics shell style) */}
      <div className="flex items-center h-full min-w-0">
        <div className="w-[52px] shrink-0 flex items-center justify-center h-full relative">
          <PanelLeft size={16} className="text-vscode-textMuted" />
          <ShellColumnEdgeTitle />
        </div>
        <div className="flex items-center gap-0 h-full text-vscode-text">
          {mainMenuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMainMenuActive(item)}
              className={`px-3 h-full flex items-center cursor-pointer text-[13px] border-b-2 transition-colors
                ${mainMenuActive === item
                  ? 'text-vscode-textBright border-vscode-textBright bg-vscode-hover/40'
                  : 'text-vscode-textMuted border-transparent hover:text-vscode-text hover:bg-vscode-hover/30'}
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Center - Global Search + Command Palette + Scope */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        {/* Global Search */}
        <div
          className="flex items-center gap-1.5 bg-vscode-sidebar/60 border border-vscode-border rounded px-2 py-0.5 min-w-[280px] cursor-pointer hover:bg-vscode-sidebar"
          onClick={onOpenCommandPalette}
          title="Open Command Palette"
        >
          <Search size={12} className="text-vscode-textMuted shrink-0" />
          <span className="text-[12px] text-vscode-textMuted flex-1">Search shipments, orders, cases...</span>
          <span className="text-[10px] text-vscode-textMuted bg-vscode-hover px-1 rounded flex items-center gap-1">
            <Command size={10} />
            <span>K</span>
          </span>
        </div>
        {/* Scope Switcher */}
        <div className="flex items-center gap-0.5">
          {[
            { label: 'All Tenants', key: 'tenant' },
            { label: 'All Networks', key: 'network' },
            { label: 'All Sites', key: 'site' },
            { label: 'Today', key: 'date' },
          ].map((scope) => (
            <div key={scope.key} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-vscode-hover cursor-pointer text-[11px] text-vscode-textMuted">
              <span>{scope.label}</span>
              <ChevronDown size={10} />
            </div>
          ))}
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
              <div className="absolute right-0 top-full mt-0.5 z-50 bg-vscode-sidebar border border-vscode-border rounded shadow-lg py-1 min-w-[240px] max-h-[300px] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold border-b border-vscode-border">Recent Objects</div>
                {recentObjects.length === 0 ? (
                  <div className="px-3 py-3 text-[12px] text-vscode-textMuted text-center">No recent objects</div>
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
                        <Icon size={13} className="text-vscode-textMuted shrink-0" />
                        <span className="truncate">{obj.name}</span>
                        <span className="text-[10px] text-vscode-textMuted ml-auto shrink-0 capitalize">{obj.type}</span>
                      </Button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-full w-[36px] rounded-none relative"
          title="Alert Center"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </Button>
        <div className="w-px h-3 bg-vscode-border mx-1" />
        <Button
          onClick={onToggleBottomPanel}
          variant="ghost"
          size="icon"
          className={`h-full w-[36px] rounded-none ${
            bottomPanelVisible ? 'text-vscode-text' : 'text-vscode-textMuted'
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
            rightSidebarVisible ? 'text-vscode-text' : 'text-vscode-textMuted'
          }`}
          title="Toggle Right Sidebar"
        >
          <PanelRight size={16} />
        </Button>
        <div className="w-px h-3 bg-vscode-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-full rounded-none px-2 text-vscode-textMuted hover:text-vscode-text"
          title="User Menu"
        >
          <User size={14} />
          <span className="text-[11px]">Ops Controller</span>
        </Button>
      </div>
    </div>
  );
}
