import { useMemo, useState } from 'react';
import { Layers, Search, Play, User, Clock, AlertTriangle, Truck, CheckCircle2, Filter } from 'lucide-react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface MyQueuesProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type QueueStatus = 'healthy' | 'busy' | 'blocked';

type QueueItem = {
  id: string;
  name: string;
  domain: 'shipment' | 'exception' | 'carrier' | 'ops';
  status: QueueStatus;
  pending: number;
  overdue: number;
  slaRisk: number;
  assignee: string;
  nextAction: string;
  targetTab: string;
};

const queueData: QueueItem[] = [
  { id: 'q-001', name: 'SLA At-Risk Triage', domain: 'shipment', status: 'busy', pending: 22, overdue: 6, slaRisk: 8, assignee: 'Lisa Wang', nextAction: 'Prioritize critical legs', targetTab: 'shipment-monitor' },
  { id: 'q-002', name: 'Customs Exception Intake', domain: 'exception', status: 'blocked', pending: 11, overdue: 5, slaRisk: 5, assignee: 'James Chen', nextAction: 'Collect missing docs', targetTab: 'exception-queue' },
  { id: 'q-003', name: 'Carrier Delay Follow-up', domain: 'carrier', status: 'busy', pending: 17, overdue: 2, slaRisk: 4, assignee: 'Mike Liu', nextAction: 'Confirm updated ETA', targetTab: 'carrier-ops' },
  { id: 'q-004', name: 'Night Shift Handover', domain: 'ops', status: 'healthy', pending: 9, overdue: 0, slaRisk: 1, assignee: 'Ops Team', nextAction: 'Review unresolved alerts', targetTab: 'ops-dashboard' },
  { id: 'q-005', name: 'Damaged Cargo Review', domain: 'exception', status: 'busy', pending: 8, overdue: 1, slaRisk: 3, assignee: 'James Chen', nextAction: 'Verify insurance claim', targetTab: 'exception-queue' },
  { id: 'q-006', name: 'Route Recompute Backlog', domain: 'shipment', status: 'healthy', pending: 14, overdue: 0, slaRisk: 2, assignee: 'Routing Bot', nextAction: 'Run nightly optimization', targetTab: 'routing' },
];

const statusMeta: Record<QueueStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  healthy: { label: 'Healthy', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle2 },
  busy: { label: 'Busy', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
  blocked: { label: 'Blocked', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle },
};

