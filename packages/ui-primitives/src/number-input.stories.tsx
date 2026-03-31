import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './number-input';

const meta: Meta<typeof NumberInput> = {
  title: 'Primitives/NumberInput',
  component: NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'Committed `number | null` with `int` vs `decimal` mode, optional `min`/`max`, `decimalPlaces`, and ↑/↓ nudging. Default uses text + commit on blur/Enter (reliable partial input). Set `nativeSpinner` for `type="number"`.',
      },
    },
  },
};
export default meta;

export const Integer: StoryObj<typeof NumberInput> = {
  name: 'Integer',
  render: function Demo() {
    const [v, setV] = useState<number | null>(42);
    return (
      <div className="max-w-xs space-y-2 p-4">
        <NumberInput mode="int" value={v} onValueChange={setV} min={0} max={100} step={1} placeholder="0–100" />
        <p className="text-[11px] text-idpxyz-textMuted">value: {v === null ? 'null' : v}</p>
      </div>
    );
  },
};

export const Decimal: StoryObj<typeof NumberInput> = {
  name: 'Decimal + decimalPlaces',
  render: function Demo() {
    const [v, setV] = useState<number | null>(3.14159);
    return (
      <div className="max-w-xs space-y-2 p-4">
        <NumberInput
          mode="decimal"
          value={v}
          onValueChange={setV}
          decimalPlaces={2}
          min={-10}
          max={99.99}
          step={0.01}
          placeholder="Amount"
        />
        <p className="text-[11px] text-idpxyz-textMuted">value: {v === null ? 'null' : v}</p>
      </div>
    );
  },
};

export const NativeSpinner: StoryObj<typeof NumberInput> = {
  name: 'Native spinner (type=number)',
  render: function Demo() {
    const [v, setV] = useState<number | null>(5);
    return (
      <div className="max-w-xs space-y-2 p-4">
        <NumberInput mode="int" nativeSpinner value={v} onValueChange={setV} min={0} max={10} step={1} />
        <p className="text-[11px] text-idpxyz-textMuted">value: {v === null ? 'null' : v}</p>
      </div>
    );
  },
};

export const Empty: StoryObj<typeof NumberInput> = {
  name: 'Empty (null)',
  render: function Demo() {
    const [v, setV] = useState<number | null>(null);
    return (
      <div className="max-w-xs p-4">
        <NumberInput mode="decimal" value={v} onValueChange={setV} placeholder="Optional" />
        <p className="mt-2 text-[11px] text-idpxyz-textMuted">value: {v === null ? 'null' : v}</p>
      </div>
    );
  },
};
