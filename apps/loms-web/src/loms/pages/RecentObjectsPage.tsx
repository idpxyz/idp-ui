import { useState } from 'react';
import { History, Truck, AlertTriangle, Package, Clock, Search, X, ExternalLink } from 'lucide-react';
import { shipments, exceptions, shipmentStatusConfig, slaStatusConfig } from '../data/loms';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface RecentObjectsPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type ObjectType = 'all' | 'shipment' | 'exception' | 'order';

const recentTimestamps = ['Just now', '2m ago', '5m ago', '12m ago', '18m ago', '25m ago', '31m ago', '45m ago', '1h ago', '1h 20m ago', '2h ago', '3h ago'];

const recentObjects = [
  ...shipments.slice(0, 6).map((s, i) => ({
    id: s.id,
    type: 'shipment' as const,
    name: s.id,
    subtitle: `${shipmentStatusConfig[s.status]?.label ?? s.status} Â· ${s.origin} ¡ú${s.destination}`,
    status: shipmentStatusConfig[s.status]?.label ?? s.status,
    statusColor: shipmentStatusConfig[s.status]?.color ?? '#888',
    slaLabel: slaStatusConfig[s.slaStatus]?.label ?? s.slaStatus,
    slaColor: slaStatusConfig[s.slaStatus]?.color ?? '#888',
    lastAccessed: recentTimestamps[i],
    tabId: `shipment-detail-${s.id}`,
  })),
  ...exceptions.slice(0, 4).map((e, i) => ({
    id: e.id,
    type: 'exception' as const,
    name: e.id,
    subtitle: `${e.reason} Â· ${e.severity}`,
    status: e.status,
    statusColor: e.status === 'open' ? '#f87171' : e.status === 'investigating' ? '#fbbf24' : '#4ade80',
    slaLabel: e.severity,
    slaColor: e.severity === 'critical' ? '#f87171' : e.severity === 'high' ? '#fb923c' : '#fbbf24',
    lastAccessed: recentTimestamps[i + 6],
    tabId: `shipment-detail-${e.objectId}`,
  })),
].sort((a, b) => recentTimestamps.indexOf(a.lastAccessed) - recentTimestamps.indexOf(b.lastAccessed));

const typeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  shipment: Truck,
  exception: AlertTriangle,
  order: Package,
};

export default function RecentObjectsPage({ onOpenTab }: RecentObjectsPageProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ObjectType>('all');
  const { addToast } = useToast();

  const filtered = recentObjects.filter((o) => {
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleOpen = (obj: typeof recentObjects[0]) => {
    onOpenTab?.(obj.tabId, obj.name);
    addToast({ type: 'info', title: 'Opened', message: obj.name });
  };

  const typeTabs: { id: ObjectType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'shipment', label: 'Shipments' },
    { id: 'exception', label: 'Exceptions' },
    { id: 'order', label: 'Orders' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-vscode-border shrink-0">
        <div>
          <h1 className="text-[15px] font-semibold text-vscode-textBright flex items-center gap-2">
            <History size={16} className="text-vscode-accent" /> Recent Objects
          </h1>
          <p className="text-[11px] text-vscode-textMuted mt-0.5">Objects you've recently viewed or worked on</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => addToast({ type: 'info', title: 'History cleared', message: 'Recent objects list reset' })}>
          <X size={12} /> Clear History
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 px-5 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-2 bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 w-[220px]">
          <Search size={12} className="text-vscode-textMuted shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recent objects..."
            className="flex-1 bg-transparent outline-none text-[12px] text-vscode-text placeholder:text-vscode-textMuted"
          />
        </div>
        <div className="flex items-center gap-1">
          {typeTabs.map((t) => (
            <Button
              key={t.id}
              variant={typeFilter === t.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTypeFilter(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>
        <span className="ml-auto text-[11px] text-vscode-textMuted">{filtered.length} objects</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="sticky top-0 z-10 bg-vscode-sidebar">
            <tr className="text-vscode-textMuted text-left border-b border-vscode-border">
              <th className="px-5 py-2 font-medium">Object</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Priority / SLA</th>
              <th className="px-3 py-2 font-medium">Last Accessed</th>
              <th className="px-3 py-2 font-medium w-[60px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((obj) => {
              const Icon = typeIcons[obj.type] ?? Package;
              return (
                <tr
                  key={obj.id}
                  onClick={() => handleOpen(obj)}
                  className="border-b border-vscode-border cursor-pointer hover:bg-vscode-hover transition-colors group"
                >
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className="text-vscode-accent shrink-0" />
                      <div>
                        <div className="font-medium text-vscode-textBright">{obj.name}</div>
                        <div className="text-[11px] text-vscode-textMuted truncate max-w-[320px]">{obj.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="capitalize text-vscode-textMuted">{obj.type}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ color: obj.statusColor, backgroundColor: `${obj.statusColor}20` }}>
                      {obj.status}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[11px]" style={{ color: obj.slaColor }}>{obj.slaLabel}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-1 text-vscode-textMuted">
                      <Clock size={10} />
                      {obj.lastAccessed}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6"
                      onClick={(e) => { e.stopPropagation(); handleOpen(obj); }}
                    >
                      <ExternalLink size={13} />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-vscode-textMuted">No recent objects</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}




