import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  ShoppingCart,
  Package,
  RotateCcw,
  CreditCard,
  BookOpen,
  FileText,
  Truck,
  MapPin,
} from 'lucide-react';
import Sidebar from './Sidebar';
import type { NavigationSection } from './Sidebar';
import type { WorkspaceNavigationGuard } from './navigationGuard';
import { useStoryConfirmDialog } from './storybook/storyConfirmDialog';

const navigationSections: NavigationSection[] = [
  {
    title: 'Commerce',
    items: [
      { id: 'order', label: 'Order', icon: 'cart' },
      { id: 'package', label: 'Package', icon: 'package' },
      { id: 'return', label: 'Return', icon: 'return' },
      { id: 'billing', label: 'Billing', icon: 'billing' },
      { id: 'catalog', label: 'Catalog', icon: 'catalog' },
      { id: 'invoice', label: 'Invoice', icon: 'invoice' },
    ],
  },
  {
    title: 'Logistics',
    items: [
      {
        id: 'network',
        label: 'Network',
        icon: 'truck',
        children: [
          { id: 'legs', label: 'Legs', icon: 'map' },
          { id: 'routes', label: 'Routes', icon: 'map' },
        ],
      },
      { id: 'shipments', label: 'Shipments', icon: 'truck' },
    ],
  },
];

const iconMap = {
  cart: ShoppingCart,
  package: Package,
  return: RotateCcw,
  billing: CreditCard,
  catalog: BookOpen,
  invoice: FileText,
  truck: Truck,
  map: MapPin,
};

const meta: Meta<typeof Sidebar> = {
  title: 'Workspace/Sidebar',
  component: Sidebar,
};

export default meta;

export const Basic: StoryObj<typeof Sidebar> = {
  render: function SidebarDemo() {
    const [active, setActive] = useState('order');
    return (
      <div className="flex h-[420px] rounded-md border border-idpxyz-border overflow-hidden">
        <Sidebar
          width={260}
          activeFile={active}
          onFileClick={setActive}
          navigationSections={navigationSections}
          iconMap={iconMap}
        />
        <div className="flex flex-1 items-center justify-center bg-idpxyz-bg text-idpxyz-textMuted text-[13px]">
          Active: <span className="text-idpxyz-text ml-1">{active}</span>
        </div>
      </div>
    );
  },
};

/** `beforeNavigation` runs before `onFileClick` on leaf items (same contract as {@link EditorGroup}). */
export const WithNavigationGuard: StoryObj<typeof Sidebar> = {
  render: function SidebarNavigationGuardDemo() {
    const [active, setActive] = useState('order');
    const [guardOn, setGuardOn] = useState(true);
    const { ask, dialog } = useStoryConfirmDialog();

    const beforeNavigation: WorkspaceNavigationGuard = async (intent) => {
      if (!guardOn || intent.kind !== 'sidebarNav') return true;
      if (intent.navId === active) return true;
      return ask(`Leave "${active}" and open "${intent.navId}"?`);
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        <label className="flex items-center gap-2 text-[12px] text-idpxyz-text">
          <input type="checkbox" checked={guardOn} onChange={(e) => setGuardOn(e.target.checked)} />
          Require confirm before sidebar navigation
        </label>
        <div className="flex h-[420px] rounded-md border border-idpxyz-border overflow-hidden">
          <Sidebar
            width={260}
            beforeNavigation={beforeNavigation}
            activeFile={active}
            onFileClick={setActive}
            navigationSections={navigationSections}
            iconMap={iconMap}
          />
          <div className="flex flex-1 items-center justify-center bg-idpxyz-bg text-idpxyz-textMuted text-[13px]">
            Active: <span className="text-idpxyz-text ml-1">{active}</span>
          </div>
        </div>
        {dialog}
      </div>
    );
  },
};
