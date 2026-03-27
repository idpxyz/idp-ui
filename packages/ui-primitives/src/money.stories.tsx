import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { useEffect, useRef, useState } from 'react';
import type { FormatMoneyMinorOptions } from '@idpxyz/ui-utils';
import { formatMoneyMinor, getDecimalSeparator, ISO4217_MINOR_DIGITS } from '@idpxyz/ui-utils';

import { FormField, Label } from './form';
import { MoneyInput, type MoneyInputProps } from './money-input';
import { MoneyText } from './money-text';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

/** All ISO 4217 alphabetic codes from generated data (same as `currencyMinorDigits` lookup). */
const PLAYGROUND_CURRENCIES = Object.keys(ISO4217_MINOR_DIGITS).sort();

/**
 * When **sync locale → currency** is on, changing `locale` sets `currency` to this **hint** (only for known tags).
 * Locales use **BCP 47** (language/region), not ISO 4217.
 */
const LOCALE_DEFAULT_CURRENCY: Partial<Record<string, keyof typeof ISO4217_MINOR_DIGITS>> = {
  'zh-CN': 'CNY',
  'zh-Hans-CN': 'CNY',
  'zh-Hant-TW': 'TWD',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'en-SG': 'SGD',
  'en-HK': 'HKD',
  'de-DE': 'EUR',
  'de-AT': 'EUR',
  'de-CH': 'CHF',
  'fr-FR': 'EUR',
  'fr-CH': 'CHF',
  'fr-CA': 'CAD',
  'it-IT': 'EUR',
  'es-ES': 'EUR',
  'es-MX': 'MXN',
  'es-AR': 'ARS',
  'pt-BR': 'BRL',
  'pt-PT': 'EUR',
  'ja-JP': 'JPY',
  'ko-KR': 'KRW',
  'ru-RU': 'RUB',
  'pl-PL': 'PLN',
  'nl-NL': 'EUR',
  'nl-BE': 'EUR',
  'sv-SE': 'SEK',
  'da-DK': 'DKK',
  'fi-FI': 'EUR',
  'nb-NO': 'NOK',
  'th-TH': 'THB',
  'vi-VN': 'VND',
  'id-ID': 'IDR',
  'ms-MY': 'MYR',
  'hi-IN': 'INR',
  'ar-SA': 'SAR',
  'tr-TR': 'TRY',
  'uk-UA': 'UAH',
  'cs-CZ': 'CZK',
  'hu-HU': 'HUF',
  'ro-RO': 'RON',
  'el-GR': 'EUR',
  'he-IL': 'ILS',
};

type MoneyPlaygroundArgs = Omit<MoneyInputProps, 'onValueMinorChange'> & {
  /** Storybook-only: when true, changing `locale` updates `currency` in Controls (see `LOCALE_DEFAULT_CURRENCY`). */
  syncCurrencyToLocale?: boolean;
  /** Story-only: drives the formatted hint line under the input (`formatMoneyMinor`). */
  formatNotation?: 'standard' | 'compact';
  /** Story-only: `accounting` uses parentheses for negatives in some locales. */
  formatCurrencySign?: 'standard' | 'accounting';
};

function formatHintFromArgs(
  notation: MoneyPlaygroundArgs['formatNotation'],
  currencySign: MoneyPlaygroundArgs['formatCurrencySign']
): FormatMoneyMinorOptions | undefined {
  const o: FormatMoneyMinorOptions = {};
  if (notation === 'compact') {
    o.notation = 'compact';
    o.compactDisplay = 'short';
  }
  if (currencySign === 'accounting') o.currencySign = 'accounting';
  return Object.keys(o).length > 0 ? o : undefined;
}

type MoneyPlaygroundViewProps = {
  moneyInputProps: Omit<MoneyInputProps, 'onValueMinorChange'>;
  syncCurrencyToLocale: boolean;
  formatHintOptions?: FormatMoneyMinorOptions;
  updateArgs: (patch: Partial<MoneyPlaygroundArgs>) => void;
};

/** No Storybook preview hooks here — `useArgs` runs only in the story `render` function. */
function MoneyPlaygroundView({
  moneyInputProps,
  syncCurrencyToLocale,
  formatHintOptions,
  updateArgs,
}: MoneyPlaygroundViewProps) {
  const { valueMinor: valueMinorFromControls, locale, currency } = moneyInputProps;
  const localePrevRef = useRef<string | undefined>(undefined);
  const [v, setV] = useState<number | null>(valueMinorFromControls);

  useEffect(() => {
    setV(valueMinorFromControls);
  }, [valueMinorFromControls]);

  useEffect(() => {
    const loc = locale ?? '';
    const prev = localePrevRef.current;
    if (prev === undefined) {
      localePrevRef.current = loc;
      return;
    }
    if (loc === prev) return;
    localePrevRef.current = loc;
    if (!syncCurrencyToLocale) return;
    const next = LOCALE_DEFAULT_CURRENCY[loc];
    if (next && next !== currency && ISO4217_MINOR_DIGITS[next] !== undefined) {
      updateArgs({ currency: next });
    }
  }, [locale, currency, syncCurrencyToLocale, updateArgs]);

  return (
    <div className="flex max-w-md flex-col gap-2 text-idpxyz-text">
      <MoneyInput {...moneyInputProps} valueMinor={v} onValueMinorChange={setV} />
      <p className="text-[11px] text-idpxyz-textMuted tabular-nums">
        minor {v ?? 'null'} · sep <code className="text-idpxyz-text">{getDecimalSeparator(locale)}</code>
        {v !== null ? ` · ${formatMoneyMinor(v, currency, locale, formatHintOptions)}` : ''}
      </p>
    </div>
  );
}

