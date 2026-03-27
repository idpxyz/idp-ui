import type { Meta, StoryObj } from '@storybook/react';
import { LayoutDashboard, Settings, Truck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@idpxyz/ui-primitives';
import CommandPalette from './CommandPalette';
import type { CommandPaletteAction } from './CommandPalette';

const sampleActions: CommandPaletteAction[] = [
  {
    id: 'nav-ops',
    label: 'Go to Operations',
    group: 'navigation',
    keywords: ['ops', 'home'],
    icon: LayoutDashboard,
    run: () => {},
  },
  {
    id: 'recent-1',
    label: 'Shipment SHP-2024-0142',
    group: 'recent',
    keywords: ['shp'],
    hint: 'Recent',
    icon: Truck,
    run: () => {},
  },
  {
    id: 'obj-order',
    label: 'Order ORD-9912',
    group: 'objects',
    keywords: ['order'],
    run: () => {},
  },
  {
    id: 'act-settings',
    label: 'Open Settings',
    group: 'actions',
    keywords: ['preferences'],
    icon: Settings,
    run: () => {},
  },
];

const meta: Meta<typeof CommandPalette> = {
  title: 'Workspace/CommandPalette',
  component: CommandPalette,
};

export default meta;

export const Interactive: StoryObj<typeof CommandPalette> = {
  render: function CommandPaletteDemo() {
    const [open, setOpen] = useState(false);
    return (
      <div className="min-h-[360px] bg-idpxyz-bg rounded-md border border-idpxyz-border p-4">
        <Button type="button" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <p className="mt-3 text-[12px] text-idpxyz-textMuted">
          When open: Esc to close, ↑↓ to move, Enter to run.
        </p>
        <CommandPalette open={open} onClose={() => setOpen(false)} actions={sampleActions} />
      </div>
    );
  },
};

export const Open: StoryObj<typeof CommandPalette> = {
  render: function CommandPaletteOpenDemo() {
    const [open, setOpen] = useState(true);
    return (
      <div className="min-h-[420px] bg-idpxyz-bg rounded-md border border-idpxyz-border p-4 relative">
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          Toggle
        </Button>
        <CommandPalette open={open} onClose={() => setOpen(false)} actions={sampleActions} />
      </div>
    );
  },
};
