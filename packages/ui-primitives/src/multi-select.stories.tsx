import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultiSelect } from './multi-select';
import type { ComboboxOption } from './combobox';

const options: ComboboxOption[] = [
  { value: 'portal', label: 'Customer Portal' },
  { value: 'api', label: 'API Integration' },
  { value: 'internal', label: 'Internal / Agent' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'wholesale', label: 'Wholesale' },
];

const meta: Meta<typeof MultiSelect> = {
  title: 'Primitives/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-[300px]">
        <MultiSelect options={options} value={value} onValueChange={setValue} placeholder="Select channels..." />
      </div>
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['portal', 'api']);
    return (
      <div className="w-[300px]">
        <MultiSelect options={options} value={value} onValueChange={setValue} />
      </div>
    );
  },
};

export const MaxDisplay: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['portal', 'api', 'internal', 'marketplace']);
    return (
      <div className="w-[300px]">
        <MultiSelect options={options} value={value} onValueChange={setValue} maxDisplay={2} />
      </div>
    );
  },
};
