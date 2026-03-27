import { useMemo, useState } from 'react';
import { IconCatalog, IconSearch, IconPlay, IconPause, IconShield, IconArrowUpDown, IconClock, IconAutomation, IconEdit, IconPlus, IconClose } from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';

type RuleStatus = 'active' | 'paused' | 'draft';
type RuleCategory = 'risk' | 'fulfillment' | 'payment' | 'notification';

interface RuleItem {
  id: string;
  name: string;
  category: RuleCategory;
  status: RuleStatus;
  priority: number;
  condition: string;
  action: string;
  hitCount24h: number;
  updatedAt: string;
  owner: string;
}

const rulesData: RuleItem[] = [
  { id: 'RULE-001', name: '高风险支付拦截', category: 'risk', status: 'active', priority: 10, condition: 'riskScore >= 85 且 新用户', action: '阻断支付并进入人工复核队列', hitCount24h: 38, updatedAt: '2026-03-12 14:20', owner: '风控组' },
  { id: 'RULE-002', name: '地址低置信度二次确认', category: 'fulfillment', status: 'active', priority: 20, condition: '地址解析置信度 < 0.7', action: '短信提醒用户确认地址', hitCount24h: 121, updatedAt: '2026-03-11 09:40', owner: '履约组' },
  { id: 'RULE-003', name: '支付网关降级重试', category: 'payment', status: 'active', priority: 15, condition: '网关5xx连续3次', action: '切换备份通道并指数退避', hitCount24h: 12, updatedAt: '2026-03-10 11:05', owner: '支付组' },
  { id: 'RULE-004', name: '超时履约升级告警', category: 'fulfillment', status: 'paused', priority: 30, condition: 'SLA 剩余 < 2h', action: '升级到值班经理并标红看板', hitCount24h: 0, updatedAt: '2026-03-08 18:30', owner: '履约组' },
  { id: 'RULE-005', name: '大促券异常核销预警', category: 'risk', status: 'active', priority: 12, condition: '同设备30分钟核销 >= 5', action: '冻结优惠券并触发审计', hitCount24h: 9, updatedAt: '2026-03-09 16:12', owner: '风控组' },
  { id: 'RULE-006', name: '发货通知补偿', category: 'notification', status: 'draft', priority: 40, condition: '发货后 10 分钟未发送通知', action: '补偿发送短信 + 站内信', hitCount24h: 0, updatedAt: '2026-03-07 13:00', owner: '消息组' },
];

const statusConfig: Record<RuleStatus, { label: string; cls: string }> = {
  active: { label: '生效中', cls: 'text-green-400 bg-green-400/10' },
  paused: { label: '已暂停', cls: 'text-yellow-400 bg-yellow-400/10' },
  draft: { label: '草稿', cls: 'text-idpxyz-textMuted bg-idpxyz-hover' },
};

const categoryConfig: Record<RuleCategory, { label: string; icon: React.ElementType }> = {
  risk: { label: '风控', icon: IconShield },
  fulfillment: { label: '履约', icon: IconClock },
  payment: { label: '支付', icon: IconAutomation },
  notification: { label: '通知', icon: IconCatalog },
};

interface RuleFormState {
  name: string;
  category: RuleCategory;
  status: RuleStatus;
  priority: number;
  condition: string;
  action: string;
  owner: string;
}

const emptyForm: RuleFormState = {
  name: '',
  category: 'risk',
  status: 'draft',
  priority: 20,
  condition: '',
  action: '',
  owner: '',
};

