import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar, FilterChip, FilterGroup, FilterSearch } from './filter-bar';

const meta: Meta<typeof FilterBar> = { title: 'Patterns/FilterBar', component: FilterBar };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <FilterBar>
      <FilterSearch placeholder="Search…" defaultValue="" />
      <FilterGroup>
        <FilterChip active>Status: Active</FilterChip>
        <FilterChip>Environment</FilterChip>
      </FilterGroup>
    </FilterBar>
  ),
};
