import type { Meta, StoryObj } from '@storybook/react';
import StatusBar from './StatusBar';
import { WorkspaceStoryProviders } from './story-providers';

const meta: Meta<typeof StatusBar> = {
  title: 'Workspace/StatusBar',
  component: StatusBar,
  decorators: [
    (Story) => (
      <WorkspaceStoryProviders>
        <Story />
      </WorkspaceStoryProviders>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof StatusBar> = {
  args: {},
};

export const WithFeedback: StoryObj<typeof StatusBar> = {
  args: {
    commandFeedback: 'Saved mapping “Inbound → DC-East”',
  },
};
