import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta: Meta = {
  title: 'Primitives/Pagination',
  parameters: {
    layout: 'padded',
  },
};
export default meta;

function usePagedState(total: number, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  return { page, pageSize, total, onPageChange: setPage, setPageSize };
}

/** Default story id: `primitives-pagination--basic` — `simple` + rows-per-page. */
export const Basic: StoryObj = {
  render: function BasicDemo() {
    const { page, pageSize, total, onPageChange, setPageSize } = usePagedState(200);
    return (
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        showPageSize
        onPageSizeChange={(n) => {
          setPageSize(n);
          onPageChange(1);
        }}
      />
    );
  },
};

export const Numbered: StoryObj = {
  render: function NumberedDemo() {
    const { page, pageSize, total, onPageChange } = usePagedState(480);
    return (
      <Pagination
        variant="numbered"
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    );
  },
};

/** Prev/next + `1–10 of 95` + rows per page (when `onPageSizeChange` is provided). */
export const Minimal: StoryObj = {
  render: function MinimalDemo() {
    const { page, pageSize, total, onPageChange, setPageSize } = usePagedState(95);
    return (
      <Pagination
        variant="minimal"
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={(n) => {
          setPageSize(n);
          onPageChange(1);
        }}
      />
    );
  },
};

export const Table: StoryObj = {
  render: function TableDemo() {
    const { page, pageSize, total, onPageChange, setPageSize } = usePagedState(1250, 20);
    return (
      <Pagination
        variant="table"
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={(n) => {
          setPageSize(n);
          onPageChange(1);
        }}
      />
    );
  },
};

export const Empty: StoryObj = {
  render: function EmptyDemo() {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        variant="table"
        page={page}
        pageSize={10}
        total={0}
        onPageChange={setPage}
        hideControlsWhenEmpty
      />
    );
  },
};