function Badge({ text, cls }: { text: string; cls: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${cls}`}>{text}</span>;
}

export default function RulesManagement() {
  const [rules, setRules] = useState<RuleItem[]>(rulesData);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | RuleStatus>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'hitCount24h' | 'updatedAt'>('priority');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedId, setSelectedId] = useState<string | null>(rulesData[0]?.id ?? null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormState>(emptyForm);

  const list = useMemo(() => {
    let v = [...rules];
    if (q.trim()) {
      const s = q.toLowerCase();
      v = v.filter(r => r.name.toLowerCase().includes(s) || r.id.toLowerCase().includes(s) || r.condition.toLowerCase().includes(s));
    }
    if (status !== 'all') v = v.filter(r => r.status === status);
    v.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return v;
  }, [rules, q, status, sortBy, sortDir]);

  const selected = list.find(r => r.id === selectedId) ?? null;
  const activeCount = rules.filter(r => r.status === 'active').length;

  const now = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (rule: RuleItem) => {
    setEditingId(rule.id);
    setForm({
      name: rule.name,
      category: rule.category,
      status: rule.status,
      priority: rule.priority,
      condition: rule.condition,
      action: rule.action,
      owner: rule.owner,
    });
    setModalOpen(true);
  };

  const saveRule = () => {
    if (!form.name.trim() || !form.condition.trim() || !form.action.trim() || !form.owner.trim()) return;
    if (editingId) {
      setRules(prev => prev.map(r => r.id === editingId ? { ...r, ...form, updatedAt: now() } : r));
      setSelectedId(editingId);
    } else {
      const nextNum = rules.reduce((m, r) => Math.max(m, Number(r.id.replace('RULE-', '')) || 0), 0) + 1;
      const id = `RULE-${String(nextNum).padStart(3, '0')}`;
      const created: RuleItem = { id, hitCount24h: 0, updatedAt: now(), ...form };
      setRules(prev => [created, ...prev]);
      setSelectedId(id);
    }
    setModalOpen(false);
  };

  const toggleRuleStatus = (rule: RuleItem) => {
    setRules(prev => prev.map(r => {
      if (r.id !== rule.id) return r;
      const nextStatus: RuleStatus = r.status === 'active' ? 'paused' : 'active';
      return { ...r, status: nextStatus, updatedAt: now() };
    }));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor min-w-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-3">
          <IconCatalog size={16} className="text-idpxyz-accent" />
          <h1 className="text-[14px] font-semibold text-idpxyz-textBright">规则策略</h1>
          <span className="text-[11px] text-idpxyz-textMuted">{activeCount} 条生效规则</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" size="sm" onClick={openCreateModal}><IconPlus size={12} /> 新建规则</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center bg-idpxyz-inputBg rounded px-2 h-[26px] border border-idpxyz-border flex-1 max-w-[360px]">
          <IconSearch size={11} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索规则名称、ID、条件..."
            className="bg-transparent border-none outline-none text-[11px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | RuleStatus)} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-0.5 text-[10px] text-idpxyz-text outline-none">
          <option value="all">全部状态</option>
          <option value="active">生效中</option>
          <option value="paused">已暂停</option>
          <option value="draft">草稿</option>
        </select>
        <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] text-idpxyz-textMuted hover:bg-idpxyz-hover">
          <IconArrowUpDown size={10} /> 排序: {sortBy}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted">
              <th className="text-left px-5 py-2 font-medium border-b border-idpxyz-border">规则</th>
              <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">分类</th>
              <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">状态</th>
              <th className="text-right px-2 py-2 font-medium border-b border-idpxyz-border">优先级</th>
              <th className="text-right px-2 py-2 font-medium border-b border-idpxyz-border">24h命中</th>
              <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">负责人</th>
              <th className="text-left px-2 py-2 font-medium border-b border-idpxyz-border">更新时间</th>
              <th className="text-right px-3 py-2 font-medium border-b border-idpxyz-border">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map(r => {
              const cat = categoryConfig[r.category];
              const st = statusConfig[r.status];
              const CatIcon = cat.icon;
              const sel = r.id === selectedId;
              return (
                <tr key={r.id} onClick={() => setSelectedId(r.id)} className={`cursor-pointer border-b border-idpxyz-border ${sel ? 'bg-idpxyz-accent/8' : 'hover:bg-idpxyz-hover'}`}>
                  <td className="px-5 py-2.5">
                    <div className="text-idpxyz-textBright font-medium">{r.name}</div>
                    <div className="text-[10px] text-idpxyz-textMuted mt-0.5">{r.id} · {r.condition}</div>
                  </td>
                  <td className="px-2 py-2.5"><span className="inline-flex items-center gap-1"><CatIcon size={10} /> {cat.label}</span></td>
                  <td className="px-2 py-2.5"><Badge text={st.label} cls={st.cls} /></td>
                  <td className="px-2 py-2.5 text-right">{r.priority}</td>
                  <td className="px-2 py-2.5 text-right text-idpxyz-textBright font-medium">{r.hitCount24h.toLocaleString()}</td>
                  <td className="px-2 py-2.5">{r.owner}</td>
                  <td className="px-2 py-2.5 text-idpxyz-textMuted">{r.updatedAt}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); openEditModal(r); }}
                      >
                        <IconEdit size={12} /> 编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={r.status === 'active' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}
                        onClick={(e) => { e.stopPropagation(); toggleRuleStatus(r); }}
                      >
                        {r.status === 'active' ? <IconPause size={12} /> : <IconPlay size={12} />}
                        {r.status === 'active' ? '暂停' : '启用'}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="px-5 py-2 border-t border-idpxyz-border bg-idpxyz-sidebar text-[11px]">
          <span className="text-idpxyz-textMuted">动作:</span>
          <span className="ml-2 text-idpxyz-text">{selected.action}</span>
          <span className="ml-3 text-idpxyz-textMuted">| 条件:</span>
          <span className="ml-2 text-idpxyz-text">{selected.condition}</span>
        </div>
      )}

      {modalOpen && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-40">
          <div className="w-[640px] max-w-[92vw] rounded border border-idpxyz-border bg-idpxyz-panelBg shadow-xl">
            <div className="flex items-center justify-between px-4 h-[40px] border-b border-idpxyz-border">
              <span className="text-[13px] text-idpxyz-textBright font-medium">{editingId ? '编辑规则' : '新建规则'}</span>
              <button onClick={() => setModalOpen(false)} className="text-idpxyz-textMuted hover:text-idpxyz-text">
                <IconClose size={14} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-[11px]">
              <label className="flex flex-col gap-1">
                <span className="text-idpxyz-textMuted">规则名称</span>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-idpxyz-textMuted">负责人</span>
                <input value={form.owner} onChange={(e) => setForm(f => ({ ...f, owner: e.target.value }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-idpxyz-textMuted">分类</span>
                <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value as RuleCategory }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text">
                  <option value="risk">风控</option>
                  <option value="fulfillment">履约</option>
                  <option value="payment">支付</option>
                  <option value="notification">通知</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-idpxyz-textMuted">状态</span>
                <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as RuleStatus }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text">
                  <option value="active">生效中</option>
                  <option value="paused">已暂停</option>
                  <option value="draft">草稿</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-idpxyz-textMuted">优先级</span>
                <input type="number" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: Number(e.target.value) || 0 }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text" />
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-idpxyz-textMuted">触发条件</span>
                <input value={form.condition} onChange={(e) => setForm(f => ({ ...f, condition: e.target.value }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text" />
              </label>
              <label className="flex flex-col gap-1 col-span-2">
                <span className="text-idpxyz-textMuted">执行动作</span>
                <input value={form.action} onChange={(e) => setForm(f => ({ ...f, action: e.target.value }))} className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1.5 outline-none text-idpxyz-text" />
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 h-[46px] border-t border-idpxyz-border">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>取消</Button>
              <Button variant="default" size="sm" onClick={saveRule}>{editingId ? '保存修改' : '创建规则'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
