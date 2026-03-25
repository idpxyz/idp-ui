import { useMemo, useState } from 'react';
import { IconReturn, IconSearch, IconSuccess, IconError, IconCircleDollar, IconClock3 } from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import { orders, paymentStatusConfig, type Order } from '../data/oms';

type ReturnType = 'return_and_refund' | 'refund_only';
type ReturnReason = 'damaged' | 'wrong_item' | 'no_longer_needed' | 'late_delivery';
type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'refunded';

interface ReturnCase {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  type: ReturnType;
  reason: ReturnReason;
  status: ReturnStatus;
  requestedAt: string;
  assignedTo: string;
}

const reasonLabel: Record<ReturnReason, string> = {
  damaged: '商品破损',
  wrong_item: '错发商品',
  no_longer_needed: '不再需要',
  late_delivery: '延迟送达',
};

const statusLabel: Record<ReturnStatus, { text: string; cls: string }> = {
  requested: { text: '待审核', cls: 'text-yellow-300 bg-yellow-400/15' },
  approved: { text: '已批准', cls: 'text-blue-300 bg-blue-400/15' },
  rejected: { text: '已拒绝', cls: 'text-red-300 bg-red-400/15' },
  refunded: { text: '已退款', cls: 'text-green-300 bg-green-400/15' },
};

const initialCases: ReturnCase[] = [
  { id: 'RET-001', orderId: 'ORD-20250301-004', customerName: '赵德明', amount: 120, type: 'return_and_refund', reason: 'damaged', status: 'requested', requestedAt: '2025-03-01 12:40', assignedTo: '周明' },
  { id: 'RET-002', orderId: 'ORD-20250301-009', customerName: '马可', amount: 78, type: 'refund_only', reason: 'no_longer_needed', status: 'approved', requestedAt: '2025-03-01 09:00', assignedTo: '刘建' },
  { id: 'RET-003', orderId: 'ORD-20250301-006', customerName: '李帆', amount: 89.99, type: 'refund_only', reason: 'late_delivery', status: 'requested', requestedAt: '2025-03-01 11:10', assignedTo: '王丽' },
  { id: 'RET-004', orderId: 'ORD-20250301-012', customerName: '雷奥·加西亚', amount: 56, type: 'return_and_refund', reason: 'wrong_item', status: 'refunded', requestedAt: '2025-02-28 17:20', assignedTo: '系统自动' },
];

interface ReturnsRefundsProps {
  onSelectOrder?: (order: Order) => void;
  onOpenOrderDetail?: (orderId: string) => void;
}

