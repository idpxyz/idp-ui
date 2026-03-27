import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from './drawer';
import { Button } from './button';

const meta: Meta = { title: 'Primitives/Drawer' };
export default meta;

export const Right: StoryObj = {
  render: function DrawerDemo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer open={open} onOpenChange={setOpen} side="right">
          <DrawerHeader>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Drawer Title</div>
          </DrawerHeader>
          <DrawerBody>
            <p style={{ fontSize: 13, color: '#aaa' }}>Drawer content goes here. This slides in from the right side.</p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="default">Save</Button>
          </DrawerFooter>
        </Drawer>
      </>
    );
  },
};
