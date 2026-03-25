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
  default: 'bg-vscode-textMuted',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('relative', className)}>
      {items.map((item, i) => (
        <div key={item.id} className="flex gap-3 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            {item.icon ? (
              <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-vscode-hover text-vscode-textMuted">
                {item.icon}
              </div>
            ) : (
              <div className={cn('shrink-0 w-2.5 h-2.5 rounded-full mt-1.5', dotColors[item.variant || 'default'])} />
            )}
            {i < items.length - 1 && (
              <div className="w-px flex-1 bg-vscode-border mt-1" />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="text-[12px] font-medium text-vscode-textBright">{item.title}</div>
            {item.description && <div className="text-[11px] text-vscode-textMuted mt-0.5">{item.description}</div>}
            {item.timestamp && <div className="text-[10px] text-vscode-textMuted mt-1">{item.timestamp}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export { Timeline, type TimelineItem };
