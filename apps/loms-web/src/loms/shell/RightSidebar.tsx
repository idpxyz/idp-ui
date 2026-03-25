import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Truck,
  MapPin,
  Hash,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Calendar,
  Package,
  Anchor,
  User,
  Shield,
  Link,
  Bell,
  RefreshCw,
  UserPlus,
  RotateCcw,
  ArrowUpRight,
  FileText,
  GitBranch,
} from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Shipment,
  type Exception,
  shipmentStatusConfig,
  slaStatusConfig,
  exceptionSeverityConfig,
  trackingEvents,
  exceptions as allExceptions,
} from '../data/loms';

interface RightSidebarProps {
  width: number;
  selectedObject: Shipment | Exception | null;
}

function Section({
  title,
  defaultExpanded = false,
  children,
}: {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="border-b border-vscode-border">
      <div
        className="flex items-center h-[22px] px-2 text-[11px] uppercase font-bold tracking-wide cursor-pointer hover:bg-vscode-hover"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown size={14} className="mr-1" /> : <ChevronRight size={14} className="mr-1" />}
        <span>{title}</span>
      </div>
      {expanded && <div className="pb-2">{children}</div>}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, valueColor }: { icon: React.ElementType; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-1.5 text-[12px]">
      <Icon size={13} className="text-vscode-textMuted shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-vscode-textMuted text-[11px]">{label}</div>
        <div className={`truncate ${valueColor || 'text-vscode-text'}`}>{value}</div>
      </div>
    </div>
  );
}

function isShipment(obj: Shipment | Exception): obj is Shipment {
  return 'carrier' in obj;
}

