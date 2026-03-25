import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, Radio, Switch } from './form-controls';

const meta: Meta = { title: 'Primitives/FormControls' };
export default meta;

export const Checkboxes: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Checkbox label="Accept terms" />
      <Checkbox label="Subscribe to newsletter" defaultChecked />
      <Checkbox label="Disabled" disabled />
    </div>
  ),
};

export const Radios: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio name="plan" label="Free" defaultChecked />
      <Radio name="plan" label="Pro" />
      <Radio name="plan" label="Enterprise" />
    </div>
  ),
};

export const Switches: StoryObj = {
  render: function SwitchDemo() {
    const [on, setOn] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Switch checked={on} onCheckedChange={setOn} label={on ? 'Enabled' : 'Disabled'} />
        <Switch checked={true} label="Always on" />
        <Switch disabled label="Disabled switch" />
      </div>
    );
  },
};
