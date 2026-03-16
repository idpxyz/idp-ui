import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Clock,
  Activity,
  Truck,
  ShoppingCart,
  AlertTriangle,
  MapPin,
  Radio,
  GitBranch,
  CreditCard,
  Settings,
  FileText,
  MoreHorizontal,
  Star,
  History,
  Eye,
  Layers,
  Package,
  ArrowRightLeft,
  BarChart3,
} from 'lucide-react';
import { navigationSections, type NavItem as NavItemType } from '../data/loms';

interface SidebarProps {
  width: number;
  onFileClick: (fileName: string) => void;
  activeFile: string;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Clock,
  Activity,
  Truck,
  ShoppingCart,
  AlertTriangle,
  MapPin,
  Radio,
  GitBranch,
  CreditCard,
  Settings,
  FileText,
  Package,
  ArrowRightLeft,
  BarChart3,
};

function NavItemRow({
  item,
  depth,
  activeFile,
  onFileClick,
}: {
  item: NavItemType;
  depth: number;
  activeFile: string;
  onFileClick: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;
  const paddingLeft = depth * 16 + 12;
  const Icon = iconMap[item.icon] || Layers;

  return (
    <div>
      <div
        className={`flex items-center cursor-pointer hover:bg-vscode-hover h-[28px] text-[12px] select-none
          ${activeFile === item.id ? 'bg-vscode-activeItem text-vscode-textBright' : 'text-vscode-text'}
        `}
        style={{ paddingLeft }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          else onFileClick(item.id);
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={13} className="mr-1.5 shrink-0 text-vscode-textMuted" /> : <ChevronRight size={13} className="mr-1.5 shrink-0 text-vscode-textMuted" />
        ) : (
          <span className="w-[13px] mr-1.5 shrink-0" />
        )}
        <Icon size={14} className="mr-2 shrink-0 text-vscode-textMuted" />
        <span className="truncate">{item.label}</span>
        {item.badge !== undefined && (
          <span className="ml-auto mr-2 bg-vscode-accent text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
            {item.badge}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <NavItemRow key={child.id} item={child} depth={depth + 1} activeFile={activeFile} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ width, onFileClick, activeFile }: SidebarProps) {
  return (
    <div className="bg-vscode-sidebar flex flex-col select-none shrink-0 overflow-hidden" style={{ width }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0">
        <span>My Work</span>
        <MoreHorizontal size={16} className="text-vscode-textMuted cursor-pointer hover:text-vscode-textBright" />
      </div>

      {/* Quick access */}
      <div className="px-3 py-1.5 border-b border-vscode-border shrink-0">
        {[
          { icon: Star, label: 'Saved Views', id: 'saved-views' },
          { icon: History, label: 'Recent Objects', id: 'recent-objects' },
          { icon: Eye, label: 'Watchlists', id: 'watchlists' },
          { icon: Layers, label: 'My Queues', id: 'my-queues' },
        ].map((qa) => (
          <div
            key={qa.id}
            className="flex items-center h-[26px] text-[12px] text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-hover rounded px-1.5 cursor-pointer"
            onClick={() => onFileClick(qa.id)}
          >
            <qa.icon size={13} className="mr-2 shrink-0" />
            <span>{qa.label}</span>
          </div>
        ))}
      </div>

      {/* Navigation sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {navigationSections.map((section) => (
          <div key={section.title}>
            <div className="px-4 h-[26px] flex items-center text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mt-2">
              {section.title}
            </div>
            {section.items.map((item) => (
              <NavItemRow
                key={item.id}
                item={item}
                depth={0}
                activeFile={activeFile}
                onFileClick={onFileClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}