const meta = {
  title: 'Primitives/Money',
  /**
   * Omit `component` so Controls lists every {@link MoneyPlaygroundArgs} field (incl. Story-only props).
   * `component: MoneyInput` makes docgen-only props win and can hide extra args in the Controls panel.
   */
  parameters: { layout: 'padded' },
  argTypes: {
    valueMinor: {
      control: 'number',
      description: 'Minor units (e.g. 9988 = ¥99.88 for CNY)',
    },
    syncCurrencyToLocale: {
      control: 'boolean',
      table: { category: 'Story' },
      description:
        'When **on**, changing **locale** also sets **currency** to a typical default in Controls. When **off**, only formatting/parsing locale changes; **currency** stays as set.',
    },
    currency: {
      control: 'select',
      options: [...PLAYGROUND_CURRENCIES],
      description:
        'ISO 4217 alphabetic code — full list from generated `ISO4217_MINOR_DIGITS`. If **sync locale → currency** is on, changing **locale** may suggest a default when the tag is in the hint map.',
    },
    locale: {
      control: 'text',
      description:
        '**BCP 47** locale tag (Unicode / RFC 5646), e.g. `en-US`, `de-DE`, `zh-Hans-CN`. This is **not** ISO 4217 (currency); type any valid tag your runtime `Intl` supports.',
    },
    currencyPrefix: {
      control: 'inline-radio',
      options: ['code', 'symbol'],
    },
    currencySymbolDisplay: {
      control: 'inline-radio',
      options: ['narrowSymbol', 'symbol', 'code', 'name'],
    },
    minMinor: { control: 'number', description: 'Clamp committed value (inclusive); leave empty for no floor.' },
    maxMinor: { control: 'number', description: 'Clamp committed value (inclusive); leave empty for no ceiling.' },
    formatNotation: {
      control: 'inline-radio',
      options: ['standard', 'compact'],
      table: { category: 'Story' },
      description: 'Story hint row only: `formatMoneyMinor` `notation`.',
    },
    formatCurrencySign: {
      control: 'inline-radio',
      options: ['standard', 'accounting'],
      table: { category: 'Story' },
      description: 'Story hint row only: `formatMoneyMinor` `currencySign`.',
    },
    showCurrencyBadge: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    placeholder: { control: 'text' },
    id: { table: { disable: true } },
    className: { table: { disable: true } },
    'aria-label': { table: { disable: true } },
  },
  args: {
    id: 'money-playground',
    syncCurrencyToLocale: true,
    formatNotation: 'standard' as const,
    formatCurrencySign: 'standard' as const,
    valueMinor: 9988,
    currency: 'CNY',
    locale: 'zh-CN',
    currencyPrefix: 'code' as const,
    currencySymbolDisplay: 'narrowSymbol' as const,
    showCurrencyBadge: true,
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<MoneyPlaygroundArgs>;

export default meta;
type Story = StoryObj<MoneyPlaygroundArgs>;

/** Use **Controls** to try currency, locale, prefix, disabled, etc. */
export const Playground: Story = {
  /** Sort before “Contract & input” so the default story is not the one with `controls.disable`. */
  name: '1 · Playground (Controls)',
  parameters: {
    controls: { disable: false, expanded: true },
    docs: {
      description: {
        story: 'Select this story to use the **Controls** panel. Other Money stories disable Controls on purpose.',
      },
    },
  },
  render(args) {
    const {
      syncCurrencyToLocale = true,
      formatNotation = 'standard',
      formatCurrencySign = 'standard',
      ...moneyInputProps
    } = args;
    const [, updateArgs] = useArgs<MoneyPlaygroundArgs>();
    const formatHintOptions = formatHintFromArgs(formatNotation, formatCurrencySign);
    return (
      <MoneyPlaygroundView
        moneyInputProps={moneyInputProps}
        syncCurrencyToLocale={syncCurrencyToLocale}
        formatHintOptions={formatHintOptions}
        updateArgs={updateArgs}
      />
    );
  },
};

/**
 * Default story id `primitives-money--basic`. **Contract:** wire `amountMinor` (integer) + ISO `currency`;
 * server owns rounding/tax/FX; UI uses `MoneyText` / `formatMoneyMinor` for display and `MoneyInput` to edit
 * (blur/Enter commits; invalid reverts). Locale drives `Intl`, placeholder, and `1.234,56` vs `1,234.56` parsing.
 */
export const Basic: StoryObj = {
  name: 'Contract & input',
  parameters: { controls: { disable: true } },
  render: function MoneyDemo() {
    const [usd, setUsd] = useState<number | null>(123_45);
    const [jpy, setJpy] = useState<number | null>(12_34);
    const [eur, setEur] = useState<number | null>(199_99);
    const [cny, setCny] = useState<number | null>(12_345_67);
    return (
      <div className="flex max-w-lg flex-col gap-8 text-idpxyz-text">
        <div className="space-y-2 text-[12px] text-idpxyz-textMuted leading-relaxed">
          <p>
            Persist <strong>minor units</strong> + <strong>currency code</strong>. Use <code className="rounded bg-idpxyz-hover px-1">MoneyText</code> /
            <code className="rounded bg-idpxyz-hover px-1">formatMoneyMinor</code> for read-only,{' '}
            <code className="rounded bg-idpxyz-hover px-1">MoneyInput</code> for forms.
          </p>
        </div>
        <FormField>
          <Label htmlFor="m-usd">USD · en-US</Label>
          <MoneyInput id="m-usd" currency="USD" valueMinor={usd} onValueMinorChange={setUsd} locale="en-US" />
          <p className="text-[11px] text-idpxyz-textMuted tabular-nums">
            minor {usd ?? 'null'} · decimal sep <code className="text-idpxyz-text">{getDecimalSeparator('en-US')}</code> ·{' '}
            {usd === null ? '—' : formatMoneyMinor(usd, 'USD', 'en-US')}
          </p>
        </FormField>
        <FormField>
          <Label htmlFor="m-cny">CNY · zh-CN · 人民币</Label>
          <MoneyInput id="m-cny" currency="CNY" valueMinor={cny} onValueMinorChange={setCny} locale="zh-CN" />
          <p className="text-[11px] text-idpxyz-textMuted tabular-nums">
            minor {cny ?? 'null'} · group/decimal per zh-CN · {cny === null ? '—' : formatMoneyMinor(cny, 'CNY', 'zh-CN')}
          </p>
        </FormField>
        <FormField>
          <Label htmlFor="m-eur">EUR · de-DE (comma decimal, ISO code prefix)</Label>
          <MoneyInput id="m-eur" currency="EUR" valueMinor={eur} onValueMinorChange={setEur} locale="de-DE" />
          <p className="text-[11px] text-idpxyz-textMuted tabular-nums">
            minor {eur ?? 'null'} · try <code className="text-idpxyz-text">1.234,56</code> or <code className="text-idpxyz-text">12,34</code> ·{' '}
            {eur === null ? '—' : formatMoneyMinor(eur, 'EUR', 'de-DE')}
          </p>
        </FormField>
        <FormField>
          <Label htmlFor="m-eur-sym">EUR · de-DE · localized symbol prefix</Label>
          <MoneyInput
            id="m-eur-sym"
            currency="EUR"
            valueMinor={eur}
            onValueMinorChange={setEur}
            locale="de-DE"
            currencyPrefix="symbol"
          />
          <p className="text-[11px] text-idpxyz-textMuted">
            Same value as above; <code className="text-idpxyz-text">currencyPrefix=&quot;symbol&quot;</code> (Intl narrow symbol).
          </p>
        </FormField>
        <FormField>
          <Label htmlFor="m-jpy">JPY · ja-JP (0 fraction digits)</Label>
          <MoneyInput id="m-jpy" currency="JPY" valueMinor={jpy} onValueMinorChange={setJpy} locale="ja-JP" />
          <p className="text-[11px] text-idpxyz-textMuted tabular-nums">
            minor {jpy ?? 'null'} · {jpy === null ? '—' : formatMoneyMinor(jpy, 'JPY', 'ja-JP')}
          </p>
        </FormField>
      </div>
    );
  },
};

export const ReadOnlyTable: StoryObj = {
  name: 'MoneyText (table)',
  parameters: { controls: { disable: true } },
  render: function TableDemo() {
    const rows: {
      label: string;
      minor: number | null;
      cur: string;
      loc: string;
      formatOptions?: FormatMoneyMinorOptions;
    }[] = [
      { label: 'Paid', minor: 1_000_00, cur: 'USD', loc: 'en-US' },
      { label: 'Pending (accounting)', minor: -50_25, cur: 'USD', loc: 'en-US', formatOptions: { currencySign: 'accounting' } },
      { label: '收银', minor: 88_888_88, cur: 'CNY', loc: 'zh-CN' },
      { label: 'Fees', minor: null, cur: 'EUR', loc: 'de-DE' },
    ];
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.label}>
              <TableCell>{r.label}</TableCell>
              <TableCell className="text-end">
                <MoneyText valueMinor={r.minor} currency={r.cur} locale={r.loc} formatOptions={r.formatOptions} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};
