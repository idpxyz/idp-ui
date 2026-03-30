import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditorGroup, { type EditorGroupData } from './EditorGroup';
import { useEditorGroupTabState } from './hooks/useEditorGroupTabState';
import type { WorkspaceNavigationGuard } from './navigationGuard';
import { formatWorkspaceNavigationIntentForStory, useStoryConfirmDialog } from './storybook/storyConfirmDialog';

const meta: Meta = {
  title: 'Workspace/EditorGroup',
  parameters: {
    docs: {
      description: {
        component: `
多编辑器组、焦点组、tab 列表由**宿主**维护。\`EditorGroup\` 只负责展示与交互回调。

**宿主约定（分屏 / 持久化 / preserve tab）** 见包内 **\`HOSTING.md\`**（与本包 \`package.json\` 同级）。

要点：**不要用 \`display: contents\` 包分屏格**；格子上用 \`onPointerDownCapture\` 设置当前焦点组；\`group.id\` 全局唯一且自增 id 与持久化对齐；\`preserveInactiveTabContent\` 时配合 \`useWorkspaceTabPanel\` 门控副作用。
`,
      },
    },
  },
};
export default meta;

export const Basic: StoryObj = {
  render: function EditorGroupDemo() {
    const {
      group,
      setGroup,
      onTabClose,
      onTabPin,
      onCloseOthers,
      onCloseToRight,
      onCloseAll,
      onTabReorder,
      onReopenClosed,
    } = useEditorGroupTabState({
      id: 'main',
      tabs: [
        { id: 'contracts', name: 'Contracts' },
        { id: 'mappings', name: 'Mappings' },
        { id: 'pipelines', name: 'Pipelines' },
      ],
      activeTab: 'contracts',
    });

    return (
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', border: '1px solid #3c3c3c', borderRadius: 4 }}>
        <EditorGroup
          group={group}
          isActive={true}
          showSplitButtons={false}
          onActivate={() => {}}
          onTabClick={(tabId) => setGroup((g) => ({ ...g, activeTab: tabId }))}
          onTabClose={onTabClose}
          onTabPin={onTabPin}
          onCloseOthers={onCloseOthers}
          onCloseToRight={onCloseToRight}
          onCloseAll={onCloseAll}
          onReopenClosed={onReopenClosed}
          onTabReorder={onTabReorder}
          onSplitRight={() => {}}
          onSplitDown={() => {}}
          renderContent={(tabId) => (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#858585', fontSize: 14 }}>
              Content for: {tabId}
            </div>
          )}
          emptyStateContent={
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#858585' }}>
              No tabs open
            </div>
          }
        />
      </div>
    );
  },
};

/**
 * `beforeNavigation` runs before tab switch / close / bulk close. Return `false` (or Promise→false) to cancel.
 * Uses {@link ConfirmDialog} via story helper — workspace stays headless; apps supply their own UI (e.g. parcel-web).
 */
