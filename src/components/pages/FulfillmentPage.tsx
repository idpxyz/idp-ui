import { useState } from 'react';
import {
  Package, Search, Clock, CheckCircle, AlertTriangle, Truck,
  ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Eye, XCircle,
} from 'lucide-react';
import { useDensity } from '../../contexts/DensityContext';
import { Button } from '../ui/button';

interface FulfillmentPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type FRStatus = 'pending' | 'allocated' | 'picking' | 'packed' | 'shipped' | 'cancelled';

interface FulfillmentRequest {
  id: string;
  orderId: string;
  status: FRStatus;
  warehouse: string;
  items: number;
  allocatedItems: number;
  promisedDate: string;
  carrier: string;
  shipmentId: string | null;
  createdAt: string;
}

const statusConfig: Record<FRStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: 'Pending',   color: '#6b7280', bg: '#6b728020', icon: Clock },
  allocated:  { label: 'Allocated', color: '#3b82f6', bg: '#3b82f620', icon: Package },
  picking:    { label: 'Picking',   color: '#f59e0b', bg: '#f59e0b20', icon: Package },
  packed:     { label: 'Packed',    color: '#8b5cf6', bg: '#8b5cf620', icon: CheckCircle },
  shipped:    { label: 'Shipped',   color: '#22c55e', bg: '#22c55e20', icon: Truck },
  cancelled:  { label: 'Cancelled', color: '#6b7280', bg: '#6b728020', icon: XCircle },
};

const sampleFRs: FulfillmentRequest[] = [
  { id: 'FR-20240301-001', orderId: 'ORD-1001', status: 'shipped', warehouse: 'Shanghai WH-A', items: 3, allocatedItems: 3, promisedDate: '2024-03-15', carrier: 'Maersk', shipmentId: 'SHP-20240301', createdAt: '2024-03-01' },
  { id: 'FR-20240302-001', orderId: 'ORD-1002', status: 'picking', warehouse: 'Shenzhen WH-B', items: 2, allocatedItems: 2, promisedDate: '2024-03-10', carrier: 'DHL', shipmentId: null, createdAt: '2024-03-02' },
  { id: 'FR-20240303-001', orderId: 'ORD-1003', status: 'packed', warehouse: 'Guangzhou WH-C', items: 1, allocatedItems: 1, promisedDate: '2024-03-08', carrier: 'FedEx', shipmentId: null, createdAt: '2024-03-03' },
  { id: 'FR-20240304-001', orderId: 'ORD-1004', status: 'allocated', warehouse: 'Ningbo WH-D', items: 5, allocatedItems: 3, promisedDate: '2024-03-20', carrier: 'COSCO', shipmentId: null, createdAt: '2024-03-04' },
  { id: 'FR-20240305-001', orderId: 'ORD-1005', status: 'shipped', warehouse: 'Beijing WH-E', items: 1, allocatedItems: 1, promisedDate: '2024-03-07', carrier: 'UPS', shipmentId: 'SHP-20240305', createdAt: '2024-03-05' },
  { id: 'FR-20240306-001', orderId: 'ORD-1006', status: 'pending', warehouse: 'Qingdao WH-F', items: 4, allocatedItems: 0, promisedDate: '2024-03-25', carrier: '-', shipmentId: null, createdAt: '2024-03-06' },
  { id: 'FR-20240307-001', orderId: 'ORD-1007', status: 'cancelled', warehouse: 'Xiamen WH-G', items: 2, allocatedItems: 0, promisedDate: '2024-03-18', carrier: '-', shipmentId: null, createdAt: '2024-03-07' },
];

export default function FulfillmentPage({ onOpenTab }: FulfillmentPageProps) {
  const { density } = useDensity();
  const cellPy = density === 'compact' ? 'py-1' : 'py-2.5';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = sampleFRs.filter((fr) => {
    const matchSearch = fr.id.toLowerCase().includes(searchTerm.toLowerCase()) || fr.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || fr.warehouse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || fr.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: sampleFRs.length,
    pending: sampleFRs.filter((f) => f.status === 'pending').length,
    inProgress: sampleFRs.filter((f) => ['allocated', 'picking', 'packed'].includes(f.status)).length,
    shipped: sampleFRs.filter((f) => f.status === 'shipped').length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-vscode-border shrink-0 bg-vscode-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-vscode-textBright font-semibold">Fulfillment</span>
          <span className="text-[11px] text-vscode-textMuted">All Warehouses</span>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[320px]">
          <Search size={13} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input type="text" placeholder="Search FR, order, warehouse..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-[12px] text-vscode-text w-full placeholder:text-vscode-textMuted" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
        </select>
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          {[
            { label: 'Total', value: stats.total, color: 'text-vscode-textBright' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-400' },
            { label: 'Shipped', value: stats.shipped, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <span className={`font-bold ${s.color}`}>{s.value}</span>
              <span className="text-vscode-textMuted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-vscode-sidebar text-vscode-textMuted text-left">
              <th className="px-3 py-2 font-medium border-b border-vscode-border">FR ID</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Order</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Warehouse</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Status</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Items</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Carrier</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Promise</th>
              <th className="px-3 py-2 font-medium border-b border-vscode-border">Shipment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fr) => {
              const st = statusConfig[fr.status];
              const StIcon = st.icon;
              return (
                <tr key={fr.id} className="hover:bg-vscode-hover cursor-pointer">
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-accent font-medium`}>{fr.id}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text cursor-pointer hover:text-vscode-accent`} onClick={() => onOpenTab?.(`order-detail-${fr.orderId}`, fr.orderId)}>{fr.orderId}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text`}>{fr.warehouse}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-center`}>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: st.color, backgroundColor: st.bg }}>
                      <StIcon size={11} /> {st.label}
                    </span>
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-center text-vscode-text`}>
                    <span className={fr.allocatedItems < fr.items ? 'text-yellow-400' : 'text-green-400'}>{fr.allocatedItems}</span>/{fr.items}
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-text`}>{fr.carrier}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border text-vscode-textMuted`}>{fr.promisedDate}</td>
                  <td className={`px-3 ${cellPy} border-b border-vscode-border`}>
                    {fr.shipmentId ? (
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-vscode-accent hover:underline" onClick={() => onOpenTab?.(`shipment-detail-${fr.shipmentId}`, `Shipment ${fr.shipmentId}`)}>{fr.shipmentId}</Button>
                    ) : (
                      <span className="text-vscode-textMuted text-[11px]">-</span>
                    )}
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