function ShipmentDetails({ shipment }: { shipment: Shipment }) {
  const st = shipmentStatusConfig[shipment.status];
  const sla = slaStatusConfig[shipment.slaStatus];
  const relatedExc = allExceptions.filter((e) => e.objectId === shipment.id);
  const riskScore = shipment.slaStatus === 'breached' ? 92 : shipment.slaStatus === 'at_risk' ? 65 : 15;

  return (
    <>
      <Section title="Status Summary" defaultExpanded={true}>
        <div className="flex items-start gap-2 px-3 py-1.5 text-[12px]">
          <Package size={13} className="text-vscode-textMuted shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-vscode-textMuted text-[11px]">Current State</div>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium mt-0.5" style={{ color: st.color, backgroundColor: st.bgColor }}>
              {st.label}
            </span>
          </div>
        </div>
        <DetailRow icon={Clock} label="Time in State" value={shipment.lastEventTime.includes(':') ? '2h 15m' : '1d 4h'} />
        <div className="flex items-start gap-2 px-3 py-1.5 text-[12px]">
          <Clock size={13} className="text-vscode-textMuted shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-vscode-textMuted text-[11px]">SLA Remaining</div>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium mt-0.5" style={{ color: sla.color, backgroundColor: sla.bgColor }}>
              {sla.label}
            </span>
            <div className="text-[10px] text-vscode-textMuted mt-0.5">Promise: {shipment.promisedDate}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 px-3 py-1.5 text-[12px]">
          <Shield size={13} className="text-vscode-textMuted shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-vscode-textMuted text-[11px]">Risk Score</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-16 h-1.5 bg-vscode-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${riskScore > 70 ? 'bg-red-400' : riskScore > 40 ? 'bg-yellow-400' : 'bg-green-400'}`} style={{ width: `${riskScore}%` }} />
              </div>
              <span className={`text-[11px] font-medium ${riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{riskScore}/100</span>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Recommended Actions" defaultExpanded={true}>
        <div className="px-3 py-1 space-y-1">
          {[
            ...(shipment.slaStatus === 'breached' || shipment.slaStatus === 'at_risk' ? [
              { icon: RefreshCw, label: 'Resync tracking', priority: 'high' as const },
              { icon: ArrowUpRight, label: 'Escalate to carrier ops', priority: 'high' as const },
            ] : []),
            ...(relatedExc.length > 0 ? [
              { icon: UserPlus, label: 'Assign case', priority: 'medium' as const },
            ] : []),
            { icon: RotateCcw, label: 'Retry booking', priority: 'low' as const },
            { icon: CheckCircle, label: 'Confirm manual override', priority: 'low' as const },
          ].map((a) => (
            <Button key={a.label} variant="ghost" size="sm" className="w-full justify-start">
              <a.icon size={12} className={`shrink-0 ${a.priority === 'high' ? 'text-red-400' : a.priority === 'medium' ? 'text-yellow-400' : 'text-vscode-textMuted'}`} />
              <span className="flex-1">{a.label}</span>
              {a.priority === 'high' && <span className="text-[9px] px-1 py-0.5 rounded bg-red-500/20 text-red-400">!</span>}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Related Objects" defaultExpanded={true}>
        <div className="px-3 py-1 space-y-1.5 text-[11px]">
          {[
            { label: 'Order', value: shipment.orderId, icon: Hash },
            { label: 'FR', value: `FR-${shipment.orderId.replace('ORD-', '')}`, icon: FileText },
            { label: 'Active Leg', value: shipment.currentLeg, icon: GitBranch },
            ...(relatedExc.length > 0 ? relatedExc.map((e) => ({ label: 'Case', value: e.id, icon: AlertTriangle })) : []),
            { label: 'Billing Item', value: `INV-${shipment.id.replace('SHP-', '')}`, icon: Hash },
            { label: 'Route Decision', value: `RD-${shipment.id.replace('SHP-', '')}`, icon: Link },
          ].map((obj) => (
            <div key={`${obj.label}-${obj.value}`} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-vscode-hover cursor-pointer">
              <obj.icon size={11} className="text-vscode-textMuted shrink-0" />
              <span className="text-vscode-textMuted">{obj.label}</span>
              <span className="text-vscode-accent ml-auto hover:underline">{obj.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Alerts" defaultExpanded={true}>
        <div className="px-3 py-1 space-y-1.5">
          {(() => {
            const alerts = [
              ...(shipment.slaStatus === 'breached' ? [{ text: 'SLA breached \u2014 immediate action required', severity: 'critical' as const }] : []),
              ...(shipment.slaStatus === 'at_risk' ? [{ text: 'Expected breach in ~45 min', severity: 'warning' as const }] : []),
              ...(shipment.status === 'exception' ? [
                { text: 'Tracking stale > 6 hours', severity: 'warning' as const },
                { text: 'Carrier incident impacts this shipment', severity: 'warning' as const },
              ] : []),
              ...(shipment.completedLegs > 0 ? [{ text: 'Leg dwell exceeded threshold at Hub 1', severity: 'info' as const }] : []),
            ];
            return alerts.length > 0 ? alerts.map((alert, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 rounded text-[11px] ${
                alert.severity === 'critical' ? 'bg-red-500/10' : alert.severity === 'warning' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
              }`}>
                <Bell size={11} className={`shrink-0 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <span className="text-vscode-text">{alert.text}</span>
              </div>
            )) : (
              <div className="text-[11px] text-vscode-textMuted px-2 py-1.5">No active alerts</div>
            );
          })()}
        </div>
      </Section>

      <Section title="Recent Events" defaultExpanded={false}>
        <div className="px-3 space-y-0">
          {trackingEvents.slice(0, 5).map((evt, i) => (
            <div key={i} className="flex gap-2 py-1.5 text-[11px] border-l-2 border-vscode-border ml-1 pl-2 relative">
              <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${i === 0 ? 'bg-vscode-accent' : 'bg-vscode-border'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-vscode-text">{evt.event}</div>
                <div className="text-vscode-textMuted">{evt.location} &middot; {evt.source}</div>
              </div>
              <span className="text-vscode-textMuted shrink-0 text-[10px]">{evt.time.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function ExceptionDetails({ exception }: { exception: Exception }) {
  const sev = exceptionSeverityConfig[exception.severity];
  return (
    <>
      <Section title="Exception Info" defaultExpanded={true}>
        <DetailRow icon={Hash} label="Case ID" value={exception.id} />
        <div className="flex items-start gap-2 px-3 py-1.5 text-[12px]">
          <AlertTriangle size={13} className="text-vscode-textMuted shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="text-vscode-textMuted text-[11px]">Severity</div>
            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium mt-0.5 uppercase" style={{ color: sev.color, backgroundColor: sev.bgColor }}>
              {sev.label}
            </span>
          </div>
        </div>
        <DetailRow icon={Hash} label="Object" value={`${exception.objectType}: ${exception.objectId}`} />
        <DetailRow icon={User} label="Owner" value={exception.owner} />
        <DetailRow icon={Clock} label="SLA Due" value={exception.slaDue} />
        <DetailRow icon={Clock} label="Age" value={exception.age} />
      </Section>

      <Section title="Description" defaultExpanded={true}>
        <div className="px-3 py-1.5 text-[12px] text-vscode-text leading-relaxed">
          {exception.description}
        </div>
      </Section>

      <Section title="Recommended Action" defaultExpanded={true}>
        <div className="px-3 py-1.5">
          <div className="flex items-start gap-2 bg-blue-500/10 rounded p-2 text-[11px]">
            <CheckCircle size={13} className="text-blue-400 shrink-0 mt-0.5" />
            <span className="text-vscode-text">{exception.recommendedAction}</span>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function RightSidebar({ width, selectedObject }: RightSidebarProps) {
  return (
    <div
      className="bg-vscode-sidebar flex flex-col select-none shrink-0 overflow-hidden"
      style={{ width }}
    >
      <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0">
        <span>Context</span>
        <MoreHorizontal size={16} className="text-vscode-textMuted cursor-pointer hover:text-vscode-textBright" />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {selectedObject ? (
          isShipment(selectedObject)
            ? <ShipmentDetails shipment={selectedObject} />
            : <ExceptionDetails exception={selectedObject} />
        ) : (
          <div className="flex-1 flex items-center justify-center h-full text-vscode-textMuted text-[12px] px-4 text-center py-8">
            Select an object to view details
          </div>
        )}
      </div>
    </div>
  );
}
