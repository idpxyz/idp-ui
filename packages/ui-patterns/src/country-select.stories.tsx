import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { CountrySelect, type CountryOption } from './country-select';

const sample: CountryOption[] = [
  { code: 'US', label: 'United States' },
  { code: 'CN', label: 'China' },
  { code: 'DE', label: 'Germany' },
  { code: 'JP', label: 'Japan' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'BR', label: 'Brazil', disabled: true },
];

const meta: Meta<typeof CountrySelect> = {
  title: 'Patterns/CountrySelect',
  component: CountrySelect,
  parameters: { layout: 'padded' },
};
export default meta;

export const Basic: StoryObj<typeof CountrySelect> = {
  render: function Demo() {
    const [v, setV] = useState<string | undefined>('CN');
    return (
      <div className="w-72 text-idpxyz-text">
        <p className="mb-2 text-[11px] text-idpxyz-textMuted">
          Pass <code className="rounded bg-idpxyz-hover px-1">options</code> from your API (ISO 3166-1 alpha-2 + label).
        </p>
        <CountrySelect options={sample} value={v} onValueChange={setV} />
        <p className="mt-2 text-[11px] text-idpxyz-textMuted tabular-nums">value: {v ?? '∅'}</p>
      </div>
    );
  },
};
