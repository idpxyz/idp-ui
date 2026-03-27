import { useMemo, useState } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import {
  IconCustomer,
  IconStar,
  IconSearch,
  IconDollar,
  IconCheckCircle,
  IconWarning,
  IconRefresh,
  IconGift,
  IconEdit,
  IconHash,
  IconClock,
  IconFilter,
  IconChart,
  IconTrending,
  IconAutomation,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import { ActionModal, ModalInput, ModalTextarea } from '../components/ActionModal';
import {
  customers,
  loyaltyTransactions,
  loyaltyRules,
  loyaltyRewards,
  loyaltyAdjustments,
  loyaltyTransactionTypeConfig,
  loyaltyTransactionStatusConfig,
  customerTierConfig,
} from '../data/oms';

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

const tabs = [
  { id: 'accounts', label: '会员账户' },
  { id: 'transactions', label: '积分流水' },
  { id: 'rules', label: '积分规则' },
  { id: 'rewards', label: '积分兑换' },
  { id: 'adjustments', label: '人工调账' },
  { id: 'builder', label: '体系构建' },
  { id: 'evaluation', label: '效果评估' },
] as const;

type TabId = typeof tabs[number]['id'];

export default function MemberLoyalty() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>('accounts');
  const [search, setSearch] = useState('');
  const [txnTypeFilter, setTxnTypeFilter] = useState('all');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? '');
  const [adjDelta, setAdjDelta] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [builderRuleName, setBuilderRuleName] = useState('消费积分主规则');
  const [builderTrigger, setBuilderTrigger] = useState('order_paid');
  const [builderEarnRate, setBuilderEarnRate] = useState('1');
  const [builderCap, setBuilderCap] = useState('3000');
  const [builderExpiryDays, setBuilderExpiryDays] = useState('365');
  const [builderTierBoost, setBuilderTierBoost] = useState('silver:1.1,gold:1.2,platinum:1.3,diamond:1.5');

  const [evalOrders, setEvalOrders] = useState('12000');
  const [evalAvgAmount, setEvalAvgAmount] = useState('78');
  const [evalRedeemRate, setEvalRedeemRate] = useState('18');
  const [evalPointValue, setEvalPointValue] = useState('0.01');

  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  const activeMembers = customers.filter(c => c.status === 'active').length;
  const redeemedPoints = loyaltyTransactions.filter(t => t.pointsChange < 0).reduce((sum, t) => sum + Math.abs(t.pointsChange), 0);
  const earnedPoints = loyaltyTransactions.filter(t => t.pointsChange > 0).reduce((sum, t) => sum + t.pointsChange, 0);

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  }, [search]);

  const filteredTransactions = useMemo(() => {
    return loyaltyTransactions.filter(t => {
      if (txnTypeFilter !== 'all' && t.type !== txnTypeFilter) return false;
      if (txnStatusFilter !== 'all' && t.status !== txnStatusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!(t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q) || t.customerId.toLowerCase().includes(q) || t.sourceId.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [txnStatusFilter, txnTypeFilter, search]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) ?? null;
  const evalOrdersNum = Number(evalOrders) || 0;
  const evalAvgAmountNum = Number(evalAvgAmount) || 0;
  const evalRedeemRateNum = Number(evalRedeemRate) || 0;
  const evalPointValueNum = Number(evalPointValue) || 0;
  const evalGmv = evalOrdersNum * evalAvgAmountNum;
  const evalEstimatedIssued = evalGmv * (Number(builderEarnRate) || 1);
  const evalEstimatedRedeemedCost = evalEstimatedIssued * (evalRedeemRateNum / 100) * evalPointValueNum;
  const evalEstimatedNetRevenue = evalGmv - evalEstimatedRedeemedCost;

  return (
    <div className="flex-1 flex flex-col bg-idpxyz-editor min-w-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-3">
          <IconStar size={16} className="text-idpxyz-accent" />
          <h1 className="text-[14px] font-semibold text-idpxyz-textBright">会员积分中心</h1>
          <span className="text-[11px] text-idpxyz-textMuted">{customers.length} 位会员</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '刷新完成', message: '积分数据已刷新' })}><IconRefresh size={12} /> 刷新</Button>
          <Button variant="default" size="sm" onClick={() => { setAdjDelta(''); setAdjReason(''); setShowAdjustModal(true); }}><IconEdit size={12} /> 调整积分</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border"><IconStar size={13} className="text-yellow-400" /><div className="text-[11px]"><span className="text-idpxyz-textMuted">会员总积分</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{totalPoints.toLocaleString()}</span></div></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border"><IconCustomer size={13} className="text-idpxyz-accent" /><div className="text-[11px]"><span className="text-idpxyz-textMuted">活跃会员</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{activeMembers}</span></div></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border"><IconCheckCircle size={13} className="text-green-400" /><div className="text-[11px]"><span className="text-idpxyz-textMuted">累计发放</span><span className="ml-1.5 text-green-400 font-medium">{earnedPoints.toLocaleString()}</span></div></div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border"><IconDollar size={13} className="text-orange-400" /><div className="text-[11px]"><span className="text-idpxyz-textMuted">累计消耗</span><span className="ml-1.5 text-orange-400 font-medium">{redeemedPoints.toLocaleString()}</span></div></div>
      </div>

      <div className="flex items-center gap-1 px-5 py-1.5 border-b border-idpxyz-border shrink-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-idpxyz-accent/15 text-idpxyz-accent font-medium' : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover'}`}>
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center bg-idpxyz-inputBg rounded px-2.5 h-[28px] w-[260px]">
          <IconSearch size={13} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[12px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted" placeholder="搜索会员ID/姓名/流水号..." />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'accounts' && (
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10"><tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left"><th className="px-4 py-2 font-medium border-b border-idpxyz-border">会员</th><th className="px-3 py-2 font-medium border-b border-idpxyz-border">等级</th><th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">积分</th><th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">订单数</th><th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">消费额</th><th className="px-3 py-2 font-medium border-b border-idpxyz-border">最近下单</th></tr></thead>
            <tbody>
              {filteredCustomers.map(c => (
                <tr key={c.id} className="hover:bg-idpxyz-hover/50 border-b border-idpxyz-border">
                  <td className="px-4 py-2.5"><div className="flex items-center gap-2"><span className="text-[18px]">{c.avatar}</span><div><div className="text-idpxyz-textBright font-medium">{c.name}</div><div className="text-[10px] text-idpxyz-textMuted">{c.id}</div></div></div></td>
                  <td className="px-3 py-2.5"><StatusBadge {...customerTierConfig[c.tier]} /></td>
                  <td className="px-3 py-2.5 text-right text-yellow-400 font-medium">{c.loyaltyPoints.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right">{c.totalOrders}</td>
                  <td className="px-3 py-2.5 text-right">${c.totalSpent.toLocaleString()}</td>
                  <td className="px-3 py-2.5">{c.lastOrderAt || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'transactions' && (
          <>
            <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border">
              <IconFilter size={12} className="text-idpxyz-textMuted" />
              <select value={txnTypeFilter} onChange={e => setTxnTypeFilter(e.target.value)} className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none">
                <option value="all">全部类型</option>
                {Object.entries(loyaltyTransactionTypeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={txnStatusFilter} onChange={e => setTxnStatusFilter(e.target.value)} className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none">
                <option value="all">全部状态</option>
                {Object.entries(loyaltyTransactionStatusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span className="text-[11px] text-idpxyz-textMuted ml-auto">{filteredTransactions.length} 条流水</span>
            </div>
            <table className="w-full text-[12px] border-collapse">
              <thead className="sticky top-0 z-10"><tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left"><th className="px-4 py-2 border-b border-idpxyz-border">流水号</th><th className="px-3 py-2 border-b border-idpxyz-border">会员</th><th className="px-3 py-2 border-b border-idpxyz-border">类型</th><th className="px-3 py-2 border-b border-idpxyz-border">状态</th><th className="px-3 py-2 border-b border-idpxyz-border text-right">变动</th><th className="px-3 py-2 border-b border-idpxyz-border text-right">余额</th><th className="px-3 py-2 border-b border-idpxyz-border">来源</th><th className="px-3 py-2 border-b border-idpxyz-border">时间</th></tr></thead>
              <tbody>
                {filteredTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-idpxyz-hover/50 border-b border-idpxyz-border">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-idpxyz-accent">{t.id}</td>
                    <td className="px-3 py-2.5"><div className="text-idpxyz-textBright">{t.customerName}</div><div className="text-[10px] text-idpxyz-textMuted">{t.customerId}</div></td>
                    <td className="px-3 py-2.5"><StatusBadge {...loyaltyTransactionTypeConfig[t.type]} /></td>
                    <td className="px-3 py-2.5"><StatusBadge {...loyaltyTransactionStatusConfig[t.status]} /></td>
                    <td className={`px-3 py-2.5 text-right font-medium ${t.pointsChange >= 0 ? 'text-green-400' : 'text-orange-400'}`}>{t.pointsChange >= 0 ? '+' : ''}{t.pointsChange}</td>
                    <td className="px-3 py-2.5 text-right text-yellow-400">{t.balanceAfter.toLocaleString()}</td>
                    <td className="px-3 py-2.5"><div className="text-idpxyz-text">{t.sourceType}</div><div className="text-[10px] text-idpxyz-textMuted">{t.sourceId}</div></td>
                    <td className="px-3 py-2.5">{t.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'rules' && (
          <div className="p-5 grid grid-cols-2 gap-3">
            {loyaltyRules.map(r => (
              <div key={r.id} className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
                <div className="flex items-center justify-between mb-2"><div className="text-[13px] text-idpxyz-textBright font-semibold">{r.name}</div><StatusBadge {...(r.enabled ? { label: '启用中', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' } : { label: '已停用', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' })} /></div>
                <div className="text-[11px] text-idpxyz-textMuted leading-relaxed">{r.description}</div>
                <div className="mt-2 px-2 py-1 rounded bg-idpxyz-editor text-[10px] text-idpxyz-accent font-mono">{r.expression}</div>
                <div className="mt-2 text-[10px] text-idpxyz-textMuted">更新: {r.updatedAt} · {r.updatedBy}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="p-5 grid grid-cols-3 gap-3">
            {loyaltyRewards.map(r => (
              <div key={r.id} className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
                <div className="flex items-center justify-between"><div className="text-[13px] text-idpxyz-textBright font-semibold">{r.name}</div><StatusBadge {...(r.status === 'active' ? { label: '可兑换', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' } : r.status === 'sold_out' ? { label: '已兑完', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' } : { label: '下线', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' })} /></div>
                <div className="mt-2 text-[11px] text-idpxyz-textMuted">{r.description}</div>
                <div className="mt-3 flex items-center justify-between text-[11px]"><span className="text-idpxyz-textMuted">所需积分</span><span className="text-yellow-400 font-medium">{r.pointsCost.toLocaleString()}</span></div>
                <div className="mt-1 flex items-center justify-between text-[11px]"><span className="text-idpxyz-textMuted">库存</span><span className="text-idpxyz-text">{r.stock.toLocaleString()}</span></div>
                <Button variant="ghost" size="sm" className="w-full mt-3 justify-center" onClick={() => addToast({ type: r.status === 'active' ? 'success' : 'warning', title: r.status === 'active' ? '兑换成功' : '不可兑换', message: r.status === 'active' ? `${r.name} 已兑换` : `${r.name} 当前状态不可兑换` })}><IconGift size={12} /> 立即兑换</Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'adjustments' && (
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10"><tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left"><th className="px-4 py-2 border-b border-idpxyz-border">调账单</th><th className="px-3 py-2 border-b border-idpxyz-border">会员</th><th className="px-3 py-2 border-b border-idpxyz-border text-right">调整前</th><th className="px-3 py-2 border-b border-idpxyz-border text-right">变动</th><th className="px-3 py-2 border-b border-idpxyz-border text-right">调整后</th><th className="px-3 py-2 border-b border-idpxyz-border">原因</th><th className="px-3 py-2 border-b border-idpxyz-border">审批信息</th></tr></thead>
            <tbody>
              {loyaltyAdjustments.map(a => (
                <tr key={a.id} className="hover:bg-idpxyz-hover/50 border-b border-idpxyz-border">
                  <td className="px-4 py-2.5 font-mono text-idpxyz-accent">{a.id}</td>
                  <td className="px-3 py-2.5"><div className="text-idpxyz-textBright">{a.customerName}</div><div className="text-[10px] text-idpxyz-textMuted">{a.customerId}</div></td>
                  <td className="px-3 py-2.5 text-right">{a.beforePoints.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-medium ${a.deltaPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}>{a.deltaPoints >= 0 ? '+' : ''}{a.deltaPoints}</td>
                  <td className="px-3 py-2.5 text-right text-yellow-400">{a.afterPoints.toLocaleString()}</td>
                  <td className="px-3 py-2.5">{a.reason}</td>
                  <td className="px-3 py-2.5 text-[11px]"><div>审批: {a.approvedBy}</div><div className="text-idpxyz-textMuted">创建: {a.createdBy} · {a.createdAt}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'builder' && (
          <div className="p-5 grid grid-cols-[1.1fr_0.9fr] gap-4">
            <div className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
              <div className="flex items-center gap-2 mb-3"><IconAutomation size={14} className="text-idpxyz-accent" /><span className="text-[13px] font-semibold text-idpxyz-textBright">积分规则搭建器</span></div>
              <div className="grid grid-cols-2 gap-3">
                <ModalInput label="规则名称" value={builderRuleName} onChange={setBuilderRuleName} />
                <div>
                  <label className="text-[11px] text-idpxyz-textMuted">触发事件</label>
                  <select value={builderTrigger} onChange={e => setBuilderTrigger(e.target.value)} className="w-full mt-1 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 text-[12px] text-idpxyz-text outline-none">
                    <option value="order_paid">订单支付成功</option>
                    <option value="order_completed">订单完成签收</option>
                    <option value="first_order">首单奖励</option>
                    <option value="campaign_event">活动触发</option>
                  </select>
                </div>
                <ModalInput label="积分系数（每美元）" value={builderEarnRate} onChange={setBuilderEarnRate} />
                <ModalInput label="单笔积分上限" value={builderCap} onChange={setBuilderCap} />
                <ModalInput label="积分有效期（天）" value={builderExpiryDays} onChange={setBuilderExpiryDays} />
                <ModalInput label="等级加成配置" value={builderTierBoost} onChange={setBuilderTierBoost} />
              </div>
              <div className="mt-3 p-3 rounded bg-idpxyz-editor border border-idpxyz-border">
                <div className="text-[11px] text-idpxyz-textMuted mb-1">规则预览</div>
                <div className="text-[12px] text-idpxyz-textBright font-mono">
                  points = min(order_paid_amount × {builderEarnRate || '1'} × tier_multiplier, {builderCap || '3000'})
                </div>
                <div className="text-[10px] text-idpxyz-textMuted mt-1">trigger={builderTrigger} · expire={builderExpiryDays || '365'}d</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="default" size="sm" onClick={() => addToast({ type: 'success', title: '已发布规则', message: `规则「${builderRuleName || '未命名规则'}」已生效` })}><IconCheckCircle size={12} /> 发布规则</Button>
                <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '保存草稿', message: '规则草稿已保存' })}><IconEdit size={12} /> 保存草稿</Button>
              </div>
            </div>

            <div className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
              <div className="flex items-center gap-2 mb-3"><IconWarning size={14} className="text-orange-400" /><span className="text-[13px] font-semibold text-idpxyz-textBright">风控与边界</span></div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-idpxyz-editor border border-idpxyz-border"><span className="text-idpxyz-textMuted">防刷策略:</span> 同设备 24h 最多 3 次奖励</div>
                <div className="p-2 rounded bg-idpxyz-editor border border-idpxyz-border"><span className="text-idpxyz-textMuted">退款回退:</span> 退款成功自动冲减相应积分</div>
                <div className="p-2 rounded bg-idpxyz-editor border border-idpxyz-border"><span className="text-idpxyz-textMuted">手工调账审批:</span> 绝对值 ≥ 500 需主管审批</div>
                <div className="p-2 rounded bg-idpxyz-editor border border-idpxyz-border"><span className="text-idpxyz-textMuted">黑名单限制:</span> blocked 状态不可获赠不可兑换</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="p-5 space-y-4">
            <div className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
              <div className="flex items-center gap-2 mb-3"><IconChart size={14} className="text-idpxyz-accent" /><span className="text-[13px] font-semibold text-idpxyz-textBright">积分效果评估模拟器</span></div>
              <div className="grid grid-cols-4 gap-3">
                <ModalInput label="月订单数" value={evalOrders} onChange={setEvalOrders} />
                <ModalInput label="客单价($)" value={evalAvgAmount} onChange={setEvalAvgAmount} />
                <ModalInput label="积分核销率(%)" value={evalRedeemRate} onChange={setEvalRedeemRate} />
                <ModalInput label="每积分成本($)" value={evalPointValue} onChange={setEvalPointValue} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-md bg-idpxyz-sidebar border border-idpxyz-border p-3"><div className="text-[10px] text-idpxyz-textMuted">预计GMV</div><div className="text-[16px] text-idpxyz-textBright font-semibold">${evalGmv.toLocaleString()}</div></div>
              <div className="rounded-md bg-idpxyz-sidebar border border-idpxyz-border p-3"><div className="text-[10px] text-idpxyz-textMuted">预计发放积分</div><div className="text-[16px] text-green-400 font-semibold">{Math.round(evalEstimatedIssued).toLocaleString()}</div></div>
              <div className="rounded-md bg-idpxyz-sidebar border border-idpxyz-border p-3"><div className="text-[10px] text-idpxyz-textMuted">积分成本</div><div className="text-[16px] text-orange-400 font-semibold">${Math.round(evalEstimatedRedeemedCost).toLocaleString()}</div></div>
              <div className="rounded-md bg-idpxyz-sidebar border border-idpxyz-border p-3"><div className="text-[10px] text-idpxyz-textMuted">净收入（估）</div><div className="text-[16px] text-idpxyz-accent font-semibold">${Math.round(evalEstimatedNetRevenue).toLocaleString()}</div></div>
            </div>

            <div className="rounded-lg border border-idpxyz-border bg-idpxyz-sidebar p-4">
              <div className="flex items-center gap-2 mb-2"><IconTrending size={14} className="text-green-400" /><span className="text-[13px] font-semibold text-idpxyz-textBright">评估结论</span></div>
              <ul className="text-[11px] text-idpxyz-text space-y-1">
                <li>- 当前参数下积分成本率约 {evalGmv > 0 ? ((evalEstimatedRedeemedCost / evalGmv) * 100).toFixed(2) : '0.00'}%</li>
                <li>- 若将“积分系数”从 {builderEarnRate || '1'} 提升至 {((Number(builderEarnRate) || 1) + 0.2).toFixed(1)}，预计成本同步提升约 20%</li>
                <li>- 建议将高风险用户群核销上限降至订单金额 10%，降低套利风险</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <ActionModal
        open={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="人工调整积分"
        description="用于客诉补偿、异常冲正、运营活动补发等场景"
        confirmLabel="提交调账"
        onConfirm={() => {
          if (!selectedCustomer || !adjDelta.trim()) return;
          addToast({ type: 'success', title: '调账已提交', message: `会员 ${selectedCustomer.name} 积分变动 ${adjDelta}` });
          setShowAdjustModal(false);
          setAdjDelta('');
          setAdjReason('');
        }}
      >
        <div className="space-y-2">
          <label className="text-[11px] text-idpxyz-textMuted">选择会员</label>
          <select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 text-[12px] text-idpxyz-text outline-none">
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id}) · 当前 {c.loyaltyPoints.toLocaleString()} 分</option>)}
          </select>
        </div>
        <ModalInput label="积分变动" placeholder="例如 +200 或 -150" value={adjDelta} onChange={setAdjDelta} />
        <ModalTextarea label="调整原因" placeholder="请输入调账原因与凭证信息..." value={adjReason} onChange={setAdjReason} rows={3} />
      </ActionModal>
    </div>
  );
}
