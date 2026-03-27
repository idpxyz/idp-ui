'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@idpxyz/ui-utils';

type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-3', className)} {...props} />;
}

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'flex w-full min-w-0 h-[36px] items-center gap-0 border-b border-idpxyz-border',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  closable?: boolean;
  onClose?: (value: string) => void;
}

const TabsTrigger = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, value, closable, onClose, children, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value!}
      className={cn(
        'group relative inline-flex h-full items-center justify-center gap-1.5 px-4 text-[13px] font-medium transition-colors',
        'text-idpxyz-textMuted hover:text-idpxyz-text focus-visible:outline-none',
        'data-[state=active]:text-idpxyz-textBright data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-[2px] data-[state=active]:after:bg-idpxyz-accent data-[state=active]:after:rounded-full',
        className
      )}
      {...props}
    >
      {children}
      {closable && value !== undefined && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={`Close ${value}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose?.(value);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-1 p-0.5 rounded hover:bg-idpxyz-hover opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="3" x2="9" y2="9" />
            <line x1="9" y1="3" x2="3" y2="9" />
          </svg>
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
);
TabsTrigger.displayName = 'TabsTrigger';

type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const TabsContent = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, value, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      value={value!}
      className={cn('mt-0 focus-visible:outline-none', className)}
      {...props}
    />
  )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps, type TabsTriggerProps, type TabsContentProps };
