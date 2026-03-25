import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectOption } from './select';

const meta: Meta = { title: 'Primitives/Select' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Select style={{ width: 240 }}>
      <SelectOption value="">Choose an option...</SelectOption>
      <SelectOption value="admin">Admin</SelectOption>
      <SelectOption value="editor">Editor</SelectOption>
      <SelectOption value="viewer">Viewer</SelectOption>
    </Select>
  ),
};
