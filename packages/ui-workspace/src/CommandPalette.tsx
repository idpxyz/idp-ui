import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Command, Search } from 'lucide-react';
import { Input, Button } from '@idpxyz/ui-primitives';

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
