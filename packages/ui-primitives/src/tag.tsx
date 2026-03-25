'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@idpxyz/ui-utils';
import { X } from 'lucide-react';

const tagVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-[11px] font-medium transition-all hover:shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-vscode-hover text-vscode-text',
        primary: 'bg-vscode-accent/20 text-vscode-accent',
        success: 'bg-green-500/15 text-green-400',
        warning: 'bg-yellow-500/15 text-yellow-400',
        error: 'bg-red-500/15 text-red-400',
        outline: 'border border-vscode-border text-vscode-textMuted',
      },
      size: {
        sm: 'h-5 px-1.5 text-[10px]',
        md: 'h-6 px-2',
        lg: 'h-7 px-2.5 text-[12px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, onRemove, children, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ variant, size, className }))} {...props}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity" aria-label="Remove tag">
          <X size={12} />
        </button>
      )}
    </span>
  )
);
Tag.displayName = 'Tag';

export { Tag, tagVariants };
