import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ActivityBar from './ActivityBar';
import { WorkspaceStoryProviders } from './story-providers';

const meta: Meta<typeof ActivityBar> = {
  title: 'Workspace/ActivityBar',
  component: ActivityBar,
  decorators: [
    (Story) => (
      <WorkspaceStoryProviders>
        <Story />
      </WorkspaceStoryProviders>
    ),
  ],
};

export default meta;

export const Basic: StoryObj<typeof ActivityBar> = {
  render: function ActivityBarDemo() {
    const [active, setActive] = useState('explorer');
    return (
      <div className="flex h-[420px] rounded-md border border-idpxyz-border overflow-hidden">
        <ActivityBar activeItem={active} onItemClick={setActive} />
        <div className="flex flex-1 items-center justify-center bg-idpxyz-bg text-idpxyz-textMuted text-[13px]">
          Active: <span className="text-idpxyz-text ml-1">{active}</span>
        </div>
      </div>
    );
  },
};
