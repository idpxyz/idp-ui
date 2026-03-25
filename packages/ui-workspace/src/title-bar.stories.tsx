import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TitleBar from './TitleBar';

const meta: Meta<typeof TitleBar> = {
  title: 'Workspace/TitleBar',
  component: TitleBar,
};

export default meta;

export const Basic: StoryObj<typeof TitleBar> = {
  render: function TitleBarDemo() {
    const [rightSidebar, setRightSidebar] = useState(true);
    const [bottomPanel, setBottomPanel] = useState(false);
    return (
      <div className="w-full min-w-[960px] rounded-md border border-vscode-border overflow-hidden">
        <TitleBar
          rightSidebarVisible={rightSidebar}
          onToggleRightSidebar={() => setRightSidebar((v) => !v)}
          bottomPanelVisible={bottomPanel}
          onToggleBottomPanel={() => setBottomPanel((v) => !v)}
        />
        <div className="h-24 bg-vscode-bg flex items-center justify-center text-vscode-textMuted text-[12px]">
          Toggle layout buttons on the right; main menu and search are non-functional demos.
        </div>
      </div>
    );
  },
};

export const WithRecentObjects: StoryObj<typeof TitleBar> = {
  render: function TitleBarRecentDemo() {
    const [rightSidebar, setRightSidebar] = useState(true);
    const [bottomPanel, setBottomPanel] = useState(false);
    return (
      <div className="w-full min-w-[960px] rounded-md border border-vscode-border overflow-hidden">
        <TitleBar
          rightSidebarVisible={rightSidebar}
          onToggleRightSidebar={() => setRightSidebar((v) => !v)}
          bottomPanelVisible={bottomPanel}
          onToggleBottomPanel={() => setBottomPanel((v) => !v)}
          recentObjects={[
            { id: '1', name: 'SHP-2024-001', type: 'shipment' },
            { id: '2', name: 'ORD-8821', type: 'order' },
            { id: '3', name: 'Case #4412', type: 'exception' },
          ]}
          onOpenRecentObject={() => {}}
        />
        <div className="h-20 bg-vscode-bg flex items-center justify-center text-vscode-textMuted text-[12px]">
          Open the clock menu for recent objects.
        </div>
      </div>
    );
  },
};
