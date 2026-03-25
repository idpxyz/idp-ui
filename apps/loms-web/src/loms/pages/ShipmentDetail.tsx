import { useState, useEffect, useRef } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import {
  ChevronRight,
  MapPin,
  Truck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Anchor,
  FileText,
  MessageSquare,
  ArrowRight,
  Circle,
  RefreshCw,
  UserPlus,
  GitBranch,
  StickyNote,
  ArrowUpRight,
  Eye,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';
import { Badge } from '@idpxyz/ui-primitives';
import { ConfirmDialog } from '@idpxyz/ui-primitives';
import {
  type Shipment,
  shipmentStatusConfig,
  slaStatusConfig,
  trackingEvents,
  exceptions,
  shipments,
} from '../data/loms';

interface ShipmentDetailProps {
  shipmentId: string;
  onOpenTab?: (tabId: string, tabName: string) => void;
  onSelectShipment?: (shipment: Shipment) => void;
}

type DetailTab = 'summary' | 'route' | 'timeline' | 'tracking' | 'exceptions' | 'documents' | 'audit';

export default function ShipmentDetail({ shipmentId, onOpenTab, onSelectShipment }: ShipmentDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('summary');
  const [actionsOpen, setActionsOpen] = useState(false);
  const [pendingConfirmAction, setPendingConfirmAction] = useState<{ label: string; run: () => void } | null>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const shipment = shipments.find((s) => s.id === shipmentId);
  if (!shipment) {
    return (
      <div className="flex-1 flex items-center justify-center bg-vscode-editor text-vscode-textMuted text-[13px]">
        Shipment {shipmentId} not found
      </div>
    );
  }

  const st = shipmentStatusConfig[shipment.status];
  const sla = slaStatusConfig[shipment.slaStatus];
  const relatedExceptions = exceptions.filter((e) => e.objectId === shipment.id);

  useEffect(() => {
    onSelectShipment?.(shipment);
  }, [shipment, onSelectShipment]);

  const tabs: { id: DetailTab; label: string; badge?: number }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'route', label: 'Route Chain' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'tracking', label: 'Tracking' },
    { id: 'exceptions', label: 'Exceptions', badge: relatedExceptions.length },
    { id: 'documents', label: 'Documents' },
    { id: 'audit', label: 'Audit' },
  ];

  const quickActions = [
    { icon: RefreshCw, label: 'Re-sync tracking', tone: 'neutral' as const, toast: { type: 'success' as const, title: 'Tracking resynced', message: `Sync triggered for ${shipmentId}` } },
    { icon: AlertTriangle, label: 'Open linked case', tone: relatedExceptions.length > 0 ? 'attention' as const : 'neutral' as const, toast: { type: 'info' as const, title: 'Opening case', message: 'Navigating to exception workbench' } },
    { icon: UserPlus, label: 'Assign owner', tone: 'neutral' as const, toast: { type: 'success' as const, title: 'Owner assigned', message: `${shipment.owner} set as owner` } },
    { icon: GitBranch, label: 'Recompute route', tone: 'neutral' as const, toast: { type: 'info' as const, title: 'Route recomputing', message: 'Route recalculation queued' } },
    { icon: StickyNote, label: 'Add note', tone: 'neutral' as const, toast: { type: 'info' as const, title: 'Note added', message: 'Internal note created for this shipment' } },
    { icon: ArrowUpRight, label: 'Escalate', tone: 'attention' as const, toast: { type: 'warning' as const, title: 'Escalated to carrier', message: 'Carrier notified via EDI' } },
    { icon: Eye, label: 'Open raw facts', tone: 'neutral' as const, toast: { type: 'info' as const, title: 'Raw facts opened', message: 'Showing source data trace' } },
  ];

  const executeQuickAction = (action: (typeof quickActions)[number]) => {
    const run = () => {
      addToast(action.toast);
      if (action.tone === 'attention') {
        addToast({
          type: 'info',
          title: 'Action audited',
          message: `${action.label} has been confirmed and recorded.`,
        });
      }
      setActionsOpen(false);
    };

    if (action.tone === 'attention') {
      setPendingConfirmAction({ label: action.label, run });
      return;
    }

    run();
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!actionsMenuRef.current) return;
      if (!actionsMenuRef.current.contains(event.target as Node)) {
        setActionsOpen(false);
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Breadcrumbs */}
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer" onClick={() => onOpenTab?.('shipment-monitor', 'Shipment Monitor')}>Operations</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="hover:text-vscode-textBright cursor-pointer" onClick={() => onOpenTab?.('shipment-monitor', 'Shipment Monitor')}>Shipment Monitor</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">{shipment.id}</span>
      </div>

      {/* Object Header */}
      <div className="px-4 py-3 border-b border-vscode-border shrink-0 bg-vscode-sidebar">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-bold text-vscode-textBright">{shipment.id}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: st.color, backgroundColor: st.bgColor }}>
              {st.label}
            </span>
            {/* subStatus (Section 6.1) */}
            {(shipment.status === 'in_transit' && shipment.slaStatus === 'at_risk') && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                tracking_stale
              </span>
            )}
            {(shipment.status === 'exception') && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                carrier_confirmation_pending
              </span>
            )}
            {/* slaUrgency (Section 6.1) */}
            {(() => {
              const urgency = shipment.slaStatus === 'breached' ? { label: 'BREACHED', cls: 'bg-red-500/20 text-red-400' }
                : shipment.slaStatus === 'at_risk' ? { label: 'BREACH RISK', cls: 'bg-orange-500/20 text-orange-400' }
                : shipment.slaRemainingMinutes !== null && shipment.slaRemainingMinutes < 120 ? { label: 'WATCH', cls: 'bg-yellow-500/20 text-yellow-400' }
                : null;
              return urgency ? (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${urgency.cls}`}>
                  <Shield size={10} /> {urgency.label}
                </span>
              ) : null;
            })()}
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold border" style={{ color: sla.color, backgroundColor: sla.bgColor, borderColor: `${sla.color}55` }}>
              SLA: {sla.label}
            </span>
            <span className="text-[11px] text-vscode-textMuted">Owner: <span className="text-vscode-text font-medium">{shipment.owner}</span></span>
            <span className="text-[11px] text-vscode-textMuted">Updated: <span className="text-vscode-text">{shipment.lastEventTime}</span></span>
          </div>
          {/* Quick Actions */}
          <div className="relative" ref={actionsMenuRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActionsOpen((v) => !v)}
              className="h-7 px-2 text-[11px] text-vscode-textMuted hover:text-vscode-text border border-vscode-border/45 rounded-md gap-1.5"
              title="Object actions"
            >
              <GitBranch size={12} />
              Actions
              <ChevronDown size={12} className={`${actionsOpen ? 'rotate-180' : ''} transition-transform`} />
            </Button>
            {actionsOpen && (
              <div className="absolute right-0 mt-1 w-[220px] rounded-md border border-vscode-border bg-vscode-sidebar shadow-lg z-20 py-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start h-8 rounded-none px-2.5 text-[12px] ${
                      action.tone === 'attention' ? 'hover:text-red-400' : 'hover:text-vscode-text'
                    }`}
                    onClick={() => executeQuickAction(action)}
                  >
                    <action.icon size={12} className="mr-2 shrink-0" />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Summary Strip (Section 7.1 â€?carrier / activeLeg / promise / owner / network) */}
        <div className="flex items-center gap-5 text-[12px] text-vscode-textMuted flex-wrap">
          <span className="flex items-center gap-1"><MapPin size={12} /> {shipment.origin}</span>
          <ArrowRight size={12} />
          <span className="flex items-center gap-1"><MapPin size={12} /> {shipment.destination}</span>
          <span className="text-vscode-border">|</span>
          <span className="flex items-center gap-1"><Truck size={12} /> {shipment.carrier} Â· {shipment.service}</span>
          <span className="text-vscode-border">|</span>
          <span className="flex items-center gap-1"><Package size={12} /> Active: <span className="text-vscode-text font-medium">{shipment.currentLeg}</span></span>
          <span className="text-vscode-border">|</span>
          <span className="flex items-center gap-1"><Clock size={12} /> Promise: <span className="text-vscode-text">{shipment.promisedDate}</span></span>
          {shipment.slaRemainingMinutes !== null && (
            <span className={`flex items-center gap-1 text-[11px] font-medium ${
              shipment.slaRemainingMinutes < 0 ? 'text-red-400' : shipment.slaRemainingMinutes < 120 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              ETA Â±{Math.abs(shipment.slaRemainingMinutes) < 60
                ? `${Math.abs(shipment.slaRemainingMinutes)}m`
                : `${Math.floor(Math.abs(shipment.slaRemainingMinutes) / 60)}h`}
              {shipment.slaRemainingMinutes < 0 ? ' overdue' : ''}
            </span>
          )}
          <span className="text-vscode-border">|</span>
          <span className="flex items-center gap-1 text-vscode-text font-medium">{shipment.weight}</span>
        </div>
      </div>
      <ConfirmDialog
        open={!!pendingConfirmAction}
        title="Confirm high-risk action"
        message={`This action may affect execution flow. Are you sure you want to continue with "${pendingConfirmAction?.label || ''}"?`}
        confirmLabel="Confirm & Continue"
        tone="warning"
        onCancel={() => setPendingConfirmAction(null)}
        onConfirm={() => {
          const action = pendingConfirmAction;
          setPendingConfirmAction(null);
          action?.run();
        }}
      />

      {/* Detail tabs */}
      <div className="flex items-center h-[32px] border-b border-vscode-border shrink-0 px-2 bg-vscode-sidebar">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            size="sm"
            className={`h-full rounded-none px-3 text-[11px] border-b-2 ${
              activeTab === tab.id
                ? 'text-vscode-text border-b-vscode-accent'
                : 'text-vscode-textMuted border-transparent hover:text-vscode-text'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="danger">{tab.badge}</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 bg-vscode-editor">
          <div className="min-h-full rounded-md border border-vscode-border bg-vscode-bg p-4">
            {activeTab === 'summary' && <SummaryTab shipment={shipment} openExceptionCount={relatedExceptions.length} />}
            {activeTab === 'route' && <RouteTab shipment={shipment} />}
            {activeTab === 'timeline' && <TimelineTab shipment={shipment} />}
            {activeTab === 'tracking' && <TrackingTab />}
            {activeTab === 'exceptions' && <ExceptionsTab exceptions={relatedExceptions} />}
            {activeTab === 'documents' && <DocumentsTab shipment={shipment} />}
            {activeTab === 'audit' && <AuditTab shipment={shipment} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Summary Tab ----
function SummaryTab({ shipment, openExceptionCount }: { shipment: Shipment; openExceptionCount: number }) {
  const sla = slaStatusConfig[shipment.slaStatus];
  return (
    <div className="max-w-[900px] space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Shipment Basics */}
        <div className="bg-vscode-sidebar rounded p-4 border border-vscode-border">
          <h3 className="text-[11px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-3">Basic Info</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Shipment ID', value: shipment.id },
              { label: 'Order Ref', value: shipment.orderId },
              { label: 'FR Ref', value: `FR-${shipment.orderId.replace('ORD-', '')}` },
              { label: 'Service Level', value: shipment.service },
              { label: 'Created', value: shipment.createdAt },
              { label: 'Weight', value: shipment.weight },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-[12px]">
                <span className="text-vscode-textMuted">{r.label}</span>
                <span className="text-vscode-text font-medium">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Origin / Destination */}
        <div className="bg-vscode-sidebar rounded p-4 border border-vscode-border">
          <h3 className="text-[11px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-3">Origin / Destination</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Circle size={8} className="text-green-400" fill="currentColor" />
              </div>
              <div>
                <div className="text-[11px] text-vscode-textMuted">Ship-from (Origin)</div>
                <div className="text-[12px] text-vscode-text font-medium">{shipment.origin}</div>
                <div className="text-[10px] text-vscode-textMuted">Region: APAC</div>
              </div>
            </div>
            <div className="ml-2.5 border-l-2 border-dashed border-vscode-border h-4" />
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={10} className="text-blue-400" />
              </div>
              <div>
                <div className="text-[11px] text-vscode-textMuted">Ship-to (Destination)</div>
                <div className="text-[12px] text-vscode-text font-medium">{shipment.destination}</div>
                <div className="text-[10px] text-vscode-textMuted">Lane: {shipment.origin.split(',')[0]} ¡ú {shipment.destination.split(',')[0]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Execution Snapshot (Section 8.1 executionSnapshot) */}
        <div className="bg-vscode-sidebar rounded p-4 border border-vscode-border">
          <h3 className="text-[11px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-3">Current Execution Snapshot</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Current Leg', value: shipment.currentLeg },
              { label: 'Current Node', value: shipment.completedLegs < shipment.legs ? `Hub ${shipment.completedLegs + 1}` : shipment.destination },
              { label: 'Last Milestone', value: shipment.lastEvent },
              { label: 'Time in State', value: shipment.lastEventTime },
              { label: 'Next Expected Milestone', value: shipment.status === 'delivered' ? 'Completed' : shipment.status === 'in_transit' ? 'Arrival at destination hub' : shipment.status === 'out_for_delivery' ? 'Delivered to consignee' : 'Carrier pickup scan' },
              { label: 'ETA Confidence', value: shipment.slaStatus === 'on_track' ? 'High (85%)' : shipment.slaStatus === 'at_risk' ? 'Medium (62%)' : 'Low (31%)' },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-[12px]">
                <span className="text-vscode-textMuted">{r.label}</span>
                <span className="text-vscode-text font-medium text-right max-w-[55%] truncate">{r.value}</span>
              </div>
            ))}
            {/* Tracking Health (Section 11.1 preload.trackingHealth) */}
            <div className="pt-1 border-t border-vscode-border">
              <div className="text-[10px] text-vscode-textMuted mb-1.5">Tracking Health</div>
              {(() => {
                const stale = shipment.slaStatus === 'breached' || shipment.status === 'exception';
                const health = stale ? 'stale' : shipment.slaStatus === 'at_risk' ? 'degraded' : 'healthy';
                const staleHours = stale ? Math.abs(Math.floor((shipment.slaRemainingMinutes ?? -360) / 60)) : 0;
                return (
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                      health === 'stale' ? 'bg-red-500/10 text-red-400' : health === 'degraded' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
                    }`}>{health}</span>
                    <span className="text-[10px] text-vscode-textMuted">
                      {health === 'stale' ? `stale ${staleHours}h` : `last update: ${shipment.lastEventTime}`}
                    </span>
                  </div>
                );
              })()}
            </div>
            <div className="pt-1">
              <div className="text-[10px] text-vscode-textMuted mb-1">Leg Progress</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: shipment.legs }).map((_, i) => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${i < shipment.completedLegs ? 'bg-green-400' : i === shipment.completedLegs ? 'bg-blue-400' : 'bg-vscode-border'}`} />
                ))}
              </div>
              <div className="text-[10px] text-vscode-textMuted mt-1">{shipment.completedLegs}/{shipment.legs} completed</div>
            </div>
          </div>
        </div>

        {/* Cost / Promise Snapshot (Section 5.4-D) */}
        <div className="bg-vscode-sidebar rounded p-4 border border-vscode-border">
          <h3 className="text-[11px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-3">Cost / Promise Snapshot</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-[12px]">
              <span className="text-vscode-textMuted">Expected Cost</span>
              <span className="text-vscode-text font-medium">$1,280.00</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-vscode-textMuted">Actual Known Cost</span>
              <span className="text-vscode-text font-medium">$1,142.50</span>
            </div>
            <div className="flex justify-between text-[12px] items-center">
              <span className="text-vscode-textMuted">Cost Variance</span>
              <span className="text-green-400 font-medium text-[11px]">âˆ?137.50 (under budget)</span>
            </div>
            <div className="h-px bg-vscode-border my-1" />
            <div className="flex justify-between text-[12px]">
              <span className="text-vscode-textMuted">Promise Window</span>
              <span className="text-vscode-text font-medium">{shipment.promisedDate}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-vscode-textMuted">Expected Delivery</span>
              <span className="text-vscode-text font-medium">{shipment.status === 'delivered' ? shipment.promisedDate : 'In transit'}</span>
            </div>
            <div className="flex justify-between text-[12px] items-center">
              <span className="text-vscode-textMuted">SLA Status</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>
                {sla.label}
              </span>
            </div>
            {shipment.slaStatus !== 'on_track' && (
              <div className={`flex items-center gap-1.5 text-[11px] p-2 rounded ${
                shipment.slaStatus === 'breached' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                <AlertTriangle size={11} />
                {shipment.slaStatus === 'breached' ? 'SLA breached â€?escalation required' : 'Delivery at risk â€?monitor closely'}
              </div>
            )}
            {/* SLA Summary: breach risk score (Section 9.1 slaSummary) */}
            <div className="pt-1 border-t border-vscode-border">
              <div className="text-[10px] text-vscode-textMuted mb-1.5">Breach Risk Score</div>
              {(() => {
                const score = shipment.slaStatus === 'breached' ? 95 : shipment.slaStatus === 'at_risk' ? 68 : shipment.riskLevel === 'high' ? 42 : 12;
                return (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-vscode-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score > 70 ? 'bg-red-400' : score > 40 ? 'bg-yellow-400' : 'bg-green-400'}`} style={{ width: `${score}%` }} />
                    </div>
                    <span className={`text-[11px] font-bold ${score > 70 ? 'text-red-400' : score > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{score}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Business Flags (Section 8.1 businessFlags[]) */}
      {(() => {
        const flags: { code: string; label: string; color: string }[] = [
          ...(shipment.origin.includes('CN') || shipment.destination.includes('CN') ? [{ code: 'international', label: 'International', color: 'text-blue-400 bg-blue-500/10' }] : []),
          ...(shipment.legs > 1 ? [{ code: 'handoff_required', label: 'Multi-leg handoff', color: 'text-purple-400 bg-purple-500/10' }] : []),
          ...(openExceptionCount > 0 ? [{ code: 'exception_open', label: `${openExceptionCount} Open Case${openExceptionCount > 1 ? 's' : ''}`, color: 'text-red-400 bg-red-500/10' }] : []),
          ...(shipment.slaStatus !== 'on_track' ? [{ code: 'tracking_unstable', label: 'Tracking unstable', color: 'text-yellow-400 bg-yellow-500/10' }] : []),
          { code: 'customs_required', label: 'Customs required', color: 'text-orange-400 bg-orange-500/10' },
        ];
        return flags.length > 0 ? (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {flags.map((f) => (
              <span key={f.code} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${f.color}`}>{f.label}</span>
            ))}
          </div>
        ) : null;
      })()}
    </div>
  );
}

