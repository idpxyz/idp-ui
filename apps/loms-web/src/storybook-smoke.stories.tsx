import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@idpxyz/ui-primitives';

const meta: Meta = { title: 'Apps/LomsWeb' };
export default meta;

/** Confirms workspace UI packages resolve when Storybook compiles app sources. */
export const Smoke: StoryObj = {
  render: () => (
    <div className="p-6 text-idpxyz-text">
      <p className="mb-3 text-[13px] text-idpxyz-textMuted">Workspace packages resolve in Storybook.</p>
      <Button type="button">Button</Button>
    </div>
  ),
};
