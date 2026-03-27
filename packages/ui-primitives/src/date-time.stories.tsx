import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { format } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { Calendar, type CalendarDensity } from './calendar';
import { DatePicker } from './date-picker';
import { DateRangePicker, type DateRange } from './date-range-picker';
import { DateTimePicker } from './datetime-picker';
import { TimePicker, TimeSelectFields } from './time-picker';

const logSelect = action('onSelect');
const logChange = action('onChange');

const meta = {
  title: 'Primitives/Date & time',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Date & time

Calendar uses **react-day-picker**; month/year and time use Radix **Select** (same family as \`TimeSelectFields\`). Theme tokens come from \`.storybook/preview.css\`; use the **Backgrounds** toolbar to switch light/dark.

### i18n

| API | Role |
|-----|------|
| \`locale\` (\`date-fns\`) | Weekday names, month/year labels in the grid, and \`format()\` on triggers. |
| \`messages\` | Short UI strings (placeholder, time labels; for ranges: \`rangeSeparator\`, \`partialSuffix\`). Wire to your i18n (\`t('…')\`). |
| \`density\` | \`Calendar\`: \`compact\` (default, ~25px cells) vs \`default\` (~44px). Also on date pickers. |

**Popover:** \`DatePicker\` closes after you pick a day (default). \`DateRangePicker\` stays open while choosing start/end; close by clicking outside or Escape. \`DateTimePicker\` stays open so you can adjust time after picking a date.

### Storybook panels

- **Docs** — this page (from \`parameters.docs.description.component\` + autodocs).
- **Controls** — **CalendarDensityPlayground**, **DatePickerPlayground**, **DateRangePickerPlayground**, **DateTimePickerPlayground**: switch \`density\` (\`compact\` vs \`default\`) plus locale/placeholder where listed.
- **Actions** — interactive stories log \`onSelect\` (Calendar) or \`onChange\` (date/time/datetime pickers) when you change values.

Stories without user-driven callbacks (static demos only) omit actions.
`,
      },
    },
  },
} satisfies Meta;

export default meta;

export const CalendarOnly: StoryObj = {
  render: function CalendarOnlyStory() {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    return (
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            logSelect(d);
            setSelected(d);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {selected ? format(selected, 'PPP') : 'No date'}
        </p>
      </div>
    );
  },
};

/** Use **Controls** → `density` to compare `compact` vs `default` (library ~44px cells). */
export const CalendarDensityPlayground: StoryObj<{ density: CalendarDensity }> = {
  args: {
    density: 'compact',
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['compact', 'default'],
      description: 'compact = denser grid; default = react-day-picker baseline sizing',
    },
  },
  render: function CalendarDensityPlaygroundStory(args) {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    return (
      <div className="flex flex-col gap-2">
        <Calendar
          mode="single"
          density={args.density}
          selected={selected}
          onSelect={(d) => {
            logSelect(d);
            setSelected(d);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {selected ? format(selected, 'PPP') : 'No date'}
        </p>
      </div>
    );
  },
};

export const DatePickerBasic: StoryObj = {
  render: function DatePickerBasicStory() {
    const [value, setValue] = useState<Date | undefined>(undefined);
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <DatePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP') : 'Unselected'}
        </p>
      </div>
    );
  },
};

/** Use **Controls** (density, locale, placeholder) and **Actions** (onChange) while interacting. */
export const DatePickerPlayground: StoryObj<{
  locale: 'enUS' | 'zhCN';
  placeholder: string;
  density: CalendarDensity;
}> = {
  args: {
    locale: 'enUS',
    placeholder: '',
    density: 'compact',
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['compact', 'default'],
      description: 'Calendar cell density',
    },
    locale: {
      control: 'select',
      options: ['enUS', 'zhCN'],
      description: 'date-fns locale → calendar + trigger formatting',
    },
    placeholder: {
      control: 'text',
      description: 'Empty = default English; e.g. 选择日期',
    },
  },
  render: function DatePickerPlaygroundStory(args) {
    const [value, setValue] = useState<Date | undefined>(undefined);
    const locale = args.locale === 'zhCN' ? zhCN : enUS;
    const messages = args.placeholder?.trim() ? { placeholder: args.placeholder } : undefined;

    return (
      <div className="flex max-w-sm flex-col gap-2">
        <DatePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
          density={args.density}
          locale={locale}
          messages={messages}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP', { locale }) : '—'}
        </p>
      </div>
    );
  },
};

export const DateRangePickerBasic: StoryObj = {
  render: function DateRangePickerBasicStory() {
    const [value, setValue] = useState<DateRange | undefined>(undefined);
    return (
      <div className="flex max-w-3xl flex-col gap-2">
        <DateRangePicker
          value={value}
          onChange={(r) => {
            logChange(r);
            setValue(r);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value?.from && value?.to
            ? `${format(value.from, 'PPP')} → ${format(value.to, 'PPP')}`
            : value?.from
              ? `Start: ${format(value.from, 'PPP')} (pick end date)`
              : '—'}
        </p>
      </div>
    );
  },
};

/** Use **Controls** → `density` (and locale) while picking a range. */
export const DateRangePickerPlayground: StoryObj<{
  locale: 'enUS' | 'zhCN';
  density: CalendarDensity;
}> = {
  args: {
    locale: 'enUS',
    density: 'compact',
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['compact', 'default'],
      description: 'Calendar cell density (two months side-by-side)',
    },
    locale: {
      control: 'select',
      options: ['enUS', 'zhCN'],
      description: 'date-fns locale',
    },
  },
  render: function DateRangePickerPlaygroundStory(args) {
    const [value, setValue] = useState<DateRange | undefined>(undefined);
    const locale = args.locale === 'zhCN' ? zhCN : enUS;
    return (
      <div className="flex max-w-3xl flex-col gap-2">
        <DateRangePicker
          value={value}
          onChange={(r) => {
            logChange(r);
            setValue(r);
          }}
          density={args.density}
          locale={locale}
          messages={args.locale === 'zhCN' ? { placeholder: '选择日期范围' } : undefined}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value?.from && value?.to
            ? `${format(value.from, 'PPP', { locale })} → ${format(value.to, 'PPP', { locale })}`
            : value?.from
              ? `Start: ${format(value.from, 'PPP', { locale })} (pick end date)`
              : '—'}
        </p>
      </div>
    );
  },
};

