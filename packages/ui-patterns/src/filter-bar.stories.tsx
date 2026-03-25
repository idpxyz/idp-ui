import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from './filter-bar';

const meta: Meta<typeof FilterBar> = { title: 'Patterns/FilterBar', component: FilterBar };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <FilterBar
      filters={[
        { key: 'status', label: 'Status', options: [{ value: 'active', label: 'Active' }, { value: 'draft', label: 'Draft' }] },
        { key: 'env', label: 'Environment', options: [{ value: 'prod', label: 'Production' }, { value: 'staging', label: 'Staging' }] },
      ]}
      values={{}}
      onChange={() => {}}
      onSearch={() => {}}
    />
  ),
};
