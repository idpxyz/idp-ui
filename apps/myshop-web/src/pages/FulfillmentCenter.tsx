import { useMemo, useState } from 'react';
import { IconSearch, IconPackageCheck, IconShipment, IconWarning, IconPlay, IconArrowRight, IconSuccess } from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  orders as allOrders,
  fulfillmentStatusConfig,
  orderStatusConfig,
  riskLevelConfig,
  type Order,
  type FulfillmentStatus,
} from '../data/oms';

interface FulfillmentCenterProps {
  onSelectOrder?: (order: Order) => void;
  onOpenOrderDetail?: (orderId: string) => void;
}

const queueStatuses: FulfillmentStatus[] = ['unallocated', 'allocated', 'picking', 'packing', 'partially_shipped', 'shipped', 'ff_failed'];

export default function FulfillmentCenter({ onSelectOrder, onOpenOrderDetail }: FulfillmentCenterProps) {
  const [queue, setQueue] = useState<Order[]>(
    allOrders.filter(o => queueStatuses.includes(o.fulfillmentStatus))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouse, setWarehouse] = useState<'all' | string>('all');
  const [status, setStatus] = useState<'all' | FulfillmentStatus>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(queue[0]?.id ?? null);

  const warehouseOptions = useMemo(
    () => ['all', ...Array.from(new Set(queue.map(o => o.warehouse).filter(Boolean)))],
    [queue]
  );

  const filtered = useMemo(() => {
    let rows = [...queue];
    if (status !== 'all') rows = rows.filter(o => o.fulfillmentStatus === status);
    if (warehouse !== 'all') rows = rows.filter(o => o.warehouse === warehouse);
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      rows = rows.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.store.toLowerCase().includes(q)
      );
    }
    return rows.sort((a, b) => a.slaHoursRemaining - b.slaHoursRemaining);
  }, [queue, status, warehouse, searchTerm]);

  const selected = filtered.find(o => o.id === selectedOrderId) ?? queue.find(o => o.id === selectedOrderId) ?? null;

  const updateOrder = (orderId: string, nextStatus: FulfillmentStatus) => {
    setQueue(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        fulfillmentStatus: nextStatus,
        status: nextStatus === 'shipped' ? 'fulfilled' : 'in_fulfillment',
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
    }));
  };

  const handlePrimaryAction = (order: Order) => {
    if (order.fulfillmentStatus === 'unallocated') updateOrder(order.id, 'allocated');
    else if (order.fulfillmentStatus === 'allocated') updateOrder(order.id, 'picking');
    else if (order.fulfillmentStatus === 'picking') updateOrder(order.id, 'packing');
    else if (order.fulfillmentStatus === 'packing') updateOrder(order.id, 'shipped');
  };

  const actionLabel = (s: FulfillmentStatus) => {
    if (s === 'unallocated') return '分配库存';
    if (s === 'allocated') return '开始拣货';
    if (s === 'picking') return '开始打包';
    if (s === 'packing') return '确认发货';
    return '';
  };

  const kpi = {
    waiting: queue.filter(o => ['unallocated', 'allocated'].includes(o.fulfillmentStatus)).length,
    processing: queue.filter(o => ['picking', 'packing'].includes(o.fulfillmentStatus)).length,
    overdue: queue.filter(o => o.slaHoursRemaining < 0).length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor min-w-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          <IconShipment size={16} className="text-vscode-accent" />
          <h1 className="text-[14px] font-semibold text-vscode-textBright">履约中心</h1>
          <span className="text-[11px] text-vscode-textMuted">{filtered.length} 单待处理</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 py-2 border-b border-vscode-border shrink-0 text-[11px]">
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">待分配/待拣货 <span className="ml-2 text-vscode-textBright font-semibold">{kpi.waiting}</span></div>
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">履约处理中 <span className="ml-2 text-vscode-textBright font-semibold">{kpi.processing}</span></div>
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">SLA超期 <span className="ml-2 text-red-400 font-semibold">{kpi.overdue}</span></div>
      </div>

      <div className="flex items-center gap-2 px-5 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[28px] border border-vscode-border flex-1 max-w-[320px]">
          <IconSearch size={12} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索订单号、客户、店铺..."
            className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted"
          />
        </div>
        <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none">
          {warehouseOptions.map(w => <option key={w} value={w}>{w === 'all' ? '全部仓库' : w}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | FulfillmentStatus)} className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none">
          <option value="all">全部履约状态</option>
          {queueStatuses.map(s => <option key={s} value={s}>{fulfillmentStatusConfig[s].label}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-vscode-sidebar text-vscode-textMuted">
              <th className="text-left px-4 py-2 font-medium border-b border-vscode-border">订单</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">履约状态</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">订单状态</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">仓库</th>
              <th className="text-right px-2 py-2 font-medium border-b border-vscode-border">SLA</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">负责人</th>
              <th className="text-right px-3 py-2 font-medium border-b border-vscode-border">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const fs = fulfillmentStatusConfig[o.fulfillmentStatus];
              const os = orderStatusConfig[o.status];
              const risk = riskLevelConfig[o.riskLevel];
              const selectedRow = o.id === selectedOrderId;
              return (
                <tr
                  key={o.id}
                  onClick={() => { setSelectedOrderId(o.id); onSelectOrder?.(o); }}
                  onDoubleClick={() => onOpenOrderDetail?.(o.id)}
                  className={`cursor-pointer border-b border-vscode-border ${selectedRow ? 'bg-vscode-accent/8' : 'hover:bg-vscode-hover'}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="text-vscode-accent font-medium">{o.id}</div>
                    <div className="text-vscode-text text-[10px]">{o.customerName} · {o.store}</div>
                    <div className="text-[10px] mt-0.5"><span className="text-vscode-textMuted">风险: </span><span style={{ color: risk.color }}>{risk.label}</span></div>
                  </td>
                  <td className="px-2 py-2.5"><span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: fs.color, backgroundColor: fs.bgColor }}>{fs.label}</span></td>
                  <td className="px-2 py-2.5"><span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: os.color, backgroundColor: os.bgColor }}>{os.label}</span></td>
                  <td className="px-2 py-2.5 text-vscode-text">{o.warehouse || '-'}</td>
                  <td className={`px-2 py-2.5 text-right font-mono ${o.slaHoursRemaining < 0 ? 'text-red-400' : o.slaHoursRemaining <= 6 ? 'text-yellow-400' : 'text-vscode-textMuted'}`}>
                    {o.slaHoursRemaining > 0 ? `${o.slaHoursRemaining}小时` : o.slaHoursRemaining < 0 ? `超${Math.abs(o.slaHoursRemaining)}小时` : '-'}
                  </td>
                  <td className="px-2 py-2.5 text-vscode-text">{o.assignedTo || '-'}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {actionLabel(o.fulfillmentStatus) && (
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handlePrimaryAction(o); }}>
                          <IconPlay size={12} /> {actionLabel(o.fulfillmentStatus)}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={(e) => { e.stopPropagation(); updateOrder(o.id, 'ff_failed'); }}>
                        <IconWarning size={12} /> 标记异常
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-vscode-textMuted">没有匹配当前筛选条件的履约单。</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="px-5 py-2 border-t border-vscode-border bg-vscode-sidebar text-[11px] flex items-center gap-4">
          <div className="inline-flex items-center gap-1 text-vscode-text"><IconPackageCheck size={12} /> 当前单: {selected.id}</div>
          <div className="inline-flex items-center gap-1 text-vscode-textMuted"><IconArrowRight size={12} /> {fulfillmentStatusConfig[selected.fulfillmentStatus].label}</div>
          {selected.fulfillmentStatus === 'shipped' && <div className="inline-flex items-center gap-1 text-green-400"><IconSuccess size={12} /> 已发货完成</div>}
        </div>
      )}
    </div>
  );
}
