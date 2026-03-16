import { ChevronRight, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { shipments, slaStatusConfig } from '../../data/loms';

interface SlaOverviewProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

export default function SlaOverview({ onOpenTab }: SlaOverviewProps) {
  const onTrack = shipments.filter((s) => s.slaStatus === 'on_track');
  const atRisk = shipments.filter((s) => s.slaStatus === 'at_risk');
  const breached = shipments.filter((s) => s.slaStatus === 'breached');
  const total = shipments.length;
  const complianceRate = total > 0 ? Math.round((onTrack.length / total) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Overview</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">SLA Overview</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Compliance Rate', value: `${complianceRate}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'On Track', value: onTrack.length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'At Risk', value: atRisk.length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Breached', value: breached.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          ].map((kpi) => (
            <div key={kpi.label} className={`${kpi.bg} rounded-lg p-4 border border-vscode-border`}>
              <kpi.icon size={18} className={`${kpi.color} mb-2`} />
              <div className={`text-[24px] font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[12px] text-vscode-textMuted mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* SLA by status breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { title: 'Breached', items: breached, color: 'border-red-500/30', dotColor: 'bg-red-500' },
            { title: 'At Risk', items: atRisk, color: 'border-yellow-500/30', dotColor: 'bg-yellow-500' },
            { title: 'On Track', items: onTrack.slice(0, 6), color: 'border-green-500/30', dotColor: 'bg-green-500' },
          ].map((group) => (
            <div key={group.title} className={`bg-vscode-sidebar rounded-lg p-4 border ${group.color}`}>
              <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${group.dotColor}`} />
                {group.title} ({group.items.length})
              </h3>
              {group.items.length === 0 ? (
                <div className="text-[12px] text-vscode-textMuted py-2">No shipments</div>
              ) : (
                <div className="space-y-1.5">
                  {group.items.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 text-[12px] py-1.5 px-2 rounded hover:bg-vscode-hover cursor-pointer border-b border-vscode-border last:border-0"
                      onClick={() => onOpenTab?.(`shipment-detail-${s.id}`, `Shipment ${s.id}`)}
                    >
                      <span className="text-vscode-accent font-medium">{s.id}</span>
                      <span className="text-vscode-textMuted truncate">{s.origin} →{s.destination}</span>
                      <span className="ml-auto text-vscode-textMuted shrink-0 text-[11px]">{s.promisedDate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Promise date timeline */}
        <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
          <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3">Upcoming Promise Dates</h3>
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-vscode-textMuted text-left">
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Shipment</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Route</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Carrier</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Promise Date</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">SLA</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Progress</th>
              </tr>
            </thead>
            <tbody>
              {[...shipments].sort((a, b) => a.promisedDate.localeCompare(b.promisedDate)).map((s) => {
                const sla = slaStatusConfig[s.slaStatus];
                return (
                  <tr key={s.id} className="hover:bg-vscode-hover cursor-pointer" onClick={() => onOpenTab?.(`shipment-detail-${s.id}`, `Shipment ${s.id}`)}>
                    <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-accent font-medium">{s.id}</td>
                    <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text">{s.origin} →{s.destination}</td>
                    <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text">{s.carrier}</td>
                    <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text">{s.promisedDate}</td>
                    <td className="px-3 py-1.5 border-b border-vscode-border text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>{sla.label}</span>
                    </td>
                    <td className="px-3 py-1.5 border-b border-vscode-border">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: s.legs }).map((_, i) => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full max-w-[20px] ${i < s.completedLegs ? 'bg-green-400' : 'bg-vscode-border'}`} />
                        ))}
                        <span className="text-[10px] text-vscode-textMuted ml-1">{s.completedLegs}/{s.legs}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




