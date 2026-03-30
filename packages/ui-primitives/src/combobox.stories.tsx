import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox, type ComboboxOption } from './combobox';

const options: ComboboxOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Primitives/Combobox',
  component: Combobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-[300px]">
        <Combobox
          options={options}
          value={value}
          onValueChange={setValue}
          placeholder="Select country..."
          searchPlaceholder="Search..."
          emptyText="No results"
        />
      </div>
    );
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('de');
    return (
      <div className="w-[300px]">
        <Combobox options={options} value={value} onValueChange={setValue} placeholder="Select..." />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]">
      <Combobox options={options} value="us" onValueChange={() => {}} disabled />
    </div>
  ),
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="w-[200px]">
        <Combobox options={options} value={value} onValueChange={setValue} size="sm" placeholder="Small" />
      </div>
    );
  },
};
