'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

function FormField({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-1.5', className)} {...props} />;
}

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }>(
  ({ className, required, children, ...props }, ref) => (
    <label ref={ref} className={cn('block text-[12px] font-medium text-vscode-text', className)} {...props}>
      {children}
      {required && <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>}
    </label>
  )
);
Label.displayName = 'Label';

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[11px] text-vscode-textMuted', className)} {...props} />;
}

function FormError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={cn('text-[11px] text-red-400 font-medium', className)} {...props} />;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[80px] px-2.5 py-1.5 text-[12px] bg-vscode-input border border-vscode-border rounded',
        'text-vscode-text placeholder:text-vscode-textMuted',
        'focus:outline-none focus:ring-1 focus:ring-vscode-accent/60 focus:border-vscode-accent/60',
        'disabled:opacity-50 disabled:cursor-not-allowed resize-y',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { FormField, Label, FormDescription, FormError, Textarea };
