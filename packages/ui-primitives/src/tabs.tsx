import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({ value: controlledValue, defaultValue, onValueChange, className, children, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const value = controlledValue ?? internalValue;
  const handleChange = React.useCallback((v: string) => {
    if (controlledValue === undefined) setInternalValue(v);
    onValueChange?.(v);
  }, [controlledValue, onValueChange]);

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext<{ value: string; onValueChange: (v: string) => void }>({
  value: '',
  onValueChange: () => {},
});

function useTabsContext() {
  return React.useContext(TabsContext);
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex h-[36px] items-center gap-0 border-b border-vscode-border',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useTabsContext();
    const isActive = ctx.value === value;
    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => ctx.onValueChange(value)}
        className={cn(
          'relative inline-flex h-full items-center justify-center px-4 text-[13px] font-medium transition-colors',
          'text-vscode-textMuted hover:text-vscode-text focus-visible:outline-none',
          isActive && 'text-vscode-textBright after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-vscode-accent after:rounded-full',
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = useTabsContext();
    if (ctx.value !== value) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn('mt-0 focus-visible:outline-none', className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent, type TabsProps, type TabsTriggerProps, type TabsContentProps };
