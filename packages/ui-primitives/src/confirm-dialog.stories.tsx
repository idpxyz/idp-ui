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
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
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
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
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

export const Neutral: StoryObj<typeof ConfirmDialog> = {
  render: function NeutralDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" variant="secondary" onClick={() => setOpen(true)}>
          Open neutral dialog
        </Button>
        <ConfirmDialog
          open={open}
          title="Leave this page?"
          message="Your cart will be saved for later."
          tone="neutral"
          confirmLabel="Leave"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Info: StoryObj<typeof ConfirmDialog> = {
  render: function InfoDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Open info dialog
        </Button>
        <ConfirmDialog
          open={open}
          title="New version available"
          message="A newer build is ready. Reload to apply updates."
          tone="info"
          confirmLabel="Reload"
          cancelLabel="Later"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const Success: StoryObj<typeof ConfirmDialog> = {
  render: function SuccessDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Open success dialog
        </Button>
        <ConfirmDialog
          open={open}
          title="Publish now?"
          message="Your changes will be visible to all viewers."
          tone="success"
          confirmLabel="Publish"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const AsyncConfirm: StoryObj<typeof ConfirmDialog> = {
  render: function AsyncDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Open async confirm
        </Button>
        <ConfirmDialog
          open={open}
          title="Save to server?"
          message="Confirm runs a fake 1.2s request; buttons show loading and cannot dismiss until done."
          tone="info"
          confirmLabel="Save"
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 1200));
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const NonDismissable: StoryObj<typeof ConfirmDialog> = {
  render: function NonDismissableDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" variant="danger" onClick={() => setOpen(true)}>
          Irreversible — must choose
        </Button>
        <ConfirmDialog
          open={open}
          title="Permanently delete account?"
          message="Overlay click and Escape are disabled. Use Cancel or Delete."
          tone="danger"
          confirmLabel="Delete"
          dismissable={false}
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const ExtraContentAndHideIcon: StoryObj<typeof ConfirmDialog> = {
  render: function ExtraDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Extra body + no icon
        </Button>
        <ConfirmDialog
          open={open}
          title="Rename workspace"
          message="Choose a new display name."
          tone="neutral"
          hideIcon
          extraContent={<input className="mt-0 w-full rounded border border-idpxyz-border bg-idpxyz-inputBg px-2 py-1 text-[12px] text-idpxyz-text" placeholder="Name" />}
          confirmLabel="Rename"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const CustomFooter: StoryObj<typeof ConfirmDialog> = {
  render: function CustomFooterDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[280px] p-4 bg-idpxyz-bg">
        <Button size="sm" type="button" onClick={() => setOpen(true)}>
          Three actions (renderFooter)
        </Button>
        <ConfirmDialog
          open={open}
          title="Save conflict"
          message="This file was modified elsewhere. What should we do?"
          tone="warning"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          renderFooter={({ onCancel, onConfirm, pending, confirmVariant }) => (
            <>
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
                Abort
              </Button>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={pending}>
                Overwrite
              </Button>
              <Button variant={confirmVariant} size="sm" onClick={onConfirm} disabled={pending}>
                Merge
              </Button>
            </>
          )}
        />
      </div>
    );
  },
};
