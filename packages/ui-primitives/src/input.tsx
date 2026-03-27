import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

const disabledLook =
  'border-idpxyz-border/40 bg-idpxyz-hover/35 text-idpxyz-textMuted cursor-text pointer-events-auto select-text shadow-none';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * When `disabled` is set:
   * - `false` (default): use `readOnly` + `aria-disabled` + the same visuals so text stays selectable (native `disabled` blocks selection in browsers).
   * - `true`: use the real `disabled` attribute (field excluded from form submit; selection may still be blocked by the browser).
   */
  nativeDisabled?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, readOnly, nativeDisabled = false, ...props }, ref) => {
    const useFacade = Boolean(disabled) && !nativeDisabled;

    return (
      <input
        ref={ref}
        {...props}
        disabled={Boolean(disabled) && nativeDisabled}
        readOnly={useFacade || readOnly}
        aria-disabled={disabled ? true : undefined}
        className={cn(
          'h-7 w-full rounded border border-idpxyz-border bg-idpxyz-inputBg px-2 text-[12px] text-idpxyz-text placeholder:text-idpxyz-textMuted outline-none transition-[border-color,background-color,opacity] focus-visible:border-[#4ea8ff] focus-visible:ring-0 focus-visible:shadow-none',
          useFacade && disabledLook,
          !useFacade &&
            disabled &&
            'disabled:cursor-text disabled:pointer-events-auto disabled:select-text disabled:border-idpxyz-border/40 disabled:bg-idpxyz-hover/35 disabled:text-idpxyz-textMuted disabled:shadow-none',
          className
        )}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
