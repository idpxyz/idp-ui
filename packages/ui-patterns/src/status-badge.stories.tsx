import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './status-badge';

const meta: Meta<typeof StatusBadge> = { title: 'Patterns/StatusBadge', component: StatusBadge };
export default meta;

export const AllStatuses: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <StatusBadge status="active" />
      <StatusBadge status="draft" />
      <StatusBadge status="published" />
      <StatusBadge status="deprecated" />
      <StatusBadge status="in_transit" />
      <StatusBadge status="delivered" />
      <StatusBadge status="exception" />
      <StatusBadge status="pending" />
    </div>
  ),
};
