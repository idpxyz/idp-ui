'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { ArrowUp, ArrowDown, ArrowUpDown, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataGridProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  searchable?: boolean;
  pageSize?: number;
}

type SortDir = 'asc' | 'desc' | null;

function DataGrid<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
  onRowClick,
  className,
  emptyMessage = 'No data',
  searchable = false,
  pageSize = 0,
}: DataGridProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDir>(null);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  let processed = [...data];

  if (search) {
    const q = search.toLowerCase();
    processed = processed.filter((row) =>
      columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
    );
  }

  if (sortKey && sortDir) {
    processed.sort((a, b) => {
      const va = String(a[sortKey] ?? '');
      const vb = String(b[sortKey] ?? '');
      const cmp = va.localeCompare(vb, undefined, { numeric: true });
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }

  const total = processed.length;
  if (pageSize > 0) {
    const start = (page - 1) * pageSize;
    processed = processed.slice(start, start + pageSize);
  }
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

  return (
    <div className={cn('border border-vscode-border rounded-md overflow-hidden', className)}>
      {searchable && (
        <div className="px-3 py-2 border-b border-vscode-border bg-vscode-sidebar">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-vscode-textMuted" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-7 pr-2 py-1 text-[12px] bg-vscode-input border border-vscode-border rounded text-vscode-text placeholder:text-vscode-textMuted focus:outline-none focus:ring-1 focus:ring-vscode-accent/40"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-vscode-sidebar border-b border-vscode-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left px-3 py-2 text-[11px] font-semibold text-vscode-textMuted uppercase tracking-wider',
                    col.sortable && 'cursor-pointer select-none hover:text-vscode-text'
                  )}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                        : <ArrowUpDown size={12} className="opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processed.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-vscode-textMuted">{emptyMessage}</td>
              </tr>
            ) : (
              processed.map((row) => (
                <tr
                  key={String(row[keyField])}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-vscode-border last:border-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-vscode-hover'
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 text-vscode-text">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pageSize > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-vscode-border bg-vscode-sidebar text-[11px] text-vscode-textMuted">
          <span>{total} total</span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-1.5 py-0.5 rounded hover:bg-vscode-hover disabled:opacity-30">Prev</button>
            <span className="px-2">{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-1.5 py-0.5 rounded hover:bg-vscode-hover disabled:opacity-30">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { DataGrid, type Column };
