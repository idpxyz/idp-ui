import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './breadcrumb';

const meta: Meta = { title: 'Primitives/Breadcrumb' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Breadcrumb items={[
      { label: 'Home', onClick: () => {} },
      { label: 'Integrations', onClick: () => {} },
      { label: 'Order Sync v2' },
    ]} />
  ),
};

export const WithHref: StoryObj = {
  render: () => (
    <Breadcrumb items={[
      { label: 'Dashboard', href: '/' },
      { label: 'Releases', href: '/releases' },
      { label: 'v1.2.0', href: '/releases/v1.2.0' },
      { label: 'Snapshot' },
    ]} />
  ),
};
