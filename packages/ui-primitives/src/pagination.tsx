'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

/** Page indices for numbered variants; `'ellipsis'` renders a gap marker. */
export type PaginationPageItem = number | 'ellipsis';

/**
 * Builds a compact page list: `[1, 'ellipsis', 9, 10, 11, 'ellipsis', 40]` for large `totalPages`.
 * @see variant `numbered` / `table`
 */
export function getPaginationPageItems(currentPage: number, totalPages: number): PaginationPageItem[] {
  if (totalPages <= 0) return [];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);
  const items: PaginationPageItem[] = [1];
  if (left > 2) items.push('ellipsis');
  for (let p = left; p <= right; p++) {
    items.push(p);
  }
  if (right < totalPages - 1) items.push('ellipsis');
  items.push(totalPages);
  return items;
}

/** Above this, page jump uses a number field instead of a long scroll list. */
const PAGE_JUMP_LIST_MAX = 400;

/**
 * Overrides default `SelectTrigger` border + input background — flat inline control for pagination rows.
 */
const paginationSelectInline =
  'border-0 bg-transparent shadow-none hover:bg-transparent hover:text-idpxyz-text ' +
  'focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-idpxyz-accent/30 ' +
  'data-[state=open]:bg-transparent disabled:bg-transparent ' +
  'h-auto min-h-0 py-0 px-1 rounded-sm text-idpxyz-textMuted ' +
  '[&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:shrink-0 [&>svg]:opacity-60';

const pageSelectTriggerClass = cn(
  paginationSelectInline,
  'w-[3.25rem] min-w-[3rem] shrink-0 justify-center gap-0.5 font-normal tabular-nums'
);

