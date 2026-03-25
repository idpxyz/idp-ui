import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './tooltip';
import { Button } from './button';

const meta: Meta = { title: 'Primitives/Tooltip' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, padding: 40 }}>
      <Tooltip content="This is a tooltip" side="top"><Button>Hover me (top)</Button></Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom"><Button>Bottom</Button></Tooltip>
      <Tooltip content="Left tooltip" side="left"><Button>Left</Button></Tooltip>
      <Tooltip content="Right tooltip" side="right"><Button>Right</Button></Tooltip>
    </div>
  ),
};
