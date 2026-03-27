import { useEffect, useState, useMemo } from 'react';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconMoreH,
  IconAutomation,
  IconTag,
  IconTrending,
  IconChart,
  IconEdit,
  IconPause,
  IconPlay,
  IconCopy,
  IconTrash,
  IconCalculator,
  IconArchive,
  IconChevronRight,
  IconArrowUpDown,
  IconFilter,
  IconClock,
  IconDollar,
  IconOrder,
  IconAlertCircle,
  IconCalendar,
  IconTarget,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Promotion,
  type PromotionType,
  type PromotionStatus,
  type SidebarSelection,
  promotions as allPromotions,
  promotionTypeConfig,
  promotionStatusConfig,
} from '../data/oms';

interface PromotionManagementProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
  onSelectObject?: (obj: SidebarSelection | null) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-idpxyz-border overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function PromotionManagement({ onOpenTab, onSelectObject }: PromotionManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'startAt' | 'revenue' | 'usedCount'>('startAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(allPromotions[0]?.id || null);

  const filtered = useMemo(() => {
    let list = [...allPromotions];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter);
    if (typeFilter !== 'all') list = list.filter(p => p.type === typeFilter);
    list.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [searchTerm, statusFilter, typeFilter, sortField, sortDir]);

  const selected = allPromotions.find(p => p.id === selectedId) || null;

  useEffect(() => {
    onSelectObject?.(selected ? { kind: 'promotion', payload: selected } : null);
  }, [selected, onSelectObject]);

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('desc'); }
  };

  // Summary stats
  const activeCount = allPromotions.filter(p => p.status === 'active').length;
  const scheduledCount = allPromotions.filter(p => p.status === 'scheduled').length;
  const totalRevenue = allPromotions.filter(p => p.status === 'active' || p.status === 'ended').reduce((s, p) => s + p.revenue, 0);
  const totalSpent = allPromotions.filter(p => p.status === 'active' || p.status === 'ended').reduce((s, p) => s + p.spent, 0);

  const quickViews: { label: string; filter: string; count: number }[] = [
    { label: '全部', filter: 'all', count: allPromotions.length },
    { label: '进行中', filter: 'active', count: allPromotions.filter(p => p.status === 'active').length },
    { label: '待开始', filter: 'scheduled', count: allPromotions.filter(p => p.status === 'scheduled').length },
    { label: '已暂停', filter: 'paused', count: allPromotions.filter(p => p.status === 'paused').length },
    { label: '已结束', filter: 'ended', count: allPromotions.filter(p => p.status === 'ended').length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-3">
          <IconAutomation size={16} className="text-idpxyz-accent" />
          <h1 className="text-[14px] font-semibold text-idpxyz-textBright">促销管理</h1>
          <span className="text-[11px] text-idpxyz-textMuted">{activeCount} 进行中 · {scheduledCount} 待开始</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end min-w-0">
          {selected && (
            <>
              <span className="text-[10px] text-idpxyz-textMuted mr-1 border-r border-idpxyz-border pr-2">{selected.name}</span>
              <Button variant="ghost" size="sm"><IconEdit size={12} /> 编辑</Button>
              {selected.status === 'active' && <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300"><IconPause size={12} /> 暂停</Button>}
              {selected.status === 'paused' && <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300"><IconPlay size={12} /> 恢复</Button>}
              <Button variant="ghost" size="sm"><IconCopy size={12} /> 复制</Button>
              {(selected.status === 'ended' || selected.status === 'draft') && <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><IconTrash size={12} /> 删除</Button>}
              <div className="w-px h-4 bg-idpxyz-border mx-1" />
            </>
          )}
          <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenTab?.('promo-simulator', '促销模拟器')}><IconCalculator size={13} /> 模拟器</Button>
          <Button variant="default" size="sm" onClick={() => onOpenTab?.('promotion-create', '创建促销活动')}><IconPlus size={13} /> 创建活动</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main IconList */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Summary Cards */}
          <div className="flex gap-3 px-5 py-3 border-b border-idpxyz-border shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconAutomation size={13} className="text-idpxyz-accent" />
              <div className="text-[11px]">
                <span className="text-idpxyz-textMuted">活动总数</span>
                <span className="ml-1.5 text-idpxyz-textBright font-medium">{allPromotions.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconTrending size={13} className="text-green-400" />
              <div className="text-[11px]">
                <span className="text-idpxyz-textMuted">活动收入</span>
                <span className="ml-1.5 text-idpxyz-textBright font-medium">${(totalRevenue / 1000).toFixed(0)}K</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconDollar size={13} className="text-yellow-400" />
              <div className="text-[11px]">
                <span className="text-idpxyz-textMuted">已消耗预算</span>
                <span className="ml-1.5 text-idpxyz-textBright font-medium">${(totalSpent / 1000).toFixed(0)}K</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconOrder size={13} className="text-blue-400" />
              <div className="text-[11px]">
                <span className="text-idpxyz-textMuted">促销订单</span>
                <span className="ml-1.5 text-idpxyz-textBright font-medium">{allPromotions.filter(p => p.status === 'active').reduce((s, p) => s + p.orderCount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Views */}
          <div className="flex items-center gap-1 px-5 py-2 border-b border-idpxyz-border shrink-0">
            {quickViews.map(qv => (
              <button key={qv.filter} onClick={() => setStatusFilter(qv.filter)}
                className={`px-2.5 py-1 rounded text-[10px] transition-colors ${statusFilter === qv.filter ? 'bg-idpxyz-accent/15 text-idpxyz-accent font-medium' : 'text-idpxyz-textMuted hover:bg-idpxyz-hover'}`}>
                {qv.label} <span className="ml-0.5 opacity-70">{qv.count}</span>
              </button>
            ))}
            <div className="flex-1" />
            <div className="flex items-center gap-1.5">
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-0.5 text-[10px] text-idpxyz-text outline-none">
                <option value="all">全部类型</option>
                {(Object.entries(promotionTypeConfig) as [PromotionType, { label: string }][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* IconSearch */}
          <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border shrink-0">
            <div className="flex items-center bg-idpxyz-inputBg rounded px-2 h-[26px] border border-idpxyz-border flex-1 max-w-[300px]">
              <IconSearch size={11} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="搜索活动名称、ID..."
                className="bg-transparent border-none outline-none text-[11px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted" />
            </div>
            <span className="text-[10px] text-idpxyz-textMuted">{filtered.length} 条结果</span>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted">
                  <th className="text-left px-5 py-2 font-medium border-b border-idpxyz-border">活动信息</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">类型</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">状态</th>
                  <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('startAt')}>
                    <span className="flex items-center gap-1">时间 <IconArrowUpDown size={9} /></span>
                  </th>
                  <th className="text-right px-2 py-2 font-medium border-b border-idpxyz-border cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('usedCount')}>
                    <span className="flex items-center gap-1 justify-end">使用次数 <IconArrowUpDown size={9} /></span>
                  </th>
                  <th className="text-right px-2 py-2 font-medium border-b border-idpxyz-border cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('revenue')}>
                    <span className="flex items-center gap-1 justify-end">收入 <IconArrowUpDown size={9} /></span>
                  </th>
                  <th className="text-right px-2 py-2 font-medium border-b border-idpxyz-border">预算</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(promo => {
                  const ts = promotionTypeConfig[promo.type];
                  const ss = promotionStatusConfig[promo.status];
                  const isSel = selectedId === promo.id;
                  return (
                    <tr key={promo.id}
                      onClick={() => setSelectedId(promo.id)}
                      className={`cursor-pointer transition-colors border-b border-idpxyz-border ${isSel ? 'bg-idpxyz-accent/8' : 'hover:bg-idpxyz-hover'}`}>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">
                          {isSel && <IconChevronRight size={10} className="text-idpxyz-accent shrink-0" />}
                          <div>
                            <div className="text-idpxyz-textBright font-medium">{promo.name}</div>
                            <div className="text-[10px] text-idpxyz-textMuted mt-0.5">{promo.id} · {promo.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2.5"><StatusBadge {...ts} /></td>
                      <td className="px-2 py-2.5"><StatusBadge {...ss} /></td>
                      <td className="px-2 py-2.5 text-idpxyz-textMuted whitespace-nowrap">
                        <div className="text-[10px]">{promo.startAt.split(' ')[0]}</div>
                        <div className="text-[9px] text-idpxyz-textMuted/70">至 {promo.endAt.split(' ')[0]}</div>
                      </td>
                      <td className="px-2 py-2.5 text-right text-idpxyz-text">{promo.usedCount.toLocaleString()}</td>
                      <td className="px-2 py-2.5 text-right text-idpxyz-textBright font-medium">${promo.revenue.toLocaleString()}</td>
                      <td className="px-2 py-2.5 text-right">
                        <div className="text-[10px] text-idpxyz-textMuted">${promo.spent.toLocaleString()} / ${promo.budget.toLocaleString()}</div>
                        <div className="mt-0.5 w-[60px] ml-auto">
                          <ProgressBar value={promo.spent} max={promo.budget} color={promo.spent / promo.budget > 0.9 ? '#f44747' : promo.spent / promo.budget > 0.7 ? '#dcdcaa' : '#6a9955'} />
                        </div>
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
