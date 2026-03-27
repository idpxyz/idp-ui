import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { ActionModal, ModalTextarea, ModalSelect, ModalInput } from '../components/ActionModal';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconUpload,
  IconMoreH,
  IconCustomer,
  IconMail,
  IconTag,
  IconStar,
  IconTrending,
  IconChart,
  IconEdit,
  IconEye,
  IconShield,
  IconWarning,
  IconArrowUpDown,
  IconFilter,
  IconLocation,
  IconClock,
  IconDollar,
  IconHash,
  IconChevronRight,
  IconBell,
  IconReturn,
  IconTicket,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Customer,
  type CustomerStatus,
  type CustomerTier,
  type RFMSegment,
  type SidebarSelection,
  customers as allCustomers,
  customerStatusConfig,
  customerTierConfig,
  rfmSegmentConfig,
} from '../data/oms';

interface CustomerManagementProps {
  onOpenTab?: (tabId: string, tabName: string, subtitle?: string) => void;
  onSelectObject?: (obj: SidebarSelection | null) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function RFMBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-[6px] h-[10px] rounded-[1px] ${
            i < value
              ? value >= 4 ? 'bg-green-400' : value >= 3 ? 'bg-yellow-400' : value >= 2 ? 'bg-orange-400' : 'bg-red-400'
              : 'bg-idpxyz-border'
          }`}
        />
      ))}
    </div>
  );
}

export default function CustomerManagement({ onOpenTab, onSelectObject }: CustomerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'totalSpent' | 'totalOrders' | 'lastOrderAt' | 'registeredAt' | 'returnRate' | 'loyaltyPoints'>('totalSpent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedId, setSelectedId] = useState<string | null>(allCustomers[0]?.id || null);
  const [activeView, setActiveView] = useState('all');

  const quickViews = [
    { id: 'all', label: '全部客户' },
    { id: 'active', label: '活跃' },
    { id: 'vip', label: 'VIP' },
    { id: 'at_risk', label: '流失风险' },
    { id: 'new', label: '新客户' },
    { id: 'blocked', label: '已封禁' },
  ];

  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers];

    // Quick view filter
    if (activeView === 'active') result = result.filter(c => c.status === 'active');
    else if (activeView === 'vip') result = result.filter(c => c.tier === 'diamond' || c.tier === 'platinum');
    else if (activeView === 'at_risk') result = result.filter(c => c.rfmSegment === 'at_risk' || c.rfmSegment === 'cant_lose' || c.rfmSegment === 'about_to_sleep');
    else if (activeView === 'new') result = result.filter(c => c.rfmSegment === 'new');
    else if (activeView === 'blocked') result = result.filter(c => c.status === 'blocked');

    // Additional filters
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (tierFilter !== 'all') result = result.filter(c => c.tier === tierFilter);
    if (segmentFilter !== 'all') result = result.filter(c => c.rfmSegment === segmentFilter);

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [searchTerm, statusFilter, tierFilter, segmentFilter, sortField, sortDir, activeView]);

  const selected = allCustomers.find(c => c.id === selectedId) || null;

  useEffect(() => {
    onSelectObject?.(selected ? { kind: 'customer', payload: selected } : null);
  }, [selected, onSelectObject]);

  // Summary stats
  const totalCustomers = allCustomers.length;
  const activeCount = allCustomers.filter(c => c.status === 'active').length;
  const vipCount = allCustomers.filter(c => c.tier === 'diamond' || c.tier === 'platinum').length;
  const totalRevenue = allCustomers.reduce((s, c) => s + c.totalSpent, 0);
  const avgLTV = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;
  const atRiskCount = allCustomers.filter(c => ['at_risk', 'cant_lose', 'about_to_sleep'].includes(c.rfmSegment)).length;

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const { addToast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgChannel, setMsgChannel] = useState('email');
  const [couponCode, setCouponCode] = useState('');
  const [newCustName, setNewCustName] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor min-w-0">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-3">
            <IconCustomer size={16} className="text-idpxyz-accent" />
            <h1 className="text-[14px] font-semibold text-idpxyz-textBright">客户管理</h1>
            <span className="text-[11px] text-idpxyz-textMuted">{totalCustomers} 位客户</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end min-w-0">
            {selected && (
              <>
                <span className="text-[10px] text-idpxyz-textMuted mr-1 border-r border-idpxyz-border pr-2">{selected.name}</span>
                <Button variant="ghost" size="sm" onClick={() => onOpenTab?.(`customer-detail-${selected.id}`, `客户 ${selected.name}`, selected.tier)}><IconEye size={12} /> 详情</Button>
                <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '编辑模式', message: `正在编辑客户 ${selected.name} 的信息` })}><IconEdit size={12} /> 编辑</Button>
                <Button variant="ghost" size="sm" onClick={() => { setMsgContent(''); setMsgChannel('email'); setModal('message'); }}><IconMail size={12} /> 发消息</Button>
                <Button variant="ghost" size="sm" onClick={() => { setCouponCode(''); setModal('coupon'); }}><IconTicket size={12} /> 发券</Button>
                <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'success', title: '已标记', message: `客户 ${selected.name} 已加入关注列表` })}><IconBell size={12} /> 标记</Button>
                <div className="w-px h-4 bg-idpxyz-border mx-1" />
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'success', title: '导出中', message: `正在导出 ${filteredCustomers.length} 位客户数据为 CSV...` })}><IconDownload size={13} /> 导出</Button>
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '导入', message: '请选择 CSV 文件进行批量导入' })}><IconUpload size={13} /> 导入</Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenTab?.('member-loyalty', '会员积分中心')}><IconStar size={13} /> 积分中心</Button>
            <Button variant="default" size="sm" onClick={() => { setNewCustName(''); setNewCustEmail(''); setModal('create'); }}><IconPlus size={13} /> 新建客户</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconCustomer size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">总客户</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{totalCustomers}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconStar size={13} className="text-green-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">活跃</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{activeCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconShield size={13} className="text-[#4ec9b0]" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">VIP</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{vipCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconDollar size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">平均LTV</span><span className="ml-1.5 text-idpxyz-textBright font-medium">${avgLTV.toLocaleString()}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconWarning size={13} className="text-orange-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">流失风险</span><span className="ml-1.5 text-red-400 font-medium">{atRiskCount}</span></div>
          </div>
        </div>

        {/* Quick Views */}
        <div className="flex items-center gap-1 px-5 py-1.5 border-b border-idpxyz-border shrink-0">
          {quickViews.map(v => {
            let count = 0;
            if (v.id === 'active') count = allCustomers.filter(c => c.status === 'active').length;
            else if (v.id === 'vip') count = allCustomers.filter(c => c.tier === 'diamond' || c.tier === 'platinum').length;
            else if (v.id === 'at_risk') count = atRiskCount;
            else if (v.id === 'new') count = allCustomers.filter(c => c.rfmSegment === 'new').length;
            else if (v.id === 'blocked') count = allCustomers.filter(c => c.status === 'blocked').length;
            return (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
                  activeView === v.id
                    ? 'bg-idpxyz-accent/15 text-idpxyz-accent font-medium'
                    : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover'
                }`}
              >
                {v.label}
                {v.id !== 'all' && <span className="ml-1 text-[10px] opacity-60">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center bg-idpxyz-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[300px]">
            <IconSearch size={13} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="搜索姓名、ID、邮箱、手机、城市、标签..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted"
            />
          </div>
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="all">全部等级</option>
            {(Object.entries(customerTierConfig) as [CustomerTier, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={segmentFilter}
            onChange={e => setSegmentFilter(e.target.value)}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="all">全部RFM分群</option>
            {(Object.entries(rfmSegmentConfig) as [RFMSegment, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <span className="text-[11px] text-idpxyz-textMuted ml-auto">排序:</span>
          <select
            value={`${sortField}-${sortDir}`}
            onChange={e => { const [f, d] = e.target.value.split('-'); setSortField(f as any); setSortDir(d as any); }}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="totalSpent-desc">总消费 ↓</option>
            <option value="totalSpent-asc">总消费 ↑</option>
            <option value="totalOrders-desc">订单数 ↓</option>
            <option value="totalOrders-asc">订单数 ↑</option>
            <option value="lastOrderAt-desc">最近下单</option>
            <option value="registeredAt-desc">最近注册</option>
            <option value="returnRate-desc">退货率 ↓</option>
            <option value="loyaltyPoints-desc">积分 ↓</option>
          </select>
          <span className="text-[11px] text-idpxyz-textMuted">{filteredCustomers.length} 位客户</span>
        </div>

        {/* Customer Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left">
                <th className="px-4 py-2 font-medium border-b border-idpxyz-border w-[40px]"></th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border">客户信息</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[70px]">状态</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[60px]">等级</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[90px]">RFM 分群</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[80px] text-center">RFM 评分</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[80px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('totalOrders')}>
                  订单数 {sortField === 'totalOrders' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[100px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('totalSpent')}>
                  总消费 {sortField === 'totalSpent' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[70px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('returnRate')}>
                  退货率 {sortField === 'returnRate' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[100px]">最后下单</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(cust => {
                const ss = customerStatusConfig[cust.status];
                const ts = customerTierConfig[cust.tier];
                const rs = rfmSegmentConfig[cust.rfmSegment];
                const isSelected = selectedId === cust.id;
                return (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedId(cust.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-idpxyz-activeItem' : 'hover:bg-idpxyz-hover'}`}
                  >
                    <td className="px-4 py-2.5 border-b border-idpxyz-border">
                      <span className="text-[20px]">{cust.avatar}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <div className="text-[12px] text-idpxyz-text font-medium">{cust.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-idpxyz-textMuted">
                        <span>{cust.id}</span>
                        <span>·</span>
                        <span>{cust.email}</span>
                        <span>·</span>
                        <span>{cust.city}, {cust.country}</span>
                      </div>
                      {cust.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {cust.tags.slice(0, 3).map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-idpxyz-hover text-[9px] text-idpxyz-textMuted">{t}</span>
                          ))}
                          {cust.tags.length > 3 && <span className="text-[9px] text-idpxyz-textMuted">+{cust.tags.length - 3}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <StatusBadge {...ss} />
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <StatusBadge {...ts} />
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <StatusBadge {...rs} />
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1.5" title={`R:${cust.rfmRecency} F:${cust.rfmFrequency} M:${cust.rfmMonetary}`}>
                          <div className="text-[9px] text-idpxyz-textMuted w-[8px]">R</div>
                          <RFMBar value={cust.rfmRecency} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-[9px] text-idpxyz-textMuted w-[8px]">F</div>
                          <RFMBar value={cust.rfmFrequency} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-[9px] text-idpxyz-textMuted w-[8px]">M</div>
                          <RFMBar value={cust.rfmMonetary} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className="text-idpxyz-textBright font-medium">{cust.totalOrders > 0 ? cust.totalOrders : '-'}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className="text-idpxyz-textBright font-medium">{cust.totalSpent > 0 ? `$${cust.totalSpent.toLocaleString()}` : '-'}</span>
                      {cust.avgOrderValue > 0 && (
                        <div className="text-[10px] text-idpxyz-textMuted">均 ${cust.avgOrderValue.toFixed(0)}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className={`font-medium ${cust.returnRate > 15 ? 'text-red-400' : cust.returnRate > 8 ? 'text-yellow-400' : 'text-idpxyz-text'}`}>
                        {cust.returnRate > 0 ? `${cust.returnRate}%` : '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <div className="text-[11px] text-idpxyz-text">{cust.lastOrderAt ? cust.lastOrderAt.split(' ')[0] : '-'}</div>
                      {cust.lastOrderAt && (
                        <div className="text-[10px] text-idpxyz-textMuted">{cust.registrationChannel}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-idpxyz-textMuted">
              没有匹配的客户
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ActionModal
        open={modal === 'message'}
        onClose={() => setModal(null)}
        title={`发消息 — ${selected?.name ?? ''}`}
        confirmLabel="发送"
        onConfirm={() => addToast({ type: 'success', title: '消息已发送', message: `已通过${msgChannel === 'email' ? '邮件' : msgChannel === 'sms' ? '短信' : '站内信'}向 ${selected?.name} 发送消息` })}
      >
        <ModalSelect label="发送渠道" value={msgChannel} onChange={setMsgChannel} options={[
          { value: 'email', label: '邮件' },
          { value: 'sms', label: '短信' },
          { value: 'in_app', label: '站内信' },
        ]} />
        <ModalTextarea label="消息内容" placeholder="请输入消息内容..." value={msgContent} onChange={setMsgContent} rows={4} />
      </ActionModal>

      <ActionModal
        open={modal === 'coupon'}
        onClose={() => setModal(null)}
        title={`发放优惠券 — ${selected?.name ?? ''}`}
        confirmLabel="发放"
        onConfirm={() => addToast({ type: 'success', title: '优惠券已发放', message: `已向 ${selected?.name} 发放优惠券 ${couponCode || 'SPRING20'}` })}
      >
        <ModalSelect label="选择优惠券" value={couponCode} onChange={setCouponCode} options={[
          { value: '', label: '选择优惠券...' },
          { value: 'SPRING20', label: '春季20元优惠券 (SPRING20)' },
          { value: 'NEWUSER15', label: '新人85折券 (NEWUSER15)' },
          { value: 'ELEC50', label: '电子产品50元券 (ELEC50)' },
          { value: 'FREESHIP', label: '全场包邮券 (FREESHIP)' },
          { value: 'VIP100', label: 'VIP百元大券 (VIP100)' },
        ]} />
      </ActionModal>

      <ActionModal
        open={modal === 'create'}
        onClose={() => setModal(null)}
        title="新建客户"
        confirmLabel="创建"
        onConfirm={() => addToast({ type: 'success', title: '客户已创建', message: `客户 ${newCustName || '新客户'} 已成功创建` })}
      >
        <ModalInput label="客户姓名" placeholder="请输入姓名" value={newCustName} onChange={setNewCustName} />
        <ModalInput label="邮箱地址" placeholder="请输入邮箱" value={newCustEmail} onChange={setNewCustEmail} type="email" />
        <ModalSelect label="注册渠道" value="" onChange={() => {}} options={[
          { value: '', label: '选择渠道...' },
          { value: 'website', label: '官网' },
          { value: 'app', label: 'App' },
          { value: 'platform', label: '平台' },
          { value: 'wechat', label: '微信小程序' },
        ]} />
      </ActionModal>
    </div>
  );
}
