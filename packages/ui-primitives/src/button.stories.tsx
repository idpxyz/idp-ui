import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Plus, Save, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'ghost', 'outline', 'danger'] },
    size: { control: 'select', options: ['sm', 'default', 'lg', 'icon'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button', variant: 'default' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
};

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
};

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="default"><Plus size={14} /> Create</Button>
      <Button variant="secondary"><Save size={14} /> Save</Button>
      <Button variant="danger"><Trash2 size={14} /> Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
