import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@idpxyz/ui-primitives';

const meta: Meta = { title: '__STORYBOOK_TITLE__' };
export default meta;

export const Smoke: StoryObj = {
  render: () => (
    <div className="p-6 text-vscode-text">
      <p className="mb-3 text-[13px] text-vscode-textMuted">__PACKAGE_NAME__ — Storybook smoke.</p>
      <Button type="button">Button</Button>
    </div>
  ),
};