export default function ReturnsRefunds({ onSelectOrder, onOpenOrderDetail }: ReturnsRefundsProps) {
  const [cases, setCases] = useState<ReturnCase[]>(initialCases);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | ReturnStatus>('all');
  const [selectedId, setSelectedId] = useState<string | null>(initialCases[0]?.id ?? null);

  const filtered = useMemo(() => {
    let list = [...cases];
    if (status !== 'all') list = list.filter(c => c.status === status);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      list = list.filter(c => c.id.toLowerCase().includes(s) || c.orderId.toLowerCase().includes(s) || c.customerName.toLowerCase().includes(s));
    }
    return list;
  }, [cases, status, q]);

  const selected = filtered.find(c => c.id === selectedId) ?? cases.find(c => c.id === selectedId) ?? null;

  const updateStatus = (id: string, next: ReturnStatus) => {
    setCases(prev => prev.map(c => (c.id === id ? { ...c, status: next } : c)));
  };

  const openOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) onSelectOrder?.(order);
    onOpenOrderDetail?.(orderId);
  };

  const kpi = {
    pending: cases.filter(c => c.status === 'requested').length,
    approved: cases.filter(c => c.status === 'approved').length,
    refunded: cases.filter(c => c.status === 'refunded').length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor min-w-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          <IconReturn size={16} className="text-vscode-accent" />
          <h1 className="text-[14px] font-semibold text-vscode-textBright">退货 / 退款</h1>
          <span className="text-[11px] text-vscode-textMuted">{filtered.length} 条申请</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 py-2 border-b border-vscode-border shrink-0 text-[11px]">
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">待审核 <span className="ml-2 text-yellow-300 font-semibold">{kpi.pending}</span></div>
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">已批准待退款 <span className="ml-2 text-blue-300 font-semibold">{kpi.approved}</span></div>
        <div className="rounded border border-vscode-border bg-vscode-sidebar px-3 py-2 text-vscode-textMuted">已退款 <span className="ml-2 text-green-300 font-semibold">{kpi.refunded}</span></div>
      </div>

      <div className="flex items-center gap-2 px-5 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[28px] border border-vscode-border flex-1 max-w-[320px]">
          <IconSearch size={12} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索退货单号、订单号、客户..."
            className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | ReturnStatus)} className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none">
          <option value="all">全部状态</option>
          <option value="requested">待审核</option>
          <option value="approved">已批准</option>
          <option value="rejected">已拒绝</option>
          <option value="refunded">已退款</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-vscode-sidebar text-vscode-textMuted">
              <th className="text-left px-4 py-2 font-medium border-b border-vscode-border">退货单</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">订单号</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">类型</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">原因</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">状态</th>
              <th className="text-right px-2 py-2 font-medium border-b border-vscode-border">金额</th>
              <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">负责人</th>
              <th className="text-right px-3 py-2 font-medium border-b border-vscode-border">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const st = statusLabel[c.status];
              return (
                <tr key={c.id} onClick={() => setSelectedId(c.id)} className={`cursor-pointer border-b border-vscode-border ${selectedId === c.id ? 'bg-vscode-accent/8' : 'hover:bg-vscode-hover'}`}>
                  <td className="px-4 py-2.5">
                    <div className="text-vscode-accent font-medium">{c.id}</div>
                    <div className="text-[10px] text-vscode-textMuted">{c.customerName} · {c.requestedAt}</div>
                  </td>
                  <td className="px-2 py-2.5">
                    <button onClick={(e) => { e.stopPropagation(); openOrder(c.orderId); }} className="text-vscode-accent hover:underline">{c.orderId}</button>
                  </td>
                  <td className="px-2 py-2.5 text-vscode-text">{c.type === 'return_and_refund' ? '退货退款' : '仅退款'}</td>
                  <td className="px-2 py-2.5 text-vscode-text">{reasonLabel[c.reason]}</td>
                  <td className="px-2 py-2.5"><span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${st.cls}`}>{st.text}</span></td>
                  <td className="px-2 py-2.5 text-right text-vscode-textBright font-medium">${c.amount.toLocaleString()}</td>
                  <td className="px-2 py-2.5 text-vscode-text">{c.assignedTo || '-'}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {c.status === 'requested' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300" onClick={(e) => { e.stopPropagation(); updateStatus(c.id, 'approved'); }}>
                            <IconSuccess size={12} /> 批准
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={(e) => { e.stopPropagation(); updateStatus(c.id, 'rejected'); }}>
                            <IconError size={12} /> 拒绝
                          </Button>
                        </>
                      )}
                      {c.status === 'approved' && (
                        <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-200" onClick={(e) => { e.stopPropagation(); updateStatus(c.id, 'refunded'); }}>
                          <IconCircleDollar size={12} /> 执行退款
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-vscode-textMuted">没有匹配当前筛选条件的退货/退款申请。</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="px-5 py-2 border-t border-vscode-border bg-vscode-sidebar text-[11px] flex items-center gap-4">
          <div className="inline-flex items-center gap-1 text-vscode-text"><IconClock3 size={12} /> 申请时间: {selected.requestedAt}</div>
          <div className="inline-flex items-center gap-1 text-vscode-textMuted">退款状态: {statusLabel[selected.status].text}</div>
          {selected.status === 'refunded' && (
            <div className="inline-flex items-center gap-1" style={{ color: paymentStatusConfig.refunded.color }}>
              <IconCircleDollar size={12} /> 退款已完成
            </div>
          )}
        </div>
      )}
    </div>
  );
}
