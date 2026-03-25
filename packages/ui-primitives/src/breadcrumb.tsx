'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

function Breadcrumb({ items, className, separator }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-[12px]', className)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (separator || <ChevronRight size={12} className="text-vscode-textMuted shrink-0" />)}
          {i === items.length - 1 ? (
            <span className="text-vscode-textBright font-medium" aria-current="page">{item.label}</span>
          ) : item.onClick ? (
            <button onClick={item.onClick} className="text-vscode-textMuted hover:text-vscode-text transition-colors">
              {item.label}
            </button>
          ) : item.href ? (
            <a href={item.href} className="text-vscode-textMuted hover:text-vscode-text transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-vscode-textMuted">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export { Breadcrumb, type BreadcrumbItem };
