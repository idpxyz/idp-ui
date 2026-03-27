import { useState, useMemo } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import {
  IconSearch,
  IconReceipt,
  IconDollar,
  IconStore,
  IconClock,
  IconCustomer,
  IconHash,
  IconDownload,
  IconRefresh,
  IconCheckCircle,
  IconWarning,
  IconReturn,
  IconFilter,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type POSTransaction,
  type POSTransactionStatus,
  type POSPaymentMethod,
  type SidebarSelection,
  posTransactions as allTransactions,
  posTransactionStatusConfig,
  posPaymentMethodConfig,
} from '../data/oms';

interface POSHistoryProps {
  onSelectObject?: (obj: SidebarSelection | null) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

export default function POSHistory({ onSelectObject }: POSHistoryProps) {
  const { addToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<POSTransactionStatus | 'all'>('all');
  const [payMethodFilter, setPayMethodFilter] = useState<POSPaymentMethod | 'all'>('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stores = useMemo(() => {
    const s = new Set(allTransactions.map(t => t.storeName));
    return ['all', ...Array.from(s)];
  }, []);

  const filtered = useMemo(() => {
    let result = [...allTransactions];
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (payMethodFilter !== 'all') result = result.filter(t => t.paymentMethod === payMethodFilter);
    if (storeFilter !== 'all') result = result.filter(t => t.storeName === storeFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) || t.receiptNo.toLowerCase().includes(q) ||
        t.cashierName.includes(q) || t.memberName.includes(q) ||
        t.items.some(i => i.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [statusFilter, payMethodFilter, storeFilter, searchTerm]);

  const selected = allTransactions.find(t => t.id === selectedId) || null;

  // Stats
  const todayTxns = allTransactions.filter(t => t.createdAt.startsWith('2025-03-17'));
  const todayTotal = todayTxns.reduce((s, t) => s + (t.status === 'completed' ? t.total : 0), 0);
  const todayCount = todayTxns.filter(t => t.status === 'completed').length;
  const todayRefunds = todayTxns.filter(t => t.status === 'refunded').length;
  const avgTicket = todayCount > 0 ? Math.round(todayTotal / todayCount) : 0;

  const handleSelectTransaction = (txn: POSTransaction) => {
    setSelectedId(txn.id);
    onSelectObject?.({ kind: 'pos_transaction', payload: txn });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor min-w-0">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-3">
            <IconReceipt size={16} className="text-idpxyz-accent" />
            <h1 className="text-[14px] font-semibold text-idpxyz-textBright">交易记录</h1>
            <span className="text-[11px] text-idpxyz-textMuted">{allTransactions.length} 笔交易</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'success', title: '导出中', message: `正在导出 ${filtered.length} 笔交易为 CSV...` })}>
              <IconDownload size={12} /> 导出
            </Button>
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '已刷新', message: '交易数据已更新' })}>
              <IconRefresh size={12} /> 刷新
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconDollar size={13} className="text-green-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">今日收入</span><span className="ml-1.5 text-green-400 font-bold">${todayTotal.toLocaleString()}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconReceipt size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">今日笔数</span><span className="ml-1.5 text-idpxyz-accent font-bold">{todayCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconHash size={13} className="text-idpxyz-textMuted" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">客单价</span><span className="ml-1.5 text-idpxyz-textBright font-bold">${avgTicket}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconReturn size={13} className="text-red-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">退款</span><span className="ml-1.5 text-red-400 font-bold">{todayRefunds}</span></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-1.5 border-b border-idpxyz-border shrink-0">
          <IconFilter size={12} className="text-idpxyz-textMuted" />
          <div className="flex items-center gap-1 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-0.5">
            <IconSearch size={11} className="text-idpxyz-textMuted" />
            <input className="bg-transparent text-[11px] text-idpxyz-text outline-none w-[150px] placeholder:text-idpxyz-textMuted" placeholder="搜索单号/收银员/会员..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 text-[11px] text-idpxyz-text outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}>
            <option value="all">全部状态</option>
            <option value="completed">已完成</option>
            <option value="refunded">已退款</option>
            <option value="voided">已作废</option>
            <option value="pending">待支付</option>
          </select>
          <select className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 text-[11px] text-idpxyz-text outline-none" value={payMethodFilter} onChange={e => setPayMethodFilter(e.target.value as typeof payMethodFilter)}>
            <option value="all">全部支付方式</option>
            {(Object.entries(posPaymentMethodConfig) as [POSPaymentMethod, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 text-[11px] text-idpxyz-text outline-none" value={storeFilter} onChange={e => setStoreFilter(e.target.value)}>
            {stores.map(s => <option key={s} value={s}>{s === 'all' ? '全部门店' : s}</option>)}
          </select>
          <span className="text-[10px] text-idpxyz-textMuted ml-auto">{filtered.length} 条记录</span>
        </div>

        {/* Transaction table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted sticky top-0 z-10">
                <th className="text-left px-4 py-2 font-medium">交易单号</th>
                <th className="text-left px-3 py-2 font-medium">时间</th>
                <th className="text-left px-3 py-2 font-medium">门店</th>
                <th className="text-left px-3 py-2 font-medium">收银员</th>
                <th className="text-left px-3 py-2 font-medium">商品</th>
                <th className="text-right px-3 py-2 font-medium">金额</th>
                <th className="text-left px-3 py-2 font-medium">支付方式</th>
                <th className="text-left px-3 py-2 font-medium">会员</th>
                <th className="text-left px-3 py-2 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(txn => {
                const ss = posTransactionStatusConfig[txn.status];
                const pm = posPaymentMethodConfig[txn.paymentMethod];
                return (
                  <tr
                    key={txn.id}
                    className={`border-b border-idpxyz-border hover:bg-idpxyz-hover/50 cursor-pointer transition-colors ${selectedId === txn.id ? 'bg-idpxyz-accent/5' : ''}`}
                    onClick={() => handleSelectTransaction(txn)}
                  >
                    <td className="px-4 py-2">
                      <div className="text-idpxyz-accent font-mono font-medium">{txn.id}</div>
                      <div className="text-[9px] text-idpxyz-textMuted font-mono">{txn.receiptNo}</div>
                    </td>
                    <td className="px-3 py-2 text-idpxyz-text">{txn.createdAt}</td>
                    <td className="px-3 py-2 text-idpxyz-textMuted">{txn.storeName.slice(-5)}</td>
                    <td className="px-3 py-2 text-idpxyz-text">{txn.cashierName}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-0.5">
                        {txn.items.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-[13px]">{item.image}</span>
                        ))}
                        {txn.items.length > 3 && <span className="text-[10px] text-idpxyz-textMuted">+{txn.items.length - 3}</span>}
                      </div>
                      <div className="text-[10px] text-idpxyz-textMuted truncate max-w-[160px]">
                        {txn.items.map(i => i.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-medium ${txn.status === 'refunded' ? 'text-red-400 line-through' : 'text-idpxyz-textBright'}`}>
                        ${txn.total.toFixed(2)}
                      </span>
                      {txn.discount > 0 && (
                        <div className="text-[9px] text-green-400">-${txn.discount.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-3 py-2"><StatusBadge {...pm} /></td>
                    <td className="px-3 py-2">
                      {txn.memberName ? (
                        <div className="flex items-center gap-1">
                          <IconCustomer size={10} className="text-idpxyz-accent" />
                          <span className="text-idpxyz-text">{txn.memberName}</span>
                        </div>
                      ) : (
                        <span className="text-idpxyz-textMuted">散客</span>
                      )}
                    </td>
                    <td className="px-3 py-2"><StatusBadge {...ss} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-idpxyz-textMuted">没有匹配的交易记录</div>
          )}
        </div>
      </div>

      {/* Right: Transaction detail panel */}
      {selected && (
        <div className="w-[300px] flex flex-col overflow-hidden bg-idpxyz-sidebar border-l border-idpxyz-border shrink-0">
          <div className="px-4 py-3 border-b border-idpxyz-border">
            <div className="flex items-center gap-2 mb-1">
              <IconReceipt size={14} className="text-idpxyz-accent" />
              <span className="text-[12px] font-semibold text-idpxyz-textBright">交易详情</span>
              <StatusBadge {...posTransactionStatusConfig[selected.status]} />
            </div>
            <div className="text-[10px] text-idpxyz-textMuted font-mono">{selected.id}</div>
          </div>

          <div className="flex-1 overflow-auto">
            {/* Receipt-style detail */}
            <div className="mx-3 my-3 bg-idpxyz-editor border border-idpxyz-border rounded-lg p-3 space-y-1.5 text-[11px]">
              <div className="text-center font-bold text-[12px] text-idpxyz-textBright mb-2 pb-2 border-b border-dashed border-idpxyz-border">
                {selected.storeName}
              </div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">单号</span><span className="text-idpxyz-text font-mono text-[10px]">{selected.receiptNo}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">时间</span><span className="text-idpxyz-text">{selected.createdAt}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">收银员</span><span className="text-idpxyz-text">{selected.cashierName}</span></div>
              {selected.memberName && (
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">会员</span><span className="text-idpxyz-accent">{selected.memberName}</span></div>
              )}

              <div className="border-t border-dashed border-idpxyz-border pt-1.5 mt-1.5 space-y-1">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[14px]">{item.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-idpxyz-textBright truncate">{item.name}</div>
                      <div className="text-[10px] text-idpxyz-textMuted">{item.skuName}</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span>${item.price} x {item.qty}</span>
                        {item.discount > 0 && <span className="text-green-400">-${item.discount}</span>}
                      </div>
                    </div>
                    <span className="text-idpxyz-textBright font-medium">${(item.price * item.qty - item.discount * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-idpxyz-border pt-1.5 mt-1.5 space-y-0.5">
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">小计</span><span>${selected.subtotal.toFixed(2)}</span></div>
                {selected.discount > 0 && <div className="flex justify-between"><span className="text-idpxyz-textMuted">优惠</span><span className="text-green-400">-${selected.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">税费</span><span>${selected.tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-[12px] pt-1"><span className="text-idpxyz-textBright">合计</span><span className="text-idpxyz-accent">${selected.total.toFixed(2)}</span></div>
              </div>

              <div className="border-t border-dashed border-idpxyz-border pt-1.5 mt-1.5 space-y-0.5">
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">支付方式</span><StatusBadge {...posPaymentMethodConfig[selected.paymentMethod]} /></div>
                {selected.paymentRef && <div className="flex justify-between"><span className="text-idpxyz-textMuted">流水号</span><span className="text-[10px] font-mono text-idpxyz-text">{selected.paymentRef}</span></div>}
                {selected.paymentMethod === 'cash' && (
                  <>
                    <div className="flex justify-between"><span className="text-idpxyz-textMuted">收取</span><span>${selected.cashReceived.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-idpxyz-textMuted">找零</span><span className="text-yellow-400">${selected.changeGiven.toFixed(2)}</span></div>
                  </>
                )}
                {selected.pointsEarned > 0 && (
                  <div className="flex justify-between"><span className="text-idpxyz-textMuted">获得积分</span><span className="text-yellow-400">+{selected.pointsEarned}</span></div>
                )}
              </div>

              {selected.note && (
                <div className="border-t border-dashed border-idpxyz-border pt-1.5 mt-1.5">
                  <span className="text-idpxyz-textMuted">备注: </span><span className="text-idpxyz-text">{selected.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-3 py-2 border-t border-idpxyz-border shrink-0 flex gap-1.5">
            <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => addToast({ type: 'success', title: '打印中', message: '正在打印交易小票...' })}>
              <IconReceipt size={11} /> 重打小票
            </Button>
            {selected.status === 'completed' && (
              <Button variant="ghost" size="sm" className="flex-1 justify-center text-red-400" onClick={() => addToast({ type: 'warning', title: '退款发起', message: `交易 ${selected.id} 退款流程已发起` })}>
                <IconReturn size={11} /> 退款
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
