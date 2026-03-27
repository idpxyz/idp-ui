import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2, Activity, AlertTriangle, LayoutList, FileText, Zap, MessageSquare } from 'lucide-react';
import { type Shipment, type Exception, trackingEvents } from '../data/loms';
import { SkeletonEventList } from '@idpxyz/ui-patterns';
import { Button } from '@idpxyz/ui-primitives';
import { Badge } from '@idpxyz/ui-primitives';

interface BottomPanelProps {
  visible: boolean;
  height: number;
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  selectedObject: Shipment | Exception | null;
}

export default function BottomPanel({ visible, height, maximized, onClose, onMaximize, selectedObject }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState('events');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    timerRef.current = setTimeout(() => setIsLoading(false), 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeTab, selectedObject]);

  if (!visible) return null;

  const tabs = [
    { id: 'events', label: 'Events', icon: Zap },
    { id: 'logs', label: 'Logs', icon: Activity },
    { id: 'cases', label: 'Cases', icon: AlertTriangle, badge: 7 },
    { id: 'jobs', label: 'Jobs', icon: LayoutList },
    { id: 'audit', label: 'Audit', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare, badge: 3 },
  ];

  return (
    <div className="bg-idpxyz-panelBg flex flex-col shrink-0 select-none" style={{ height }}>
      {/* Panel tabs */}
      <div className="flex items-center justify-between h-[35px] border-b border-idpxyz-border shrink-0">
        <div className="flex items-center h-full">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant="ghost"
              size="sm"
              className={`h-full rounded-none px-3 text-[11px] uppercase tracking-wide border-b-2
                ${activeTab === tab.id
                  ? 'text-idpxyz-text border-b-idpxyz-accent'
                  : 'text-idpxyz-textMuted border-transparent hover:text-idpxyz-text'
                }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.badge !== undefined && (
                <Badge>{tab.badge}</Badge>
              )}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1 mr-2">
          <Button variant="ghost" size="icon" onClick={onMaximize} title={maximized ? 'Restore' : 'Maximize'}>
            {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-auto p-2 text-[12px]">
        {isLoading && <SkeletonEventList rows={6} />}
        {!isLoading && activeTab === 'events' && (
          <div className="space-y-0.5">
            {trackingEvents.map((evt, i) => (
              <div key={i} className="flex items-center gap-3 py-1 text-idpxyz-text">
                <span className="text-idpxyz-textMuted font-mono shrink-0 text-[11px] w-[120px]">{evt.time}</span>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${(evt as any).isAnomaly ? 'bg-red-500/20 text-red-400' : 'bg-idpxyz-hover text-idpxyz-textMuted'}`}>
                  {evt.source}
                </span>
                <span className="truncate">{evt.event}</span>
                <span className="ml-auto text-idpxyz-textMuted shrink-0">{evt.location}</span>
              </div>
            ))}
          </div>
        )}
        {!isLoading && activeTab === 'logs' && (
          <div className="space-y-0.5">
            {[
              { time: '14:32:05', actor: 'System', action: 'Shipment SHP-20240301 status updated to In Transit', level: 'info' },
              { time: '14:28:11', actor: 'Lisa Wang', action: 'Viewed exception EXC-001 details', level: 'info' },
              { time: '14:15:30', actor: 'System', action: 'SLA breach detected for SHP-20240302', level: 'warn' },
              { time: '13:58:22', actor: 'James Chen', action: 'Assigned EXC-002 to self', level: 'info' },
              { time: '13:45:00', actor: 'Scheduler', action: 'Daily KPI report generated', level: 'info' },
              { time: '13:30:15', actor: 'System', action: 'Carrier API timeout for Maersk (retry 2/3)', level: 'warn' },
              { time: '13:15:00', actor: 'Mike Liu', action: 'Escalated EXC-004 to operations manager', level: 'info' },
              { time: '12:58:33', actor: 'System', action: 'Auto-retry successful for booking SHP-20240306', level: 'info' },
            ].map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-0.5 text-idpxyz-text">
                <span className="text-idpxyz-textMuted font-mono shrink-0 text-[11px]">{log.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.level === 'warn' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                <span className="text-idpxyz-accent shrink-0">[{log.actor}]</span>
                <span className="truncate">{log.action}</span>
              </div>
            ))}
          </div>
        )}
        {!isLoading && activeTab === 'cases' && (
          <div className="space-y-1">
            {[
              { id: 'EXC-001', severity: 'critical', reason: 'Customs hold - missing documentation', object: 'SHP-20240302', age: '5h' },
              { id: 'EXC-002', severity: 'high', reason: 'Container damaged during handling', object: 'SHP-20240310', age: '8h' },
              { id: 'EXC-003', severity: 'medium', reason: 'Documentation pending from shipper', object: 'SHP-20240307', age: '1d' },
              { id: 'EXC-004', severity: 'critical', reason: 'Vessel delay - weather', object: 'SHP-20240304-L1', age: '12h' },
              { id: 'EXC-005', severity: 'low', reason: 'Carrier rate discrepancy', object: 'SHP-20240306', age: '3h' },
              { id: 'EXC-006', severity: 'high', reason: 'Address validation failure', object: 'SHP-20240301', age: '2h' },
              { id: 'EXC-007', severity: 'medium', reason: 'Partial fulfillment risk', object: 'ORD-1004', age: '6h' },
            ].map((c) => (
              <div key={c.id} className="flex items-center gap-2 py-1 text-idpxyz-text">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  c.severity === 'critical' ? 'bg-red-500' : c.severity === 'high' ? 'bg-orange-400' : c.severity === 'medium' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <span className="text-idpxyz-accent font-medium shrink-0">{c.id}</span>
                <span className="truncate">{c.reason}</span>
                <span className="ml-auto text-idpxyz-textMuted shrink-0">{c.object}</span>
                <span className="text-idpxyz-textMuted shrink-0">{c.age}</span>
              </div>
            ))}
          </div>
        )}
        {!isLoading && activeTab === 'jobs' && (
          <div className="space-y-1">
            {[
              { id: 'JOB-041', type: 'Booking', status: 'running', target: 'SHP-20240311', started: '2m ago' },
              { id: 'JOB-040', type: 'Label Gen', status: 'completed', target: 'SHP-20240306', started: '15m ago' },
              { id: 'JOB-039', type: 'Rate Calc', status: 'completed', target: 'SHP-20240312', started: '30m ago' },
              { id: 'JOB-038', type: 'Retry', status: 'failed', target: 'SHP-20240310', started: '1h ago' },
              { id: 'JOB-037', type: 'Report', status: 'completed', target: 'Daily KPIs', started: '2h ago' },
            ].map((j) => (
              <div key={j.id} className="flex items-center gap-3 py-1 text-idpxyz-text">
                <span className="text-idpxyz-textMuted font-mono shrink-0 text-[11px]">{j.id}</span>
                <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium bg-idpxyz-hover text-idpxyz-textMuted">{j.type}</span>
                <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  j.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                  j.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{j.status}</span>
                <span className="truncate">{j.target}</span>
                <span className="ml-auto text-idpxyz-textMuted shrink-0">{j.started}</span>
              </div>
            ))}
          </div>
        )}
        {!isLoading && activeTab === 'audit' && (
          <div className="space-y-0.5">
            {[
              { time: '14:30:00', user: 'Lisa Wang', action: 'Updated exception EXC-001 status', detail: 'open \u2192 investigating', ip: '10.0.1.42' },
              { time: '14:15:00', user: 'System', action: 'Auto-escalation triggered', detail: 'EXC-004 overdue 1d', ip: '-' },
              { time: '13:45:00', user: 'James Chen', action: 'Exported shipment data', detail: 'CSV, 142 records', ip: '10.0.1.38' },
              { time: '12:30:00', user: 'Admin', action: 'Updated routing rules', detail: 'CN\u2192US Express lane added', ip: '10.0.1.10' },
              { time: '11:00:00', user: 'System', action: 'Config change detected', detail: 'Carrier Maersk rate table v3.2', ip: '-' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-1 text-idpxyz-text">
                <span className="text-idpxyz-textMuted font-mono shrink-0 text-[11px]">{a.time}</span>
                <span className="text-idpxyz-accent shrink-0">{a.user}</span>
                <span className="truncate">{a.action}</span>
                <span className="text-idpxyz-textMuted truncate">{a.detail}</span>
                <span className="ml-auto text-idpxyz-textMuted shrink-0 font-mono text-[10px]">{a.ip}</span>
              </div>
            ))}
          </div>
        )}
        {!isLoading && activeTab === 'comments' && (
          <div className="space-y-2">
            {[
              { time: '14:22', user: 'Lisa Wang', avatar: 'LW', text: 'Contacted Maersk support for updated ETA. They confirmed vessel is on schedule but port congestion may cause 4-6h delay at destination.', mentions: ['SHP-20240301'] },
              { time: '13:45', user: 'James Chen', avatar: 'JC', text: 'Customer escalation received \u2014 priority upgrade requested. Moving to express handling.', mentions: ['ORD-1002', 'EXC-001'] },
              { time: '11:30', user: 'Mike Liu', avatar: 'ML', text: 'Documentation re-submitted to customs. Awaiting clearance confirmation within 2h.', mentions: ['SHP-20240302'] },
            ].map((c, i) => (
              <div key={i} className="flex gap-2 py-1.5">
                <div className="w-6 h-6 rounded-full bg-idpxyz-accent/20 text-idpxyz-accent text-[10px] font-bold flex items-center justify-center shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-idpxyz-accent font-medium text-[11px]">{c.user}</span>
                    <span className="text-idpxyz-textMuted text-[10px] font-mono">{c.time}</span>
                  </div>
                  <div className="text-idpxyz-text text-[11px] mt-0.5 leading-relaxed">{c.text}</div>
                  {c.mentions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {c.mentions.map((m) => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-accent cursor-pointer hover:underline">{m}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-idpxyz-border">
              <input type="text" placeholder="Add a comment..." className="flex-1 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 text-[11px] text-idpxyz-text outline-none placeholder:text-idpxyz-textMuted" />
              <Button variant="default" size="sm">Send</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
