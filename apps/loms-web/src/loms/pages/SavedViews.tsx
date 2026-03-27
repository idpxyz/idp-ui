import { useState } from 'react';
import { Star, Truck, AlertTriangle, BarChart3, Search, Trash2, Edit2, Play, Share2, Lock, Globe } from 'lucide-react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface SavedViewsProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type ViewCategory = 'all' | 'shipments' | 'exceptions' | 'reports';

const savedViews = [
  { id: 'sv-001', name: 'High Risk Shipments', description: 'All shipments with risk level critical or high, SLA < 2h', category: 'shipments', target: 'shipment-monitor', icon: Truck, owner: 'Lisa Wang', shared: true, pinned: true, lastUsed: '2m ago', useCount: 142, filters: { risk: 'critical,high', sla: 'at_risk,breached' } },
  { id: 'sv-002', name: 'Breached SLA �?Today', description: 'Shipments that breached SLA in the last 24 hours', category: 'shipments', target: 'shipment-monitor', icon: Truck, owner: 'James Chen', shared: true, pinned: true, lastUsed: '15m ago', useCount: 88, filters: { sla: 'breached' } },
  { id: 'sv-003', name: 'Customs Exception Queue', description: 'Open exceptions with customs-related reasons, unassigned', category: 'exceptions', target: 'exception-queue', icon: AlertTriangle, owner: 'Lisa Wang', shared: false, pinned: false, lastUsed: '1h ago', useCount: 54, filters: { type: 'customs', status: 'open' } },
  { id: 'sv-004', name: 'Maersk In-Transit Delays', description: 'In-transit shipments via Maersk with delay > 12h', category: 'shipments', target: 'shipment-monitor', icon: Truck, owner: 'Mike Liu', shared: true, pinned: false, lastUsed: '3h ago', useCount: 31, filters: { carrier: 'Maersk', status: 'delayed' } },
  { id: 'sv-005', name: 'Daily Ops KPI Report', description: 'Standard daily KPI snapshot for operations review', category: 'reports', target: 'reports', icon: BarChart3, owner: 'System', shared: true, pinned: true, lastUsed: '8h ago', useCount: 210, filters: {} },
  { id: 'sv-006', name: 'Escalated Critical Cases', description: 'Critical severity exceptions escalated but unresolved > 6h', category: 'exceptions', target: 'exception-queue', icon: AlertTriangle, owner: 'James Chen', shared: false, pinned: false, lastUsed: '30m ago', useCount: 19, filters: { severity: 'critical', status: 'escalated' } },
  { id: 'sv-007', name: 'Air Freight Monitoring', description: 'All active air freight legs across all carriers', category: 'shipments', target: 'shipment-monitor', icon: Truck, owner: 'Lisa Wang', shared: true, pinned: false, lastUsed: '2d ago', useCount: 67, filters: { mode: 'air' } },
  { id: 'sv-008', name: 'Week-over-Week Exception Trend', description: 'Exception volume trend, grouped by type and week', category: 'reports', target: 'reports', icon: BarChart3, owner: 'System', shared: true, pinned: false, lastUsed: '1d ago', useCount: 45, filters: {} },
];

export default function SavedViews({ onOpenTab }: SavedViewsProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ViewCategory>('all');
  const { addToast } = useToast();

  const filtered = savedViews.filter((v) => {
    const matchCat = category === 'all' || v.category === category;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter((v) => v.pinned);
  const rest = filtered.filter((v) => !v.pinned);

  const handleApply = (view: typeof savedViews[0]) => {
    onOpenTab?.(view.target, view.name);
    addToast({ type: 'success', title: 'View applied', message: `Opened "${view.name}"` });
  };

  const handleDelete = (view: typeof savedViews[0]) => {
    addToast({ type: 'warning', title: 'View deleted', message: `"${view.name}" removed` });
  };

  const categoryTabs: { id: ViewCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'shipments', label: 'Shipments' },
    { id: 'exceptions', label: 'Exceptions' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-idpxyz-border shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-idpxyz-textBright flex items-center gap-2">
            <Star size={16} className="text-yellow-400" /> Saved Views
          </h1>
          <p className="text-[11px] text-idpxyz-textMuted mt-0.5">Saved filter presets and report configurations</p>
        </div>
        <Button variant="default" onClick={() => addToast({ type: 'info', title: 'Create View', message: 'View builder coming soon' })}>
          + New View
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-2 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 w-[220px]">
          <Search size={12} className="text-idpxyz-textMuted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search views..."
            className="flex-1 bg-transparent outline-none text-[12px] text-idpxyz-text placeholder:text-idpxyz-textMuted"
          />
        </div>
        <div className="flex items-center gap-1">
          {categoryTabs.map((t) => (
            <Button
              key={t.id}
              variant={category === t.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategory(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-idpxyz-textMuted">{filtered.length} views</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Pinned */}
        {pinned.length > 0 && (
          <section>
            <h3 className="text-[10px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2 flex items-center gap-1.5">
              <Star size={10} className="text-yellow-400" /> Pinned
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {pinned.map((v) => <ViewCard key={v.id} view={v} onApply={handleApply} onDelete={handleDelete} />)}
            </div>
          </section>
        )}

        {/* All others */}
        {rest.length > 0 && (
          <section>
            {pinned.length > 0 && <h3 className="text-[10px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2">All Views</h3>}
            <div className="grid grid-cols-1 gap-2">
              {rest.map((v) => <ViewCard key={v.id} view={v} onApply={handleApply} onDelete={handleDelete} />)}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-idpxyz-textMuted">
            <Star size={32} className="mb-3 opacity-20" />
            <p className="text-[13px]">No saved views match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewCard({
  view,
  onApply,
  onDelete,
}: {
  view: typeof savedViews[0];
  onApply: (v: typeof savedViews[0]) => void;
  onDelete: (v: typeof savedViews[0]) => void;
}) {
  const Icon = view.icon;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded border border-idpxyz-border bg-idpxyz-sidebar hover:border-idpxyz-accent/40 transition-colors group">
      <div className="w-8 h-8 rounded bg-idpxyz-hover flex items-center justify-center shrink-0">
        <Icon size={14} className="text-idpxyz-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-idpxyz-textBright truncate">{view.name}</span>
          {view.shared
            ? <span title="Shared"><Globe size={10} className="text-idpxyz-textMuted shrink-0" /></span>
            : <span title="Private"><Lock size={10} className="text-idpxyz-textMuted shrink-0" /></span>}
        </div>
        <p className="text-[11px] text-idpxyz-textMuted truncate mt-0.5">{view.description}</p>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-idpxyz-textMuted">
          <span>by {view.owner}</span>
          <span>·</span>
          <span>Used {view.useCount}×</span>
          <span>·</span>
          <span>Last used {view.lastUsed}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button variant="default" size="sm" onClick={() => onApply(view)} title="Apply view">
          <Play size={10} /> Apply
        </Button>
        <Button variant="ghost" size="icon" title="Edit">
          <Edit2 size={12} />
        </Button>
        <Button variant="ghost" size="icon" title="Share">
          <Share2 size={12} />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-red-500/20 hover:text-red-400" onClick={() => onDelete(view)} title="Delete">
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  );
}




