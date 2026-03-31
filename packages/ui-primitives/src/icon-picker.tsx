'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as Flags from 'country-flag-icons/react/3x2';
import { countries } from 'country-flag-icons';
import { cn } from '@idpxyz/ui-utils';
import { Input } from './input';

const EXCLUDE = new Set(['createLucideIcon', 'default', 'icons', 'Icon']);

const allIconEntries: [string, LucideIcon][] = Object.entries(LucideIcons)
  .filter(([name, comp]) =>
    !EXCLUDE.has(name) &&
    !name.endsWith('Icon') &&
    !name.startsWith('Lucide') &&
    typeof comp === 'object' &&
    comp !== null &&
    '$$typeof' in (comp as Record<string, unknown>),
  ) as [string, LucideIcon][];

type FlagComponent = React.ComponentType<React.HTMLAttributes<HTMLElement> & React.SVGAttributes<SVGElement>>;
const FlagComponents = Flags as unknown as Record<string, FlagComponent>;

const countrySearchIndex: Record<string, string> = {};
try {
  const dnEn = new Intl.DisplayNames(['en'], { type: 'region' });
  const dnZh = new Intl.DisplayNames(['zh'], { type: 'region' });
  for (const code of countries) {
    const clean = code.replace(/-/g, '');
    const parts = [code, clean];
    try { const n = dnEn.of(clean); if (n) parts.push(n); } catch { /* skip */ }
    try { const n = dnZh.of(clean); if (n) parts.push(n); } catch { /* skip */ }
    countrySearchIndex[code] = parts.join(' ').toLowerCase();
  }
} catch {
  for (const code of countries) {
    countrySearchIndex[code] = code.toLowerCase();
  }
}

const allFlagEntries: [string, FlagComponent][] = countries
  .filter((code) => FlagComponents[code])
  .map((code) => [code, FlagComponents[code]]);

export const FLAG_PREFIX = 'flag:';

export function isFlag(value: string): boolean {
  return value.startsWith(FLAG_PREFIX);
}

export function getFlagCode(value: string): string {
  return value.slice(FLAG_PREFIX.length);
}

export function renderIconValue(
  value: string | undefined | null,
  size = 16,
  className?: string,
): React.ReactNode {
  if (!value) return null;
  if (isFlag(value)) {
    const code = getFlagCode(value);
    const Flag = FlagComponents[code];
    if (!Flag) return null;
    const h = Math.round(size * 2 / 3);
    return <Flag className={cn('inline-block rounded-[2px]', className)} style={{ width: size, height: h }} />;
  }
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[value];
  return Icon ? <Icon size={size} className={className} /> : null;
}

function getCountryLabel(code: string): string {
  try {
    const dn = new Intl.DisplayNames([typeof navigator !== 'undefined' ? navigator.language : 'en'], { type: 'region' });
    return dn.of(code.replace(/-/g, '')) ?? code;
  } catch {
    return code;
  }
}

export interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
  className?: string;
}

const PAGE_SIZE = 150;
type Tab = 'icons' | 'flags';

