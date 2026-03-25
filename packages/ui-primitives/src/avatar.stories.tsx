import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = { title: 'Primitives/Avatar', component: Avatar };
export default meta;

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Avatar size="xs" alt="Alice" />
      <Avatar size="sm" alt="Bob Chen" />
      <Avatar size="md" alt="Charlie Davis" />
      <Avatar size="lg" alt="Diana Evans" />
      <Avatar size="xl" alt="Ethan Ford" />
    </div>
  ),
};

export const WithFallback: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar alt="John Doe" />
      <Avatar fallback="AI" />
      <Avatar src="https://invalid.url/avatar.png" alt="Broken Image" />
    </div>
  ),
};
