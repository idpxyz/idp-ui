import { useState, useEffect, useRef } from 'react';
import {
  Search, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight,
  Eye, AlertTriangle, Truck, Package, Clock, CheckCircle, XCircle, PauseCircle,
  LayoutGrid, List, CalendarClock, Star, Bookmark, BarChart3,
  UserPlus, Tag, RefreshCw, ArrowUpRight, Download, MoreHorizontal,
} from 'lucide-react';
import { shipments, shipmentStatusConfig, slaStatusConfig, exceptions, type Shipment } from '../../data/loms';
import { SkeletonTable } from '../Skeleton';
import { Button } from '../ui/button';
import { FilteredEmptyState, TrulyEmptyState, UnavailableState } from '../ui/page-states';
import { useToast } from '../../contexts/ToastContext';
import { useDensity } from '../../contexts/DensityContext';

interface ShipmentMonitorProps {
  onSelectShipment?: (shipment: Shipment) => void;
  onOpenDetail?: (shipmentId: string) => void;
}

type ViewMode = 'table' | 'board' | 'timeline';

const riskConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Crit', color: '#f87171', bgColor: 'rgba(248,113,113,0.15)' },
  high: { label: 'High', color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)' },
  medium: { label: 'Med', color: '#60a5fa', bgColor: 'rgba(96,165,250,0.15)' },
  low: { label: 'Low', color: '#4ade80', bgColor: 'rgba(74,222,128,0.10)' },
};

