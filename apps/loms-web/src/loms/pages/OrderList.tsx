import { useState } from 'react';
import { ChevronRight, Search, ChevronLeft, Package } from 'lucide-react';
import { useDensity } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';

interface OrderListProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

interface LOMSOrder {
  id: string;
  customerId: string;
  customerName: string;
  items: number;
  totalValue: string;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shipmentIds: string[];
}

const orders: LOMSOrder[] = [
  { id: 'ORD-1001', customerId: 'C-101', customerName: 'Acme Corp', items: 3, totalValue: '12,500', currency: 'USD', status: 'shipped', createdAt: '2024-03-01', shipmentIds: ['SHP-20240301'] },
  { id: 'ORD-1002', customerId: 'C-102', customerName: 'Global Trade Inc', items: 1, totalValue: '8,200', currency: 'USD', status: 'processing', createdAt: '2024-03-02', shipmentIds: ['SHP-20240302'] },
  { id: 'ORD-1003', customerId: 'C-103', customerName: 'Pacific Imports', items: 5, totalValue: '34,100', currency: 'USD', status: 'shipped', createdAt: '2024-03-03', shipmentIds: ['SHP-20240303', 'SHP-20240304'] },
  { id: 'ORD-1004', customerId: 'C-104', customerName: 'EuroLogistics GmbH', items: 2, totalValue: '15,800', currency: 'EUR', status: 'confirmed', createdAt: '2024-03-04', shipmentIds: ['SHP-20240305'] },
  { id: 'ORD-1005', customerId: 'C-105', customerName: 'Asia Express Co', items: 8, totalValue: '52,300', currency: 'USD', status: 'shipped', createdAt: '2024-03-05', shipmentIds: ['SHP-20240306', 'SHP-20240307'] },
  { id: 'ORD-1006', customerId: 'C-106', customerName: 'MidEast Trading', items: 1, totalValue: '4,900', currency: 'USD', status: 'delivered', createdAt: '2024-03-06', shipmentIds: ['SHP-20240308'] },
  { id: 'ORD-1007', customerId: 'C-107', customerName: 'Nordic Freight AB', items: 4, totalValue: '28,700', currency: 'EUR', status: 'processing', createdAt: '2024-03-07', shipmentIds: ['SHP-20240309'] },
  { id: 'ORD-1008', customerId: 'C-108', customerName: 'Latam Cargo SA', items: 2, totalValue: '11,300', currency: 'USD', status: 'pending', createdAt: '2024-03-08', shipmentIds: [] },
  { id: 'ORD-1009', customerId: 'C-109', customerName: 'AfriFreight Ltd', items: 6, totalValue: '41,600', currency: 'USD', status: 'shipped', createdAt: '2024-03-09', shipmentIds: ['SHP-20240310', 'SHP-20240311'] },
  { id: 'ORD-1010', customerId: 'C-110', customerName: 'OceanBridge Pty', items: 1, totalValue: '6,400', currency: 'AUD', status: 'cancelled', createdAt: '2024-03-10', shipmentIds: [] },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: '#9ca3af', bgColor: '#9ca3af20' },
  confirmed: { label: 'Confirmed', color: '#60a5fa', bgColor: '#60a5fa20' },
  processing: { label: 'Processing', color: '#c084fc', bgColor: '#c084fc20' },
  shipped: { label: 'Shipped', color: '#34d399', bgColor: '#34d39920' },
  delivered: { label: 'Delivered', color: '#22c55e', bgColor: '#22c55e20' },
  cancelled: { label: 'Cancelled', color: '#f87171', bgColor: '#f8717120' },
};

export default function OrderList({ onOpenTab }: OrderListProps) {
  const { density } = useDensity();
  const cellPy = density === 'compact' ? 'py-1' : 'py-2.5';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-idpxyz-breadcrumb bg-idpxyz-editor border-b border-idpxyz-border shrink-0 select-none">
        <span className="hover:text-idpxyz-textBright cursor-pointer">Operations</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-text">Orders</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center bg-idpxyz-sidebar border border-idpxyz-border rounded px-2 py-1 gap-1.5 flex-1 max-w-[300px]">
          <Search size={14} className="text-idpxyz-textMuted" />
          <input
            className="bg-transparent text-[12px] text-idpxyz-text placeholder-idpxyz-textMuted outline-none flex-1"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="bg-idpxyz-sidebar border border-idpxyz-border rounded px-2 py-1 text-[12px] text-idpxyz-text outline-none"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <span className="text-[12px] text-idpxyz-textMuted ml-auto">{filtered.length} orders</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="sticky top-0 bg-idpxyz-sidebar z-10">
            <tr className="text-idpxyz-textMuted text-left">
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Order ID</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Customer</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">Items</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">Value</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">Status</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Created</th>
              <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Shipments</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => {
              const sc = statusConfig[o.status];
              return (
                <tr key={o.id} className="hover:bg-idpxyz-hover cursor-pointer">
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-accent font-medium`}>{o.id}</td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-text`}>{o.customerName}</td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-center text-idpxyz-text`}>{o.items}</td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-right text-idpxyz-textBright font-medium`}>{o.currency} {o.totalValue}</td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-center`}>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: sc.color, backgroundColor: sc.bgColor }}>{sc.label}</span>
                  </td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border text-idpxyz-textMuted`}>{o.createdAt}</td>
                  <td className={`px-3 ${cellPy} border-b border-idpxyz-border`}>
                    <div className="flex items-center gap-1">
                      {o.shipmentIds.length === 0 ? (
                        <span className="text-idpxyz-textMuted">â€?¡ª</span>
                      ) : (
                        o.shipmentIds.map((sid) => (
                          <span
                            key={sid}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium cursor-pointer hover:bg-blue-500/30"
                            onClick={(e) => { e.stopPropagation(); onOpenTab?.(`shipment-detail-${sid}`, `Shipment ${sid}`); }}
                          >
                            {sid}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-idpxyz-border shrink-0 text-[12px]">
          <span className="text-idpxyz-textMuted">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /></Button>
            <Button variant="ghost" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={14} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}




