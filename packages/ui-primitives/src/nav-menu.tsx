'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: NavItem[];
}

interface NavMenuProps {
  items: NavItem[];
  activeId?: string;
  collapsed?: boolean;
  className?: string;
}

function NavMenu({ items, activeId, collapsed, className }: NavMenuProps) {
  return (
    <nav className={cn('flex flex-col', className)} role="navigation">
      {items.map((item) => (
        <NavMenuItem key={item.id} item={item} activeId={activeId} collapsed={collapsed} depth={0} />
      ))}
    </nav>
  );
}

function NavMenuItem({ item, activeId, collapsed, depth }: { item: NavItem; activeId?: string; collapsed?: boolean; depth: number }) {
  const [expanded, setExpanded] = React.useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
    item.onClick?.();
  };

  const Tag = item.href ? 'a' : 'button';
  const linkProps = item.href ? { href: item.href } : {};

  return (
    <>
      <Tag
        {...linkProps}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2 w-full text-left text-[12px] transition-colors',
          'hover:bg-vscode-hover rounded-sm',
          isActive ? 'bg-vscode-activeItem text-vscode-textBright' : 'text-vscode-text',
          collapsed ? 'px-2 py-2 justify-center' : 'px-2 py-1.5',
        )}
        style={{ paddingLeft: collapsed ? undefined : `${8 + depth * 16}px` }}
        title={collapsed ? item.label : undefined}
      >
        {item.icon && <span className="shrink-0 w-4 h-4 flex items-center justify-center text-vscode-textMuted">{item.icon}</span>}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-vscode-accent text-white leading-none">{item.badge}</span>
            )}
            {hasChildren && (
              expanded ? <ChevronDown size={12} className="text-vscode-textMuted" /> : <ChevronRight size={12} className="text-vscode-textMuted" />
            )}
          </>
        )}
      </Tag>
      {hasChildren && expanded && !collapsed && (
        <div>
          {item.children!.map((child) => (
            <NavMenuItem key={child.id} item={child} activeId={activeId} collapsed={collapsed} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
}

export { NavMenu, type NavItem };
