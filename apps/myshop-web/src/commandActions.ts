import type { RecentObject, CommandPaletteAction } from '@idpxyz/ui-workspace';
import { omsTabNameMap } from './navigation';

interface BuildCommandActionsOptions {
  recentObjects: RecentObject[];
  onOpenPage: (navId: string) => void;
  onOpenObject: (id: string, name: string) => void;
  onToggleBottomPanel: () => void;
  onToggleRightSidebar: () => void;
  onFeedback: (message: string) => void;
}

export function buildDefaultCommandActions({
  recentObjects,
  onOpenPage,
  onOpenObject,
  onToggleBottomPanel,
  onToggleRightSidebar,
  onFeedback,
}: BuildCommandActionsOptions): CommandPaletteAction[] {
  const actions: CommandPaletteAction[] = [];

  // Navigation actions
  Object.entries(omsTabNameMap).forEach(([id, name]) => {
    actions.push({
      id: `nav-${id}`,
      label: `打开 ${name}`,
      group: 'navigation',
      keywords: [id, name],
      run: () => onOpenPage(id),
    });
  });

  // Recent objects
  recentObjects.slice(0, 10).forEach((obj) => {
    actions.push({
      id: `recent-${obj.id}`,
      label: `打开 ${obj.name}`,
      group: 'recent',
      keywords: [obj.id, obj.name, obj.type],
      run: () => onOpenObject(obj.id, obj.name),
    });
  });

  // Layout actions
  actions.push(
    { id: 'toggle-bottom', label: '切换底部面板', group: 'actions', keywords: ['底部', '面板', 'panel'], run: onToggleBottomPanel },
    { id: 'toggle-right', label: '切换右侧检查器', group: 'actions', keywords: ['右侧', '检查器', 'sidebar'], run: onToggleRightSidebar },
  );

  // Quick actions
  actions.push(
    { id: 'new-order', label: '创建新订单', group: 'actions', keywords: ['新建', '订单', 'new', 'order'], run: () => onFeedback('创建订单功能开发中') },
    { id: 'export-orders', label: '导出订单数据', group: 'actions', keywords: ['导出', 'export'], run: () => onFeedback('导出功能开发中') },
    { id: 'refresh-data', label: '刷新数据', group: 'actions', keywords: ['刷新', 'refresh'], run: () => onFeedback('数据已刷新') },
  );

  return actions;
}
