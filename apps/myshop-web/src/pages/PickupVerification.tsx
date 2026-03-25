import { useState, useMemo } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import {
  IconSearch,
  IconScan,
  IconHash,
  IconCheckCircle,
  IconClock,
  IconCustomer,
  IconPackage,
  IconDollar,
  IconStore,
  IconReceipt,
  IconWarning,
  IconShoppingBag,
  IconArrowLeft,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type PickupOrder,
  type PickupStatus,
  pickupOrders as allPickupOrders,
  pickupStatusConfig,
} from '../data/oms';

interface PickupVerificationProps {
  onOpenTab?: (tabId: string, tabName: string, subtitle?: string) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

export default function PickupVerification({ onOpenTab }: PickupVerificationProps) {
  const { addToast } = useToast();

  const [codeInput, setCodeInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<PickupStatus | 'all'>('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const stores = useMemo(() => {
    const s = new Set(allPickupOrders.map(p => p.storeName));
    return ['all', ...Array.from(s)];
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...allPickupOrders];
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (storeFilter !== 'all') result = result.filter(p => p.storeName === storeFilter);
    return result;
  }, [statusFilter, storeFilter]);

  const selected = allPickupOrders.find(p => p.id === selectedId) || null;

  // Stats
  const pendingCount = allPickupOrders.filter(p => p.status === 'pending_pickup').length;
  const pickedUpCount = allPickupOrders.filter(p => p.status === 'picked_up').length;
  const expiredCount = allPickupOrders.filter(p => p.status === 'expired').length;
  const totalAmount = allPickupOrders.filter(p => p.status === 'pending_pickup').reduce((s, p) => s + p.totalAmount, 0);

  // Code lookup
  const handleCodeLookup = () => {
    const code = codeInput.trim();
    if (!code) return;
    const found = allPickupOrders.find(p => p.pickupCode === code || p.onlineOrderId === code || p.id === code);
    if (!found) {
      addToast({ type: 'error', title: '未找到', message: `取货码 ${code} 无匹配记录` });
      return;
    }
    setSelectedId(found.id);
    if (found.status === 'pending_pickup') {
      setVerifyingId(found.id);
      addToast({ type: 'info', title: '已匹配', message: `${found.customerName} 的取货单，请核实后确认` });
    } else {
      addToast({ type: 'warning', title: '状态异常', message: `该取货单状态为「${pickupStatusConfig[found.status].label}」` });
    }
    setCodeInput('');
  };

