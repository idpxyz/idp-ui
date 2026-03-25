import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { ToastProvider, useToast } from './ToastProvider';

const meta: Meta = { title: 'Theme/ToastProvider' };
export default meta;

function ToastDemo() {
  const { addToast } = useToast();
  return (
    <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button
        type="button"
        onClick={() => addToast({ type: 'success', title: 'Saved', message: 'Changes applied.' })}
        style={btnStyle}
      >
        Success
      </button>
      <button
        type="button"
        onClick={() => addToast({ type: 'info', title: 'Tip', message: 'Use filters to narrow results.' })}
        style={btnStyle}
      >
        Info
      </button>
      <button
        type="button"
        onClick={() => addToast({ type: 'warning', title: 'Review required', message: 'Some fields need attention.' })}
        style={btnStyle}
      >
        Warning
      </button>
      <button
        type="button"
        onClick={() => addToast({ type: 'error', title: 'Sync failed', message: 'Could not reach carrier API.' })}
        style={btnStyle}
      >
        Error
      </button>
    </div>
  );
}

const btnStyle: CSSProperties = {
  padding: '8px 14px',
  fontSize: 13,
  cursor: 'pointer',
  borderRadius: 6,
  border: '1px solid var(--vsc-border, #3c3c3c)',
  background: 'var(--vsc-hover, rgba(255,255,255,0.06))',
  color: 'var(--vsc-text, #ccc)',
};

export const Default: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
