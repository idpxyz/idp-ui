import { ChevronRight, Truck, AlertTriangle, Clock, CheckCircle, TrendingUp, Package, Anchor, Zap, WifiOff, ListChecks, Eye, BarChart3, RefreshCw, Bookmark } from 'lucide-react';
import { shipments, exceptions, shipmentStatusConfig, slaStatusConfig } from '../data/loms';
import { Button } from '@idpxyz/ui-primitives';
import { useDensity } from '@idpxyz/ui-theme-runtime';

interface OpsDashboardProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

export default function OpsDashboard({ onOpenTab }: OpsDashboardProps) {
  const { density } = useDensity();
  const cellPy = density === 'compact' ? 'py-1' : 'py-2';
  const stats = {
    totalShipments: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
    exceptions: shipments.filter((s) => s.status === 'exception').length,
    onHold: shipments.filter((s) => s.status === 'on_hold').length,
    booked: shipments.filter((s) => s.status === 'booked').length,
    slaOnTrack: shipments.filter((s) => s.slaStatus === 'on_track').length,
    slaAtRisk: shipments.filter((s) => s.slaStatus === 'at_risk').length,
    slaBreached: shipments.filter((s) => s.slaStatus === 'breached').length,
    openExceptions: exceptions.filter((e) => e.status === 'open').length,
    criticalExceptions: exceptions.filter((e) => e.severity === 'critical').length,
  };

  const carriers = [...new Set(shipments.map((s) => s.carrier))];
  const carrierStats = carriers.map((c) => ({
    name: c,
    count: shipments.filter((s) => s.carrier === c).length,
    exceptions: shipments.filter((s) => s.carrier === c && s.status === 'exception').length,
  }));

  const delayReasons = [
    { reason: 'Customs hold', count: 4, pct: 28 },
    { reason: 'Carrier scan missing', count: 3, pct: 21 },
    { reason: 'Handoff delay', count: 3, pct: 21 },
    { reason: 'Booking failure', count: 2, pct: 14 },
    { reason: 'Address issue', count: 1, pct: 8 },
    { reason: 'Route mismatch', count: 1, pct: 8 },
  ];

  const slaHeatmap = [
    { carrier: 'Maersk', onTrack: 5, atRisk: 1, breached: 0 },
    { carrier: 'DHL', onTrack: 3, atRisk: 0, breached: 1 },
    { carrier: 'FedEx', onTrack: 2, atRisk: 1, breached: 0 },
    { carrier: 'COSCO', onTrack: 1, atRisk: 1, breached: 1 },
    { carrier: 'Evergreen', onTrack: 2, atRisk: 0, breached: 0 },
    { carrier: 'UPS', onTrack: 1, atRisk: 0, breached: 0 },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      {/* Header */}
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-idpxyz-border shrink-0 bg-idpxyz-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-idpxyz-textBright font-semibold">Operations Dashboard</span>
          <span className="text-[11px] text-idpxyz-textMuted">Today Â· All Regions</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <RefreshCw size={11} /> Refresh
          </Button>
          <Button variant="secondary" size="sm">
            <Eye size={11} /> Save View
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* KPI Strip - 8 cards per design doc */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
          {[
            { label: 'Active', value: stats.totalShipments - stats.delivered, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10', click: () => onOpenTab?.('shipment-monitor', 'Shipment Monitor') },
            { label: 'Delayed', value: stats.exceptions + stats.onHold, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', click: () => onOpenTab?.('shipment-monitor', 'Shipment Monitor') },
            { label: 'At Risk', value: stats.slaAtRisk, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', click: () => onOpenTab?.('sla-overview', 'SLA Overview') },
            { label: 'Open Cases', value: stats.openExceptions, icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10', click: () => onOpenTab?.('exception-queue', 'Exceptions') },
            { label: 'Carrier Incidents', value: 2, icon: WifiOff, color: 'text-red-400', bg: 'bg-red-500/10', click: () => onOpenTab?.('carrier-ops', 'Carrier Ops') },
            { label: 'Jobs Failed (1h)', value: 1, icon: RefreshCw, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Avg Lead Time', value: '8.2d', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'SLA Breach Today', value: stats.slaBreached, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', click: () => onOpenTab?.('sla-overview', 'SLA Overview') },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`${kpi.bg} rounded-lg p-3 border border-idpxyz-border cursor-pointer hover:brightness-110 transition-all`}
              onClick={kpi.click}
            >
              <kpi.icon size={14} className={`${kpi.color} mb-1`} />
              <div className={`text-[18px] font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-idpxyz-textMuted mt-0.5 leading-tight">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Main 2-column layout per design doc */}
        <div className="flex gap-4 mb-4">
          {/* Left column: My Queues + Critical Alerts + Carrier Status */}
          <div className="w-[280px] shrink-0 space-y-3">
            {/* My Queues */}
            <div className="bg-idpxyz-sidebar rounded-lg p-3 border border-idpxyz-border">
              <h3 className="text-[11px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2 flex items-center gap-1.5">
                <ListChecks size={12} /> My Queues
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Unassigned cases', count: 3, color: 'text-red-400' },
                  { label: 'Overdue cases', count: 1, color: 'text-orange-400' },
                  { label: 'Monitored shipments', count: 8, color: 'text-blue-400' },
                  { label: 'My watchlists', count: 2, color: 'text-idpxyz-textMuted' },
                ].map((q) => (
                  <div key={q.label} className="flex items-center justify-between text-[12px] py-1.5 px-2 rounded hover:bg-idpxyz-hover cursor-pointer">
                    <span className="text-idpxyz-text">{q.label}</span>
                    <span className={`font-bold ${q.color}`}>{q.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Views (Section 3.2) */}
            <div className="bg-idpxyz-sidebar rounded-lg p-3 border border-idpxyz-border">
              <h3 className="text-[11px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2 flex items-center gap-1.5">
                <Eye size={12} /> Saved Views
              </h3>
              <div className="space-y-1">
                {[
                  { label: 'Operations Controller', desc: 'Default ops view' },
                  { label: 'Exception Specialist', desc: 'Focus on open cases' },
                  { label: 'Carrier Ops', desc: 'Carrier health focus' },
                  { label: 'Supervisor', desc: 'Team workload overview' },
                ].map((v) => (
                  <div key={v.label} className="flex items-center gap-2 text-[11px] py-1.5 px-2 rounded hover:bg-idpxyz-hover cursor-pointer">
                    <Bookmark size={11} className="text-idpxyz-textMuted shrink-0" />
                    <div className="min-w-0">
                      <div className="text-idpxyz-text truncate">{v.label}</div>
                      <div className="text-[10px] text-idpxyz-textMuted">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-idpxyz-sidebar rounded-lg p-3 border border-red-500/20">
              <h3 className="text-[11px] uppercase tracking-wider text-red-400 font-semibold mb-2 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Critical Alerts
              </h3>
              <div className="space-y-1.5">
                {[
                  { msg: 'COSCO API fully down (45m)', severity: 'critical' },
                  { msg: 'FedEx Booking API high latency', severity: 'warning' },
                  { msg: '3 tracking stale > 6 hours', severity: 'warning' },
                  { msg: 'EXC-001 SLA breach in 30 min', severity: 'critical' },
                ].map((a, i) => (
                  <div key={i} className={`flex items-start gap-2 text-[11px] py-1.5 px-2 rounded cursor-pointer ${
                    a.severity === 'critical' ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-yellow-500/5 hover:bg-yellow-500/10'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${a.severity === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <span className="text-idpxyz-text">{a.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Status */}
            <div className="bg-idpxyz-sidebar rounded-lg p-3 border border-idpxyz-border">
              <h3 className="text-[11px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2 flex items-center gap-1.5">
                <Anchor size={12} /> Carrier Status
              </h3>
              <div className="space-y-1">
                {carrierStats.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[11px] py-1 px-2 rounded hover:bg-idpxyz-hover cursor-pointer" onClick={() => onOpenTab?.('carrier-ops', 'Carrier Ops')}>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.name === 'COSCO' ? 'bg-red-500' : c.name === 'FedEx' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <span className="text-idpxyz-text">{c.name}</span>
                    </div>
                    <span className="text-idpxyz-textMuted">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Failures (Section 15.1) */}
            <div className="bg-idpxyz-sidebar rounded-lg p-3 border border-orange-500/20">
              <h3 className="text-[11px] uppercase tracking-wider text-orange-400 font-semibold mb-2 flex items-center gap-1.5">
                <Zap size={12} /> Job Failures (Last 1h)
              </h3>
              <div className="space-y-1.5">
                {[
                  { type: 'Tracking sync', count: 3, status: 'retrying' },
                  { type: 'Booking request', count: 1, status: 'failed' },
                  { type: 'Route compute', count: 0, status: 'ok' },
                  { type: 'Manifest push', count: 2, status: 'retrying' },
                  { type: 'Label generation', count: 0, status: 'ok' },
                ].map((j) => (
                  <div key={j.type} className="flex items-center justify-between text-[11px] py-1 px-2 rounded hover:bg-idpxyz-hover cursor-pointer">
                    <span className="text-idpxyz-text">{j.type}</span>
                    <div className="flex items-center gap-2">
                      {j.count > 0 ? (
                        <>
                          <span className={j.status === 'failed' ? 'text-red-400 font-bold' : 'text-orange-400 font-medium'}>{j.count}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${j.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {j.status}
                          </span>
                        </>
                      ) : (
                        <span className="text-green-400 text-[10px]">OK</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: SLA Heatmap + Top Delay Reasons */}
          <div className="flex-1 space-y-3">
            {/* SLA Heatmap by Carrier */}
            <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
              <h3 className="text-[12px] font-semibold text-idpxyz-textBright mb-3 flex items-center gap-2">
                <BarChart3 size={14} className="text-idpxyz-textMuted" />
                SLA Heatmap by Carrier
              </h3>
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr className="text-idpxyz-textMuted text-left">
                    <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">Carrier</th>
                    <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border text-center">On Track</th>
                    <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border text-center">At Risk</th>
                    <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border text-center">Breached</th>
                    <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {slaHeatmap.map((row) => {
                    const total = row.onTrack + row.atRisk + row.breached;
                    return (
                      <tr key={row.carrier} className="hover:bg-idpxyz-hover cursor-pointer">
                        <td className="px-3 py-2 border-b border-idpxyz-border text-idpxyz-text font-medium">{row.carrier}</td>
                        <td className="px-3 py-2 border-b border-idpxyz-border text-center">
                          <span className="text-green-400 font-medium">{row.onTrack}</span>
                        </td>
                        <td className="px-3 py-2 border-b border-idpxyz-border text-center">
                          {row.atRisk > 0 ? <span className="text-yellow-400 font-medium">{row.atRisk}</span> : <span className="text-idpxyz-textMuted">0</span>}
                        </td>
                        <td className="px-3 py-2 border-b border-idpxyz-border text-center">
                          {row.breached > 0 ? <span className="text-red-400 font-bold">{row.breached}</span> : <span className="text-idpxyz-textMuted">0</span>}
                        </td>
                        <td className="px-3 py-2 border-b border-idpxyz-border">
                          <div className="flex gap-0.5 h-2">
                            {row.onTrack > 0 && <div className="bg-green-400 rounded-sm" style={{ flex: row.onTrack }} />}
                            {row.atRisk > 0 && <div className="bg-yellow-400 rounded-sm" style={{ flex: row.atRisk }} />}
                            {row.breached > 0 && <div className="bg-red-400 rounded-sm" style={{ flex: row.breached }} />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Top Delay Reasons + Exception Distribution */}
            <div className="grid grid-cols-2 gap-3">
              {/* Top Delay Reasons */}
              <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
                <h3 className="text-[12px] font-semibold text-idpxyz-textBright mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-idpxyz-textMuted" />
                  Top Delay Reasons
                </h3>
                <div className="space-y-2">
                  {delayReasons.map((dr) => (
                    <div key={dr.reason}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-idpxyz-text">{dr.reason}</span>
                        <span className="text-idpxyz-textMuted">{dr.count} ({dr.pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-idpxyz-border rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${dr.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Exceptions */}
              <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
                <h3 className="text-[12px] font-semibold text-idpxyz-textBright mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-idpxyz-textMuted" />
                  Open Exceptions
                </h3>
                <div className="space-y-1.5">
                  {exceptions.filter((e) => e.status !== 'resolved').slice(0, 5).map((exc) => (
                    <div key={exc.id} className="flex items-center gap-2 text-[11px] py-1.5 px-2 rounded hover:bg-idpxyz-hover cursor-pointer border-b border-idpxyz-border last:border-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        exc.severity === 'critical' ? 'bg-red-500' : exc.severity === 'high' ? 'bg-orange-400' : 'bg-yellow-400'
                      }`} />
                      <span className="text-idpxyz-accent shrink-0">{exc.id}</span>
                      <span className="text-idpxyz-text truncate">{exc.reason}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto" onClick={() => onOpenTab?.('exception-queue', 'Exceptions')}>
                  View all exceptions ¡ú                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Trend + Aging Queue per Section 3.2 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Workload Trend */}
          <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
            <h3 className="text-[12px] font-semibold text-idpxyz-textBright mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-idpxyz-textMuted" />
              Workload Trend (7d)
            </h3>
            <div className="space-y-2">
              {[
                { day: 'Mon', created: 18, resolved: 14 },
                { day: 'Tue', created: 22, resolved: 19 },
                { day: 'Wed', created: 15, resolved: 16 },
                { day: 'Thu', created: 28, resolved: 21 },
                { day: 'Fri', created: 24, resolved: 22 },
                { day: 'Sat', created: 10, resolved: 11 },
                { day: 'Sun', created: 8, resolved: 7 },
              ].map((d) => (
                <div key={d.day} className="flex items-center gap-2 text-[11px]">
                  <span className="w-7 text-idpxyz-textMuted shrink-0">{d.day}</span>
                  <div className="flex-1 flex items-center gap-1 h-3">
                    <div className="bg-blue-400 rounded-sm h-full" style={{ width: `${(d.created / 30) * 100}%` }} title={`Created: ${d.created}`} />
                    <div className="bg-green-400/60 rounded-sm h-full" style={{ width: `${(d.resolved / 30) * 100}%` }} title={`Resolved: ${d.resolved}`} />
                  </div>
                  <span className="w-14 text-right shrink-0">
                    <span className="text-blue-400">{d.created}</span>
                    <span className="text-idpxyz-textMuted">/</span>
                    <span className="text-green-400">{d.resolved}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-idpxyz-border text-[10px] text-idpxyz-textMuted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-400" /> Created</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-400/60" /> Resolved</span>
            </div>
          </div>

          {/* Aging Queue / Exception Distribution */}
          <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
            <h3 className="text-[12px] font-semibold text-idpxyz-textBright mb-3 flex items-center gap-2">
              <Clock size={14} className="text-idpxyz-textMuted" />
              Aging Queue
            </h3>
            <div className="space-y-2">
              {[
                { bucket: '< 1 hour', count: 3, color: 'bg-green-400', pct: 20 },
                { bucket: '1â€? hours', count: 5, color: 'bg-blue-400', pct: 33 },
                { bucket: '4â€?2 hours', count: 4, color: 'bg-yellow-400', pct: 27 },
                { bucket: '12â€?4 hours', count: 2, color: 'bg-orange-400', pct: 13 },
                { bucket: '> 24 hours', count: 1, color: 'bg-red-400', pct: 7 },
              ].map((b) => (
                <div key={b.bucket}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-idpxyz-text">{b.bucket}</span>
                    <span className="text-idpxyz-textMuted">{b.count} items ({b.pct}%)</span>
                  </div>
                  <div className="h-2 bg-idpxyz-border rounded-full overflow-hidden">
                    <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-idpxyz-border flex items-center justify-between text-[11px]">
              <span className="text-idpxyz-textMuted">Total open: <span className="text-idpxyz-text font-medium">15</span></span>
              <span className="text-idpxyz-textMuted">Avg age: <span className="text-yellow-400 font-medium">5.2h</span></span>
            </div>
          </div>
        </div>

        {/* Recent Shipments table */}
        <div className="bg-idpxyz-sidebar rounded-lg p-4 border border-idpxyz-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold text-idpxyz-textBright flex items-center gap-2">
              <Truck size={14} className="text-idpxyz-textMuted" />
              Recent Shipments
            </h3>
            <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => onOpenTab?.('shipment-monitor', 'Shipment Monitor')}>
              View all ¡ú            </Button>
          </div>
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-idpxyz-textMuted text-left">
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">ID</th>
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">Route</th>
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">Carrier</th>
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border text-center">Status</th>
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border text-center">SLA</th>
                <th className="px-3 py-1.5 font-medium border-b border-idpxyz-border">Last Event</th>
              </tr>
            </thead>
            <tbody>
              {shipments.slice(0, 6).map((s) => {
                const st = shipmentStatusConfig[s.status];
                const sla = slaStatusConfig[s.slaStatus];
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-idpxyz-hover cursor-pointer"
                    onClick={() => onOpenTab?.(`shipment-detail-${s.id}`, `Shipment ${s.id}`)}
                  >
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-accent font-medium`}>{s.id}</td>
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-text`}>{s.origin} ¡ú{s.destination}</td>
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-text`}>{s.carrier}</td>
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-center`}>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: st.color, backgroundColor: st.bgColor }}>
                        {st.label}
                      </span>
                    </td>
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-center`}>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>
                        {sla.label}
                      </span>
                    </td>
                    <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-textMuted`}>{s.lastEvent}</td>
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




