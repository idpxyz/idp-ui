import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'h-7 w-full rounded border border-vscode-border bg-vscode-inputBg px-2 text-[12px] text-vscode-text placeholder:text-vscode-textMuted outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-ring)] focus-visible:ring-offset-1',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
