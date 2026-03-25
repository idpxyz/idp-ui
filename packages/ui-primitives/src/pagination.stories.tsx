import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta: Meta = { title: 'Primitives/Pagination' };
export default meta;

export const Basic: StoryObj = {
  render: function PaginationDemo() {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageSize={10} total={95} onPageChange={setPage} />;
  },
};
