import { useState, useCallback } from 'react';
import {
  IconSave,
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconTicket,
  IconDollar,
  IconAlertCircle,
  IconChevronRight,
  IconChevronDown,
  IconClose,
  IconSearch,
  IconTarget,
  IconCalendar,
  IconSettings,
  IconMoreH,
  IconUsers,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  productCategories,
  spuList,
  type CouponType,
  couponTypeConfig,
} from '../data/oms';

// ── Section definitions ──
const sectionDefs = [
  { id: 'basic', label: '基本信息', icon: IconTicket },
  { id: 'discount', label: '优惠规则', icon: IconDollar },
  { id: 'scope', label: '适用范围', icon: IconTarget },
  { id: 'distribute', label: '发放设置', icon: IconUsers },
  { id: 'time', label: '有效期', icon: IconCalendar },
  { id: 'rules', label: '高级规则', icon: IconSettings },
] as const;
type SectionId = (typeof sectionDefs)[number]['id'];

interface FormData {
  code: string;
  name: string;
  type: CouponType;
  description: string;
  // Discount
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  // Scope
  scope: 'all' | 'category' | 'product';
  scopeIds: string[];
  scopeNames: string[];
  channels: string[];
  // Distribute
  totalQty: string;
  perUserLimit: string;
  newUserOnly: boolean;
  // Time
  startDate: string;
  endDate: string;
  validDays: string;
  // Advanced
  stackable: boolean;
}

const init: FormData = {
  code: '', name: '', type: 'fixed', description: '',
  discountValue: '', minOrderAmount: '', maxDiscountAmount: '',
  scope: 'all', scopeIds: [], scopeNames: [], channels: ['全渠道'],
  totalQty: '', perUserLimit: '1', newUserOnly: false,
  startDate: '', endDate: '', validDays: '30',
  stackable: false,
};

