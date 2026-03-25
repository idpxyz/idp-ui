import { useState } from 'react';
import { ChevronRight, Radio, CheckCircle, AlertTriangle, WifiOff, RefreshCw, Clock, XCircle } from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';
import { Badge } from '@idpxyz/ui-primitives';

interface CarrierOpsProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type CarrierTab = 'status' | 'retries' | 'incidents';

const carrierIntegrations = [
  { carrier: 'Maersk', endpoint: 'Booking API', status: 'online', lastCall: '1m ago', successRate: '99.8%', avgLatency: '120ms' },
  { carrier: 'Maersk', endpoint: 'Tracking API', status: 'online', lastCall: '30s ago', successRate: '99.9%', avgLatency: '85ms' },
  { carrier: 'DHL', endpoint: 'Rate API', status: 'online', lastCall: '2m ago', successRate: '99.7%', avgLatency: '95ms' },
  { carrier: 'DHL', endpoint: 'Label API', status: 'online', lastCall: '5m ago', successRate: '99.9%', avgLatency: '110ms' },
  { carrier: 'FedEx', endpoint: 'Booking API', status: 'degraded', lastCall: '3m ago', successRate: '97.2%', avgLatency: '450ms' },
  { carrier: 'FedEx', endpoint: 'Tracking API', status: 'online', lastCall: '1m ago', successRate: '99.5%', avgLatency: '130ms' },
  { carrier: 'UPS', endpoint: 'Shipping API', status: 'online', lastCall: '2m ago', successRate: '99.6%', avgLatency: '105ms' },
  { carrier: 'COSCO', endpoint: 'Booking API', status: 'offline', lastCall: '45m ago', successRate: '94.1%', avgLatency: '-' },
  { carrier: 'COSCO', endpoint: 'Tracking API', status: 'degraded', lastCall: '8m ago', successRate: '96.5%', avgLatency: '380ms' },
  { carrier: 'Evergreen', endpoint: 'Booking API', status: 'online', lastCall: '4m ago', successRate: '99.3%', avgLatency: '140ms' },
];

const retryQueue = [
  { id: 'RTY-001', carrier: 'COSCO', operation: 'Booking Create', shipment: 'SHP-20240310', attempts: 3, maxAttempts: 5, lastAttempt: '8m ago', nextRetry: '2m', status: 'pending', error: 'Connection timeout' },
  { id: 'RTY-002', carrier: 'FedEx', operation: 'Label Generation', shipment: 'SHP-20240306', attempts: 1, maxAttempts: 3, lastAttempt: '15m ago', nextRetry: '5m', status: 'pending', error: 'Rate limit exceeded' },
  { id: 'RTY-003', carrier: 'COSCO', operation: 'Tracking Poll', shipment: 'SHP-20240304', attempts: 5, maxAttempts: 5, lastAttempt: '1h ago', nextRetry: '-', status: 'exhausted', error: 'Service unavailable' },
  { id: 'RTY-004', carrier: 'UPS', operation: 'Status Update', shipment: 'SHP-20240309', attempts: 2, maxAttempts: 3, lastAttempt: '30m ago', nextRetry: '10m', status: 'pending', error: 'Invalid response format' },
  { id: 'RTY-005', carrier: 'Maersk', operation: 'Document Upload', shipment: 'SHP-20240302', attempts: 1, maxAttempts: 3, lastAttempt: '5m ago', nextRetry: '15m', status: 'pending', error: 'File too large' },
];

const incidents = [
  { id: 'INC-012', carrier: 'COSCO', severity: 'critical', title: 'Full API outage', started: '45m ago', duration: '45m', affected: 12, status: 'active' },
  { id: 'INC-011', carrier: 'FedEx', severity: 'warning', title: 'Booking API high latency', started: '2h ago', duration: '2h', affected: 5, status: 'active' },
  { id: 'INC-010', carrier: 'Maersk', severity: 'info', title: 'Scheduled maintenance window', started: '6h ago', duration: '30m', affected: 0, status: 'resolved' },
  { id: 'INC-009', carrier: 'DHL', severity: 'warning', title: 'Rate API intermittent errors', started: '1d ago', duration: '4h', affected: 8, status: 'resolved' },
  { id: 'INC-008', carrier: 'UPS', severity: 'critical', title: 'Authentication failure', started: '2d ago', duration: '1h', affected: 23, status: 'resolved' },
  { id: 'INC-007', carrier: 'COSCO', severity: 'warning', title: 'Tracking data stale', started: '3d ago', duration: '6h', affected: 15, status: 'resolved' },
];

