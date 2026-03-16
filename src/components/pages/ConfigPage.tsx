import { useState } from 'react';
import { ChevronRight, Settings, Shield, FileText, Users, Save, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface ConfigPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type ConfigTab = 'general' | 'rules' | 'access' | 'audit';

const rulesList = [
  { id: 'RULE-001', name: 'Auto-escalation on SLA breach', type: 'Escalation', status: 'active', trigger: 'SLA breach > 2h', action: 'Assign to Ops Manager', lastTriggered: '2h ago' },
  { id: 'RULE-002', name: 'Carrier fallback routing', type: 'Routing', status: 'active', trigger: 'Carrier offline > 30m', action: 'Re-route via alternate carrier', lastTriggered: '45m ago' },
  { id: 'RULE-003', name: 'Exception auto-assign', type: 'Assignment', status: 'active', trigger: 'New critical exception', action: 'Assign to on-call team', lastTriggered: '1d ago' },
  { id: 'RULE-004', name: 'Cost threshold alert', type: 'Alert', status: 'active', trigger: 'Variance > 10%', action: 'Notify Finance team', lastTriggered: '3d ago' },
  { id: 'RULE-005', name: 'Document reminder', type: 'Notification', status: 'paused', trigger: 'Missing docs after 24h', action: 'Email shipper', lastTriggered: '5d ago' },
  { id: 'RULE-006', name: 'Daily KPI report', type: 'Report', status: 'active', trigger: 'Daily at 08:00 UTC', action: 'Generate & distribute report', lastTriggered: '6h ago' },
];

const accessRoles = [
  { role: 'Ops Controller', users: 4, permissions: ['View all', 'Edit shipments', 'Manage exceptions', 'Routing decisions', 'Carrier management'] },
  { role: 'Ops Viewer', users: 8, permissions: ['View all', 'Export data'] },
  { role: 'Finance', users: 3, permissions: ['View billing', 'Settlement management', 'Export reports'] },
  { role: 'Admin', users: 2, permissions: ['Full access', 'User management', 'Config management', 'Audit access'] },
  { role: 'Carrier Manager', users: 2, permissions: ['View shipments', 'Carrier ops', 'Integration management'] },
];

const auditEntries = [
  { time: '14:30:00', user: 'Admin', action: 'Updated rule RULE-002', detail: 'Changed trigger threshold from 60m to 30m', ip: '10.0.1.10' },
  { time: '12:00:00', user: 'Admin', action: 'Added user "Mike Liu"', detail: 'Role: Ops Controller', ip: '10.0.1.10' },
  { time: '10:15:00', user: 'System', action: 'Config auto-backup', detail: 'Backup ID: BK-20240316-001', ip: '-' },
  { time: '09:00:00', user: 'Admin', action: 'Updated carrier rate table', detail: 'Maersk rate table v3.2 →v3.3', ip: '10.0.1.10' },
  { time: 'Yesterday 16:00', user: 'Admin', action: 'Created rule RULE-006', detail: 'Daily KPI report automation', ip: '10.0.1.10' },
  { time: 'Yesterday 11:30', user: 'System', action: 'SSL certificate renewed', detail: 'Carrier API gateway cert', ip: '-' },
];

export default function ConfigPage({ onOpenTab }: ConfigPageProps) {
  const [activeTab, setActiveTab] = useState<ConfigTab>('general');

  const tabs: { id: ConfigTab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'rules', label: 'Rules Engine' },
    { id: 'access', label: 'Access Control' },
    { id: 'audit', label: 'Audit Log' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Admin</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">Configuration</span>
      </div>

      <div className="flex items-center h-[32px] border-b border-vscode-border shrink-0 px-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            size="sm"
            className={`h-full rounded-none px-3 text-[11px] border-b-2 border-r border-vscode-border/50 last:border-r-0 ${
              activeTab === tab.id ? 'text-vscode-text border-b-vscode-accent' : 'text-vscode-textMuted border-transparent hover:text-vscode-text'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'general' && (
          <div className="max-w-[600px] space-y-4">
            <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
              <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
                <Settings size={14} /> System Settings
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Default SLA Warning Threshold', value: '4 hours before breach', type: 'select' },
                  { label: 'Auto-refresh Interval', value: '30 seconds', type: 'select' },
                  { label: 'Default Page Size', value: '25 rows', type: 'select' },
                  { label: 'Timezone', value: 'UTC+8 (Asia/Shanghai)', type: 'select' },
                  { label: 'Date Format', value: 'YYYY-MM-DD', type: 'select' },
                  { label: 'Currency Display', value: 'USD', type: 'select' },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-[12px] text-vscode-text">{setting.label}</span>
                    <span className="text-[12px] text-vscode-textMuted bg-vscode-hover px-2 py-1 rounded">{setting.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-vscode-border">
                <Button variant="default" size="sm">
                  <Save size={12} /> Save Changes
                </Button>
                <Button variant="secondary" size="sm">
                  <RotateCcw size={12} /> Reset
                </Button>
              </div>
            </div>

            <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
              <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
                <Shield size={14} /> Notification Preferences
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'SLA breach alerts', enabled: true },
                  { label: 'Exception assignments', enabled: true },
                  { label: 'Carrier incidents', enabled: true },
                  { label: 'Cost discrepancies', enabled: false },
                  { label: 'Daily digest email', enabled: true },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between py-1">
                    <span className="text-[12px] text-vscode-text">{pref.label}</span>
                    <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? 'bg-vscode-accent' : 'bg-vscode-border'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${pref.enabled ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-2">
            {rulesList.map((rule) => (
              <div key={rule.id} className="bg-vscode-sidebar rounded p-3 border border-vscode-border">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] text-vscode-accent font-medium">{rule.id}</span>
                  <span className="text-[12px] text-vscode-textBright font-medium">{rule.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted font-medium">{rule.type}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{rule.status}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-vscode-textMuted">
                  <span>Trigger: <span className="text-vscode-text">{rule.trigger}</span></span>
                  <span>Action: <span className="text-vscode-text">{rule.action}</span></span>
                  <span className="ml-auto">Last: {rule.lastTriggered}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'access' && (
          <div className="space-y-3">
            {accessRoles.map((role) => (
              <div key={role.role} className="bg-vscode-sidebar rounded p-4 border border-vscode-border">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-vscode-textMuted" />
                  <span className="text-[13px] text-vscode-textBright font-semibold">{role.role}</span>
                  <span className="text-[11px] text-vscode-textMuted">{role.users} users</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((p) => (
                    <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-vscode-hover text-vscode-text">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-0.5">
            {auditEntries.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5 text-[12px] text-vscode-text border-b border-vscode-border last:border-0">
                <span className="text-vscode-textMuted font-mono shrink-0 text-[11px] w-[130px]">{a.time}</span>
                <span className="text-vscode-accent shrink-0">{a.user}</span>
                <span className="truncate">{a.action}</span>
                <span className="text-vscode-textMuted truncate">{a.detail}</span>
                <span className="ml-auto text-vscode-textMuted shrink-0 font-mono text-[10px]">{a.ip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