export default function MyQueues({ onOpenTab }: MyQueuesProps) {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | QueueItem['domain']>('all');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const { addToast } = useToast();

  const filtered = useMemo(() => queueData.filter((q) => {
    const bySearch = !search || q.name.toLowerCase().includes(search.toLowerCase()) || q.assignee.toLowerCase().includes(search.toLowerCase());
    const byDomain = domainFilter === 'all' || q.domain === domainFilter;
    const byOverdue = !onlyOverdue || q.overdue > 0;
    return bySearch && byDomain && byOverdue;
  }), [search, domainFilter, onlyOverdue]);

  const totals = useMemo(() => ({
    pending: filtered.reduce((s, q) => s + q.pending, 0),
    overdue: filtered.reduce((s, q) => s + q.overdue, 0),
    risk: filtered.reduce((s, q) => s + q.slaRisk, 0),
  }), [filtered]);

  const handleOpenQueue = (q: QueueItem) => {
    onOpenTab?.(q.targetTab, q.name);
    addToast({ type: 'success', title: 'Queue opened', message: q.name });
  };

  const handleTakeBatch = (q: QueueItem) => {
    addToast({ type: 'info', title: 'Batch claimed', message: `${q.name} â€?5 items assigned` });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      <div className="flex items-center justify-between px-5 py-3 border-b border-idpxyz-border shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-idpxyz-textBright flex items-center gap-2">
            <Layers size={16} className="text-idpxyz-accent" /> My Queues
          </h1>
          <p className="text-[11px] text-idpxyz-textMuted mt-0.5">Operational work queues with SLA and backlog visibility</p>
        </div>
        <Button variant="outline" onClick={() => addToast({ type: 'info', title: 'Queue settings', message: 'Queue configuration panel coming soon' })}>
          Queue Settings
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5 py-3 border-b border-idpxyz-border shrink-0">
        <Metric title="Pending" value={String(totals.pending)} />
        <Metric title="Overdue" value={String(totals.overdue)} danger={totals.overdue > 0} />
        <Metric title="SLA Risk" value={String(totals.risk)} danger={totals.risk > 0} />
      </div>

      <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-2 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 w-[260px]">
          <Search size={12} className="text-idpxyz-textMuted shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search queues..." className="flex-1 bg-transparent outline-none text-[12px] text-idpxyz-text placeholder:text-idpxyz-textMuted" />
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'shipment', 'exception', 'carrier', 'ops'] as const).map((d) => (
            <Button key={d} variant={domainFilter === d ? 'default' : 'ghost'} size="sm" onClick={() => setDomainFilter(d)}>
              {d === 'all' ? 'All' : d[0].toUpperCase() + d.slice(1)}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-[11px] text-idpxyz-textMuted cursor-pointer">
          <input type="checkbox" checked={onlyOverdue} onChange={(e) => setOnlyOverdue(e.target.checked)} className="accent-idpxyz-accent" />
          <Filter size={11} /> Overdue only
        </label>
        <span className="ml-auto text-[11px] text-idpxyz-textMuted">{filtered.length} queues</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-2">
          {filtered.map((q) => {
            const meta = statusMeta[q.status];
            const StatusIcon = meta.icon;
            return (
              <div key={q.id} className="border border-idpxyz-border rounded bg-idpxyz-sidebar p-3 hover:border-idpxyz-accent/40 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-idpxyz-hover flex items-center justify-center shrink-0">
                    {q.domain === 'shipment' ? <Truck size={14} className="text-idpxyz-accent" /> : <Layers size={14} className="text-idpxyz-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-idpxyz-textBright truncate">{q.name}</span>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${meta.bg} ${meta.color}`}>
                        <StatusIcon size={10} /> {meta.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted capitalize">{q.domain}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <SmallStat label="Pending" value={q.pending} />
                      <SmallStat label="Overdue" value={q.overdue} danger={q.overdue > 0} />
                      <SmallStat label="SLA Risk" value={q.slaRisk} danger={q.slaRisk > 0} />
                      <SmallStat label="Owner" value={q.assignee} icon={<User size={10} />} />
                    </div>
                    <p className="text-[11px] text-idpxyz-textMuted mt-2">Next action: {q.nextAction}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="default" size="sm" onClick={() => handleOpenQueue(q)}>
                      <Play size={10} /> Open
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTakeBatch(q)}>
                      Take 5
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-14 text-idpxyz-textMuted">
              <Layers size={28} className="mx-auto mb-2 opacity-20" />
              <p className="text-[12px]">No queues found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, danger = false }: { title: string; value: string; danger?: boolean }) {
  return (
    <div className="px-3 py-2 rounded border border-idpxyz-border bg-idpxyz-sidebar">
      <div className="text-[10px] uppercase tracking-wider text-idpxyz-textMuted">{title}</div>
      <div className={`text-[18px] font-semibold mt-1 ${danger ? 'text-red-400' : 'text-idpxyz-textBright'}`}>{value}</div>
    </div>
  );
}

function SmallStat({
  label,
  value,
  danger = false,
  icon,
}: {
  label: string;
  value: number | string;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="px-2 py-1 rounded bg-idpxyz-hover/70 text-[10px]">
      <div className="text-idpxyz-textMuted">{label}</div>
      <div className={`mt-0.5 flex items-center gap-1 font-medium ${danger ? 'text-red-400' : 'text-idpxyz-text'}`}>
        {icon}
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}




