import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './button';
import { ConfirmDialog } from './confirm-dialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Primitives/ConfirmDialog',
  component: ConfirmDialog,
};

export default meta;

export const Warning: StoryObj<typeof ConfirmDialog> = {
  render: function WarningDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-vscode-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Open warning dialog
        </Button>
        <ConfirmDialog
          open={open}
          title="Discard changes?"
          message="You have unsaved changes. Close without saving?"
          tone="warning"
          confirmLabel="Discard"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Danger: StoryObj<typeof ConfirmDialog> = {
  render: function DangerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-vscode-bg">
        <Button size="sm" type="button" variant="danger" onClick={() => setOpen(true)}>
          Open delete dialog
        </Button>
        <ConfirmDialog
          open={open}
          title="Delete shipment?"
          message="This action cannot be undone."
          tone="danger"
          confirmLabel="Delete"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};
