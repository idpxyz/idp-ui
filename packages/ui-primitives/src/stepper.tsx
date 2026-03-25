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
  if (orientation === 'vertical') {
    return <VerticalStepper steps={steps} currentStep={currentStep} className={className} />;
  }

  return (
    <nav aria-label="Progress" className={cn('w-full', className)}>
      <div className="flex">
        {steps.map((step, i) => {
          const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming';
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className={cn('flex flex-col items-center', isLast ? '' : 'flex-1')}>
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div className={cn(
                    'flex-1 h-0.5 rounded-full',
                    i <= currentStep ? 'bg-vscode-accent' : 'bg-vscode-border',
                  )} />
                )}
                <div className={cn(
                  'shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all',
                  status === 'complete' && 'bg-vscode-accent border-vscode-accent text-white',
                  status === 'current' && 'border-vscode-accent text-vscode-accent bg-vscode-accent/10 ring-4 ring-vscode-accent/10',
                  status === 'upcoming' && 'border-vscode-border text-vscode-textMuted bg-transparent',
                )}>
                  {status === 'complete' ? <Check size={16} strokeWidth={3} /> : i + 1}
                </div>
                {!isLast && (
                  <div className={cn(
                    'flex-1 h-0.5 rounded-full',
                    i < currentStep ? 'bg-vscode-accent' : 'bg-vscode-border',
                  )} />
                )}
              </div>
              <div className="text-center mt-2 px-1">
                <div className={cn(
                  'text-[12px] font-semibold',
                  status === 'complete' || status === 'current' ? 'text-vscode-textBright' : 'text-vscode-textMuted',
                )}>
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-[10px] text-vscode-textMuted mt-0.5">{step.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function VerticalStepper({ steps, currentStep, className }: { steps: Step[]; currentStep: number; className?: string }) {
  return (
    <nav aria-label="Progress" className={cn('', className)}>
      {steps.map((step, i) => {
        const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming';
        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn(
                'shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all',
                status === 'complete' && 'bg-vscode-accent border-vscode-accent text-white',
                status === 'current' && 'border-vscode-accent text-vscode-accent bg-vscode-accent/10 ring-4 ring-vscode-accent/10',
                status === 'upcoming' && 'border-vscode-border text-vscode-textMuted bg-transparent',
              )}>
                {status === 'complete' ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-0.5 flex-1 my-1 rounded-full min-h-[24px]',
                  i < currentStep ? 'bg-vscode-accent' : 'bg-vscode-border',
                )} />
              )}
            </div>
            <div className="pt-1.5 pb-6">
              <div className={cn(
                'text-[13px] font-semibold',
                status === 'complete' || status === 'current' ? 'text-vscode-textBright' : 'text-vscode-textMuted',
              )}>
                {step.label}
              </div>
              {step.description && (
                <div className="text-[11px] text-vscode-textMuted mt-0.5">{step.description}</div>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export { Stepper, type Step };