function formatSlaRemaining(minutes: number | null): string {
  if (minutes === null) return '--';
  const abs = Math.abs(minutes);
  const sign = minutes < 0 ? '-' : '';
  if (abs < 60) return `${sign}${abs}m`;
  if (abs < 1440) return `${sign}${Math.floor(abs / 60)}h ${abs % 60}m`;
  return `${sign}${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
}

const statusIcons: Record<string, React.ElementType> = {
  created: Package,
  booked: Package,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  exception: AlertTriangle,
  cancelled: XCircle,
  on_hold: PauseCircle,
};

export default function ShipmentMonitor({ onSelectShipment, onOpenDetail }: ShipmentMonitorProps) {
  const { density } = useDensity();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slaFilter, setSlaFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [savedView, setSavedView] = useState('all-active');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFacets, setShowFacets] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const { addToast } = useToast();
  const hasShownSkeleton = useRef(false);

  // Simulated initial load skeleton (搂13.1)
  useEffect(() => {
    if (hasShownSkeleton.current) return;
    hasShownSkeleton.current = true;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  }, []);

  // 搂16.16: Esc key closes Preview Pane
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedId(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const pageSize = 10;
  const cellPy = density === 'compact' ? 'py-1' : 'py-2.5';

  const filtered = shipments.filter((s) => {
    const matchSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchSla = slaFilter === 'all' || s.slaStatus === slaFilter;
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    const matchCarrier = carrierFilter === 'all' || s.carrier === carrierFilter;
    return matchSearch && matchStatus && matchSla && matchRisk && matchCarrier;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'promise_asc':
        return a.promisedDate.localeCompare(b.promisedDate);
      case 'sla_asc':
        return (a.slaRemainingMinutes ?? Number.MAX_SAFE_INTEGER) - (b.slaRemainingMinutes ?? Number.MAX_SAFE_INTEGER);
      case 'risk_desc': {
        const rank = { critical: 4, high: 3, medium: 2, low: 1 };
        return (rank[b.riskLevel as keyof typeof rank] || 0) - (rank[a.riskLevel as keyof typeof rank] || 0);
      }
      case 'updated_desc':
      default:
        return b.lastEventTime.localeCompare(a.lastEventTime);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const isFiltered =
    searchTerm.trim().length > 0 ||
    statusFilter !== 'all' ||
    slaFilter !== 'all' ||
    riskFilter !== 'all' ||
    carrierFilter !== 'all';

  const handleRowClick = (shipment: Shipment) => {
    setSelectedId(shipment.id);
    onSelectShipment?.(shipment);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((s) => s.id)));
  };

  // Stats bar
  const stats = {
    total: shipments.length,
    inTransit: shipments.filter((s) => s.status === 'in_transit').length,
    exceptions: shipments.filter((s) => s.status === 'exception').length,
    atRisk: shipments.filter((s) => s.slaStatus === 'at_risk').length,
    breached: shipments.filter((s) => s.slaStatus === 'breached').length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
  };

  // Facet counts
  const statusFacets = Object.entries(shipmentStatusConfig).map(([key, cfg]) => ({
    key, label: cfg.label, count: shipments.filter((s) => s.status === key).length, color: cfg.color,
  }));
  const carrierFacets = [...new Set(shipments.map((s) => s.carrier))].map((c) => ({
    key: c, label: c, count: shipments.filter((s) => s.carrier === c).length,
  }));

  const savedViews = [
    { id: 'all-active', label: 'All Active Shipments', count: stats.total - stats.delivered },
    { id: 'at-risk', label: 'At Risk (< 2h SLA)', count: stats.atRisk },
    { id: 'exceptions-only', label: 'Exceptions Only', count: stats.exceptions },
    { id: 'my-watchlist', label: 'My Watchlist', count: 4 },
  ];

  useEffect(() => {
    if (savedView === 'all-active') {
      setStatusFilter('all');
      setSlaFilter('all');
      setRiskFilter('all');
      setCarrierFilter('all');
    } else if (savedView === 'at-risk') {
      setStatusFilter('all');
      setSlaFilter('at_risk');
      setRiskFilter('all');
      setCarrierFilter('all');
    } else if (savedView === 'exceptions-only') {
      setStatusFilter('exception');
      setSlaFilter('all');
      setRiskFilter('all');
      setCarrierFilter('all');
    } else if (savedView === 'my-watchlist') {
      setStatusFilter('all');
      setSlaFilter('all');
      setRiskFilter('high');
      setCarrierFilter('all');
    }
    setCurrentPage(1);
  }, [savedView]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Header */}
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-vscode-border shrink-0 bg-vscode-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-vscode-textBright font-semibold">Shipment Monitor</span>
          <span className="text-[11px] text-vscode-textMuted">All Regions</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Star size={11} /> Save View
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={11} /> Export
          </Button>
        </div>
      </div>

      {/* Filter Bar (Golden Template: Search / Primary / View-Sort / Saved View / More Filters) */}
      <div className="border-b border-vscode-border shrink-0 bg-vscode-sidebar">
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
          <div className="flex items-center bg-vscode-inputBg rounded px-2.5 h-[28px] flex-1 min-w-[260px] max-w-[380px]">
            <Search size={13} className="text-vscode-textMuted mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search shipment, order, origin, destination, carrier..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none outline-none text-[12px] text-vscode-text w-full placeholder:text-vscode-textMuted"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            {Object.entries(shipmentStatusConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select
            value={slaFilter}
            onChange={(e) => { setSlaFilter(e.target.value); setCurrentPage(1); }}
            className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer"
          >
            <option value="all">SLA: All</option>
            {Object.entries(slaStatusConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer"
          >
            <option value="updated_desc">Sort: Updated →</option>
            <option value="promise_asc">Sort: Promise →</option>
            <option value="sla_asc">Sort: SLA Remaining →</option>
            <option value="risk_desc">Sort: Risk →</option>
          </select>
          <div className="flex items-center border border-vscode-border rounded overflow-hidden h-[28px]">
            {([
              { mode: 'table' as ViewMode, icon: List, label: 'Table' },
              { mode: 'board' as ViewMode, icon: LayoutGrid, label: 'Board' },
              { mode: 'timeline' as ViewMode, icon: CalendarClock, label: 'Timeline' },
            ]).map((v) => (
              <Button
                key={v.mode}
                onClick={() => setViewMode(v.mode)}
                variant={viewMode === v.mode ? 'default' : 'ghost'}
                size="sm"
                title={v.label}
                className="h-full rounded-none px-2.5"
              >
                <v.icon size={12} />
                <span>{v.label}</span>
              </Button>
            ))}
          </div>
          <select
            value={savedView}
            onChange={(e) => setSavedView(e.target.value)}
            className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer min-w-[160px]"
          >
            {savedViews.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAdvancedFilters((v) => !v)}
            className="h-[28px]"
          >
            More Filters
          </Button>
          <Button
            onClick={() => setShowFacets(!showFacets)}
            variant={showFacets ? 'default' : 'ghost'}
            size="sm"
            className="h-[28px]"
          >
            <BarChart3 size={12} /> Facets
          </Button>
          <span className="text-[12px] text-vscode-textMuted ml-auto shrink-0">
            {filtered.length} shipments
          </span>
        </div>
        {showAdvancedFilters && (
          <div className="flex items-center gap-2 px-4 py-1.5 border-t border-vscode-border/70 bg-vscode-editor">
            <Button variant="outline" size="sm" className="h-6">Owner: Any</Button>
            <Button variant="outline" size="sm" className="h-6">Site: Any</Button>
            <Button variant="outline" size="sm" className="h-6">Severity: Any</Button>
            <Button variant="outline" size="sm" className="h-6">Time Window: 24h</Button>
            <span className="text-[11px] text-vscode-textMuted ml-1">P0 placeholder for advanced filter schema</span>
          </div>
        )}
      </div>

      {/* Secondary Toolbar: bulk actions + KPI summary */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-vscode-border shrink-0 text-[11px]">
        <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          <Tag size={13} /> Filters
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsUnavailable((v) => !v)} title="Toggle unavailable state for workspace validation">
          <AlertTriangle size={13} />
          {isUnavailable ? 'Set Available' : 'Set Unavailable'}
        </Button>
        <div className="w-px h-4 bg-vscode-border mx-1" />
        <span className="text-vscode-accent font-medium">{selectedIds.size} selected</span>
        {[
          { icon: UserPlus, label: 'Assign' },
          { icon: Tag, label: 'Tag' },
          { icon: Bookmark, label: 'Watchlist' },
          { icon: RefreshCw, label: 'Resync' },
          { icon: ArrowUpRight, label: 'Escalate' },
        ].map((a) => (
          <Button key={a.label} variant="ghost" size="sm" title={a.label}>
            <a.icon size={12} /> {a.label}
          </Button>
        ))}

        {/* KPI summary on the right */}
        <div className="flex items-center gap-3 ml-auto">
          {[
            { label: 'Total', value: stats.total, color: 'text-vscode-textBright' },
            { label: 'Transit', value: stats.inTransit, color: 'text-blue-400' },
            { label: 'Exc', value: stats.exceptions, color: 'text-red-400' },
            { label: 'Risk', value: stats.atRisk, color: 'text-yellow-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <span className={`font-bold ${s.color}`}>{s.value}</span>
              <span className="text-vscode-textMuted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left facet panel */}
        {showFacets && (
          <div className="w-[200px] shrink-0 border-r border-vscode-border overflow-y-auto bg-vscode-sidebar">
            {/* Saved Views */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2 flex items-center gap-1"><Star size={10} /> Saved Views</h4>
              {savedViews.map((v) => (
                <div
                  key={v.id}
                  className={`flex items-center justify-between text-[11px] py-1 px-1.5 rounded cursor-pointer ${
                    savedView === v.id ? 'bg-vscode-activeItem text-vscode-textBright' : 'hover:bg-vscode-hover'
                  }`}
                  onClick={() => setSavedView(v.id)}
                >
                  <span className="text-vscode-text truncate">{v.label}</span>
                  <span className="text-vscode-textMuted shrink-0">{v.count}</span>
                </div>
              ))}
            </div>
            {/* Status facets */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">By Status</h4>
              {statusFacets.filter((f) => f.count > 0).map((f) => (
                <div
                  key={f.key}
                  className={`flex items-center justify-between text-[11px] py-1 px-1.5 rounded cursor-pointer ${statusFilter === f.key ? 'bg-vscode-activeItem' : 'hover:bg-vscode-hover'}`}
                  onClick={() => { setStatusFilter(statusFilter === f.key ? 'all' : f.key); setCurrentPage(1); }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="text-vscode-text">{f.label}</span>
                  </div>
                  <span className="text-vscode-textMuted">{f.count}</span>
                </div>
              ))}
            </div>
            {/* Carrier facets */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">By Carrier</h4>
              {carrierFacets.map((f) => (
                <div key={f.key} className="flex items-center justify-between text-[11px] py-1 px-1.5 rounded hover:bg-vscode-hover cursor-pointer">
                  <span className="text-vscode-text">{f.label}</span>
                  <span className="text-vscode-textMuted">{f.count}</span>
                </div>
              ))}
            </div>
            {/* Watchlists (Section 4.2) */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2 flex items-center gap-1"><Bookmark size={10} /> Watchlists</h4>
              {[
                { label: 'High-value shipments', count: 4 },
                { label: 'Customs-sensitive', count: 6 },
                { label: 'VIP customers', count: 3 },
              ].map((w) => (
                <div key={w.label} className="flex items-center justify-between text-[11px] py-1 px-1.5 rounded hover:bg-vscode-hover cursor-pointer">
                  <span className="text-vscode-text truncate">{w.label}</span>
                  <span className="text-vscode-textMuted shrink-0">{w.count}</span>
                </div>
              ))}
            </div>
            {/* Preview Pane (Section 4.7 / 15.2) */}
            {selectedId && (() => {
              const prev = shipments.find((s) => s.id === selectedId);
              if (!prev) return null;
              const st = shipmentStatusConfig[prev.status];
              const risk = riskConfig[prev.riskLevel];
              return (
                <div className="p-3 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold flex items-center gap-1"><Eye size={10} /> Preview</h4>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSelectedId(null)} title="Close Preview (Esc)">×</Button>
                </div>
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-vscode-accent text-[12px] font-medium cursor-pointer hover:underline" onClick={() => onOpenDetail?.(prev.id)}>{prev.id}</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ color: st?.color, backgroundColor: st?.bgColor }}>{st?.label}</span>
                        {risk && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ color: risk.color, backgroundColor: risk.bgColor }}>{risk.label}</span>}
                      </div>
                    </div>
                    <div className="text-[11px] space-y-1">
                      <div className="flex justify-between"><span className="text-vscode-textMuted">Active Leg</span><span className="text-vscode-text">{prev.currentLeg}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">Carrier</span><span className="text-vscode-text">{prev.carrier}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">SLA</span><span className={prev.slaRemainingMinutes !== null && prev.slaRemainingMinutes < 0 ? 'text-red-400' : 'text-vscode-text'}>{formatSlaRemaining(prev.slaRemainingMinutes)}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">Owner</span><span className="text-vscode-text">{prev.owner}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">Route</span><span className="text-vscode-text">{prev.origin} →{prev.destination}</span></div>
                    </div>
                    <div>
                      <span className="text-[10px] text-vscode-textMuted uppercase tracking-wider font-semibold">Last Event</span>
                      <div className="mt-1 text-[11px] text-vscode-text bg-vscode-hover rounded px-2 py-1.5">
                        <div>{prev.lastEvent}</div>
                        <div className="text-vscode-textMuted text-[10px] mt-0.5">{prev.lastEventTime}</div>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-vscode-textMuted uppercase tracking-wider font-semibold">Quick Actions</span>
                      <div className="mt-1 space-y-1">
                        <Button variant="default" size="sm" className="w-full justify-start font-medium" onClick={() => { onOpenDetail?.(prev.id); setSelectedId(null); }}>Open Full Detail →</Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">Resync Tracking</Button>
                        <Button variant="ghost" size="sm" className="w-full justify-start">Assign Owner</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Main grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Facet Summary Strip (Section 15.2) */}
          <div className="flex items-center gap-4 px-3 py-1.5 bg-vscode-sidebar border-b border-vscode-border text-[11px] shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-vscode-textMuted">Status:</span>
              {Object.entries(
                filtered.reduce<Record<string, number>>((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {})
              ).map(([status, count]) => {
                const cfg = shipmentStatusConfig[status];
                return <span key={status} className="whitespace-nowrap" style={{ color: cfg?.color }}>{cfg?.label || status} <strong>{count}</strong></span>;
              })}
            </div>
            <span className="text-vscode-border">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-vscode-textMuted">Risk:</span>
              {Object.entries(
                filtered.reduce<Record<string, number>>((acc, s) => { acc[s.riskLevel] = (acc[s.riskLevel] || 0) + 1; return acc; }, {})
              ).map(([risk, count]) => {
                const cfg = riskConfig[risk];
                return <span key={risk} className="whitespace-nowrap" style={{ color: cfg?.color }}>{cfg?.label || risk} <strong>{count}</strong></span>;
              })}
            </div>
            <span className="text-vscode-border">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-vscode-textMuted">Carrier:</span>
              {Object.entries(
                filtered.reduce<Record<string, number>>((acc, s) => { acc[s.carrier] = (acc[s.carrier] || 0) + 1; return acc; }, {})
              ).slice(0, 4).map(([carrier, count]) => (
                <span key={carrier} className="text-vscode-text whitespace-nowrap">{carrier} <strong>{count}</strong></span>
              ))}
            </div>
          </div>

          {isUnavailable ? (
            <div className="flex-1 min-h-0">
              <UnavailableState onRetry={() => setIsUnavailable(false)} />
            </div>
          ) : viewMode === 'table' && (
            <>
              <div className="flex-1 p-2">
                <div className="h-full border border-vscode-border rounded-md bg-vscode-sidebar overflow-hidden">
                  <div className="h-full overflow-auto">
                    <table className="w-full text-[12px] border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-vscode-sidebar text-vscode-textMuted text-left">
                      <th className="px-2 py-2 font-medium border-b border-vscode-border w-[30px]">
                        <input type="checkbox" checked={selectedIds.size === paged.length && paged.length > 0} onChange={toggleSelectAll} className="accent-vscode-accent" />
                      </th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Shipment</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Order</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Origin</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Destination</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Carrier</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Lane</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">Status</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Active Leg</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">Risk</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">SLA</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">Remaining</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">Exc</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Legs</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Owner</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">Last Event</th>
                      <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center w-[60px]"></th>
                    </tr>
                  </thead>
                  {isLoading ? <SkeletonTable rows={8} cols={17} /> : <tbody>
                    {paged.map((shipment) => {
                      const st = shipmentStatusConfig[shipment.status];
                      const sla = slaStatusConfig[shipment.slaStatus];
                      const StatusIcon = statusIcons[shipment.status] || Package;
                      return (
                        <tr
                          key={shipment.id}
                          onClick={() => handleRowClick(shipment)}
                          onDoubleClick={() => onOpenDetail?.(shipment.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedId === shipment.id ? 'bg-vscode-activeItem' : 'hover:bg-vscode-hover'
                          }`}
                        >
                          <td className={`px-2 ${cellPy} border-b border-vscode-border`} onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedIds.has(shipment.id)} onChange={() => toggleSelect(shipment.id)} className="accent-vscode-accent" />
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border whitespace-nowrap`}>
                            <span className="text-vscode-accent font-medium">{shipment.id}</span>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-textMuted whitespace-nowrap`}>{shipment.orderId}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text whitespace-nowrap`}>{shipment.origin}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text whitespace-nowrap`}>{shipment.destination}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text whitespace-nowrap`}>{shipment.carrier}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-textMuted whitespace-nowrap text-[11px]`}>{shipment.origin.split(',')[0]} → {shipment.destination.split(',')[0]}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center whitespace-nowrap`}>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: st.color, backgroundColor: st.bgColor }}>
                              <StatusIcon size={11} /> {st.label}
                            </span>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border whitespace-nowrap text-[11px] text-vscode-text`}>{shipment.currentLeg}</td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center whitespace-nowrap`}>
                            {(() => { const r = riskConfig[shipment.riskLevel]; return r ? <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: r.color, backgroundColor: r.bgColor }}>{r.label}</span> : null; })()}
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center whitespace-nowrap`}>
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>{sla.label}</span>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center whitespace-nowrap`}>
                            <span className={`text-[11px] font-medium ${shipment.slaRemainingMinutes !== null && shipment.slaRemainingMinutes < 0 ? 'text-red-400' : shipment.slaRemainingMinutes !== null && shipment.slaRemainingMinutes < 120 ? 'text-yellow-400' : 'text-vscode-textMuted'}`}>
                              {formatSlaRemaining(shipment.slaRemainingMinutes)}
                            </span>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center whitespace-nowrap`}>
                            {(() => { const cnt = exceptions.filter((e) => e.objectId === shipment.id && e.status !== 'resolved').length; return cnt > 0 ? <span className="text-red-400 font-medium text-[11px]">{cnt}</span> : <span className="text-vscode-textMuted text-[11px]">0</span>; })()}
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text whitespace-nowrap`}>
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {Array.from({ length: shipment.legs }).map((_, i) => (
                                  <div key={i} className={`w-2 h-2 rounded-full ${i < shipment.completedLegs ? 'bg-green-400' : 'bg-vscode-border'}`} />
                                ))}
                              </div>
                              <span className="text-[11px] text-vscode-textMuted">{shipment.currentLeg}</span>
                            </div>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border whitespace-nowrap`}>
                            <span className={`text-[11px] ${shipment.owner === 'Unassigned' ? 'text-vscode-textMuted italic' : 'text-vscode-text'}`}>{shipment.owner}</span>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border whitespace-nowrap`}>
                            <div className="flex flex-col">
                              <span className="text-vscode-text text-[11px] truncate max-w-[180px]">{shipment.lastEvent}</span>
                              <span className="text-vscode-textMuted text-[10px]"><Clock size={10} className="inline mr-0.5" />{shipment.lastEventTime}</span>
                            </div>
                          </td>
                          <td className={`px-3 ${cellPy} border-b border-vscode-border text-center`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onOpenDetail?.(shipment.id); }} title="Open Detail">
                              <Eye size={14} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {paged.length === 0 && (
                      <tr>
                        <td colSpan={17} className="px-4 py-4">
                          <div className="h-[220px]">
                            {isFiltered ? (
                              <FilteredEmptyState
                                onReset={() => {
                                  setSearchTerm('');
                                  setStatusFilter('all');
                                  setSlaFilter('all');
                                  setRiskFilter('all');
                                  setCarrierFilter('all');
                                  setSavedView('all-active');
                                  setCurrentPage(1);
                                }}
                              />
                            ) : (
                              <TrulyEmptyState />
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>}
                    </table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-1.5 border-t border-vscode-border bg-vscode-sidebar shrink-0 text-[12px] text-vscode-textMuted select-none">
                <span>Page {currentPage} / {totalPages}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></Button>
                </div>
              </div>
            </>
          )}

          {viewMode === 'board' && (
            <div className="flex-1 overflow-auto p-3">
              <div className="flex gap-3 min-w-max">
                {Object.entries(shipmentStatusConfig).filter(([key]) => filtered.some((s) => s.status === key)).map(([statusKey, cfg]) => {
                  const items = filtered.filter((s) => s.status === statusKey);
                  return (
                    <div key={statusKey} className="w-[240px] shrink-0">
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                        <span className="text-[12px] text-vscode-textBright font-semibold">{cfg.label}</span>
                        <span className="text-[10px] text-vscode-textMuted bg-vscode-hover px-1.5 rounded-full">{items.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {items.map((s) => {
                          const sla = slaStatusConfig[s.slaStatus];
                          return (
                            <div
                              key={s.id}
                              className="bg-vscode-sidebar rounded p-2.5 border border-vscode-border hover:border-vscode-accent/50 cursor-pointer"
                              onClick={() => { handleRowClick(s); }}
                              onDoubleClick={() => onOpenDetail?.(s.id)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] text-vscode-accent font-medium">{s.id}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>{sla.label}</span>
                              </div>
                              <div className="text-[10px] text-vscode-textMuted mb-1">{s.origin} →{s.destination}</div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-vscode-textMuted">{s.carrier}</span>
                                <div className="flex gap-0.5">
                                  {Array.from({ length: s.legs }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < s.completedLegs ? 'bg-green-400' : 'bg-vscode-border'}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="flex-1 overflow-auto p-4">
              <div className="max-w-[700px]">
                <h3 className="text-[12px] text-vscode-textBright font-semibold mb-3">Shipments by Promise Date</h3>
                {[...filtered].sort((a, b) => a.promisedDate.localeCompare(b.promisedDate)).map((s) => {
                  const st = shipmentStatusConfig[s.status];
                  const sla = slaStatusConfig[s.slaStatus];
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 py-2 border-b border-vscode-border hover:bg-vscode-hover cursor-pointer"
                      onClick={() => handleRowClick(s)}
                      onDoubleClick={() => onOpenDetail?.(s.id)}
                    >
                      <span className="text-[11px] text-vscode-textMuted font-mono w-[80px] shrink-0">{s.promisedDate}</span>
                      <span className={`w-2 h-2 rounded-full shrink-0`} style={{ backgroundColor: st.color }} />
                      <span className="text-[12px] text-vscode-accent font-medium w-[110px] shrink-0">{s.id}</span>
                      <span className="text-[11px] text-vscode-text truncate flex-1">{s.origin} →{s.destination}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0" style={{ color: sla.color, backgroundColor: sla.bgColor }}>{sla.label}</span>
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: s.legs }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < s.completedLegs ? 'bg-green-400' : 'bg-vscode-border'}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




