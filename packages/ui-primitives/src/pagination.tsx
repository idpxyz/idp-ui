'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-between gap-4 text-[12px] text-vscode-textMuted', className)}>
      <span>{from}–{to} of {total}</span>
      <div className="flex items-center gap-1">
        <PaginationButton onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="First page">
          <ChevronsLeft size={14} />
        </PaginationButton>
        <PaginationButton onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft size={14} />
        </PaginationButton>
        <span className="px-2 text-vscode-text font-medium">
          {page} / {totalPages}
        </span>
        <PaginationButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight size={14} />
        </PaginationButton>
        <PaginationButton onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="Last page">
          <ChevronsRight size={14} />
        </PaginationButton>
      </div>
    </nav>
  );
}

function PaginationButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'p-1 rounded hover:bg-vscode-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
        className
      )}
      {...props}
    />
  );
}

export { Pagination };