function PageJumpControl({
  page,
  totalPages,
  onGo,
}: {
  page: number;
  totalPages: number;
  onGo: (p: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(String(page));

  React.useEffect(() => {
    if (open) setDraft(String(page));
  }, [open, page]);

  if (totalPages <= 0) {
    return (
      <span className="px-2 font-normal tabular-nums text-idpxyz-textMuted" aria-hidden>
        —
      </span>
    );
  }

  const submitInput = () => {
    const n = parseInt(draft, 10);
    if (!Number.isFinite(n)) return;
    onGo(Math.min(Math.max(1, n), totalPages));
    setOpen(false);
  };

  const triggerClass = cn(
    'inline-flex h-auto min-h-0 min-w-[4rem] shrink-0 items-center justify-center gap-0.5 rounded-sm px-1',
    'border-0 bg-transparent text-[11px] font-normal tabular-nums text-idpxyz-textMuted transition-colors',
    'hover:bg-transparent hover:text-idpxyz-text',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/30'
  );

  if (totalPages > PAGE_JUMP_LIST_MAX) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={triggerClass}
            aria-label={`Page ${page} of ${totalPages}, enter page number`}
            aria-haspopup="dialog"
          >
            <span>
              {page} / {totalPages}
            </span>
            <ChevronDown className="h-2.5 w-2.5 shrink-0 opacity-60" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-[11rem] p-2">
          <form
            className="flex flex-col gap-2"
            onSubmit={(ev) => {
              ev.preventDefault();
              submitInput();
            }}
          >
            <label className="text-[11px] text-idpxyz-textMuted" htmlFor="pagination-page-jump">
              Page (1–{totalPages})
            </label>
            <Input
              id="pagination-page-jump"
              type="number"
              min={1}
              max={totalPages}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-6 border-0 bg-transparent px-1 shadow-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/30"
            />
            <Button type="submit" variant="secondary" size="sm" className="w-full">
              Go
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center gap-1 px-0.5">
      <Select value={String(page)} onValueChange={(v) => onGo(Number(v))}>
        <SelectTrigger size="sm" className={pageSelectTriggerClass} aria-label={`Page (${page} of ${totalPages})`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} align="center">
          {Array.from({ length: totalPages }, (_, i) => {
            const p = i + 1;
            return (
              <SelectItem key={p} value={String(p)}>
                {p}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <span className="shrink-0 text-idpxyz-textMuted" aria-hidden>
        /
      </span>
      <span className="min-w-[1.5rem] shrink-0 tabular-nums text-idpxyz-textMuted">{totalPages}</span>
    </div>
  );
}

export type PaginationVariant = 'simple' | 'numbered' | 'minimal' | 'table';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  /**
   * - `simple` — range + first/prev/page×/next/last
   * - `minimal` — prev/next only + `from–to of total`; page size when `onPageSizeChange` is set
   * - `numbered` — page buttons + ellipsis
   * - `table` — range + numbered nav + page size (admin table)
   */
  variant?: PaginationVariant;
  /** When `onPageSizeChange` is set: defaults on for `table` / `minimal`; for `simple` pass `true` to show. */
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** When `total === 0`, hide the pager controls (summary can still show). */
  hideControlsWhenEmpty?: boolean;
}

function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  variant = 'simple',
  showPageSize: showPageSizeProp,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  hideControlsWhenEmpty = false,
}: PaginationProps) {
  const totalPages = total === 0 ? 0 : Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total);
  const to = total === 0 ? 0 : Math.min(page * pageSize, total);

  const showPageSize =
    Boolean(onPageSizeChange) && (showPageSizeProp ?? (variant === 'table' || variant === 'minimal'));

  const canPrev = totalPages > 0 && page > 1;
  const canNext = totalPages > 0 && page < totalPages;

  const go = (next: number) => {
    if (totalPages <= 0) return;
    const clamped = Math.min(Math.max(1, next), totalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  const summary = (
    <span className="tabular-nums">
      {from}–{to} <span className="text-idpxyz-textMuted">of</span> {total}
    </span>
  );

  const navFirstLast = (
    <>
      <PaginationIconButton onClick={() => go(1)} disabled={!canPrev} aria-label="First page">
        <ChevronsLeft size={12} />
      </PaginationIconButton>
      <PaginationIconButton onClick={() => go(page - 1)} disabled={!canPrev} aria-label="Previous page">
        <ChevronLeft size={12} />
      </PaginationIconButton>
    </>
  );

  const navNextLast = (
    <>
      <PaginationIconButton onClick={() => go(page + 1)} disabled={!canNext} aria-label="Next page">
        <ChevronRight size={12} />
      </PaginationIconButton>
      <PaginationIconButton onClick={() => go(totalPages)} disabled={!canNext} aria-label="Last page">
        <ChevronsRight size={12} />
      </PaginationIconButton>
    </>
  );

  const pageNumbers =
    totalPages > 0 ? (
      <div className="flex items-center gap-0.5" role="group" aria-label="Pages">
        {getPaginationPageItems(page, totalPages).map((item, i) =>
          item === 'ellipsis' ? (
            <span
              key={`e-${i}`}
              className="flex min-w-[1.75rem] items-center justify-center px-0.5 text-idpxyz-textMuted"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => go(item)}
              className={cn(
                'min-w-[1.75rem] rounded px-1.5 py-1 tabular-nums transition-colors',
                item === page
                  ? 'font-medium text-idpxyz-text underline decoration-idpxyz-border underline-offset-2'
                  : 'text-idpxyz-textMuted hover:bg-transparent hover:text-idpxyz-text'
              )}
              aria-label={`Page ${item}`}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}
      </div>
    ) : null;

  const pageSizeSelect =
    showPageSize && onPageSizeChange ? (
      <div className="flex items-center gap-2">
        <span className="text-idpxyz-textMuted">Rows</span>
        <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
          <SelectTrigger size="sm" className={cn(paginationSelectInline, 'min-w-[4rem] shrink-0')} aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ) : null;

  const hideNav = hideControlsWhenEmpty && total === 0;

  if (variant === 'minimal') {
    return (
      <nav
        aria-label="Pagination"
        className={cn(
          'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] text-idpxyz-textMuted',
          className
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {!hideNav && (
            <div className="flex items-center gap-1">
              <PaginationIconButton onClick={() => go(page - 1)} disabled={!canPrev} aria-label="Previous page">
                <ChevronLeft size={12} />
              </PaginationIconButton>
              <PaginationIconButton onClick={() => go(page + 1)} disabled={!canNext} aria-label="Next page">
                <ChevronRight size={12} />
              </PaginationIconButton>
            </div>
          )}
          {summary}
        </div>
        {pageSizeSelect}
      </nav>
    );
  }

  if (variant === 'numbered') {
    return (
      <nav
        aria-label="Pagination"
        className={cn('flex flex-wrap items-center justify-center gap-3 text-[11px] text-idpxyz-textMuted', className)}
      >
        {!hideNav && (
          <div className="flex items-center gap-1">
            {navFirstLast}
            {pageNumbers}
            {navNextLast}
          </div>
        )}
      </nav>
    );
  }

  if (variant === 'table') {
    return (
      <nav
        aria-label="Pagination"
        className={cn(
          'flex flex-wrap items-center justify-between gap-4 text-[11px] text-idpxyz-textMuted',
          className
        )}
      >
        {summary}
        <div className="flex flex-wrap items-center justify-end gap-4">
          {!hideNav && (
            <div className="flex items-center gap-1">
              {navFirstLast}
              {pageNumbers}
              {navNextLast}
            </div>
          )}
          {pageSizeSelect}
        </div>
      </nav>
    );
  }

  /* simple */
  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-4 text-[11px] text-idpxyz-textMuted', className)}
    >
      {summary}
      <div className="flex flex-wrap items-center gap-4">
        {!hideNav && (
          <div className="flex items-center gap-1">
            {navFirstLast}
            <PageJumpControl page={page} totalPages={totalPages} onGo={go} />
            {navNextLast}
          </div>
        )}
        {pageSizeSelect}
      </div>
    </nav>
  );
}

function PaginationIconButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-sm p-0.5 text-idpxyz-textMuted transition-colors hover:bg-transparent hover:text-idpxyz-text disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      {...props}
    />
  );
}

export { Pagination };
