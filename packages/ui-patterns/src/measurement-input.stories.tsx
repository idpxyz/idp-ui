import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { MeasurementInput, type MeasurementUnitOption } from './measurement-input';

const weightUnits: MeasurementUnitOption[] = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
  { value: 'g', label: 'g' },
];

const dimUnits: MeasurementUnitOption[] = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
];

const meta: Meta<typeof MeasurementInput> = {
  title: 'Patterns/MeasurementInput',
  component: MeasurementInput,
  parameters: { layout: 'padded' },
};
export default meta;

export const Weight: StoryObj<typeof MeasurementInput> = {
  render: function WeightDemo() {
    const [amount, setAmount] = useState<number | null>(2.5);
    const [unit, setUnit] = useState('kg');
    return (
      <div className="max-w-xs text-idpxyz-text">
        <MeasurementInput
          amount={amount}
          unit={unit}
          units={weightUnits}
          kind="weight"
          onChange={({ amount: a, unit: u }) => {
            setAmount(a);
            setUnit(u);
          }}
        />
        <p className="mt-2 text-[11px] text-idpxyz-textMuted tabular-nums">
          state: {amount ?? 'null'} {unit} (convert to g in your app)
        </p>
      </div>
    );
  },
};

export const Length: StoryObj<typeof MeasurementInput> = {
  render: function LengthDemo() {
    const [amount, setAmount] = useState<number | null>(30);
    const [unit, setUnit] = useState('cm');
    return (
      <div className="max-w-xs text-idpxyz-text">
        <MeasurementInput
          amount={amount}
          unit={unit}
          units={dimUnits}
          kind="length"
          onChange={({ amount: a, unit: u }) => {
            setAmount(a);
            setUnit(u);
          }}
        />
        <p className="mt-2 text-[11px] text-idpxyz-textMuted tabular-nums">
          state: {amount ?? 'null'} {unit}
        </p>
      </div>
    );
  },
};
