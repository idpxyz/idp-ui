import type { Meta, StoryObj } from '@storybook/react';
import { NavMenu } from './nav-menu';
import { LayoutDashboard, Layers, FileText, Settings, Activity } from 'lucide-react';

const meta: Meta = { title: 'Primitives/NavMenu' };
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <div style={{ width: 240, background: '#252526', padding: 8, borderRadius: 8 }}>
      <NavMenu
        activeId="integrations"
        items={[
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={14} /> },
          { id: 'integrations', label: 'Integrations', icon: <Layers size={14} />, badge: 12 },
          { id: 'contracts', label: 'Contracts', icon: <FileText size={14} />, children: [
            { id: 'source', label: 'Source Contracts' },
            { id: 'canonical', label: 'Canonical Contracts' },
          ]},
          { id: 'executions', label: 'Executions', icon: <Activity size={14} />, badge: '3' },
          { id: 'settings', label: 'Settings', icon: <Settings size={14} /> },
        ]}
      />
    </div>
  ),
};
