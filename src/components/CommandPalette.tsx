import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Command, FileSearch, History, LayoutGrid, Search, Truck, AlertTriangle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { type RecentObject } from './TitleBar';
import { shipments, exceptions } from '../data/loms';

export interface CommandPaletteAction {
  id: string;
  label: string;
  group: 'navigation' | 'recent' | 'objects' | 'actions';
  keywords: string[];
  hint?: string;
  icon?: React.ElementType;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandPaletteAction[];
}

function groupLabel(group: CommandPaletteAction['group']) {
  if (group === 'navigation') return 'Navigation';
  if (group === 'recent') return 'Recent Objects';
  if (group === 'objects') return 'Objects';
  return 'Actions';
}

export function buildDefaultCommandActions(params: {
  recentObjects: RecentObject[];
  onOpenPage: (navId: string) => void;
  onOpenObject: (id: string, name: string) => void;
  onToggleBottomPanel: () => void;
  onToggleRightSidebar: () => void;
  onFeedback?: (message: string) => void;
}): CommandPaletteAction[] {
  const { recentObjects, onOpenPage, onOpenObject, onToggleBottomPanel, onToggleRightSidebar, onFeedback } = params;

  const navItems: Array<{ id: string; label: string; keywords: string[] }> = [
    { id: 'ops-dashboard', label: 'Open Operations Dashboard', keywords: ['dashboard', 'ops'] },
    { id: 'shipment-monitor', label: 'Open Shipment Monitor', keywords: ['shipment', 'monitor', 'table'] },
    { id: 'exception-queue', label: 'Open Exception Queue', keywords: ['exception', 'cases'] },
    { id: 'routing', label: 'Open Routing', keywords: ['route', 'routing'] },
    { id: 'billing', label: 'Open Billing', keywords: ['billing', 'invoice'] },
    { id: 'reports', label: 'Open Reports', keywords: ['report', 'kpi'] },
    { id: 'config', label: 'Open Configuration', keywords: ['config', 'settings'] },
  ];

  const recentActions: CommandPaletteAction[] = recentObjects.slice(0, 8).map((obj) => ({
    id: `recent-${obj.id}`,
    label: `Open ${obj.name}`,
    group: 'recent',
    keywords: [obj.id.toLowerCase(), obj.name.toLowerCase(), obj.type],
    icon: History,
    run: () => {
      onOpenObject(obj.id, obj.name);
      onFeedback?.(`Executed: Open ${obj.name}`);
    },
  }));

  const objectCandidates = [
    ...shipments.slice(0, 12).map((s) => ({ id: s.id, name: s.id, kind: 'shipment' as const })),
    ...exceptions.slice(0, 8).map((e) => ({ id: e.id, name: e.id, kind: 'exception' as const })),
  ];

  const objectActions: CommandPaletteAction[] = objectCandidates.map((obj) => ({
    id: `obj-${obj.id}`,
    label: `Open ${obj.name}`,
    group: 'objects',
    keywords: [obj.id.toLowerCase(), obj.kind],
    icon: obj.kind === 'shipment' ? Truck : AlertTriangle,
    run: () => {
      onOpenObject(obj.id, obj.name);
      onFeedback?.(`Executed: Open ${obj.name}`);
    },
  }));

  const actionItems: CommandPaletteAction[] = [
    {
      id: 'action-toggle-bottom',
      label: 'Toggle Bottom Panel',
      group: 'actions',
      keywords: ['panel', 'bottom', 'events', 'logs'],
      icon: LayoutGrid,
      run: () => {
        onToggleBottomPanel();
        onFeedback?.('Executed: Toggle Bottom Panel');
      },
      hint: 'Ctrl+J',
    },
    {
      id: 'action-toggle-right',
      label: 'Toggle Right Context Panel',
      group: 'actions',
      keywords: ['panel', 'inspector', 'right'],
      icon: LayoutGrid,
      run: () => {
        onToggleRightSidebar();
        onFeedback?.('Executed: Toggle Right Context Panel');
      },
    },
  ];

  return [
    ...navItems.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      group: 'navigation' as const,
      keywords: item.keywords,
      icon: FileSearch,
      run: () => {
        onOpenPage(item.id);
        onFeedback?.(`Executed: ${item.label}`);
      },
    })),
    ...recentActions,
    ...objectActions,
    ...actionItems,
  ];
}

export default function CommandPalette({ open, onClose, actions }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      a.label.toLowerCase().includes(q) || a.keywords.some((k) => k.includes(q))
    );
  }, [actions, query]);

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length));
      } else if (e.key === 'Enter') {
        const item = filtered[activeIndex];
        if (item) {
          e.preventDefault();
          item.run();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, filtered, activeIndex]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[130] bg-black/45" onClick={onClose} />
      <div className="fixed inset-0 z-[131] flex items-start justify-center pt-[12vh] px-4">
        <div className="w-full max-w-[760px] overflow-hidden rounded-md border border-vscode-border bg-vscode-sidebar shadow-2xl">
          <div className="flex items-center gap-2 border-b border-vscode-border px-3 py-2">
            <Command size={14} className="text-vscode-textMuted" />
            <Search size={14} className="text-vscode-textMuted" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search object ID..."
              className="h-8 border-0 bg-transparent px-0 text-[13px] focus-visible:ring-0"
            />
            <span className="rounded bg-vscode-hover px-1.5 py-0.5 text-[10px] text-vscode-textMuted">ESC</span>
          </div>

          <div className="max-h-[430px] overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="px-3 py-8 text-center text-[12px] text-vscode-textMuted">No commands found</div>
            ) : (
              filtered.map((item, idx) => {
                const Icon = item.icon || ArrowUpRight;
                const showGroupLabel = idx === 0 || filtered[idx - 1].group !== item.group;
                return (
                  <div key={item.id}>
                    {showGroupLabel && (
                      <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-vscode-textMuted">
                        {groupLabel(item.group)}
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        item.run();
                        onClose();
                      }}
                      className={`h-8 w-full justify-start rounded px-2 text-[12px] ${idx === activeIndex ? 'bg-vscode-activeItem text-vscode-textBright' : ''}`}
                    >
                      <Icon size={13} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.hint && <span className="ml-auto text-[10px] text-vscode-textMuted">{item.hint}</span>}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}



