import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonTable, SkeletonEventList } from './skeleton';

const meta: Meta = { title: 'Patterns/Skeleton' };
export default meta;

export const Table: StoryObj = {
  render: () => <SkeletonTable rows={5} cols={4} />,
};

export const EventList: StoryObj = {
  render: () => <SkeletonEventList rows={6} />,
};
