import { useState } from 'react';
import {
  ArrowRightLeft, Search, Clock, CheckCircle, AlertTriangle, Truck,
  MapPin, Anchor, Package, Eye,
} from 'lucide-react';
import { useDensity } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface LegMonitorProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type LegStatus = 'pending' | 'in_transit' | 'arrived' | 'completed' | 'exception' | 'cancelled';

interface LegItem {
  id: string;
  shipmentId: string;
  sequence: number;
  legType: string;
  carrier: string;
  origin: string;
  destination: string;
  status: LegStatus;
  plannedDeparture: string;
  plannedArrival: string;
  actualDeparture: string | null;
  actualArrival: string | null;
  dwellMinutes: number | null;
}

const legStatusConfig: Record<LegStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: '#6b7280', bg: '#6b728020' },
  in_transit: { label: 'In Transit', color: '#3b82f6', bg: '#3b82f620' },
  arrived:    { label: 'Arrived',    color: '#8b5cf6', bg: '#8b5cf620' },
  completed:  { label: 'Completed',  color: '#22c55e', bg: '#22c55e20' },
  exception:  { label: 'Exception',  color: '#ef4444', bg: '#ef444420' },
  cancelled:  { label: 'Cancelled',  color: '#6b7280', bg: '#6b728020' },
};

const sampleLegs: LegItem[] = [
  { id: 'LEG-001', shipmentId: 'SHP-20240301', sequence: 1, legType: 'First Mile', carrier: 'Local Trucking', origin: 'Shanghai Factory', destination: 'Shanghai Port', status: 'completed', plannedDeparture: '2024-03-02 08:00', plannedArrival: '2024-03-02 14:00', actualDeparture: '2024-03-02 08:30', actualArrival: '2024-03-02 13:45', dwellMinutes: 120 },
  { id: 'LEG-002', shipmentId: 'SHP-20240301', sequence: 2, legType: 'Ocean', carrier: 'Maersk', origin: 'Shanghai Port', destination: 'Busan Port', status: 'in_transit', plannedDeparture: '2024-03-05 06:00', plannedArrival: '2024-03-06 22:00', actualDeparture: '2024-03-05 06:30', actualArrival: null, dwellMinutes: null },
  { id: 'LEG-003', shipmentId: 'SHP-20240301', sequence: 3, legType: 'Ocean', carrier: 'Maersk', origin: 'Busan Port', destination: 'Los Angeles Port', status: 'pending', plannedDeparture: '2024-03-07 10:00', plannedArrival: '2024-03-14 08:00', actualDeparture: null, actualArrival: null, dwellMinutes: null },
  { id: 'LEG-004', shipmentId: 'SHP-20240302', sequence: 1, legType: 'Air', carrier: 'DHL', origin: 'Shenzhen Airport', destination: 'London Heathrow', status: 'exception', plannedDeparture: '2024-03-03 22:00', plannedArrival: '2024-03-04 16:00', actualDeparture: null, actualArrival: null, dwellMinutes: null },
  { id: 'LEG-005', shipmentId: 'SHP-20240304', sequence: 1, legType: 'First Mile', carrier: 'Local Trucking', origin: 'Ningbo Warehouse', destination: 'Shanghai Port', status: 'completed', plannedDeparture: '2024-03-04 06:00', plannedArrival: '2024-03-04 12:00', actualDeparture: '2024-03-04 06:15', actualArrival: '2024-03-04 11:50', dwellMinutes: 180 },
  { id: 'LEG-006', shipmentId: 'SHP-20240304', sequence: 2, legType: 'Ocean', carrier: 'COSCO', origin: 'Shanghai Port', destination: 'Singapore Port', status: 'in_transit', plannedDeparture: '2024-03-05 20:00', plannedArrival: '2024-03-10 08:00', actualDeparture: '2024-03-05 21:00', actualArrival: null, dwellMinutes: null },
  { id: 'LEG-007', shipmentId: 'SHP-20240305', sequence: 3, legType: 'Last Mile', carrier: 'UPS', origin: 'JFK Hub', destination: 'New York Office', status: 'in_transit', plannedDeparture: '2024-03-07 08:00', plannedArrival: '2024-03-07 14:00', actualDeparture: '2024-03-07 08:15', actualArrival: null, dwellMinutes: null },
  { id: 'LEG-008', shipmentId: 'SHP-20240308', sequence: 1, legType: 'Ocean', carrier: 'MSC', origin: 'Tianjin Port', destination: 'Jebel Ali Port', status: 'arrived', plannedDeparture: '2024-03-05 10:00', plannedArrival: '2024-03-08 06:00', actualDeparture: '2024-03-05 10:30', actualArrival: '2024-03-08 05:45', dwellMinutes: 90 },
];

export default function LegMonitor({ onOpenTab }: LegMonitorProps) {
  const { density } = useDensity();
  const cellPy = density === 'compact' ? 'py-1' : 'py-2.5';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = sampleLegs.filter((leg) => {
    const matchSearch = leg.id.toLowerCase().includes(searchTerm.toLowerCase()) || leg.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) || leg.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || leg.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-vscode-border shrink-0 bg-vscode-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-vscode-textBright font-semibold">Leg Monitor</span>
          <span className="text-[11px] text-vscode-textMuted">All Legs</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[320px]">
          <Search size={13} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input type="text" placeholder="Search leg, shipment, carrier..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-[12px] text-vscode-text w-full placeholder:text-vscode-textMuted" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Status</option>
          {Object.entries(legStatusConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
        </select>
        <span className="text-[12px] text-vscode-textMuted ml-auto">{filtered.length} legs</span>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-vscode-sidebar text-vscode-textMuted text-left">
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Leg ID</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Shipment</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">#</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Type</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Carrier</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Origin</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Destination</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Status</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Planned</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Actual</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Dwell</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((leg) => {
              const st = legStatusConfig[leg.status];
              return (
                <tr key={leg.id} className="hover:bg-vscode-hover cursor-pointer">
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-accent font-medium`}>{leg.id}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border`}>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-vscode-accent hover:underline" onClick={() => onOpenTab?.(`shipment-detail-${leg.shipmentId}`, `Shipment ${leg.shipmentId}`)}>{leg.shipmentId}</Button>
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-textMuted`}>L{leg.sequence}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text`}>{leg.legType}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text`}>{leg.carrier}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text text-[11px]`}>{leg.origin}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text text-[11px]`}>{leg.destination}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-center`}>
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: st.color, backgroundColor: st.bg }}>{st.label}</span>
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-textMuted text-[10px]`}>
                    <div>{leg.plannedDeparture.split(' ')[0]}</div>
                    <div>{leg.plannedDeparture.split(' ')[1]} ¡ú{leg.plannedArrival.split(' ')[1]}</div>
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-[10px]`}>
                    {leg.actualDeparture ? (
                      <div>
                        <div className="text-vscode-text">{leg.actualDeparture.split(' ')[1]}</div>
                        <div className="text-vscode-textMuted">{leg.actualArrival ? leg.actualArrival.split(' ')[1] : 'In progress'}</div>
                      </div>
                    ) : <span className="text-vscode-textMuted">-</span>}
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-center`}>
                    {leg.dwellMinutes !== null ? (
                      <span className={`text-[11px] ${leg.dwellMinutes > 150 ? 'text-yellow-400' : 'text-vscode-textMuted'}`}>{leg.dwellMinutes}m</span>
                    ) : <span className="text-vscode-textMuted">-</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}




