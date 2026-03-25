import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './status-badge';

const meta: Meta<typeof StatusBadge> = { title: 'Patterns/StatusBadge', component: StatusBadge };
export default meta;

/** Uses `status` variants from `statusBadgeVariants` (semantic states). */
export const AllStatuses: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <StatusBadge status="success">Success</StatusBadge>
      <StatusBadge status="warning">Warning</StatusBadge>
      <StatusBadge status="danger">Danger</StatusBadge>
      <StatusBadge status="info">Info</StatusBadge>
      <StatusBadge status="neutral">Neutral</StatusBadge>
      <StatusBadge status="pending">Pending</StatusBadge>
    </div>
  ),
};
