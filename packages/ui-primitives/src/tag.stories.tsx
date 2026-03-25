import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './tag';

const meta: Meta<typeof Tag> = { title: 'Primitives/Tag', component: Tag };
export default meta;

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="error">Error</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
};

export const Removable: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Tag variant="primary" onRemove={() => {}}>React</Tag>
      <Tag variant="success" onRemove={() => {}}>TypeScript</Tag>
      <Tag variant="default" onRemove={() => {}}>Vite</Tag>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};
