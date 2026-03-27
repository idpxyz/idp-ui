'use client';

import * as React from 'react';
import { cn } from '@idpxyz/ui-utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
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
      <div className="relative flex items-start justify-between">
        {steps.map((step, i) => {
          const status = i < currentStep ? 'complete' : i === currentStep ? 'current' : 'upcoming';
          return (
            <div key={step.id} className="flex flex-col items-center z-10" style={{ width: `${100 / steps.length}%` }}>
              <div className={cn(
                'shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold border-2 transition-all bg-idpxyz-bg',
                status === 'complete' && 'bg-idpxyz-accent border-idpxyz-accent text-white',
                status === 'current' && 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-bg ring-4 ring-idpxyz-accent/10',
                status === 'upcoming' && 'border-idpxyz-border text-idpxyz-textMuted bg-idpxyz-bg',
              )}>
                {status === 'complete' ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <div className="text-center mt-2.5">
                <div className={cn(
                  'text-[12px] font-semibold',
                  status === 'complete' || status === 'current' ? 'text-idpxyz-textBright' : 'text-idpxyz-textMuted',
                )}>
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-[10px] text-idpxyz-textMuted mt-0.5">{step.description}</div>
                )}
                {step.timestamp && (
                  <div className="text-[10px] text-idpxyz-accent mt-1">{step.timestamp}</div>
                )}
              </div>
            </div>
          );
        })}
        {/* Connecting line drawn behind circles, clipped to circle centers */}
        <div
          className="absolute top-[18px] flex items-center"
          style={{
            left: `${50 / steps.length}%`,
            right: `${50 / steps.length}%`,
          }}
        >
          {steps.slice(0, -1).map((_, i) => (
            <div key={i} className={cn(
              'flex-1 h-0.5 rounded-full',
              i < currentStep ? 'bg-idpxyz-accent' : 'bg-idpxyz-border',
            )} />
          ))}
        </div>
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
                status === 'complete' && 'bg-idpxyz-accent border-idpxyz-accent text-white',
                status === 'current' && 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10 ring-4 ring-idpxyz-accent/10',
                status === 'upcoming' && 'border-idpxyz-border text-idpxyz-textMuted bg-transparent',
              )}>
                {status === 'complete' ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'w-0.5 flex-1 my-1 rounded-full min-h-[24px]',
                  i < currentStep ? 'bg-idpxyz-accent' : 'bg-idpxyz-border',
                )} />
              )}
            </div>
            <div className="pt-1.5 pb-6">
              <div className={cn(
                'text-[13px] font-semibold',
                status === 'complete' || status === 'current' ? 'text-idpxyz-textBright' : 'text-idpxyz-textMuted',
              )}>
                {step.label}
              </div>
              {step.description && (
                <div className="text-[11px] text-idpxyz-textMuted mt-0.5">{step.description}</div>
              )}
              {step.timestamp && (
                <div className="text-[10px] text-idpxyz-accent mt-1">{step.timestamp}</div>
              )}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export { Stepper, type Step };
