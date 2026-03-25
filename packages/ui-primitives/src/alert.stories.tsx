import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './alert';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { variant: 'info', title: 'Information', children: 'This is an informational alert.' },
};

export const Success: Story = {
  args: { variant: 'success', title: 'Success', children: 'Operation completed successfully.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Warning', children: 'Please review before proceeding.' },
};

export const Error: Story = {
  args: { variant: 'error', title: 'Error', children: 'Something went wrong. Please try again.' },
};

export const Dismissable: Story = {
  args: { variant: 'warning', title: 'Dismissable', children: 'Click the X to dismiss.', onDismiss: () => alert('Dismissed!') },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 500 }}>
      <Alert variant="info" title="Info">Informational message</Alert>
      <Alert variant="success" title="Success">Operation successful</Alert>
      <Alert variant="warning" title="Warning">Please be careful</Alert>
      <Alert variant="error" title="Error">Something failed</Alert>
    </div>
  ),
};
