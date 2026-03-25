import { useMemo, useState } from 'react';
import { Eye, Plus, Bell, BellOff, Search, Truck, AlertTriangle, Clock, Play } from 'lucide-react';
import { shipments, exceptions, shipmentStatusConfig } from '../data/loms';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface WatchlistsProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type WatchlistType = 'shipment' | 'exception';

type WatchlistItem = {
  id: string;
  name: string;
  type: WatchlistType;
  rule: string;
  count: number;
  critical: number;
  owner: string;
  muted: boolean;
  refresh: string;
};

const watchlistsSeed: WatchlistItem[] = [
  { id: 'wl-001', name: 'Critical SLA Risk', type: 'shipment', rule: 'SLA at_risk/breached AND risk high/critical', count: 27, critical: 9, owner: 'Lisa Wang', muted: false, refresh: '30s' },
  { id: 'wl-002', name: 'Customs Hold Cases', type: 'exception', rule: 'reason contains customs AND status open/investigating', count: 12, critical: 4, owner: 'James Chen', muted: false, refresh: '1m' },
  { id: 'wl-003', name: 'Maersk Delay Radar', type: 'shipment', rule: 'carrier=Maersk AND status delayed', count: 18, critical: 3, owner: 'Mike Liu', muted: true, refresh: '2m' },
  { id: 'wl-004', name: 'Escalated Unresolved', type: 'exception', rule: 'severity critical/high AND age > 6h', count: 7, critical: 5, owner: 'Lisa Wang', muted: false, refresh: '1m' },
  { id: 'wl-005', name: 'Port Congestion Lanes', type: 'shipment', rule: 'destination in congested ports', count: 21, critical: 6, owner: 'System', muted: true, refresh: '5m' },
];

export default function Watchlists({ onOpenTab }: WatchlistsProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | WatchlistType>('all');
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const { addToast } = useToast();

  const [watchlistsLocal, setWatchlistsLocal] = useState(watchlistsSeed);

  const totalWatchedObjects = shipments.length + exceptions.length;
  const totalCritical = watchlistsLocal.reduce((s, w) => s + w.critical, 0);

  const filtered = useMemo(() => watchlistsLocal.filter((w) => {
    const bySearch = !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.rule.toLowerCase().includes(search.toLowerCase());
    const byType = typeFilter === 'all' || w.type === typeFilter;
    const byAlert = !onlyAlerts || w.critical > 0;
    return bySearch && byType && byAlert;
  }), [watchlistsLocal, search, typeFilter, onlyAlerts]);

  const toggleMuted = (id: string) => {
    setWatchlistsLocal((prev) => prev.map((w) => w.id === id ? { ...w, muted: !w.muted } : w));
    const target = watchlistsLocal.find((w) => w.id === id);
    if (target) {
      addToast({ type: target.muted ? 'info' : 'warning', title: target.muted ? 'Alerts enabled' : 'Alerts muted', message: target.name });
    }
  };

  const handleOpen = (w: WatchlistItem) => {
    const target = w.type === 'shipment' ? 'shipment-monitor' : 'exception-queue';
    onOpenTab?.(target, w.name);
    addToast({ type: 'success', title: 'Watchlist opened', message: w.name });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center justify-between px-5 py-3 border-b border-vscode-border shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-vscode-textBright flex items-center gap-2">
            <Eye size={16} className="text-vscode-accent" /> Watchlists
          </h1>
          <p className="text-[11px] text-vscode-textMuted mt-0.5">Continuous monitoring lists with alert rules</p>
        </div>
        <Button variant="default" onClick={() => addToast({ type: 'info', title: 'New watchlist', message: 'Watchlist builder will open here' })}>
          <Plus size={12} /> New Watchlist
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5 py-3 border-b border-vscode-border shrink-0">
        <Metric title="Total Watchlists" value={String(watchlistsLocal.length)} />
        <Metric title="Watched Objects" value={String(totalWatchedObjects)} />
        <Metric title="Critical Alerts" value={String(totalCritical)} danger={totalCritical > 0} />
      </div>

      <div className="flex items-center gap-3 px-5 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-2 bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 w-[260px]">
          <Search size={12} className="text-vscode-textMuted shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search watchlists..." className="flex-1 bg-transparent outline-none text-[12px] text-vscode-text placeholder:text-vscode-textMuted" />
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'shipment', 'exception'] as const).map((t) => (
            <Button key={t} variant={typeFilter === t ? 'default' : 'ghost'} size="sm" onClick={() => setTypeFilter(t)}>
              {t === 'all' ? 'All' : t === 'shipment' ? 'Shipments' : 'Exceptions'}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-[11px] text-vscode-textMuted cursor-pointer">
          <input type="checkbox" checked={onlyAlerts} onChange={(e) => setOnlyAlerts(e.target.checked)} className="accent-vscode-accent" />
          Critical only
        </label>
        <span className="ml-auto text-[11px] text-vscode-textMuted">{filtered.length} watchlists</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-2">
          {filtered.map((w) => (
            <div key={w.id} className="border border-vscode-border rounded bg-vscode-sidebar p-3 hover:border-vscode-accent/40 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-vscode-hover flex items-center justify-center shrink-0">
                  {w.type === 'shipment' ? <Truck size={14} className="text-vscode-accent" /> : <AlertTriangle size={14} className="text-orange-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-vscode-textBright truncate">{w.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted capitalize">{w.type}</span>
                    {w.critical > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{w.critical} critical</span>
                    )}
                  </div>
                  <p className="text-[11px] text-vscode-textMuted mt-0.5 truncate">{w.rule}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-vscode-textMuted">
                    <span>{w.count} objects</span>
                    <span>·</span>
                    <span>Owner: {w.owner}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> Refresh {w.refresh}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="default" size="sm" onClick={() => handleOpen(w)}>
                    <Play size={10} /> Open
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleMuted(w.id)} title={w.muted ? 'Enable alerts' : 'Mute alerts'}>
                    {w.muted ? <BellOff size={13} /> : <Bell size={13} />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-14 text-vscode-textMuted">
              <Eye size={28} className="mx-auto mb-2 opacity-20" />
              <p className="text-[12px]">No watchlists found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, danger = false }: { title: string; value: string; danger?: boolean }) {
  return (
    <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
      <div className="text-[10px] uppercase tracking-wider text-vscode-textMuted">{title}</div>
      <div className={`text-[18px] font-semibold mt-1 ${danger ? 'text-red-400' : 'text-vscode-textBright'}`}>{value}</div>
    </div>
  );
}




