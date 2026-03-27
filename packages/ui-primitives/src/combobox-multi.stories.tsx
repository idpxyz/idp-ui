import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Combobox, type ComboboxOption } from './combobox';
import { MultiSelect } from './multi-select';

const meta: Meta = { title: 'Primitives/Combobox & MultiSelect' };
export default meta;

const sampleOptions: ComboboxOption[] = [
  { value: 'http1', label: 'HTTP/1.1' },
  { value: 'http2', label: 'HTTP/2' },
  { value: 'http3', label: 'HTTP/3' },
  { value: 'grpc', label: 'gRPC' },
];

export const SearchableSingle: StoryObj = {
  render: function SearchableSingleStory() {
    const [value, setValue] = useState<string | undefined>('http2');
    return (
      <div className="w-[280px]">
        <Combobox
          options={sampleOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Protocol…"
          searchPlaceholder="Filter protocols…"
          emptyText="No protocol found."
        />
      </div>
    );
  },
};

const multiSample: ComboboxOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie' },
  { value: 'd', label: 'Delta' },
  { value: 'e', label: 'Echo' },
];

export const SearchableMulti: StoryObj = {
  render: function SearchableMultiStory() {
    const [value, setValue] = useState<string[]>(['a', 'c']);
    return (
      <div className="w-[320px]">
        <MultiSelect
          options={multiSample}
          value={value}
          onValueChange={setValue}
          placeholder="Choose tags…"
          searchPlaceholder="Filter…"
          maxDisplay={2}
        />
      </div>
    );
  },
};