export default function CarrierOps({ onOpenTab }: CarrierOpsProps) {
  const [activeTab, setActiveTab] = useState<CarrierTab>('status');

  const tabs: { id: CarrierTab; label: string; badge?: number }[] = [
    { id: 'status', label: 'Integration Status' },
    { id: 'retries', label: 'Retry Center', badge: retryQueue.filter((r) => r.status === 'pending').length },
    { id: 'incidents', label: 'Incident Timeline', badge: incidents.filter((i) => i.status === 'active').length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Operations</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">Carrier Ops</span>
      </div>

      {/* Tabs */}
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
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="danger">{tab.badge}</Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'status' && (
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 bg-vscode-sidebar z-10">
              <tr className="text-vscode-textMuted text-left">
                <th className="px-3 py-2 font-medium border-b border-vscode-border">Carrier</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border">Endpoint</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Status</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border">Last Call</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border">Success Rate</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border">Avg Latency</th>
              </tr>
            </thead>
            <tbody>
              {carrierIntegrations.map((ci, i) => (
                <tr key={i} className="hover:bg-vscode-hover">
                  <td className="px-3 py-2 border-b border-vscode-border text-vscode-text font-medium">{ci.carrier}</td>
                  <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{ci.endpoint}</td>
                  <td className="px-3 py-2 border-b border-vscode-border text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${
                      ci.status === 'online' ? 'bg-green-500/20 text-green-400' :
                      ci.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {ci.status === 'online' ? <CheckCircle size={10} /> : ci.status === 'degraded' ? <AlertTriangle size={10} /> : <WifiOff size={10} />}
                      {ci.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted">{ci.lastCall}</td>
                  <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{ci.successRate}</td>
                  <td className="px-3 py-2 border-b border-vscode-border text-vscode-text font-mono">{ci.avgLatency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'retries' && (
          <div className="space-y-2">
            {retryQueue.map((r) => (
              <div key={r.id} className={`bg-vscode-sidebar rounded p-3 border ${r.status === 'exhausted' ? 'border-red-500/30' : 'border-vscode-border'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] text-vscode-accent font-medium">{r.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted font-medium">{r.carrier}</span>
                  <span className="text-[12px] text-vscode-text">{r.operation}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>{r.status}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-vscode-textMuted">
                  <span className="flex items-center gap-1 cursor-pointer text-vscode-accent hover:underline" onClick={() => onOpenTab?.(`shipment-detail-${r.shipment}`, `Shipment ${r.shipment}`)}>{r.shipment}</span>
                  <span>Attempts: {r.attempts}/{r.maxAttempts}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> Last: {r.lastAttempt}</span>
                  {r.nextRetry !== '-' && <span className="flex items-center gap-1"><RefreshCw size={10} /> Next: {r.nextRetry}</span>}
                </div>
                <div className="mt-1.5 text-[11px] text-red-400 flex items-center gap-1">
                  <XCircle size={10} /> {r.error}
                </div>
                {r.status === 'pending' && (
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="default" size="sm">Retry Now</Button>
                    <Button variant="secondary" size="sm">Cancel</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-2">
            {incidents.map((inc) => (
              <div key={inc.id} className={`bg-vscode-sidebar rounded p-3 border ${
                inc.status === 'active'
                  ? inc.severity === 'critical' ? 'border-red-500/30' : 'border-yellow-500/30'
                  : 'border-vscode-border'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    inc.severity === 'critical' ? 'bg-red-500' : inc.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-[12px] text-vscode-accent font-medium">{inc.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted font-medium">{inc.carrier}</span>
                  <span className="text-[12px] text-vscode-textBright font-medium">{inc.title}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    inc.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                  }`}>{inc.status}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-vscode-textMuted">
                  <span>Started: {inc.started}</span>
                  <span>Duration: {inc.duration}</span>
                  <span>Affected shipments: {inc.affected}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




