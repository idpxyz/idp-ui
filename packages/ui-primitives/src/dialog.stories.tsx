import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogBody,
  DialogFooter,
} from './dialog';
import { Button } from './button';

const meta: Meta = { title: 'Primitives/Dialog' };
export default meta;

export const Basic: StoryObj = {
  render: function DialogDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogClose onClose={() => setOpen(false)} />
            </DialogHeader>
            <DialogBody>
              <DialogDescription>This will apply your changes. You can still undo from the activity log.</DialogDescription>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={() => setOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};
