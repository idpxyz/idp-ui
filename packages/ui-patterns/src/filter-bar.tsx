import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { Search, X } from 'lucide-react';

/* ── FilterBar Root ── */
interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional border at the bottom */
  bordered?: boolean;
}

function FilterBar({ bordered = true, className, children, ...props }: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-1.5',
        bordered && 'border-b border-vscode-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Search field ── */
interface FilterSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

const FilterSearch = React.forwardRef<HTMLInputElement, FilterSearchProps>(
  ({ className, value, onClear, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';
    return (
      <div className="relative flex-1">
        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-vscode-textMuted" />
        <input
          ref={ref}
          type="text"
          value={value}
          className={cn(
            'h-6 w-full rounded border border-vscode-border bg-vscode-inputBg pl-7 pr-6 text-[11px] text-vscode-text placeholder:text-vscode-textMuted outline-none focus-visible:ring-1 focus-visible:ring-[var(--ds-focus-ring)]',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-vscode-textMuted hover:text-vscode-text"
          >
            <X size={10} />
          </button>
        )}
      </div>
    );
  }
);
FilterSearch.displayName = 'FilterSearch';

/* ── Filter group wrapper ── */
function FilterGroup({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} {...props}>
      {children}
    </div>
  );
}

/* ── Filter chip / tag ── */
interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onRemove?: () => void;
}

function FilterChip({ active, onRemove, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full px-2 text-[10px] transition-colors',
        active
          ? 'bg-vscode-accent/20 text-vscode-accent'
          : 'bg-vscode-hover text-vscode-textMuted hover:text-vscode-text',
        className
      )}
      {...props}
    >
      {children}
      {active && onRemove && (
        <X
          size={9}
          className="ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}

export {
  FilterBar,
  FilterSearch,
  FilterGroup,
  FilterChip,
  type FilterBarProps,
  type FilterSearchProps,
  type FilterChipProps,
};
