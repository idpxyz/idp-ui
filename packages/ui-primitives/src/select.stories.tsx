import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormError, FormField } from './form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta: Meta = { title: 'Primitives/Select' };
export default meta;

export const Basic: StoryObj = {
  render: function BasicStory() {
    const [value, setValue] = useState('editor');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Choose a role…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

/** Story id `primitives-select--radix` — same as Basic (Radix `Select`; legacy links). */
export const Radix: StoryObj = {
  ...Basic,
};

export const Placeholder: StoryObj = {
  render: function PlaceholderStory() {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Nothing selected yet — pick an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">Option one</SelectItem>
          <SelectItem value="two">Option two</SelectItem>
          <SelectItem value="three">Option three</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Disabled: StoryObj = {
  render: function DisabledStory() {
    return (
      <Select defaultValue="locked" disabled>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="locked">Cannot change</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Sizes: StoryObj = {
  render: function SizesStory() {
    const [a, setA] = useState('sm');
    const [b, setB] = useState('md');
    const [c, setC] = useState('lg');
    return (
      <div className="flex flex-col gap-4">
        <Select value={a} onValueChange={setA}>
          <SelectTrigger size="sm" className="w-[200px]">
            <SelectValue placeholder="Small" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small trigger</SelectItem>
            <SelectItem value="alt">Alt</SelectItem>
          </SelectContent>
        </Select>
        <Select value={b} onValueChange={setB}>
          <SelectTrigger size="default" className="w-[200px]">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="md">Default trigger</SelectItem>
            <SelectItem value="alt">Alt</SelectItem>
          </SelectContent>
        </Select>
        <Select value={c} onValueChange={setC}>
          <SelectTrigger size="lg" className="w-[200px]">
            <SelectValue placeholder="Large" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lg">Large trigger</SelectItem>
            <SelectItem value="alt">Alt</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const Grouped: StoryObj = {
  render: function GroupedStory() {
    const [value, setValue] = useState('http2');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[260px]">
          <SelectValue placeholder="Protocol" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>HTTP</SelectLabel>
            <SelectItem value="http1">HTTP/1.1</SelectItem>
            <SelectItem value="http2">HTTP/2</SelectItem>
            <SelectItem value="http3">HTTP/3</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>RPC</SelectLabel>
            <SelectItem value="grpc">gRPC</SelectItem>
            <SelectItem value="connect">Connect</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
};

/** `aria-invalid` on the trigger + `FormError` — matches form validation UX. */
export const Invalid: StoryObj = {
  render: function InvalidStory() {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Select value={value} onValueChange={setValue}>
        <FormField className="max-w-[240px]">
          <SelectTrigger aria-invalid className="w-full">
            <SelectValue placeholder="Required field" />
          </SelectTrigger>
          <FormError>Please select an option.</FormError>
        </FormField>
        <SelectContent>
          {Array.from({ length: 8 }, (_, i) => (
            <SelectItem key={i} value={`opt-${i}`}>
              Option {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

/** Enough options to scroll; up/down chevrons appear when the list overflows (built into `SelectContent`). */
export const LongList: StoryObj = {
  render: function LongListStory() {
    const [value, setValue] = useState('item-15');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Pick a row…" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 48 }, (_, i) => (
            <SelectItem key={i} value={`item-${i}`}>
              Item {i + 1} — long label to exercise horizontal space
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

/** Narrow trigger vs wide trigger; dropdown follows trigger width via `min-w-[var(--radix-select-trigger-width)]`. */
export const TriggerWidths: StoryObj = {
  render: function TriggerWidthsStory() {
    const [narrow, setNarrow] = useState('a');
    const [wide, setWide] = useState('b');
    return (
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-[11px] text-idpxyz-textMuted">Narrow trigger (w-[120px])</p>
          <Select value={narrow} onValueChange={setNarrow}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pick…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Short</SelectItem>
              <SelectItem value="b">Medium label</SelectItem>
              <SelectItem value="c">Very long option label for overflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-2 text-[11px] text-idpxyz-textMuted">Wide trigger (min-w-[360px])</p>
          <Select value={wide} onValueChange={setWide}>
            <SelectTrigger className="min-w-[360px]">
              <SelectValue placeholder="Wide field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  },
};
