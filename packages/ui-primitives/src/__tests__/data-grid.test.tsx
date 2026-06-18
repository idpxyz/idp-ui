import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataGrid, type Column } from '../data-grid';

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
  qty: number;
}

const rows: Row[] = [{ id: '1', name: 'Widget', qty: 42 }];

const columns: Column<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'qty', header: 'Qty', align: 'right' },
];

describe('DataGrid column alignment', () => {
  it('right-aligns the header and cells of align="right" columns', () => {
    render(<DataGrid columns={columns} data={rows} />);
    const header = screen.getByText('Qty').closest('th');
    const cell = screen.getByText('42').closest('td');
    expect(header?.className).toContain('text-right');
    expect(cell?.className).toContain('text-right');
  });

  it('left-aligns columns by default', () => {
    render(<DataGrid columns={columns} data={rows} />);
    const header = screen.getByText('Name').closest('th');
    const cell = screen.getByText('Widget').closest('td');
    expect(header?.className).toContain('text-left');
    expect(cell?.className).not.toContain('text-right');
  });
});
