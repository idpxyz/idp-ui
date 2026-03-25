import type { Meta, StoryObj } from '@storybook/react';
import { Progress, Spinner } from './progress';

const meta: Meta = { title: 'Primitives/Progress' };
export default meta;

export const Bars: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Progress value={25} showLabel />
      <Progress value={50} variant="success" showLabel />
      <Progress value={75} variant="warning" showLabel />
      <Progress value={90} variant="error" showLabel />
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <Progress value={60} size="sm" />
      <Progress value={60} size="md" />
      <Progress value={60} size="lg" />
    </div>
  ),
};

export const Spinners: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};
