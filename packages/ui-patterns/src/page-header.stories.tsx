import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions } from './page-header';
import { Button } from '@idpxyz/ui-primitives';

const meta: Meta = { title: 'Patterns/PageHeader' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderTitle>Integrations</PageHeaderTitle>
        <PageHeaderDescription>Manage all business integrations</PageHeaderDescription>
      </PageHeaderContent>
      <PageHeaderActions>
        <Button variant="ghost">Export</Button>
        <Button variant="default">New Integration</Button>
      </PageHeaderActions>
    </PageHeader>
  ),
};
