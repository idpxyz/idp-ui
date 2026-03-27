import type { Meta, StoryObj } from '@storybook/react';

import { MoneyRangeText } from './money-range-text';

const meta: Meta<typeof MoneyRangeText> = {
  title: 'Patterns/MoneyRangeText',
  component: MoneyRangeText,
  parameters: { layout: 'padded' },
};
export default meta;

export const Basic: StoryObj<typeof MoneyRangeText> = {
  args: {
    minMinor: 1_000_00,
    maxMinor: 5_000_00,
    currency: 'USD',
    locale: 'en-US',
  },
};

export const SameBandCNY: StoryObj<typeof MoneyRangeText> = {
  name: 'CNY · zh-CN',
  args: {
    minMinor: 50_00,
    maxMinor: 120_00,
    currency: 'CNY',
    locale: 'zh-CN',
  },
};

export const OpenEndedMin: StoryObj<typeof MoneyRangeText> = {
  name: 'Missing min (null)',
  args: {
    minMinor: null,
    maxMinor: 99_99,
    currency: 'EUR',
    locale: 'de-DE',
  },
};
