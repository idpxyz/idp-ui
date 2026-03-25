import { FileSearch, History, LayoutGrid, Truck, AlertTriangle } from 'lucide-react';
import type { CommandPaletteAction, RecentObject } from '@idpxyz/ui-workspace';
import { shipments, exceptions } from './data/loms';

export function buildDefaultCommandActions(params: {
  recentObjects: RecentObject[];
  onOpenPage: (navId: string) => void;
  onOpenObject: (id: string, name: string) => void;
  onToggleBottomPanel: () => void;
  onToggleRightSidebar: () => void;
  onFeedback?: (message: string) => void;
}): CommandPaletteAction[] {
  const { recentObjects, onOpenPage, onOpenObject, onToggleBottomPanel, onToggleRightSidebar, onFeedback } = params;

  const navItems: Array<{ id: string; label: string; keywords: string[] }> = [
    { id: 'ops-dashboard', label: 'Open Operations Dashboard', keywords: ['dashboard', 'ops'] },
    { id: 'shipment-monitor', label: 'Open Shipment Monitor', keywords: ['shipment', 'monitor', 'table'] },
    { id: 'exception-queue', label: 'Open Exception Queue', keywords: ['exception', 'cases'] },
    { id: 'routing', label: 'Open Routing', keywords: ['route', 'routing'] },
    { id: 'billing', label: 'Open Billing', keywords: ['billing', 'invoice'] },
    { id: 'reports', label: 'Open Reports', keywords: ['report', 'kpi'] },
    { id: 'config', label: 'Open Configuration', keywords: ['config', 'settings'] },
  ];

  const recentActions: CommandPaletteAction[] = recentObjects.slice(0, 8).map((obj) => ({
    id: `recent-${obj.id}`,
    label: `Open ${obj.name}`,
    group: 'recent',
    keywords: [obj.id.toLowerCase(), obj.name.toLowerCase(), obj.type],
    icon: History,
    run: () => {
      onOpenObject(obj.id, obj.name);
      onFeedback?.(`Executed: Open ${obj.name}`);
    },
  }));

  const objectCandidates = [
    ...shipments.slice(0, 12).map((s) => ({ id: s.id, name: s.id, kind: 'shipment' as const })),
    ...exceptions.slice(0, 8).map((e) => ({ id: e.id, name: e.id, kind: 'exception' as const })),
  ];

  const objectActions: CommandPaletteAction[] = objectCandidates.map((obj) => ({
    id: `obj-${obj.id}`,
    label: `Open ${obj.name}`,
    group: 'objects',
    keywords: [obj.id.toLowerCase(), obj.kind],
    icon: obj.kind === 'shipment' ? Truck : AlertTriangle,
    run: () => {
      onOpenObject(obj.id, obj.name);
      onFeedback?.(`Executed: Open ${obj.name}`);
    },
  }));

  const actionItems: CommandPaletteAction[] = [
    {
      id: 'action-toggle-bottom',
      label: 'Toggle Bottom Panel',
      group: 'actions',
      keywords: ['panel', 'bottom', 'events', 'logs'],
      icon: LayoutGrid,
      run: () => {
        onToggleBottomPanel();
        onFeedback?.('Executed: Toggle Bottom Panel');
      },
      hint: 'Ctrl+J',
    },
    {
      id: 'action-toggle-right',
      label: 'Toggle Right Context Panel',
      group: 'actions',
      keywords: ['panel', 'inspector', 'right'],
      icon: LayoutGrid,
      run: () => {
        onToggleRightSidebar();
        onFeedback?.('Executed: Toggle Right Context Panel');
      },
    },
  ];

  return [
    ...navItems.map((item) => ({
      id: `nav-${item.id}`,
      label: item.label,
      group: 'navigation' as const,
      keywords: item.keywords,
      icon: FileSearch,
      run: () => {
        onOpenPage(item.id);
        onFeedback?.(`Executed: ${item.label}`);
      },
    })),
    ...recentActions,
    ...objectActions,
    ...actionItems,
  ];
}
