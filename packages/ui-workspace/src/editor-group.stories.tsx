import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditorGroup from './EditorGroup';
import { useEditorGroupTabState } from './hooks/useEditorGroupTabState';
import type { WorkspaceNavigationGuard } from './navigationGuard';
import { formatWorkspaceNavigationIntentForStory, useStoryConfirmDialog } from './storybook/storyConfirmDialog';

const meta: Meta = { title: 'Workspace/EditorGroup' };
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