function IconPicker({ value, onChange, placeholder = 'Search icons...', className }: IconPickerProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>(() => (value && isFlag(value) ? 'flags' : 'icons'));
  const [search, setSearch] = React.useState('');
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const filteredIcons = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allIconEntries;
    return allIconEntries.filter(([name]) => name.toLowerCase().includes(q));
  }, [search]);

  const filteredFlags = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allFlagEntries;
    return allFlagEntries.filter(([code]) =>
      (countrySearchIndex[code] ?? code.toLowerCase()).includes(q),
    );
  }, [search]);

  const allFiltered = tab === 'icons' ? filteredIcons : filteredFlags;

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    scrollRef.current?.scrollTo(0, 0);
  }, [search, tab]);

  const visibleItems = React.useMemo(
    () => allFiltered.slice(0, visibleCount),
    [allFiltered, visibleCount],
  );

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !expanded) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= allFiltered.length) return prev;
            return prev + PAGE_SIZE;
          });
        }
      },
      { root: scrollRef.current, rootMargin: '100px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [expanded, allFiltered.length, visibleCount]);

  const displayValue = React.useMemo(() => {
    if (!value) return null;
    if (isFlag(value)) {
      const code = getFlagCode(value);
      const Flag = FlagComponents[code];
      if (!Flag) return null;
      return { node: <Flag className="inline-block rounded-[2px]" style={{ width: 18, height: 12 }} />, label: getCountryLabel(code) };
    }
    const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[value];
    if (!Icon) return null;
    return { node: <Icon size={16} className="shrink-0" />, label: value };
  }, [value]);

  return (
    <div className={cn('space-y-1', className)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="h-8 w-full flex items-center gap-2 px-2 rounded border border-idpxyz-border bg-idpxyz-inputBg text-[12px] hover:bg-idpxyz-hover/50 transition-colors"
      >
        {displayValue ? (
          <>
            {displayValue.node}
            <span className="text-idpxyz-text truncate flex-1 text-left">{displayValue.label}</span>
          </>
        ) : (
          <span className="text-idpxyz-textMuted flex-1 text-left">{placeholder}</span>
        )}
        <LucideIcons.ChevronDown
          size={14}
          className={cn('shrink-0 text-idpxyz-textMuted transition-transform', expanded && 'rotate-180')}
        />
      </button>

      {expanded ? (
        <div className="space-y-1.5 rounded border border-idpxyz-border bg-idpxyz-inputBg p-2">
          <div className="flex gap-1 mb-1">
            {(['icons', 'flags'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setSearch(''); }}
                className={cn(
                  'flex-1 h-6 text-[10px] rounded transition-colors',
                  tab === t ? 'bg-idpxyz-accent/20 text-idpxyz-accent font-medium' : 'text-idpxyz-textMuted hover:bg-idpxyz-hover',
                )}
              >
                {t === 'icons' ? 'Icons' : 'Flags'}
              </button>
            ))}
          </div>

          <Input
            className="h-7 text-[11px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tab === 'icons' ? placeholder : 'Search country...'}
            autoFocus
          />

          <div
            ref={scrollRef}
            className="overflow-y-auto"
            style={{ display: 'grid', gridTemplateColumns: tab === 'icons' ? 'repeat(8, 36px)' : 'repeat(6, 1fr)', gap: '2px', maxHeight: '200px' }}
          >
            {tab === 'icons'
              ? (visibleItems as [string, LucideIcon][]).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { onChange(value === name ? '' : name); setExpanded(false); }}
                    className={cn(
                      'flex items-center justify-center rounded hover:bg-idpxyz-hover transition-colors',
                      value === name && 'bg-idpxyz-accent/20 ring-1 ring-idpxyz-accent',
                    )}
                    style={{ width: '36px', height: '36px' }}
                    title={name}
                  >
                    <Icon size={18} />
                  </button>
                ))
              : (visibleItems as [string, FlagComponent][]).map(([code, Flag]) => {
                  const flagVal = `${FLAG_PREFIX}${code}`;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => { onChange(value === flagVal ? '' : flagVal); setExpanded(false); }}
                      className={cn(
                        'flex items-center justify-center rounded hover:bg-idpxyz-hover transition-colors py-1',
                        value === flagVal && 'bg-idpxyz-accent/20 ring-1 ring-idpxyz-accent',
                      )}
                      title={getCountryLabel(code)}
                    >
                      <Flag className="rounded-[2px]" style={{ width: 28, height: 19 }} />
                    </button>
                  );
                })}
            {allFiltered.length === 0 ? (
              <p key="__empty__" className="text-[11px] text-idpxyz-textMuted text-center py-4" style={{ gridColumn: '1 / -1' }}>
                {tab === 'icons' ? 'No icons found' : 'No flags found'}
              </p>
            ) : null}
            {visibleCount < allFiltered.length ? (
              <div key="__sentinel__" ref={sentinelRef} style={{ gridColumn: '1 / -1', height: '1px' }} />
            ) : null}
          </div>

          <p className="text-[9px] text-idpxyz-textMuted text-center">
            {visibleItems.length}/{allFiltered.length} · {tab === 'icons' ? 'Lucide Icons' : 'Country Flags'}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export { IconPicker };
