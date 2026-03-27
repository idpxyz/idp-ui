import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState, type ReactNode } from 'react';

import { ParcelDimensionsField, type ParcelDimensionsCm } from './parcel-dimensions-field';

const meta: Meta<typeof ParcelDimensionsField> = {
  title: 'Patterns/ParcelDimensionsField',
  component: ParcelDimensionsField,
  parameters: { layout: 'padded' },
};
export default meta;

function volumeReadoutFromCm(value: ParcelDimensionsCm): ReactNode | undefined {
  const { length, width, height } = value;
  if (length == null || width == null || height == null) return undefined;
  const cm3 = length * width * height;
  const m3 = cm3 / 1_000_000;
  const fmt = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 6 });
  return (
    <>
      {fmt.format(m3)} m³ <span className="text-idpxyz-textMuted">（{fmt.format(cm3)} cm³）</span>
    </>
  );
}

export const Default: StoryObj<typeof ParcelDimensionsField> = {
  render: function DefaultDemo() {
    const [value, setValue] = useState<ParcelDimensionsCm>({
      length: 30,
      width: 20,
      height: 10,
    });
    const volumeReadout = useMemo(() => volumeReadoutFromCm(value), [value]);
    return (
      <div className="max-w-md text-idpxyz-text">
        <ParcelDimensionsField value={value} onChange={setValue} volumeReadout={volumeReadout} />
        <pre className="mt-3 whitespace-pre-wrap rounded border border-idpxyz-border bg-idpxyz-hover/20 p-2 text-[11px] text-idpxyz-textMuted">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    );
  },
};

export const NoVolume: StoryObj<typeof ParcelDimensionsField> = {
  render: function NoVolumeDemo() {
    const [value, setValue] = useState<ParcelDimensionsCm>({
      length: null,
      width: null,
      height: null,
    });
    return (
      <div className="max-w-md text-idpxyz-text">
        <ParcelDimensionsField value={value} onChange={setValue} />
      </div>
    );
  },
};
