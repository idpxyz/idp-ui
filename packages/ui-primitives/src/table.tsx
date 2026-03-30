import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

/** Applied to each `TableHead` when `Table` has `stickyHeader`. */
const tableHeadStickyClass =
  'sticky top-0 z-[2] bg-idpxyz-editor shadow-[0_1px_0_0_rgba(0,0,0,0.25)]';

const TableStickyHeaderContext = React.createContext(false);

export type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  /**
   * Sticky header row: each `TableHead` gets `position: sticky` with editor background.
   * Parent scroll must not be blocked by `overflow-hidden` between the scroll container and this table.
   * For horizontal overflow, wrap `<Table>` in `overflow-x-auto` (not on the table root).
   */
  stickyHeader?: boolean;
};

/* ── Table Root ── */
/** Wrapper is `min-w-0` only — no overflow here so sticky headers can use the page/parent scrollport. */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, stickyHeader, ...props }, ref) => (
    <TableStickyHeaderContext.Provider value={!!stickyHeader}>
      <div className="w-full min-w-0">
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom text-[12px]',
            stickyHeader && 'border-separate border-spacing-0',
            className
          )}
          {...props}
        />
      </div>
    </TableStickyHeaderContext.Provider>
  )
);
Table.displayName = 'Table';

/* ── Header ── */
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

/* ── Body ── */
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

/* ── Footer ── */
const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t border-idpxyz-border bg-idpxyz-sidebar font-medium', className)} {...props} />
  )
);
TableFooter.displayName = 'TableFooter';

/* ── Row ── */
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-idpxyz-border transition-colors hover:bg-idpxyz-hover data-[state=selected]:bg-idpxyz-activeItem/10',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  /** When `Table` has `stickyHeader`, cells are sticky by default. Set `false` to opt out. */
  sticky?: boolean;
};

/* ── Head Cell ── */
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky, ...props }, ref) => {
    const stickyHeaderFromTable = React.useContext(TableStickyHeaderContext);
    const stickyActive = stickyHeaderFromTable && sticky !== false;
    return (
      <th
        ref={ref}
        className={cn(
          'h-8 px-3 text-left align-middle text-[11px] font-medium text-idpxyz-textMuted [&:has([role=checkbox])]:pr-0',
          stickyActive && tableHeadStickyClass,
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = 'TableHead';

/* ── Body Cell ── */
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-3 py-2 align-middle text-idpxyz-text [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

/* ── Caption ── */
const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn('mt-2 text-[11px] text-idpxyz-textMuted', className)} {...props} />
  )
);
TableCaption.displayName = 'TableCaption';

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption };
