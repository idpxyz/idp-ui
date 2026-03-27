'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const dotColors = {
  default: 'bg-idpxyz-textMuted ring-idpxyz-textMuted/20',
  success: 'bg-green-500 ring-green-500/20',
  warning: 'bg-yellow-500 ring-yellow-500/20',
  error: 'bg-red-500 ring-red-500/20',
};

const lineColors = {
  default: 'bg-idpxyz-border',
  success: 'bg-green-500/40',
  warning: 'bg-yellow-500/40',
  error: 'bg-red-500/40',
};

function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-4 group">
          <div className="flex flex-col items-center pt-1">
            {item.icon ? (
              <div className={cn(
                'shrink-0 w-8 h-8 flex items-center justify-center rounded-full ring-4',
                dotColors[item.variant || 'default']
              )}>
                {item.icon}
              </div>
            ) : (
              <div className={cn('shrink-0 w-3.5 h-3.5 rounded-full ring-4', dotColors[item.variant || 'default'])} />
            )}
            {i < items.length - 1 && (
              <div className={cn('w-0.5 flex-1 mt-2 mb-0 rounded-full', lineColors[item.variant || 'default'])} />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-8 last:pb-0">
            <div className="bg-idpxyz-sidebar/50 border border-idpxyz-border/50 rounded-lg px-4 py-3 group-hover:border-idpxyz-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-idpxyz-textBright">{item.title}</div>
                {item.timestamp && <div className="text-[11px] text-idpxyz-textMuted">{item.timestamp}</div>}
              </div>
              {item.description && <div className="text-[12px] text-idpxyz-textMuted mt-1">{item.description}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { Timeline, type TimelineItem };
