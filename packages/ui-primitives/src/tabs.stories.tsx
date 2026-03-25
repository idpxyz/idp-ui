import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta = { title: 'Primitives/Tabs' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><div style={{ padding: 16, fontSize: 13, color: '#ccc' }}>Overview content</div></TabsContent>
      <TabsContent value="analytics"><div style={{ padding: 16, fontSize: 13, color: '#ccc' }}>Analytics content</div></TabsContent>
      <TabsContent value="settings"><div style={{ padding: 16, fontSize: 13, color: '#ccc' }}>Settings content</div></TabsContent>
    </Tabs>
  ),
};
