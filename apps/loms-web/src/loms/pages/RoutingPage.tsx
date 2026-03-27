import { useState } from 'react';
import { ChevronRight, GitBranch, CheckCircle, Clock, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { shipments } from '../data/loms';
import { Button } from '@idpxyz/ui-primitives';
import { Badge } from '@idpxyz/ui-primitives';

interface RoutingPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type RoutingTab = 'decisions' | 'recompute';

const routingDecisions = [
  { id: 'RD-001', shipment: 'SHP-20240301', type: 'Initial Route', from: 'Shanghai, CN', to: 'Los Angeles, US', selectedCarrier: 'Maersk', selectedService: 'Ocean FCL', alternativeCount: 3, cost: '$2,450', transit: '14d', reason: 'Lowest cost within SLA window', decidedAt: '2024-03-01 09:00', decidedBy: 'Auto' },
  { id: 'RD-002', shipment: 'SHP-20240302', type: 'Re-route', from: 'Busan, KR', to: 'Rotterdam, NL', selectedCarrier: 'DHL', selectedService: 'Air Express', alternativeCount: 2, cost: '$4,800', transit: '3d', reason: 'SLA breach risk - upgraded to air', decidedAt: '2024-03-02 14:30', decidedBy: 'Lisa Wang' },
  { id: 'RD-003', shipment: 'SHP-20240305', type: 'Initial Route', from: 'Tokyo, JP', to: 'Hamburg, DE', selectedCarrier: 'Evergreen', selectedService: 'Ocean FCL', alternativeCount: 4, cost: '$1,980', transit: '21d', reason: 'Best transit time for standard service', decidedAt: '2024-03-04 11:15', decidedBy: 'Auto' },
  { id: 'RD-004', shipment: 'SHP-20240307', type: 'Fallback', from: 'Ho Chi Minh, VN', to: 'Sydney, AU', selectedCarrier: 'COSCO', selectedService: 'Ocean LCL', alternativeCount: 2, cost: '$1,200', transit: '18d', reason: 'Primary carrier unavailable', decidedAt: '2024-03-05 16:45', decidedBy: 'Auto' },
  { id: 'RD-005', shipment: 'SHP-20240310', type: 'Re-route', from: 'Shenzhen, CN', to: 'New York, US', selectedCarrier: 'FedEx', selectedService: 'Air Freight', alternativeCount: 3, cost: '$5,600', transit: '5d', reason: 'Container damage - emergency re-route', decidedAt: '2024-03-06 08:20', decidedBy: 'James Chen' },
];

const recomputeTasks = [
  { id: 'RC-001', shipment: 'SHP-20240304', trigger: 'Vessel delay detected', status: 'completed', alternatives: 3, selected: 'Keep current route', computedAt: '2h ago', duration: '12s' },
  { id: 'RC-002', shipment: 'SHP-20240302', trigger: 'SLA breach imminent', status: 'completed', alternatives: 2, selected: 'Upgrade to air freight', computedAt: '4h ago', duration: '8s' },
  { id: 'RC-003', shipment: 'SHP-20240310', trigger: 'Carrier API failure', status: 'pending_review', alternatives: 4, selected: null, computedAt: '30m ago', duration: '15s' },
  { id: 'RC-004', shipment: 'SHP-20240307', trigger: 'Cost optimization', status: 'completed', alternatives: 2, selected: 'Switch to COSCO LCL', computedAt: '1d ago', duration: '10s' },
  { id: 'RC-005', shipment: 'SHP-20240311', trigger: 'New booking request', status: 'running', alternatives: 0, selected: null, computedAt: 'now', duration: '-' },
];

export default function RoutingPage({ onOpenTab }: RoutingPageProps) {
  const [activeTab, setActiveTab] = useState<RoutingTab>('decisions');

  const tabs: { id: RoutingTab; label: string; badge?: number }[] = [
    { id: 'decisions', label: 'Decision Center' },
    { id: 'recompute', label: 'Recompute Tasks', badge: recomputeTasks.filter((t) => t.status === 'pending_review' || t.status === 'running').length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-idpxyz-breadcrumb bg-idpxyz-editor border-b border-idpxyz-border shrink-0 select-none">
        <span className="hover:text-idpxyz-textBright cursor-pointer">Management</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-text">Routing</span>
      </div>

      <div className="flex items-center h-[32px] border-b border-idpxyz-border shrink-0 px-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            size="sm"
            className={`h-full rounded-none px-3 text-[11px] border-b-2 border-r border-idpxyz-border/50 last:border-r-0 ${
              activeTab === tab.id ? 'text-idpxyz-text border-b-idpxyz-accent' : 'text-idpxyz-textMuted border-transparent hover:text-idpxyz-text'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="warning">{tab.badge}</Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'decisions' && (
          <div className="space-y-2">
            {routingDecisions.map((rd) => (
              <div key={rd.id} className="bg-idpxyz-sidebar rounded p-3 border border-idpxyz-border">
                <div className="flex items-center gap-2 mb-1.5">
                  <GitBranch size={13} className="text-idpxyz-textMuted" />
                  <span className="text-[12px] text-idpxyz-accent font-medium">{rd.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted font-medium">{rd.type}</span>
                  <span
                    className="text-[11px] text-idpxyz-accent cursor-pointer hover:underline"
                    onClick={() => onOpenTab?.(`shipment-detail-${rd.shipment}`, `Shipment ${rd.shipment}`)}
                  >{rd.shipment}</span>
                  <span className="ml-auto text-[10px] text-idpxyz-textMuted">{rd.decidedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-idpxyz-text mb-1">
                  <span>{rd.from}</span>
                  <ArrowRight size={12} className="text-idpxyz-textMuted" />
                  <span>{rd.to}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-idpxyz-textMuted">
                  <span className="text-idpxyz-textBright font-medium">{rd.selectedCarrier} Â· {rd.selectedService}</span>
                  <span>Cost: {rd.cost}</span>
                  <span>Transit: {rd.transit}</span>
                  <span>{rd.alternativeCount} alternatives evaluated</span>
                  <span className="ml-auto">By: {rd.decidedBy}</span>
                </div>
                <div className="mt-1.5 text-[11px] text-idpxyz-textMuted italic">{rd.reason}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recompute' && (
          <div className="space-y-2">
            {recomputeTasks.map((rc) => (
              <div key={rc.id} className={`bg-idpxyz-sidebar rounded p-3 border ${
                rc.status === 'pending_review' ? 'border-yellow-500/30' : rc.status === 'running' ? 'border-blue-500/30' : 'border-idpxyz-border'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <RefreshCw size={13} className={rc.status === 'running' ? 'text-blue-400 animate-spin' : 'text-idpxyz-textMuted'} />
                  <span className="text-[12px] text-idpxyz-accent font-medium">{rc.id}</span>
                  <span
                    className="text-[11px] text-idpxyz-accent cursor-pointer hover:underline"
                    onClick={() => onOpenTab?.(`shipment-detail-${rc.shipment}`, `Shipment ${rc.shipment}`)}
                  >{rc.shipment}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    rc.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    rc.status === 'pending_review' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{rc.status.replace('_', ' ')}</span>
                </div>
                <div className="text-[12px] text-idpxyz-text mb-1">
                  <AlertTriangle size={11} className="inline mr-1 text-yellow-400" />
                  Trigger: {rc.trigger}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-idpxyz-textMuted">
                  <span>{rc.alternatives} alternatives</span>
                  {rc.selected && <span className="text-green-400">¡ú{rc.selected}</span>}
                  <span className="flex items-center gap-1"><Clock size={10} /> {rc.computedAt}</span>
                  <span>Duration: {rc.duration}</span>
                </div>
                {rc.status === 'pending_review' && (
                  <div className="mt-2 flex items-center gap-2">
                    <Button variant="default" size="sm">Review & Approve</Button>
                    <Button variant="secondary" size="sm">Dismiss</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




