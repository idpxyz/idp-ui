import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './stepper';

const meta: Meta = { title: 'Primitives/Stepper' };
export default meta;

const steps = [
  { id: 'draft', label: 'Draft', description: 'Create integration' },
  { id: 'review', label: 'Review', description: 'Submit for approval' },
  { id: 'approve', label: 'Approve', description: 'Manager approval' },
  { id: 'publish', label: 'Publish', description: 'Deploy to production' },
];

export const Horizontal: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <Stepper steps={steps} currentStep={2} />
    </div>
  ),
};

export const Vertical: StoryObj = {
  render: () => <Stepper steps={steps} currentStep={1} orientation="vertical" />,
};

export const AllComplete: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <Stepper steps={steps} currentStep={4} />
    </div>
  ),
};