// ---- Route Tab ----
function RouteTab({ shipment }: { shipment: Shipment }) {
  const legTypes = ['First Mile', 'Line Haul', 'Last Mile', 'Cross-dock'];
  const legs = Array.from({ length: shipment.legs }, (_, i) => ({
    seq: i + 1,
    legNo: `LEG-${shipment.id.replace('SHP-', '')}-${String(i + 1).padStart(2, '0')}`,
    legType: legTypes[i % legTypes.length],
    status: i < shipment.completedLegs ? 'completed' : i === shipment.completedLegs ? 'active' : 'pending',
    origin: i === 0 ? shipment.origin : `Hub ${i}`,
    destination: i === shipment.legs - 1 ? shipment.destination : `Hub ${i + 1}`,
    carrier: shipment.carrier,
    plannedStart: `2024-03-${String(5 + i * 2).padStart(2, '0')} 08:00`,
    plannedEnd: `2024-03-${String(6 + i * 2).padStart(2, '0')} 18:00`,
    actualStart: i < shipment.completedLegs ? `2024-03-${String(5 + i * 2).padStart(2, '0')} 08:${15 + i * 5}` : i === shipment.completedLegs ? `2024-03-${String(5 + i * 2).padStart(2, '0')} 08:30` : null,
    actualEnd: i < shipment.completedLegs ? `2024-03-${String(6 + i * 2).padStart(2, '0')} 17:${45 - i * 3}` : null,
    dwellMinutes: i < shipment.completedLegs ? 90 + i * 30 : null,
  }));

  return (
    <div className="max-w-[800px]">
      <div className="space-y-0">
        {legs.map((leg, i) => (
          <div key={leg.seq} className="flex items-stretch gap-3">
            {/* Timeline */}
            <div className="flex flex-col items-center w-6 shrink-0">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                leg.status === 'completed' ? 'bg-green-400' : leg.status === 'active' ? 'bg-blue-400' : 'bg-vscode-border'
              }`}>
                {leg.status === 'completed' ? <CheckCircle size={10} className="text-white" /> : leg.status === 'active' ? <Truck size={10} className="text-white" /> : <Circle size={8} className="text-vscode-textMuted" />}
              </div>
              {i < legs.length - 1 && (
                <div className={`flex-1 w-0.5 my-1 ${leg.status === 'completed' ? 'bg-green-400' : 'bg-vscode-border'}`} />
              )}
            </div>

            {/* Leg card */}
            <div className={`flex-1 mb-3 rounded p-3 border text-[12px] ${
              leg.status === 'active' ? 'bg-blue-500/5 border-blue-500/30' : 'bg-vscode-sidebar border-vscode-border'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-vscode-textBright">Leg {leg.seq}</span>
                  <span className="text-[10px] text-vscode-textMuted font-mono">{leg.legNo}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted">{leg.legType}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  leg.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  leg.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-vscode-hover text-vscode-textMuted'
                }`}>{leg.status}</span>
              </div>
              <div className="flex items-center gap-2 text-vscode-textMuted mb-2">
                <span>{leg.origin}</span>
                <ArrowRight size={12} />
                <span>{leg.destination}</span>
                <span className="ml-auto flex items-center gap-1"><Anchor size={11} /> {leg.carrier}</span>
              </div>
              {/* Planned vs Actual times */}
              <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-vscode-border text-[11px]">
                <div>
                  <div className="text-[10px] text-vscode-textMuted uppercase tracking-wider mb-1">Planned</div>
                  <div className="flex items-center gap-1 text-vscode-textMuted">
                    <Clock size={10} /> {leg.plannedStart} ¡ú{leg.plannedEnd.split(' ')[1]}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-vscode-textMuted uppercase tracking-wider mb-1">Actual</div>
                  {leg.actualStart ? (
                    <div className="flex items-center gap-1 text-vscode-text">
                      <Clock size={10} /> {leg.actualStart.split(' ')[1]} ¡ú{leg.actualEnd ? leg.actualEnd.split(' ')[1] : <span className="text-blue-400">in progress</span>}
                    </div>
                  ) : (
                    <span className="text-vscode-textMuted">â€?¡ª</span>
                  )}
                </div>
              </div>
              {/* Dwell time */}
              {leg.dwellMinutes !== null && (
                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  <span className="text-vscode-textMuted">Dwell at handoff:</span>
                  <span className={`font-medium ${leg.dwellMinutes > 120 ? 'text-yellow-400' : 'text-vscode-text'}`}>{leg.dwellMinutes}m</span>
                  {leg.dwellMinutes > 120 && <AlertTriangle size={10} className="text-yellow-400" />}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Handoff nodes */}
      <div className="mt-4 p-3 bg-vscode-sidebar rounded border border-vscode-border">
        <h4 className="text-[11px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">Handoff Points</h4>
        <div className="flex items-center gap-2 text-[12px] flex-wrap">
          {[shipment.origin, ...Array.from({ length: shipment.legs - 1 }, (_, i) => `Hub ${i + 1}`), shipment.destination].map((node, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-[11px] ${
                i <= shipment.completedLegs ? 'bg-green-500/10 text-green-400 font-medium' : 'bg-vscode-hover text-vscode-textMuted'
              }`}>{node}</span>
              {i < arr.length - 1 && <ArrowRight size={12} className="text-vscode-textMuted" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Tracking Tab ----
function TrackingTab() {
  const [trackingView, setTrackingView] = useState<'normalized' | 'raw'>('normalized');

  const rawCarrierEvents = [
    { code: 'PU', description: 'Shipment picked up from shipper', timestamp: '2024-03-05 08:30:00 CST', provider: 'Maersk API', mapped: 'Picked Up' },
    { code: 'DP', description: 'Departed from origin terminal', timestamp: '2024-03-05 14:00:00 CST', provider: 'Maersk API', mapped: 'Departed Origin' },
    { code: 'AR', description: 'Arrived at transshipment port CNSHA', timestamp: '2024-03-06 02:15:00 CST', provider: 'Maersk API', mapped: 'Arrived Hub' },
    { code: 'VD', description: 'Vessel departed CNSHA', timestamp: '2024-03-06 18:00:00 CST', provider: 'Maersk AIS', mapped: 'In Transit' },
    { code: 'VA', description: 'Vessel arrived KRPUS', timestamp: '2024-03-07 22:30:00 KST', provider: 'Maersk AIS', mapped: 'Arrived at Port' },
    { code: 'CU', description: 'Customs clearance initiated', timestamp: '2024-03-08 06:00:00 KST', provider: 'Customs EDI', mapped: 'Customs Processing' },
    { code: 'CC', description: 'Customs cleared', timestamp: '2024-03-08 14:45:00 KST', provider: 'Customs EDI', mapped: 'Customs Cleared' },
    { code: 'OL', description: 'Container loaded on vessel MSC-ANNA', timestamp: '2024-03-09 08:00:00 KST', provider: 'Maersk API', mapped: 'Loaded on Vessel' },
    { code: 'DL', description: 'DELAY: Vessel departure delayed weather', timestamp: '2024-03-09 22:00:00 KST', provider: 'Maersk Alert', mapped: '[Delay]Delay Detected' },
  ];

  return (
    <div className="max-w-[700px]">
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center border border-vscode-border rounded overflow-hidden text-[11px]">
          <Button
            onClick={() => setTrackingView('normalized')}
            variant={trackingView === 'normalized' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
          >
            Normalized Tracking
          </Button>
          <Button
            onClick={() => setTrackingView('raw')}
            variant={trackingView === 'raw' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-none"
          >
            Raw Carrier Events
          </Button>
        </div>
        <span className="text-[10px] text-vscode-textMuted ml-auto">Last sync: 2 min ago</span>
      </div>

      {trackingView === 'normalized' ? (
        <>
          {trackingEvents.map((evt, i) => (
            <div key={i} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                  i === 0 ? 'bg-vscode-accent' : evt.isAnomaly ? 'bg-red-400' : 'bg-vscode-border'
                }`} />
                {i < trackingEvents.length - 1 && <div className="flex-1 w-0.5 my-0.5 bg-vscode-border" />}
              </div>
              <div className={`flex-1 mb-2 rounded p-3 border text-[12px] ${
                evt.isAnomaly ? 'bg-red-500/5 border-red-500/30' : 'bg-vscode-sidebar border-vscode-border'
              }`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-vscode-textBright font-medium">{evt.event}</span>
                  {evt.isAnomaly && <AlertTriangle size={13} className="text-red-400" />}
                </div>
                <div className="flex items-center gap-3 text-vscode-textMuted text-[11px]">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {evt.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {evt.time}</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded bg-vscode-hover text-[10px]">{evt.source}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="text-vscode-textMuted text-left">
              <th className="px-3 py-2 font-medium border-b border-vscode-border w-[50px]">Code</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Original Description</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Provider Timestamp</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Source</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Mapped Event</th>
            </tr>
          </thead>
          <tbody>
            {rawCarrierEvents.map((evt, i) => (
              <tr key={i} className={`hover:bg-vscode-hover ${evt.code === 'DL' ? 'bg-red-500/5' : ''}`}>
                <td className="px-3 py-2 border-b border-vscode-border font-mono text-vscode-accent">{evt.code}</td>
                <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{evt.description}</td>
                <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted text-[11px] font-mono">{evt.timestamp}</td>
                <td className="px-3 py-2 border-b border-vscode-border"><span className="px-1.5 py-0.5 rounded bg-vscode-hover text-[10px] text-vscode-textMuted">{evt.provider}</span></td>
                <td className="px-3 py-2 border-b border-vscode-border text-vscode-text text-[11px]">{evt.mapped}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---- Exceptions Tab ----
function ExceptionsTab({ exceptions: excList }: { exceptions: typeof exceptions }) {
  if (excList.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-vscode-textMuted text-[12px]">
        <CheckCircle size={16} className="mr-2 text-green-400" />
        No exceptions for this shipment
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-[700px]">
      {excList.map((exc) => (
        <div key={exc.id} className="bg-vscode-sidebar rounded p-3 border border-vscode-border">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
              exc.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
              exc.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
              exc.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>{exc.severity}</span>
            <span className="text-[12px] text-vscode-accent font-medium">{exc.id}</span>
            <span className="ml-auto text-[11px] text-vscode-textMuted capitalize">{exc.status}</span>
          </div>
          <div className="text-[12px] text-vscode-text mb-1">{exc.reason}</div>
          <div className="text-[11px] text-vscode-textMuted">{exc.description}</div>
          <div className="mt-2 flex items-start gap-2 bg-blue-500/10 rounded p-2 text-[11px]">
            <CheckCircle size={12} className="text-blue-400 shrink-0 mt-0.5" />
            <span className="text-vscode-text">{exc.recommendedAction}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Documents Tab ----
function DocumentsTab({ shipment }: { shipment: Shipment }) {
  const docs = [
    { name: 'Bill of Lading', type: 'PDF', size: '245 KB', date: shipment.createdAt, status: 'available' },
    { name: 'Commercial Invoice', type: 'PDF', size: '128 KB', date: shipment.createdAt, status: 'available' },
    { name: 'Packing List', type: 'PDF', size: '89 KB', date: shipment.createdAt, status: 'available' },
    { name: 'Customs Declaration', type: 'PDF', size: '312 KB', date: shipment.createdAt, status: shipment.status === 'exception' ? 'missing' : 'available' },
    { name: 'Shipping Label', type: 'PDF', size: '56 KB', date: shipment.createdAt, status: 'available' },
    { name: 'Certificate of Origin', type: 'PDF', size: '178 KB', date: shipment.createdAt, status: 'pending' },
  ];

  return (
    <div className="max-w-[700px]">
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="text-vscode-textMuted text-left">
            <th className="px-3 py-2 font-medium border-b border-vscode-border">Document</th>
            <th className="px-3 py-2 font-medium border-b border-vscode-border">Type</th>
            <th className="px-3 py-2 font-medium border-b border-vscode-border">Size</th>
            <th className="px-3 py-2 font-medium border-b border-vscode-border">Date</th>
            <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.name} className="hover:bg-vscode-hover cursor-pointer">
              <td className="px-3 py-2 border-b border-vscode-border">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-vscode-textMuted" />
                  <span className="text-vscode-text">{doc.name}</span>
                </div>
              </td>
              <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted">{doc.type}</td>
              <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted">{doc.size}</td>
              <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted">{doc.date}</td>
              <td className="px-3 py-2 border-b border-vscode-border text-center">
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                  doc.status === 'available' ? 'bg-green-500/20 text-green-400' :
                  doc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{doc.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Timeline Tab (Section 5.6 â€?unified timeline of all events) ----
function TimelineTab({ shipment }: { shipment: Shipment }) {
  const timelineEntries = [
    { time: '12:22', source: 'USPS', type: 'carrier_scan', desc: 'Carrier scan received', mapped: 'InTransit' },
    { time: '12:35', source: 'System', type: 'state_change', desc: 'Shipment status updated', mapped: 'tracking sync job' },
    { time: '13:10', source: 'Rule Engine', type: 'risk', desc: 'Risk score raised â€?SLA risk detected', mapped: '' },
    { time: '13:22', source: 'Monitor', type: 'case', desc: 'Exception case suggested â€?pending confirmation', mapped: '' },
    { time: '14:05', source: shipment.owner !== 'Unassigned' ? shipment.owner : 'Amy', type: 'user_note', desc: '"customer asked for ETA update"', mapped: '' },
    { time: '14:30', source: 'System', type: 'state_change', desc: `Status: ${shipmentStatusConfig[shipment.status].label}`, mapped: '' },
  ];

  const typeColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    carrier_scan: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Truck },
    state_change: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Package },
    risk: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
    case: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertTriangle },
    user_note: { bg: 'bg-green-500/20', text: 'text-green-400', icon: MessageSquare },
  };

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center gap-2 mb-4 text-[11px] text-vscode-textMuted">
        <span>Showing unified timeline for {shipment.id}</span>
        <span className="ml-auto">Last updated: 2 min ago</span>
      </div>
      <div className="space-y-0">
        {timelineEntries.map((entry, i) => {
          const tc = typeColors[entry.type] || { bg: 'bg-vscode-hover', text: 'text-vscode-textMuted', icon: Clock };
          const EntryIcon = tc.icon;
          return (
            <div key={i} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${tc.bg}`}>
                  <EntryIcon size={10} className={tc.text} />
                </div>
                {i < timelineEntries.length - 1 && <div className="flex-1 w-0.5 my-0.5 bg-vscode-border" />}
              </div>
              <div className="flex-1 mb-2 rounded p-2.5 border bg-vscode-sidebar border-vscode-border text-[12px]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-vscode-textBright font-medium">{entry.desc}</span>
                  <span className="text-[10px] text-vscode-textMuted font-mono">{entry.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-vscode-textMuted">
                  <span>source: {entry.source}</span>
                  {entry.mapped && <span>normalized: {entry.mapped}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Audit Tab (Section 5.10) ----
function AuditTab({ shipment }: { shipment: Shipment }) {
  const activities = [
    { time: '14:30:00', actor: 'System', type: 'state_change', desc: `Status changed to ${shipmentStatusConfig[shipment.status].label}` },
    { time: '14:15:00', actor: 'Lisa Wang', type: 'comment', desc: 'Contacted carrier for updated ETA. Response expected within 2h.' },
    { time: '13:00:00', actor: 'System', type: 'event', desc: shipment.lastEvent },
    { time: '11:30:00', actor: 'James Chen', type: 'action', desc: 'Verified documentation and uploaded to carrier portal.' },
    { time: '09:00:00', actor: 'System', type: 'state_change', desc: 'SLA status updated based on latest tracking.' },
    { time: '08:00:00', actor: 'Scheduler', type: 'event', desc: 'Automated tracking poll completed.' },
  ];

  return (
    <div className="max-w-[700px] space-y-1">
      {activities.map((act, i) => (
        <div key={i} className="flex items-start gap-3 py-2 text-[12px] border-b border-vscode-border last:border-0">
          <span className="text-vscode-textMuted font-mono shrink-0 text-[11px] mt-0.5">{act.time}</span>
          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
            act.type === 'state_change' ? 'bg-blue-500/20' :
            act.type === 'comment' ? 'bg-purple-500/20' :
            act.type === 'action' ? 'bg-green-500/20' :
            'bg-vscode-hover'
          }`}>
            {act.type === 'comment' ? <MessageSquare size={11} className="text-purple-400" /> :
             act.type === 'action' ? <CheckCircle size={11} className="text-green-400" /> :
             act.type === 'state_change' ? <Package size={11} className="text-blue-400" /> :
             <Clock size={11} className="text-vscode-textMuted" />}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-vscode-accent mr-1.5">{act.actor}</span>
            <span className="text-vscode-text">{act.desc}</span>
          </div>
        </div>
      ))}
    </div>
  );
}