export const WithNavigationGuard: StoryObj = {
  render: function EditorGroupNavigationGuardDemo() {
    const [simulateDirty, setSimulateDirty] = useState(true);
    const { ask, dialog } = useStoryConfirmDialog();

    const {
      group,
      setGroup,
      onTabClose,
      onTabPin,
      onCloseOthers,
      onCloseToRight,
      onCloseAll,
      onTabReorder,
      onReopenClosed,
    } = useEditorGroupTabState({
      id: 'main',
      tabs: [
        { id: 'contracts', name: 'Contracts', modified: simulateDirty },
        { id: 'mappings', name: 'Mappings' },
        { id: 'pipelines', name: 'Pipelines' },
      ],
      activeTab: 'contracts',
    });

    const beforeNavigation: WorkspaceNavigationGuard = async (intent) => {
      if (!simulateDirty) return true;
      return ask(formatWorkspaceNavigationIntentForStory(intent));
    };

    return (
      <div className="flex flex-col gap-3 p-2">
        <label className="flex items-center gap-2 text-[12px] text-idpxyz-text">
          <input
            type="checkbox"
            checked={simulateDirty}
            onChange={(e) => setSimulateDirty(e.target.checked)}
          />
          Simulate unsaved state (guard runs when checked)
        </label>
        <div style={{ height: 400, display: 'flex', flexDirection: 'column', border: '1px solid #3c3c3c', borderRadius: 4 }}>
          <EditorGroup
            group={group}
            isActive={true}
            showSplitButtons={false}
            beforeNavigation={beforeNavigation}
            onActivate={() => {}}
            onTabClick={(tabId) => setGroup((g) => ({ ...g, activeTab: tabId }))}
            onTabClose={onTabClose}
            onTabPin={onTabPin}
            onCloseOthers={onCloseOthers}
            onCloseToRight={onCloseToRight}
            onCloseAll={onCloseAll}
            onReopenClosed={onReopenClosed}
            onTabReorder={onTabReorder}
            onSplitRight={() => {}}
            onSplitDown={() => {}}
            renderContent={(tabId) => (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#858585', fontSize: 14 }}>
                Content for: {tabId}
              </div>
            )}
            emptyStateContent={
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#858585' }}>
                No tabs open
              </div>
            }
          />
        </div>
        {dialog}
      </div>
    );
  },
};

/**
 * 分屏宿主最小示例（与 Parcel / LOMS App 一致的模式）：
 * - 每格 `Fragment` + `key={group.id}`，**不要**用 `display: contents` 包一整格
 * - 格容器 `onPointerDownCapture` → 设置当前焦点组
 * - `clickTab` 只更新 **一个** group（例如 `findIndex` 后替换一项）
 */
export const SplitTwoPanes: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          '左右两组独立 `activeTab`；点击某一组 tab 只改该组。焦点环 `isActive` 随 `activeGroupId` 变化。',
      },
    },
  },
  render: function SplitTwoPanesDemo() {
    const [groups, setGroups] = useState<EditorGroupData[]>([
      {
        id: 'group-0',
        tabs: [
          { id: 'left-a', name: 'Left A' },
          { id: 'left-b', name: 'Left B' },
        ],
        activeTab: 'left-a',
      },
      {
        id: 'group-1',
        tabs: [
          { id: 'right-x', name: 'Right X' },
          { id: 'right-y', name: 'Right Y' },
        ],
        activeTab: 'right-x',
      },
    ]);
    const [activeGroupId, setActiveGroupId] = useState('group-0');

    const clickTab = (groupId: string, tabId: string) => {
      setGroups((prev) => {
        const idx = prev.findIndex((g) => g.id === groupId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...prev[idx], activeTab: tabId };
        return next;
      });
      setActiveGroupId(groupId);
    };

    return (
      <div className="flex flex-row flex-1 min-h-0 h-[420px] border border-idpxyz-border rounded overflow-hidden bg-idpxyz-editor">
        {groups.map((group) => (
          <Fragment key={group.id}>
            <div
              className="flex flex-col min-h-0 min-w-0 border-r border-idpxyz-border last:border-r-0"
              style={{ flex: '1 1 50%' }}
              onPointerDownCapture={() => setActiveGroupId(group.id)}
            >
              <EditorGroup
                key={group.id}
                group={group}
                isActive={group.id === activeGroupId}
                showSplitButtons={false}
                onActivate={() => setActiveGroupId(group.id)}
                onTabClick={(tabId) => clickTab(group.id, tabId)}
                onTabClose={() => {}}
                onTabPin={() => {}}
                onCloseOthers={() => {}}
                onCloseToRight={() => {}}
                onCloseAll={() => {}}
                onTabReorder={() => {}}
                onReopenClosed={() => {}}
                onSplitRight={() => {}}
                onSplitDown={() => {}}
                renderContent={(tabId) => (
                  <div className="flex flex-1 min-h-0 items-center justify-center text-idpxyz-textMuted text-[13px]">
                    Pane {group.id} — tab {tabId}
                  </div>
                )}
                emptyStateContent={null}
              />
            </div>
          </Fragment>
        ))}
      </div>
    );
  },
};
