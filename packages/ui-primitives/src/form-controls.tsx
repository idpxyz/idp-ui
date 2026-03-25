'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            'h-4 w-4 rounded border border-vscode-border bg-vscode-input text-vscode-accent cursor-pointer',
            'focus:ring-2 focus:ring-vscode-accent/40 focus:ring-offset-0',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-[12px] text-vscode-text cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

const Radio = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || React.useId();
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className={cn(
            'h-4 w-4 border border-vscode-border bg-vscode-input text-vscode-accent cursor-pointer',
            'focus:ring-2 focus:ring-vscode-accent/40 focus:ring-offset-0',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-[12px] text-vscode-text cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';

const Switch = React.forwardRef<HTMLButtonElement, {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}>(({ checked = false, onCheckedChange, disabled, label, className }, ref) => (
  <div className="flex items-center gap-2">
    <button
      ref={ref}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vscode-accent/40',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-vscode-accent' : 'bg-vscode-border',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
    {label && <span className="text-[12px] text-vscode-text select-none">{label}</span>}
  </div>
));
Switch.displayName = 'Switch';

export { Checkbox, Radio, Switch };
