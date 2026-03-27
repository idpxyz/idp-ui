import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@idpxyz/ui-primitives';

const meta: Meta = { title: 'Apps/DemoWeb' };
export default meta;

export const Smoke: StoryObj = {
  render: () => (
    <div className="p-6 text-idpxyz-text">
      <p className="mb-3 text-[13px] text-idpxyz-textMuted">@idpxyz/demo-web — Storybook smoke.</p>
      <Button type="button">Button</Button>
    </div>
  ),
};
