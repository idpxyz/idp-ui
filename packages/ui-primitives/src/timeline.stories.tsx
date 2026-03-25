import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './timeline';

const meta: Meta = { title: 'Primitives/Timeline' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Timeline
      items={[
        { id: '1', title: 'Release created', description: 'Version v1.0.0', timestamp: '10:00 AM', variant: 'default' },
        { id: '2', title: 'Submitted for review', timestamp: '10:15 AM', variant: 'default' },
        { id: '3', title: 'Approved by admin', timestamp: '11:00 AM', variant: 'success' },
        { id: '4', title: 'Published to production', description: 'Snapshot frozen', timestamp: '11:30 AM', variant: 'success' },
      ]}
    />
  ),
};

export const WithErrors: StoryObj = {
  render: () => (
    <Timeline
      items={[
        { id: '1', title: 'Execution started', variant: 'default' },
        { id: '2', title: 'Mapping completed', variant: 'success' },
        { id: '3', title: 'Connector send failed', description: 'HTTP 503', variant: 'error' },
        { id: '4', title: 'Retry scheduled', variant: 'warning' },
      ]}
    />
  ),
};
