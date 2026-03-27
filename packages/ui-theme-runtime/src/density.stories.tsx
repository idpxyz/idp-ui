import type { Meta, StoryObj } from '@storybook/react';
import { DensityProvider, useDensity } from './DensityProvider';

const meta: Meta = { title: 'Theme/DensityProvider' };
export default meta;

function DensityDemo() {
  const { density, toggleDensity } = useDensity();
  return (
    <div style={{ padding: 24 }}>
      <p style={{ marginBottom: 12, fontSize: 14 }}>
        Current list density: <strong>{density}</strong>
      </p>
      <button
        type="button"
        onClick={toggleDensity}
        style={{
          padding: '8px 16px',
          fontSize: 13,
          cursor: 'pointer',
          borderRadius: 6,
          border: '1px solid var(--idpxyz-border, #3c3c3c)',
          background: 'var(--idpxyz-hover, rgba(255,255,255,0.06))',
          color: 'var(--idpxyz-text, #ccc)',
        }}
      >
        Toggle density
      </button>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => (
    <DensityProvider>
      <DensityDemo />
    </DensityProvider>
  ),
};
