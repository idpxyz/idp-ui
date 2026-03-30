import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table';
import { Badge } from './badge';

const meta: Meta = { title: 'Primitives/Table' };
export default meta;

export const StickyHeader: StoryObj = {
  render: () => (
    <div className="max-h-[220px] overflow-auto rounded border border-idpxyz-border bg-idpxyz-editor p-2">
      <Table stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 24 }, (_, i) => (
            <TableRow key={i}>
              <TableCell className="font-mono">Z-{i}</TableCell>
              <TableCell>Row {i + 1}</TableCell>
              <TableCell>active</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const Basic: StoryObj = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Environment</TableHead>
          <TableHead>Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { name: 'Order Sync', status: 'active', env: 'Production', updated: '2026-03-25' },
          { name: 'Inventory Feed', status: 'draft', env: 'Staging', updated: '2026-03-24' },
          { name: 'Shipment Tracker', status: 'deprecated', env: 'Dev', updated: '2026-03-20' },
        ].map((row) => (
          <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell><Badge variant={row.status === 'active' ? 'success' : row.status === 'draft' ? 'default' : 'warning'}>{row.status}</Badge></TableCell>
            <TableCell>{row.env}</TableCell>
            <TableCell>{row.updated}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
