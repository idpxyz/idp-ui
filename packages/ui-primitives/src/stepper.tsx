'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

function Stepper({ steps, currentStep, className, orientation = 'horizontal' }: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <nav aria-label="Progress" className={cn(isVertical ? 'flex flex-col gap-0' : 'flex items-center gap-0', className)}>
      {steps.map((step, i) => {
        const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming';

        return (
          <React.Fragment key={step.id}>
            <div className={cn('flex items-center gap-2', isVertical && 'flex-col items-start')}>
              <div className={cn(
                'shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 transition-colors',
                status === 'complete' && 'bg-vscode-accent border-vscode-accent text-white',
                status === 'current' && 'border-vscode-accent text-vscode-accent bg-transparent',
                status === 'upcoming' && 'border-vscode-border text-vscode-textMuted bg-transparent',
              )}>
                {status === 'complete' ? <Check size={14} /> : i + 1}
              </div>
              <div className={isVertical ? 'ml-0 mt-1 mb-4' : ''}>
                <div className={cn(
                  'text-[12px] font-medium',
                  status === 'complete' || status === 'current' ? 'text-vscode-textBright' : 'text-vscode-textMuted',
                )}>
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-[10px] text-vscode-textMuted">{step.description}</div>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'transition-colors',
                isVertical ? 'w-px h-6 ml-3.5 bg-vscode-border' : 'flex-1 h-px mx-2 bg-vscode-border',
                i < currentStep && (isVertical ? 'bg-vscode-accent' : 'bg-vscode-accent'),
              )} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export { Stepper, type Step };
