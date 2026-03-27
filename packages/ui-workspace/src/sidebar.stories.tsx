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