  // Confirm pickup
  const handleConfirmPickup = (order: PickupOrder) => {
    addToast({ type: 'success', title: '核销成功', message: `${order.customerName} 的取货单 ${order.pickupCode} 已核销完成` });
    setVerifyingId(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-vscode-editor min-w-0">
      {/* Left: Order list */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => onOpenTab?.('pos-terminal', 'POS 收银')}>
              <IconArrowLeft size={14} />
            </Button>
            <IconReceipt size={16} className="text-vscode-accent" />
            <h1 className="text-[14px] font-semibold text-vscode-textBright">O2O 到店核销</h1>
            <span className="text-[11px] text-vscode-textMuted">{pendingCount} 单待核销</span>
          </div>
          <div className="flex items-center gap-2">
            <IconStore size={12} className="text-vscode-textMuted" />
            <span className="text-[11px] text-vscode-textMuted">上海南京路旗舰店</span>
          </div>
        </div>

        {/* Code input bar */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-vscode-border shrink-0 bg-vscode-sidebar">
          <div className="flex items-center gap-1.5 flex-1 bg-vscode-inputBg border-2 border-vscode-accent rounded-lg px-3 py-2">
            <IconScan size={16} className="text-vscode-accent" />
            <input
              className="flex-1 bg-transparent text-[14px] text-vscode-text outline-none placeholder:text-vscode-textMuted"
              placeholder="扫码 / 输入取货码 / 订单号..."
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCodeLookup(); }}
              autoFocus
            />
            <Button variant="default" size="sm" onClick={handleCodeLookup}>核验</Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-vscode-border shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
            <IconClock size={13} className="text-yellow-400" />
            <div className="text-[11px]"><span className="text-vscode-textMuted">待核销</span><span className="ml-1.5 text-yellow-400 font-bold">{pendingCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
            <IconCheckCircle size={13} className="text-green-400" />
            <div className="text-[11px]"><span className="text-vscode-textMuted">已核销</span><span className="ml-1.5 text-green-400 font-bold">{pickedUpCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
            <IconWarning size={13} className="text-red-400" />
            <div className="text-[11px]"><span className="text-vscode-textMuted">已过期</span><span className="ml-1.5 text-red-400 font-bold">{expiredCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
            <IconDollar size={13} className="text-vscode-accent" />
            <div className="text-[11px]"><span className="text-vscode-textMuted">待取金额</span><span className="ml-1.5 text-vscode-accent font-bold">${totalAmount.toLocaleString()}</span></div>
          </div>
          <div className="flex-1" />
          <select className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}>
            <option value="all">全部状态</option>
            <option value="pending_pickup">待取货</option>
            <option value="picked_up">已取货</option>
            <option value="expired">已过期</option>
            <option value="cancelled">已取消</option>
          </select>
          <select className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none" value={storeFilter} onChange={e => setStoreFilter(e.target.value)}>
            {stores.map(s => <option key={s} value={s}>{s === 'all' ? '全部门店' : s}</option>)}
          </select>
        </div>

        {/* Order list table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-vscode-sidebar text-vscode-textMuted sticky top-0 z-10">
                <th className="text-left px-4 py-2 font-medium">取货码</th>
                <th className="text-left px-3 py-2 font-medium">客户</th>
                <th className="text-left px-3 py-2 font-medium">商品</th>
                <th className="text-right px-3 py-2 font-medium">金额</th>
                <th className="text-left px-3 py-2 font-medium">门店</th>
                <th className="text-left px-3 py-2 font-medium">状态</th>
                <th className="text-left px-3 py-2 font-medium">支付时间</th>
                <th className="text-left px-3 py-2 font-medium">过期时间</th>
                <th className="text-center px-3 py-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const ss = pickupStatusConfig[order.status];
                const isVerifying = verifyingId === order.id;
                return (
                  <tr
                    key={order.id}
                    className={`border-b border-vscode-border hover:bg-vscode-hover/50 cursor-pointer transition-colors ${selectedId === order.id ? 'bg-vscode-accent/5' : ''} ${isVerifying ? 'ring-2 ring-vscode-accent ring-inset' : ''}`}
                    onClick={() => setSelectedId(order.id)}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-bold text-vscode-accent font-mono tracking-wider">{order.pickupCode}</span>
                      </div>
                      <div className="text-[9px] text-vscode-textMuted font-mono">{order.onlineOrderId}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-vscode-textBright font-medium">{order.customerName}</div>
                      <div className="text-[10px] text-vscode-textMuted">{order.customerPhone}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {order.items.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-[14px]">{item.image}</span>
                        ))}
                        {order.items.length > 3 && <span className="text-[10px] text-vscode-textMuted">+{order.items.length - 3}</span>}
                      </div>
                      <div className="text-[10px] text-vscode-textMuted truncate max-w-[140px]">
                        {order.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className="text-vscode-textBright font-medium">${order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-2 text-vscode-textMuted">{order.storeName.replace(/.*?(?=店)/, '').slice(-4) || order.storeName}</td>
                    <td className="px-3 py-2"><StatusBadge {...ss} /></td>
                    <td className="px-3 py-2 text-vscode-textMuted">{order.paidAt}</td>
                    <td className="px-3 py-2 text-vscode-textMuted">{order.expiresAt}</td>
                    <td className="px-3 py-2 text-center">
                      {order.status === 'pending_pickup' && (
                        <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); handleConfirmPickup(order); }}>
                          <IconCheckCircle size={11} /> 核销
                        </Button>
                      )}
                      {order.status === 'picked_up' && (
                        <span className="text-[10px] text-green-400">已取 {order.pickedUpAt.split(' ')[0]}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-vscode-textMuted">没有匹配的取货单</div>
          )}
        </div>
      </div>

      {/* Right: Detail panel */}
      {selected && (
        <div className="w-[300px] flex flex-col overflow-hidden bg-vscode-sidebar border-l border-vscode-border shrink-0">
          <div className="px-4 py-3 border-b border-vscode-border">
            <div className="flex items-center gap-2 mb-1">
              <IconReceipt size={14} className="text-vscode-accent" />
              <span className="text-[12px] font-semibold text-vscode-textBright">取货单详情</span>
            </div>
            <div className="flex items-center justify-center my-3">
              <div className="bg-vscode-editor border-2 border-dashed border-vscode-accent rounded-xl px-6 py-3 text-center">
                <div className="text-[10px] text-vscode-textMuted mb-1">取货码</div>
                <div className="text-[32px] font-bold text-vscode-accent font-mono tracking-[0.3em]">{selected.pickupCode}</div>
              </div>
            </div>
            <StatusBadge {...pickupStatusConfig[selected.status]} />
          </div>

          <div className="flex-1 overflow-auto">
            <div className="px-4 py-2.5 space-y-2 text-[11px] border-b border-vscode-border">
              <div className="text-[10px] uppercase text-vscode-textMuted font-bold tracking-wide mb-1">客户信息</div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">姓名</span><span className="text-vscode-textBright">{selected.customerName}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">电话</span><span className="text-vscode-text">{selected.customerPhone}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">线上订单</span><span className="text-vscode-accent font-mono">{selected.onlineOrderId}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">支付方式</span><span className="text-vscode-text">{selected.onlinePayMethod}</span></div>
            </div>

            <div className="px-4 py-2.5 space-y-1.5 border-b border-vscode-border">
              <div className="text-[10px] uppercase text-vscode-textMuted font-bold tracking-wide mb-1">商品明细</div>
              {selected.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="text-[18px]">{item.image}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-vscode-textBright truncate">{item.name}</div>
                    <div className="text-[10px] text-vscode-textMuted">{item.skuName} x{item.qty}</div>
                  </div>
                  <span className="text-[11px] text-vscode-textBright font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1.5 border-t border-vscode-border text-[12px] font-bold">
                <span className="text-vscode-textBright">合计</span>
                <span className="text-vscode-accent">${selected.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="px-4 py-2.5 space-y-2 text-[11px] border-b border-vscode-border">
              <div className="text-[10px] uppercase text-vscode-textMuted font-bold tracking-wide mb-1">时间信息</div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">支付时间</span><span className="text-vscode-text">{selected.paidAt}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">过期时间</span><span className="text-vscode-text">{selected.expiresAt}</span></div>
              {selected.pickedUpAt && <div className="flex justify-between"><span className="text-vscode-textMuted">取货时间</span><span className="text-green-400">{selected.pickedUpAt}</span></div>}
              {selected.pickedUpBy && <div className="flex justify-between"><span className="text-vscode-textMuted">核销人</span><span className="text-vscode-text">{selected.pickedUpBy}</span></div>}
            </div>

            {selected.note && (
              <div className="px-4 py-2.5 text-[11px] border-b border-vscode-border">
                <div className="text-[10px] uppercase text-vscode-textMuted font-bold tracking-wide mb-1">备注</div>
                <p className="text-vscode-text leading-relaxed">{selected.note}</p>
              </div>
            )}
          </div>

          {selected.status === 'pending_pickup' && (
            <div className="px-4 py-3 border-t border-vscode-border shrink-0">
              <Button variant="default" size="sm" className="w-full justify-center text-[12px] font-semibold py-2" onClick={() => handleConfirmPickup(selected)}>
                <IconCheckCircle size={14} /> 确认核销
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
