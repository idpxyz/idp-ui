import type { Meta, StoryObj } from '@storybook/react';
import EditorGroup from './EditorGroup';
import { useEditorGroupTabState } from './hooks/useEditorGroupTabState';

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