export const TimePickerBasic: StoryObj = {
  render: function TimePickerBasicStory() {
    const [value, setValue] = useState('14:30');
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <TimePicker
          value={value}
          onChange={(v) => {
            logChange(v);
            setValue(v);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">Value: {value}</p>
      </div>
    );
  },
};

export const TimeSelectFieldsStep5: StoryObj = {
  render: function TimeSelectFieldsStep5Story() {
    const [value, setValue] = useState('09:07');
    return (
      <div className="flex flex-col gap-2">
        <TimeSelectFields
          value={value}
          onChange={(v) => {
            logChange(v);
            setValue(v);
          }}
          minuteStep={5}
        />
        <p className="text-[12px] text-idpxyz-textMuted">Normalizes to step: {value}</p>
      </div>
    );
  },
};

export const DateTimePickerBasic: StoryObj = {
  render: function DateTimePickerBasicStory() {
    const [value, setValue] = useState<Date | undefined>(undefined);
    return (
      <div className="flex max-w-md flex-col gap-2">
        <DateTimePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP p') : 'Unselected'}
        </p>
      </div>
    );
  },
};

/** **Controls** → `density` + `locale` for the date half of the popover. */
export const DateTimePickerPlayground: StoryObj<{
  locale: 'enUS' | 'zhCN';
  density: CalendarDensity;
}> = {
  args: {
    locale: 'enUS',
    density: 'compact',
  },
  argTypes: {
    density: {
      control: 'radio',
      options: ['compact', 'default'],
      description: 'Calendar cell density',
    },
    locale: {
      control: 'select',
      options: ['enUS', 'zhCN'],
      description: 'date-fns locale',
    },
  },
  render: function DateTimePickerPlaygroundStory(args) {
    const [value, setValue] = useState<Date | undefined>(undefined);
    const locale = args.locale === 'zhCN' ? zhCN : enUS;
    return (
      <div className="flex max-w-md flex-col gap-2">
        <DateTimePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
          density={args.density}
          locale={locale}
          messages={args.locale === 'zhCN' ? { placeholder: '选择日期与时间' } : undefined}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP p', { locale }) : '—'}
        </p>
      </div>
    );
  },
};

/** `locale` drives calendar + `format()`; `messages` supplies UI strings — typical library i18n split. */
export const CalendarChineseLocale: StoryObj = {
  render: function CalendarChineseLocaleStory() {
    const [selected, setSelected] = useState<Date | undefined>(new Date());
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            logSelect(d);
            setSelected(d);
          }}
          locale={zhCN}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {selected ? format(selected, 'PPP', { locale: zhCN }) : '—'}
        </p>
      </div>
    );
  },
};

export const DateRangePickerChineseLocale: StoryObj = {
  render: function DateRangePickerChineseLocaleStory() {
    const [value, setValue] = useState<DateRange | undefined>(undefined);
    return (
      <div className="flex max-w-3xl flex-col gap-2">
        <DateRangePicker
          value={value}
          onChange={(r) => {
            logChange(r);
            setValue(r);
          }}
          locale={zhCN}
          messages={{ placeholder: '选择日期范围' }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value?.from && value?.to
            ? `${format(value.from, 'PPP', { locale: zhCN })} → ${format(value.to, 'PPP', { locale: zhCN })}`
            : value?.from
              ? `开始：${format(value.from, 'PPP', { locale: zhCN })}`
              : '—'}
        </p>
      </div>
    );
  },
};

export const DatePickerChineseLocale: StoryObj = {
  render: function DatePickerChineseLocaleStory() {
    const [value, setValue] = useState<Date | undefined>(undefined);
    return (
      <div className="flex max-w-sm flex-col gap-2">
        <DatePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
          locale={zhCN}
          messages={{ placeholder: '选择日期' }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP', { locale: zhCN }) : '未选择'}
        </p>
      </div>
    );
  },
};

export const DateTimePickerChineseLocale: StoryObj = {
  render: function DateTimePickerChineseLocaleStory() {
    const [value, setValue] = useState<Date | undefined>(undefined);
    return (
      <div className="flex max-w-md flex-col gap-2">
        <DateTimePicker
          value={value}
          onChange={(d) => {
            logChange(d);
            setValue(d);
          }}
          locale={zhCN}
          messages={{
            placeholder: '选择日期与时间',
            timeLabel: '时间',
            hourLabel: '时',
            minuteLabel: '分',
          }}
        />
        <p className="text-[12px] text-idpxyz-textMuted">
          {value ? format(value, 'PPP p', { locale: zhCN }) : '未选择'}
        </p>
      </div>
    );
  },
};
