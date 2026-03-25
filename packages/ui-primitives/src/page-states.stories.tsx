import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import {
  LoadingState,
  FilteredEmptyState,
  TrulyEmptyState,
  NoPermissionState,
  UnavailableState,
  SectionErrorState,
} from './page-states';

const meta: Meta = { title: 'Primitives/PageStates' };
export default meta;

function StateFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[320px] w-full max-w-[720px] border border-vscode-border rounded-md overflow-hidden">
      {children}
    </div>
  );
}

export const Loading: StoryObj = {
  render: () => (
    <StateFrame>
      <LoadingState />
    </StateFrame>
  ),
};

export const FilteredEmpty: StoryObj = {
  render: () => (
    <StateFrame>
      <FilteredEmptyState onReset={() => {}} />
    </StateFrame>
  ),
};

export const TrulyEmpty: StoryObj = {
  render: () => (
    <StateFrame>
      <TrulyEmptyState onCreate={() => {}} />
    </StateFrame>
  ),
};

export const NoPermission: StoryObj = {
  render: () => (
    <StateFrame>
      <NoPermissionState />
    </StateFrame>
  ),
};

export const Unavailable: StoryObj = {
  render: () => (
    <StateFrame>
      <UnavailableState onRetry={() => {}} />
    </StateFrame>
  ),
};

export const SectionError: StoryObj = {
  render: () => (
    <div className="max-w-[480px] rounded-md border border-vscode-border p-4 bg-vscode-bg">
      <SectionErrorState message="Failed to load line items: network timeout." onRetry={() => {}} />
    </div>
  ),
};
