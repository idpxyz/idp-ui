import { useState } from 'react';
import { ChevronRight, ChevronDown, Layers } from 'lucide-react';
import { runWorkspaceNavigationGuard, type WorkspaceNavigationGuard } from './navigationGuard';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface NavigationSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  width: number;
  onFileClick: (fileName: string) => void;
  activeFile: string;
  navigationSections: NavigationSection[];
  iconMap: Record<string, React.ElementType>;
  /** Optional guard before activating a sidebar nav item (same contract as EditorGroup `beforeNavigation`). */
  beforeNavigation?: WorkspaceNavigationGuard;
}

function NavItemRow({
  item,
  depth,
  activeFile,
  onFileClick,
  iconMap,
  beforeNavigation,
}: {
  item: NavItem;
  depth: number;
  activeFile: string;
  onFileClick: (name: string) => void;
  iconMap: Record<string, React.ElementType>;
  beforeNavigation?: WorkspaceNavigationGuard;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;
  const paddingLeft = depth * 16 + 12;
  const Icon = iconMap[item.icon] || Layers;

  return (
    <div>
      <div
        className={`group flex items-center cursor-pointer h-[30px] text-[12px] select-none rounded-sm mx-1 px-1
          ${activeFile === item.id
            ? 'bg-idpxyz-activeItem text-idpxyz-textBright'
            : 'text-idpxyz-text hover:bg-idpxyz-hover'}
        `}
        style={{ paddingLeft }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          else {
            void runWorkspaceNavigationGuard(
              beforeNavigation,
              { kind: 'sidebarNav', navId: item.id },
              () => onFileClick(item.id),
            );
          }
        }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={13} className="mr-1.5 shrink-0 text-idpxyz-textMuted" /> : <ChevronRight size={13} className="mr-1.5 shrink-0 text-idpxyz-textMuted" />
        ) : (
          <span className="w-[13px] mr-1.5 shrink-0" />
        )}
        <Icon
          size={14}
          strokeWidth={1.75}
          className={`mr-2 shrink-0 ${activeFile === item.id ? 'text-idpxyz-textBright' : 'text-idpxyz-textMuted group-hover:text-idpxyz-text'}`}
        />
        <span className="truncate font-normal">{item.label}</span>
        {item.badge !== undefined && (
          <span className="ml-auto mr-1 min-w-[1.25rem] text-center bg-blue-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full leading-none tabular-nums">
            {item.badge}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {item.children!.map((child) => (
            <NavItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              activeFile={activeFile}
              onFileClick={onFileClick}
              iconMap={iconMap}
              beforeNavigation={beforeNavigation}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ width, onFileClick, activeFile, navigationSections, iconMap, beforeNavigation }: SidebarProps) {
  return (
    <div className="bg-idpxyz-sidebar flex flex-col select-none shrink-0 overflow-hidden" style={{ width }}>
      {/* Navigation sections — logistics-style grouped nav (MY WORK, OVERVIEW, …) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1 pb-2">
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <div
              className={`px-3 h-[22px] flex items-center text-[11px] uppercase tracking-[0.06em] text-idpxyz-textMuted font-semibold ${sectionIndex === 0 ? 'mt-0' : 'mt-3'}`}
            >
              {section.title}
            </div>
            {section.items.map((item) => (
              <NavItemRow
                key={item.id}
                item={item}
                depth={0}
                activeFile={activeFile}
                onFileClick={onFileClick}
                iconMap={iconMap}
                beforeNavigation={beforeNavigation}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
