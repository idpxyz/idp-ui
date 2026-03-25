import type { Meta, StoryObj } from '@storybook/react';
import { DataGrid } from './data-grid';
import { Badge } from './badge';

const meta: Meta = { title: 'Primitives/DataGrid' };
export default meta;

const sampleData = Array.from({ length: 25 }, (_, i) => ({
  id: `exec-${String(i + 1).padStart(3, '0')}`,
  integration: `order-sync-${(i % 3) + 1}`,
  status: ['success', 'failed', 'running'][i % 3],
  origin: ['api', 'async', 'replay'][i % 3],
  duration: Math.floor(Math.random() * 5000),
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
}));

export const FullFeature: StoryObj = {
  render: () => (
    <DataGrid
      columns={[
        { key: 'id', header: 'ID', sortable: true, width: '120px' },
        { key: 'integration', header: 'Integration', sortable: true },
        {
          key: 'status', header: 'Status', sortable: true,
          render: (v) => <Badge variant={v === 'success' ? 'success' : v === 'failed' ? 'destructive' : 'default'}>{String(v)}</Badge>,
        },
        { key: 'origin', header: 'Origin', sortable: true },
        { key: 'duration', header: 'Duration', sortable: true, render: (v) => `${v}ms` },
      ]}
      data={sampleData}
      searchable
      pageSize={10}
    />
  ),
};
