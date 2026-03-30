'use client';

import * as React from 'react';
import { icons as lucideIcons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Input } from './input';

const allIconNames = Object.keys(lucideIcons) as (keyof typeof lucideIcons)[];

export interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
  className?: string;
}

function IconPicker({ value, onChange, placeholder = 'Select icon', className }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allIconNames.slice(0, 120);
    return allIconNames.filter((name) => name.toLowerCase().includes(q)).slice(0, 120);
  }, [search]);

  const SelectedIcon = value ? (lucideIcons[value as keyof typeof lucideIcons] as LucideIcon | undefined) : undefined;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="h-8 flex-1 flex items-center gap-2 px-2 rounded border border-idpxyz-border bg-idpxyz-inputBg text-[12px]">
        {SelectedIcon ? (
          <>
            <SelectedIcon size={16} />
            <span className="text-idpxyz-text truncate">{value}</span>
          </>
        ) : (
          <span className="text-idpxyz-textMuted">{placeholder}</span>
        )}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
            {SelectedIcon ? <SelectedIcon size={16} /> : <span className="text-[12px]">🎨</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-2" align="start">
          <Input
            className="h-7 text-[11px] mb-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            autoFocus
          />
          <div className="grid grid-cols-8 gap-0.5 max-h-[240px] overflow-y-auto">
            {filtered.map((name) => {
              const Icon = lucideIcons[name] as LucideIcon;
              if (!Icon || typeof Icon !== 'function') return null;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false); }}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded hover:bg-idpxyz-hover transition-colors',
                    value === name && 'bg-idpxyz-accent/20 ring-1 ring-idpxyz-accent',
                  )}
                  title={name}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
          {filtered.length === 0 ? (
            <p className="text-[11px] text-idpxyz-textMuted text-center py-4">No icons found</p>
          ) : null}
          <p className="text-[9px] text-idpxyz-textMuted mt-2 text-center">
            {filtered.length} icons · Lucide
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { IconPicker };