// ── Helpers ──
function Row({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="w-[100px] shrink-0 pt-0.5">
        <span className="text-[11px] text-idpxyz-textMuted">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</span>
        {hint && <div className="text-[9px] text-idpxyz-textMuted/70 mt-0.5 leading-tight">{hint}</div>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function Inp({ value, onChange, placeholder, className = '', type = 'text', mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string; type?: string; mono?: boolean;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1 text-[11px] text-idpxyz-text outline-none focus:border-idpxyz-accent placeholder:text-idpxyz-textMuted w-full ${mono ? 'font-mono' : ''} ${className}`} />
  );
}

function SectionHead({ id, icon: Icon, label, expanded, toggle, status }: {
  id: string; icon: React.ElementType; label: string; expanded: boolean; toggle: () => void; status?: 'ok' | 'warn';
}) {
  return (
    <button id={`sec-${id}`} onClick={toggle}
      className="w-full flex items-center gap-2 px-4 h-[32px] text-[11px] uppercase tracking-wider text-idpxyz-breadcrumb border-b border-idpxyz-border bg-idpxyz-sidebar hover:bg-idpxyz-hover transition-colors shrink-0">
      {expanded ? <IconChevronDown size={11} /> : <IconChevronRight size={11} />}
      <Icon size={12} className="text-idpxyz-accent" />
      <span className="font-bold">{label}</span>
      {status === 'ok' && <IconCheck size={10} className="text-green-400 ml-auto" />}
      {status === 'warn' && <IconAlertCircle size={10} className="text-yellow-400 ml-auto" />}
    </button>
  );
}

// ══════════════════════════════════
interface CouponCreateProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
  onBack?: () => void;
}

export default function CouponCreate({ onOpenTab, onBack }: CouponCreateProps) {
  const [form, setForm] = useState<FormData>({ ...init });
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['basic', 'discount', 'scope', 'distribute', 'time']));
  const [scopeSearch, setScopeSearch] = useState('');

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => setForm(p => ({ ...p, [k]: v })), []);
  const tog = (id: SectionId) => setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isOpen = (id: SectionId) => expanded.has(id);

  // Scope helpers
  const addScopeItem = (id: string, name: string) => {
    if (!form.scopeIds.includes(id)) {
      set('scopeIds', [...form.scopeIds, id]);
      set('scopeNames', [...form.scopeNames, name]);
    }
  };
  const rmScopeItem = (id: string) => {
    const idx = form.scopeIds.indexOf(id);
    if (idx >= 0) {
      set('scopeIds', form.scopeIds.filter((_, i) => i !== idx));
      set('scopeNames', form.scopeNames.filter((_, i) => i !== idx));
    }
  };

  // Channel toggle
  const channelOpts = ['全渠道', '官网', 'App', '亚马逊', 'Shopee', 'eBay'];
  const toggleChannel = (ch: string) => {
    if (ch === '全渠道') { set('channels', ['全渠道']); return; }
    const cur = form.channels.filter(c => c !== '全渠道');
    const next = cur.includes(ch) ? cur.filter(c => c !== ch) : [...cur, ch];
    set('channels', next.length === 0 ? ['全渠道'] : next);
  };

  // Auto-generate code
  const genCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    set('code', code);
  };

  // Section status
  const ss = (id: SectionId): 'ok' | 'warn' | undefined => {
    switch (id) {
      case 'basic': return form.code && form.name && form.type ? 'ok' : form.name ? 'warn' : undefined;
      case 'discount': return form.discountValue || form.type === 'free_shipping' ? 'ok' : undefined;
      case 'scope': return form.scope === 'all' || form.scopeIds.length > 0 ? 'ok' : 'warn';
      case 'distribute': return form.totalQty || form.perUserLimit ? 'ok' : undefined;
      case 'time': return form.startDate && form.endDate ? 'ok' : form.startDate ? 'warn' : undefined;
      case 'rules': return 'ok';
    }
  };

  const scrollTo = (id: SectionId) => {
    if (!expanded.has(id)) setExpanded(p => new Set([...p, id]));
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const typeOptions: { v: CouponType; l: string }[] = (Object.entries(couponTypeConfig) as [CouponType, { label: string }][]).map(([k, v]) => ({ v: k, l: v.label }));

  const scopeResults = form.scope === 'category'
    ? productCategories.filter(c => c.status === 'active' && (!scopeSearch || c.name.includes(scopeSearch) || c.path.includes(scopeSearch))).slice(0, 10)
    : form.scope === 'product'
      ? spuList.filter(s => !scopeSearch || s.name.toLowerCase().includes(scopeSearch.toLowerCase()) || s.id.includes(scopeSearch)).slice(0, 10)
      : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="text-idpxyz-textMuted hover:text-idpxyz-text"><IconArrowLeft size={14} /></button>}
          <IconTicket size={15} className="text-idpxyz-accent" />
          <h1 className="text-[14px] font-semibold text-idpxyz-textBright">创建优惠券</h1>
          {form.name && <span className="text-[11px] text-idpxyz-textMuted truncate max-w-[200px]">— {form.name}</span>}
          {form.code && <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted font-mono">{form.code}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-idpxyz-textMuted mr-1">{sectionDefs.filter(s => ss(s.id) === 'ok').length}/{sectionDefs.length}</span>
          <div className="w-px h-4 bg-idpxyz-border mx-1" />
          <Button variant="ghost" size="sm"><IconSave size={12} /> 保存草稿</Button>
          <Button variant="default" size="sm"><IconCheck size={12} /> 创建优惠券</Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left nav */}
        <div className="w-[190px] border-r border-idpxyz-border bg-idpxyz-sidebar flex flex-col overflow-auto shrink-0">
          <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-idpxyz-breadcrumb shrink-0 border-b border-idpxyz-border">
            <span>表单区块</span>
            <IconMoreH size={14} className="text-idpxyz-textMuted" />
          </div>
          {sectionDefs.map(s => {
            const st = ss(s.id);
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-[11px] text-left border-b border-idpxyz-border transition-colors hover:bg-idpxyz-hover ${expanded.has(s.id) ? 'text-idpxyz-text' : 'text-idpxyz-textMuted'}`}>
                <Icon size={11} className={st === 'ok' ? 'text-green-400' : st === 'warn' ? 'text-yellow-400' : 'text-idpxyz-textMuted'} />
                <span className="flex-1 truncate">{s.label}</span>
                {st === 'ok' && <IconCheck size={9} className="text-green-400 shrink-0" />}
                {st === 'warn' && <IconAlertCircle size={9} className="text-yellow-400 shrink-0" />}
              </button>
            );
          })}
          <div className="mt-auto px-4 py-3 border-t border-idpxyz-border">
            <div className="flex gap-1 mb-1.5">
              {sectionDefs.map(s => <div key={s.id} className={`flex-1 h-1.5 rounded-full ${ss(s.id) === 'ok' ? 'bg-green-400' : ss(s.id) === 'warn' ? 'bg-yellow-400' : 'bg-idpxyz-border'}`} />)}
            </div>
            <div className="text-[10px] text-idpxyz-textMuted">{sectionDefs.filter(s => ss(s.id) === 'ok').length}/{sectionDefs.length} 区块完成</div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto">

          {/* 1. 基本信息 */}
          <SectionHead id="basic" icon={IconTicket} label="基本信息" expanded={isOpen('basic')} toggle={() => tog('basic')} status={ss('basic')} />
          {isOpen('basic') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="券码" required hint="唯一标识，用户输入此码兑换">
                <div className="flex items-center gap-1.5">
                  <Inp value={form.code} onChange={v => set('code', v.toUpperCase())} placeholder="SPRING20" mono className="flex-1" />
                  <button onClick={genCode} className="text-[10px] text-idpxyz-accent hover:underline whitespace-nowrap">随机生成</button>
                </div>
              </Row>
              <Row label="券名称" required>
                <Inp value={form.name} onChange={v => set('name', v)} placeholder="如：春季20元优惠券" />
              </Row>
              <Row label="券类型" required>
                <div className="flex items-center gap-3 text-[11px]">
                  {typeOptions.map(o => (
                    <label key={o.v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={form.type === o.v} onChange={() => set('type', o.v)} className="accent-[var(--idpxyz-accent)]" />
                      <span className="text-idpxyz-text">{o.l}</span>
                    </label>
                  ))}
                </div>
              </Row>
              <Row label="描述">
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="优惠券使用说明..." rows={2}
                  className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1.5 text-[11px] text-idpxyz-text outline-none focus:border-idpxyz-accent placeholder:text-idpxyz-textMuted resize-none" />
              </Row>
            </div>
          )}

          {/* 2. 优惠规则 */}
          <SectionHead id="discount" icon={IconDollar} label="优惠规则" expanded={isOpen('discount')} toggle={() => tog('discount')} status={ss('discount')} />
          {isOpen('discount') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              {form.type !== 'free_shipping' && (
                <Row label="优惠值" required hint={form.type === 'percentage' ? '折扣百分比' : '减免金额'}>
                  <div className="flex items-center gap-1.5">
                    <Inp value={form.discountValue} onChange={v => set('discountValue', v)} placeholder={form.type === 'percentage' ? '15' : '20'} className="w-[100px]" />
                    <span className="text-[10px] text-idpxyz-textMuted">{form.type === 'percentage' ? '%' : 'USD'}</span>
                  </div>
                </Row>
              )}
              <Row label="最低消费" hint="达到此金额才可使用">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-idpxyz-textMuted">$</span>
                  <Inp value={form.minOrderAmount} onChange={v => set('minOrderAmount', v)} placeholder="0" className="w-[100px]" />
                </div>
              </Row>
              {form.type === 'percentage' && (
                <Row label="最高优惠" hint="封顶优惠金额">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-idpxyz-textMuted">$</span>
                    <Inp value={form.maxDiscountAmount} onChange={v => set('maxDiscountAmount', v)} placeholder="30" className="w-[100px]" />
                  </div>
                </Row>
              )}
            </div>
          )}

          {/* 3. 适用范围 */}
          <SectionHead id="scope" icon={IconTarget} label="适用范围" expanded={isOpen('scope')} toggle={() => tog('scope')} status={ss('scope')} />
          {isOpen('scope') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-2">
              <Row label="适用商品" required>
                <div className="flex items-center gap-3 text-[11px]">
                  {([['all', '全部商品'], ['category', '指定分类'], ['product', '指定商品']] as const).map(([v, l]) => (
                    <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" checked={form.scope === v} onChange={() => { set('scope', v); set('scopeIds', []); set('scopeNames', []); }} className="accent-[var(--idpxyz-accent)]" />
                      <span className="text-idpxyz-text">{l}</span>
                    </label>
                  ))}
                </div>
              </Row>

              {form.scope !== 'all' && (
                <div>
                  {form.scopeIds.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {form.scopeIds.map((id, i) => (
                        <span key={id} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-idpxyz-accent/10 text-[10px] text-idpxyz-accent">
                          {form.scopeNames[i]}
                          <IconClose size={8} className="cursor-pointer hover:text-red-400" onClick={() => rmScopeItem(id)} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center bg-idpxyz-inputBg rounded px-2 h-[26px] border border-idpxyz-border mb-1.5">
                    <IconSearch size={11} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
                    <input type="text" value={scopeSearch} onChange={e => setScopeSearch(e.target.value)}
                      placeholder={form.scope === 'category' ? '搜索分类...' : '搜索商品名称/ID...'}
                      className="bg-transparent border-none outline-none text-[11px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted" />
                    {scopeSearch && <IconClose size={10} className="text-idpxyz-textMuted cursor-pointer shrink-0" onClick={() => setScopeSearch('')} />}
                  </div>
                  <div className="border border-idpxyz-border rounded max-h-[150px] overflow-auto">
                    {scopeResults.map(item => {
                      const id = item.id;
                      const name = 'name' in item ? item.name : '';
                      const selected = form.scopeIds.includes(id);
                      return (
                        <div key={id} onClick={() => selected ? rmScopeItem(id) : addScopeItem(id, name)}
                          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[11px] transition-colors ${selected ? 'bg-idpxyz-accent/10 text-idpxyz-accent' : 'hover:bg-idpxyz-hover text-idpxyz-text'}`}>
                          {selected ? <IconCheck size={10} /> : <IconPlus size={10} className="text-idpxyz-textMuted" />}
                          {'image' in item && <span className="text-[12px]">{(item as { image: string }).image}</span>}
                          {'mainImage' in item && <span className="text-[12px]">{(item as { mainImage: string }).mainImage}</span>}
                          <span className="truncate">{name}</span>
                        </div>
                      );
                    })}
                    {scopeResults.length === 0 && <div className="px-3 py-2 text-[10px] text-idpxyz-textMuted">无匹配结果</div>}
                  </div>
                </div>
              )}

              <Row label="适用渠道">
                <div className="flex flex-wrap gap-1">
                  {channelOpts.map(ch => {
                    const on = form.channels.includes(ch);
                    return (
                      <button key={ch} type="button" onClick={() => toggleChannel(ch)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${on ? 'border-idpxyz-accent bg-idpxyz-accent/15 text-idpxyz-accent' : 'border-idpxyz-border text-idpxyz-textMuted hover:bg-idpxyz-hover'}`}>
                        {on && <IconCheck size={8} className="inline mr-0.5" />}{ch}
                      </button>
                    );
                  })}
                </div>
              </Row>
            </div>
          )}

          {/* 4. 发放设置 */}
          <SectionHead id="distribute" icon={IconUsers} label="发放设置" expanded={isOpen('distribute')} toggle={() => tog('distribute')} status={ss('distribute')} />
          {isOpen('distribute') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="发放总量" hint="0 = 不限量">
                <Inp value={form.totalQty} onChange={v => set('totalQty', v)} placeholder="10000" className="w-[120px]" />
              </Row>
              <Row label="每人限领" required>
                <Inp value={form.perUserLimit} onChange={v => set('perUserLimit', v)} placeholder="1" className="w-[80px]" />
              </Row>
              <Row label="用户限制">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-idpxyz-text">
                  <input type="checkbox" checked={form.newUserOnly} onChange={e => set('newUserOnly', e.target.checked)} className="accent-[var(--idpxyz-accent)]" />
                  仅限新用户领取
                </label>
              </Row>
            </div>
          )}

          {/* 5. 有效期 */}
          <SectionHead id="time" icon={IconCalendar} label="有效期" expanded={isOpen('time')} toggle={() => tog('time')} status={ss('time')} />
          {isOpen('time') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="发放开始" required>
                <Inp value={form.startDate} onChange={v => set('startDate', v)} placeholder="2025-03-01" type="date" className="w-[160px]" />
              </Row>
              <Row label="发放截止" required>
                <Inp value={form.endDate} onChange={v => set('endDate', v)} placeholder="2025-03-31" type="date" className="w-[160px]" />
              </Row>
              <Row label="领取后有效" required hint="用户领取后几天内可用">
                <div className="flex items-center gap-1.5">
                  <Inp value={form.validDays} onChange={v => set('validDays', v)} placeholder="30" className="w-[80px]" />
                  <span className="text-[10px] text-idpxyz-textMuted">天</span>
                </div>
              </Row>
            </div>
          )}

          {/* 6. 高级规则 */}
          <SectionHead id="rules" icon={IconSettings} label="高级规则" expanded={isOpen('rules')} toggle={() => tog('rules')} status={ss('rules')} />
          {isOpen('rules') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="可叠加">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-idpxyz-text">
                  <input type="checkbox" checked={form.stackable} onChange={e => set('stackable', e.target.checked)} className="accent-[var(--idpxyz-accent)]" />
                  允许与其他优惠券或促销活动叠加使用
                </label>
              </Row>
            </div>
          )}

          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}
