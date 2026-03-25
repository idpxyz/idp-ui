import { useEffect, useState, useMemo } from 'react';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconMoreH,
  IconTicket,
  IconTrending,
  IconEdit,
  IconPause,
  IconPlay,
  IconCopy,
  IconTrash,
  IconChevronRight,
  IconArrowUpDown,
  IconDollar,
  IconOrder,
  IconClock,
  IconUsers,
  IconCheck,
  IconAlertCircle,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Coupon,
  type CouponType,
  type CouponStatus,
  type SidebarSelection,
  coupons as allCoupons,
  couponTypeConfig,
  couponStatusConfig,
} from '../data/oms';

interface CouponManagementProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
  onSelectObject?: (obj: SidebarSelection | null) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-vscode-border overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function CouponManagement({ onOpenTab, onSelectObject }: CouponManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'usedQty' | 'revenue'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(allCoupons[0]?.id || null);

  const filtered = useMemo(() => {
    let list = [...allCoupons];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter);
    if (typeFilter !== 'all') list = list.filter(c => c.type === typeFilter);
    list.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [searchTerm, statusFilter, typeFilter, sortField, sortDir]);

  const selected = allCoupons.find(c => c.id === selectedId) || null;

  useEffect(() => {
    onSelectObject?.(selected ? { kind: 'coupon', payload: selected } : null);
  }, [selected, onSelectObject]);

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('desc'); }
  };

  // Summary
  const activeCount = allCoupons.filter(c => c.status === 'active').length;
  const totalIssued = allCoupons.reduce((s, c) => s + c.issuedQty, 0);
  const totalUsed = allCoupons.reduce((s, c) => s + c.usedQty, 0);
  const totalRevenue = allCoupons.reduce((s, c) => s + c.revenue, 0);

  const quickViews: { label: string; filter: string; count: number }[] = [
    { label: '全部', filter: 'all', count: allCoupons.length },
    { label: '发放中', filter: 'active', count: allCoupons.filter(c => c.status === 'active').length },
    { label: '已暂停', filter: 'paused', count: allCoupons.filter(c => c.status === 'paused').length },
    { label: '已领完', filter: 'depleted', count: allCoupons.filter(c => c.status === 'depleted').length },
    { label: '已过期', filter: 'expired', count: allCoupons.filter(c => c.status === 'expired').length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          <IconTicket size={16} className="text-vscode-accent" />
          <h1 className="text-[14px] font-semibold text-vscode-textBright">优惠券管理</h1>
          <span className="text-[11px] text-vscode-textMuted">{activeCount} 发放中 · {totalIssued.toLocaleString()} 已发放</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end min-w-0">
          {selected && (
            <>
              <span className="text-[10px] text-vscode-textMuted mr-1 border-r border-vscode-border pr-2">{selected.code}</span>
              <Button variant="ghost" size="sm"><IconEdit size={12} /> 编辑</Button>
              {selected.status === 'active' && <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300"><IconPause size={12} /> 暂停</Button>}
              {selected.status === 'paused' && <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300"><IconPlay size={12} /> 恢复</Button>}
              <Button variant="ghost" size="sm"><IconCopy size={12} /> 复制</Button>
              {(selected.status === 'expired' || selected.status === 'draft') && <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><IconTrash size={12} /> 删除</Button>}
              <div className="w-px h-4 bg-vscode-border mx-1" />
            </>
          )}
          <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
          <Button variant="default" size="sm" onClick={() => onOpenTab?.('coupon-create', '创建优惠券')}><IconPlus size={13} /> 创建优惠券</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main IconList */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Summary Cards */}
          <div className="flex gap-3 px-5 py-3 border-b border-vscode-border shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
              <IconTicket size={13} className="text-vscode-accent" />
              <div className="text-[11px]">
                <span className="text-vscode-textMuted">券种</span>
                <span className="ml-1.5 text-vscode-textBright font-medium">{allCoupons.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
              <IconUsers size={13} className="text-blue-400" />
              <div className="text-[11px]">
                <span className="text-vscode-textMuted">已发放</span>
                <span className="ml-1.5 text-vscode-textBright font-medium">{totalIssued.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
              <IconCheck size={13} className="text-green-400" />
              <div className="text-[11px]">
                <span className="text-vscode-textMuted">已使用</span>
                <span className="ml-1.5 text-vscode-textBright font-medium">{totalUsed.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
              <IconTrending size={13} className="text-green-400" />
              <div className="text-[11px]">
                <span className="text-vscode-textMuted">带动收入</span>
                <span className="ml-1.5 text-vscode-textBright font-medium">${(totalRevenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </div>

          {/* Quick Views */}
          <div className="flex items-center gap-1 px-5 py-2 border-b border-vscode-border shrink-0">
            {quickViews.map(qv => (
              <button key={qv.filter} onClick={() => setStatusFilter(qv.filter)}
                className={`px-2.5 py-1 rounded text-[10px] transition-colors ${statusFilter === qv.filter ? 'bg-vscode-accent/15 text-vscode-accent font-medium' : 'text-vscode-textMuted hover:bg-vscode-hover'}`}>
                {qv.label} <span className="ml-0.5 opacity-70">{qv.count}</span>
              </button>
            ))}
            <div className="flex-1" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[10px] text-vscode-text outline-none">
              <option value="all">全部类型</option>
              {(Object.entries(couponTypeConfig) as [CouponType, { label: string }][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* IconSearch */}
          <div className="flex items-center gap-2 px-5 py-2 border-b border-vscode-border shrink-0">
            <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[26px] border border-vscode-border flex-1 max-w-[300px]">
              <IconSearch size={11} className="text-vscode-textMuted mr-1.5 shrink-0" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索券名称、券码、ID..."
                className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted" />
            </div>
            <span className="text-[10px] text-vscode-textMuted">{filtered.length} 条结果</span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-vscode-sidebar text-vscode-textMuted">
                  <th className="text-left px-5 py-2 font-medium border-b border-vscode-border">优惠券信息</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">类型</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">状态</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">优惠</th>
                  <th className="text-right px-2 py-2 font-medium border-b border-vscode-border">发放/领取</th>
                  <th className="text-right px-2 py-2 font-medium border-b border-vscode-border cursor-pointer hover:text-vscode-text" onClick={() => toggleSort('usedQty')}>
                    <span className="flex items-center gap-1 justify-end">已使用 <IconArrowUpDown size={9} /></span>
                  </th>
                  <th className="text-right px-2 py-2 font-medium border-b border-vscode-border cursor-pointer hover:text-vscode-text" onClick={() => toggleSort('revenue')}>
                    <span className="flex items-center gap-1 justify-end">带动收入 <IconArrowUpDown size={9} /></span>
                  </th>
                  <th className="text-left px-2 py-2 font-medium border-b border-vscode-border">有效期</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cpn => {
                  const ts = couponTypeConfig[cpn.type];
                  const ss = couponStatusConfig[cpn.status];
                  const isSel = selectedId === cpn.id;
                  const useRate = cpn.issuedQty > 0 ? (cpn.usedQty / cpn.issuedQty * 100) : 0;
                  return (
                    <tr key={cpn.id}
                      onClick={() => setSelectedId(cpn.id)}
                      className={`cursor-pointer transition-colors border-b border-vscode-border ${isSel ? 'bg-vscode-accent/8' : 'hover:bg-vscode-hover'}`}>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          {isSel && <IconChevronRight size={10} className="text-vscode-accent shrink-0" />}
                          <div>
                            <div className="text-vscode-textBright font-medium">{cpn.name}</div>
                            <div className="text-[10px] text-vscode-textMuted mt-0.5 font-mono">{cpn.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2.5"><StatusBadge {...ts} /></td>
                      <td className="px-2 py-2.5"><StatusBadge {...ss} /></td>
                      <td className="px-2 py-2.5 text-vscode-text whitespace-nowrap">
                        {cpn.type === 'percentage' ? `${cpn.discountValue}% OFF` : cpn.type === 'fixed' ? `-$${cpn.discountValue}` : '免运费'}
                        {cpn.minOrderAmount > 0 && <div className="text-[9px] text-vscode-textMuted">满 ${cpn.minOrderAmount}</div>}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <span className="text-vscode-text">{cpn.issuedQty.toLocaleString()}</span>
                        {cpn.totalQty > 0 && <span className="text-vscode-textMuted">/{cpn.totalQty.toLocaleString()}</span>}
                      </td>
                      <td className="px-2 py-2.5 text-right">
                        <span className="text-vscode-textBright font-medium">{cpn.usedQty.toLocaleString()}</span>
                        <div className="text-[9px] text-vscode-textMuted">{useRate.toFixed(0)}% 核销</div>
                      </td>
                      <td className="px-2 py-2.5 text-right text-vscode-textBright font-medium">${cpn.revenue.toLocaleString()}</td>
                      <td className="px-2 py-2.5 text-vscode-textMuted whitespace-nowrap text-[10px]">
                        {cpn.startAt} ~ {cpn.endAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
