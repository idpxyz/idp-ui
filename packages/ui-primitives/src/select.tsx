import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';
import { ChevronDown } from 'lucide-react';

const selectVariants = cva(
  'inline-flex w-full items-center justify-between rounded border text-[12px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-ring)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      size: {
        sm: 'h-6 px-2 text-[11px]',
        default: 'h-7 px-2',
        lg: 'h-8 px-2.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            selectVariants({ size }),
            'appearance-none border-vscode-border bg-vscode-inputBg pr-7 text-vscode-text',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={12}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-vscode-textMuted"
        />
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface SelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

function SelectOption({ className, ...props }: SelectOptionProps) {
  return <option className={cn('bg-vscode-sidebar text-vscode-text', className)} {...props} />;
}

export { Select, SelectOption, selectVariants };
