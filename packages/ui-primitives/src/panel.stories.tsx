import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Zap, Activity, AlertTriangle, LayoutList, FileText, MessageSquare } from 'lucide-react';
import { PanelShell, PanelTabBar, PanelTab, PanelContent } from './panel';

const meta: Meta = { title: 'Primitives/Panel' };
export default meta;

export const Default: StoryObj = {
  render: function PanelDemo() {
    const [activeTab, setActiveTab] = useState('events');
    const [maximized, setMaximized] = useState(false);
    const [visible, setVisible] = useState(true);

    const tabs = [
      { id: 'events', label: 'Events', icon: <Zap size={14} /> },
      { id: 'logs', label: 'Logs', icon: <Activity size={14} /> },
      { id: 'cases', label: 'Cases', icon: <AlertTriangle size={14} />, badge: 7 },
      { id: 'jobs', label: 'Jobs', icon: <LayoutList size={14} /> },
      { id: 'audit', label: 'Audit', icon: <FileText size={14} /> },
      { id: 'comments', label: 'Comments', icon: <MessageSquare size={14} />, badge: 3 },
    ];

    if (!visible) {
      return (
        <button
          onClick={() => setVisible(true)}
          style={{ padding: '8px 16px', color: '#aaa', border: '1px solid #444', borderRadius: 4 }}
        >
          Show Panel
        </button>
      );
    }

    return (
      <div style={{ width: '100%', maxWidth: 900, border: '1px solid var(--idpxyz-border)' }}>
        <PanelShell height={maximized ? 400 : 200} visible={visible}>
          <PanelTabBar
            maximized={maximized}
            onMaximize={() => setMaximized(!maximized)}
            onClose={() => setVisible(false)}
          >
            {tabs.map((tab) => (
              <PanelTab
                key={tab.id}
                active={activeTab === tab.id}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </PanelTabBar>
          <PanelContent>
            <div className="text-[12px] text-idpxyz-text">
              {activeTab === 'events' && (
                <div className="space-y-1">
                  {[
                    { time: '14:32:05', source: 'System', event: 'Order ORD-001 created' },
                    { time: '14:28:11', source: 'User', event: 'Order ORD-001 confirmed payment' },
                    { time: '14:15:30', source: 'System', event: 'Allocation completed for ORD-001' },
                    { time: '13:58:22', source: 'Carrier', event: 'Shipment SHP-001 dispatched' },
                  ].map((evt, i) => (
                    <div key={i} className="flex items-center gap-3 py-0.5">
                      <span className="text-idpxyz-textMuted font-mono w-[80px] shrink-0 text-[11px]">{evt.time}</span>
                      <span className="text-idpxyz-accent shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover">{evt.source}</span>
                      <span>{evt.event}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab !== 'events' && (
                <div className="text-idpxyz-textMuted py-6 text-center">
                  Content for "{activeTab}" tab
                </div>
              )}
            </div>
          </PanelContent>
        </PanelShell>
      </div>
    );
  },
};

export const MinimalTabs: StoryObj = {
  render: function MinimalDemo() {
    const [activeTab, setActiveTab] = useState('output');
    return (
      <div style={{ width: '100%', maxWidth: 600, border: '1px solid var(--idpxyz-border)' }}>
        <PanelShell height={150}>
          <PanelTabBar onClose={() => {}}>
            <PanelTab active={activeTab === 'output'} label="Output" onClick={() => setActiveTab('output')} />
            <PanelTab active={activeTab === 'terminal'} label="Terminal" onClick={() => setActiveTab('terminal')} />
            <PanelTab active={activeTab === 'problems'} label="Problems" badge={2} onClick={() => setActiveTab('problems')} />
          </PanelTabBar>
          <PanelContent>
            <div className="text-[11px] font-mono text-idpxyz-textMuted">
              {activeTab} panel content
            </div>
          </PanelContent>
        </PanelShell>
      </div>
    );
  },
};
