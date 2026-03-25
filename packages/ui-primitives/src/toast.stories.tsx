import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, useToast } from './toast';
import { Button } from './button';

const meta: Meta = { title: 'Primitives/Toast' };
export default meta;

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button onClick={() => toast({ variant: 'info', title: 'Info', description: 'This is informational' })}>Info</Button>
      <Button onClick={() => toast({ variant: 'success', title: 'Success', description: 'Operation completed' })}>Success</Button>
      <Button onClick={() => toast({ variant: 'warning', title: 'Warning', description: 'Please review' })}>Warning</Button>
      <Button onClick={() => toast({ variant: 'error', title: 'Error', description: 'Something went wrong' })}>Error</Button>
    </div>
  );
}

export const Interactive: StoryObj = {
  render: () => (
    <Toaster>
      <ToastDemo />
    </Toaster>
  ),
};
