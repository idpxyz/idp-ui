import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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

export const Closeable: StoryObj = {
  render: function CloseableTabs() {
    const allTabs = [
      { id: 'contracts', label: 'Contracts' },
      { id: 'mappings', label: 'Mappings' },
      { id: 'pipelines', label: 'Pipelines' },
      { id: 'executions', label: 'Executions' },
    ];
    const [tabs, setTabs] = useState(allTabs);
    const [active, setActive] = useState('contracts');

    const handleClose = (val: string) => {
      const remaining = tabs.filter(t => t.id !== val);
      setTabs(remaining);
      if (active === val && remaining.length > 0) {
        setActive(remaining[0].id);
      }
    };

    return (
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {tabs.map(t => (
            <TabsTrigger key={t.id} value={t.id} closable onClose={handleClose}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(t => (
          <TabsContent key={t.id} value={t.id}>
            <div style={{ padding: 16, fontSize: 13, color: '#ccc' }}>Content for {t.label}</div>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
};
