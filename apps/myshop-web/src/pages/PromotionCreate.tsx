import { useState, useCallback, useRef, useEffect } from 'react';
import {
  IconSave,
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconAutomation,
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
  IconTrash,
  IconGift,
  IconPackage,
  IconShipment,
  IconTimer,
  IconShoppingBag,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  productCategories,
  spuList,
  type PromotionType,
  promotionTypeConfig,
} from '../data/oms';

// ── Section definitions ──
const sectionDefs = [
  { id: 'basic', label: '基本信息', icon: IconAutomation },
  { id: 'typeRules', label: '活动规则', icon: IconDollar },
  { id: 'scope', label: '适用范围', icon: IconTarget },
  { id: 'time', label: '活动时间', icon: IconCalendar },
  { id: 'rules', label: '高级规则', icon: IconSettings },
] as const;
type SectionId = (typeof sectionDefs)[number]['id'];

// ── Type-specific hint / icon map ──
const typeHintMap: Record<PromotionType, { icon: React.ElementType; hint: string }> = {
  flash_sale:     { icon: IconTimer,       hint: '设置秒杀价格、限量和每人限购' },
  bundle:         { icon: IconPackage,     hint: '选择捆绑商品并设置组合优惠价' },
  buy_x_get_y:    { icon: IconGift,        hint: '设置买X件送Y件及赠品' },
  percentage_off: { icon: IconDollar,   hint: '设置折扣百分比，支持阶梯折扣' },
  fixed_off:      { icon: IconShoppingBag,  hint: '设置满减阶梯，支持多级满减' },
  free_shipping:  { icon: IconShipment,        hint: '设置包邮条件（区域/金额/重量）' },
};

interface TierRow { threshold: string; value: string; }
interface BundleItem { productId: string; productName: string; qty: string; }

interface FormData {
  name: string;
  type: PromotionType;
  description: string;
  // ── flash_sale ──
  flashProductId: string;
  flashProductName: string;
  flashSalePrice: string;
  flashStockLimit: string;
  flashPerUserLimit: string;
  // ── bundle ──
  bundleItems: BundleItem[];
  bundleOriginalTotal: string;
  bundlePrice: string;
  // ── buy_x_get_y ──
  buyQty: string;
  getQty: string;
  giftProductId: string;
  giftProductName: string;
  // ── percentage_off ──
  discountPct: string;
  maxDiscountAmount: string;
  pctTiers: TierRow[];
  usePctTiers: boolean;
  // ── fixed_off ──
  fixedTiers: TierRow[];
  // ── free_shipping ──
  freeShipMinAmount: string;
  freeShipMaxWeight: string;
  freeShipRegions: string[];
  // ── common ──
  minOrderAmount: string;
  // Scope
  scope: 'all' | 'category' | 'product';
  scopeIds: string[];
  scopeNames: string[];
  channels: string[];
  // Time
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  // Advanced
  usageLimit: string;
  budget: string;
  stackable: boolean;
  priority: string;
}

const init: FormData = {
  name: '', type: 'percentage_off', description: '',
  flashProductId: '', flashProductName: '',
  flashSalePrice: '', flashStockLimit: '', flashPerUserLimit: '1',
  bundleItems: [{ productId: '', productName: '', qty: '1' }], bundleOriginalTotal: '', bundlePrice: '',
  buyQty: '2', getQty: '1', giftProductId: '', giftProductName: '',
  discountPct: '', maxDiscountAmount: '', pctTiers: [{ threshold: '', value: '' }], usePctTiers: false,
  fixedTiers: [{ threshold: '100', value: '10' }],
  freeShipMinAmount: '', freeShipMaxWeight: '', freeShipRegions: ['全国'],
  minOrderAmount: '',
  scope: 'all', scopeIds: [], scopeNames: [], channels: ['全渠道'],
  startDate: '', startTime: '00:00', endDate: '', endTime: '23:59',
  usageLimit: '', budget: '', stackable: false, priority: '10',
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

function Inp({ value, onChange, placeholder, className = '', type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1 text-[11px] text-idpxyz-text outline-none focus:border-idpxyz-accent placeholder:text-idpxyz-textMuted w-full ${className}`} />
  );
}

function Sel({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; placeholder?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1 text-[11px] text-idpxyz-text outline-none focus:border-idpxyz-accent w-full">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
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

// ── TierEditor ──
function TierEditor({ tiers, onChange, thLabel, valLabel, thPlaceholder, valPlaceholder }: {
  tiers: TierRow[]; onChange: (v: TierRow[]) => void;
  thLabel: string; valLabel: string; thPlaceholder: string; valPlaceholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[9px] text-idpxyz-textMuted">
        <span className="w-[100px]">{thLabel}</span>
        <span className="w-[100px]">{valLabel}</span>
      </div>
      {tiers.map((t, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Inp value={t.threshold} onChange={v => { const n = [...tiers]; n[i] = { ...n[i], threshold: v }; onChange(n); }} placeholder={thPlaceholder} className="w-[100px]" />
          <Inp value={t.value} onChange={v => { const n = [...tiers]; n[i] = { ...n[i], value: v }; onChange(n); }} placeholder={valPlaceholder} className="w-[100px]" />
          {tiers.length > 1 && (
            <button onClick={() => onChange(tiers.filter((_, j) => j !== i))} className="text-idpxyz-textMuted hover:text-red-400"><IconTrash size={11} /></button>
          )}
        </div>
      ))}
      <button onClick={() => onChange([...tiers, { threshold: '', value: '' }])}
        className="flex items-center gap-1 text-[10px] text-idpxyz-accent hover:underline"><IconPlus size={10} /> 添加阶梯</button>
    </div>
  );
}

// ── ProductPicker (shared by bundle / gift / flash) ──
function ProductPicker({ selectedId, selectedName, icon: SelIcon, onSelect, onClear, placeholder }: {
  selectedId: string; selectedName: string; icon: React.ElementType;
  onSelect: (id: string, name: string) => void; onClear: () => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const results = spuList.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)).slice(0, 8);

  if (selectedId) {
    return (
      <div className="flex items-center gap-1.5 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2 py-1 text-[11px]">
        <SelIcon size={10} className="text-idpxyz-accent shrink-0" />
        <span className="text-idpxyz-text truncate flex-1">{selectedName}</span>
        <IconClose size={10} className="text-idpxyz-textMuted cursor-pointer hover:text-red-400 shrink-0" onClick={onClear} />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative min-w-[260px]">
      <div className="flex items-center bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 h-[28px] cursor-pointer hover:border-idpxyz-accent transition-colors"
        onClick={() => setOpen(o => !o)}>
        <IconSearch size={11} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
        {open ? (
          <input autoFocus type="text" value={search} onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder="输入关键词筛选..."
            className="bg-transparent border-none outline-none text-[11px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted" />
        ) : (
          <span className="text-[11px] text-idpxyz-textMuted flex-1">{placeholder || '点击选择商品...'}</span>
        )}
        <IconChevronDown size={10} className={`text-idpxyz-textMuted shrink-0 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="absolute z-30 mt-1 left-0 min-w-[400px] border border-idpxyz-border rounded bg-idpxyz-sidebar shadow-lg max-h-[240px] overflow-auto">
          {results.map(s => (
            <div key={s.id}
              onClick={() => { onSelect(s.id, s.name); setSearch(''); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer text-[11px] hover:bg-idpxyz-hover text-idpxyz-text border-b border-idpxyz-border last:border-b-0">
              <span className="text-[14px] shrink-0">{s.mainImage}</span>
              <div className="flex-1 min-w-0">
                <div className="text-idpxyz-text">{s.name}</div>
                <div className="text-[9px] text-idpxyz-textMuted">{s.brand} · {s.id}</div>
              </div>
            </div>
          ))}
          {results.length === 0 && <div className="px-3 py-2.5 text-[10px] text-idpxyz-textMuted text-center">无匹配商品</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════
interface PromotionCreateProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
  onBack?: () => void;
}

export default function PromotionCreate({ onOpenTab, onBack }: PromotionCreateProps) {
  const [form, setForm] = useState<FormData>({ ...init });
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['basic', 'typeRules', 'scope', 'time']));
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

  // Section status
  const ss = (id: SectionId): 'ok' | 'warn' | undefined => {
    switch (id) {
      case 'basic': return form.name && form.type ? 'ok' : form.name ? 'warn' : undefined;
      case 'typeRules': {
        const t = form.type;
        if (t === 'flash_sale') return form.flashProductId && form.flashSalePrice && form.flashStockLimit ? 'ok' : (form.flashProductId || form.flashSalePrice) ? 'warn' : undefined;
        if (t === 'bundle') return form.bundlePrice && form.bundleItems.some(b => b.productId) ? 'ok' : form.bundlePrice ? 'warn' : undefined;
        if (t === 'buy_x_get_y') return form.buyQty && form.getQty ? 'ok' : undefined;
        if (t === 'percentage_off') return form.usePctTiers ? (form.pctTiers.some(r => r.threshold && r.value) ? 'ok' : undefined) : (form.discountPct ? 'ok' : undefined);
        if (t === 'fixed_off') return form.fixedTiers.some(r => r.threshold && r.value) ? 'ok' : undefined;
        if (t === 'free_shipping') return 'ok';
        return undefined;
      }
      case 'scope': {
        if (form.type === 'flash_sale' || form.type === 'bundle') return 'ok';
        return form.scope === 'all' || form.scopeIds.length > 0 ? 'ok' : 'warn';
      }
      case 'time': return form.startDate && form.endDate ? 'ok' : form.startDate ? 'warn' : undefined;
      case 'rules': return form.budget ? 'ok' : undefined;
    }
  };

  const scrollTo = (id: SectionId) => {
    if (!expanded.has(id)) setExpanded(p => new Set([...p, id]));
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const typeOptions = (Object.entries(promotionTypeConfig) as [PromotionType, { label: string }][]).map(([k, v]) => ({ v: k, l: v.label }));

  // Scope search results
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
          <IconAutomation size={15} className="text-idpxyz-accent" />
          <h1 className="text-[14px] font-semibold text-idpxyz-textBright">创建促销活动</h1>
          {form.name && <span className="text-[11px] text-idpxyz-textMuted truncate max-w-[200px]">— {form.name}</span>}
          {form.type && <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted">{promotionTypeConfig[form.type].label}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-idpxyz-textMuted mr-1">{sectionDefs.filter(s => ss(s.id) === 'ok').length}/{sectionDefs.length}</span>
          <div className="w-px h-4 bg-idpxyz-border mx-1" />
          <Button variant="ghost" size="sm"><IconSave size={12} /> 保存草稿</Button>
          <Button variant="default" size="sm"><IconCheck size={12} /> 创建活动</Button>
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
          <SectionHead id="basic" icon={IconAutomation} label="基本信息" expanded={isOpen('basic')} toggle={() => tog('basic')} status={ss('basic')} />
          {isOpen('basic') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="活动名称" required>
                <Inp value={form.name} onChange={v => set('name', v)} placeholder="如：春季大促 - 全场8折" />
              </Row>
              <Row label="活动类型" required>
                <Sel value={form.type} onChange={v => set('type', v as PromotionType)} options={typeOptions} />
              </Row>
              <Row label="活动描述">
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="活动描述，将展示给运营人员..." rows={3}
                  className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1.5 text-[11px] text-idpxyz-text outline-none focus:border-idpxyz-accent placeholder:text-idpxyz-textMuted resize-none" />
              </Row>
            </div>
          )}

          {/* 2. 活动规则 (dynamic by type) */}
          {(() => {
            const th = typeHintMap[form.type];
            const TypeIcon = th.icon;
            return (
              <>
                <SectionHead id="typeRules" icon={TypeIcon} label={`活动规则 — ${promotionTypeConfig[form.type].label}`} expanded={isOpen('typeRules')} toggle={() => tog('typeRules')} status={ss('typeRules')} />
                {isOpen('typeRules') && (
                  <div className="px-4 py-3 border-b border-idpxyz-border space-y-1">
                    {/* Type hint banner */}
                    <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded bg-idpxyz-accent/8 text-[10px] text-idpxyz-accent">
                      <TypeIcon size={12} />
                      <span>{th.hint}</span>
                    </div>

                    {/* ── flash_sale ── */}
                    {form.type === 'flash_sale' && (
                      <>
                        <Row label="秒杀商品" required hint="选择参与秒杀的商品">
                          <ProductPicker selectedId={form.flashProductId} selectedName={form.flashProductName} icon={IconTimer} placeholder="点击选择秒杀商品..." onSelect={(id, name) => { set('flashProductId', id); set('flashProductName', name); }} onClear={() => { set('flashProductId', ''); set('flashProductName', ''); }} />
                        </Row>
                        <Row label="秒杀价" required hint="活动期间的商品售价">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">$</span>
                            <Inp value={form.flashSalePrice} onChange={v => set('flashSalePrice', v)} placeholder="299" className="w-[120px]" />
                          </div>
                        </Row>
                        <Row label="限量" required hint="秒杀库存总数">
                          <Inp value={form.flashStockLimit} onChange={v => set('flashStockLimit', v)} placeholder="100" className="w-[100px]" />
                        </Row>
                        <Row label="每人限购" hint="每位用户最多购买数量">
                          <Inp value={form.flashPerUserLimit} onChange={v => set('flashPerUserLimit', v)} placeholder="1" className="w-[80px]" />
                        </Row>
                      </>
                    )}

                    {/* ── bundle ── */}
                    {form.type === 'bundle' && (
                      <>
                        <Row label="捆绑商品" required hint="选择组合中的商品">
                          <div className="space-y-1.5">
                            {form.bundleItems.map((bi, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <div className="flex-1">
                                  <ProductPicker selectedId={bi.productId} selectedName={bi.productName} icon={IconPackage} placeholder="点击选择商品..."
                                    onSelect={(id, name) => { const items = [...form.bundleItems]; items[idx] = { ...items[idx], productId: id, productName: name }; set('bundleItems', items); }}
                                    onClear={() => { const items = [...form.bundleItems]; items[idx] = { ...items[idx], productId: '', productName: '' }; set('bundleItems', items); }} />
                                </div>
                                <span className="text-[10px] text-idpxyz-textMuted">×</span>
                                <Inp value={bi.qty} onChange={v => {
                                  const items = [...form.bundleItems]; items[idx] = { ...items[idx], qty: v }; set('bundleItems', items);
                                }} placeholder="1" className="w-[50px]" />
                                {form.bundleItems.length > 1 && (
                                  <button onClick={() => set('bundleItems', form.bundleItems.filter((_, i) => i !== idx))} className="text-idpxyz-textMuted hover:text-red-400"><IconTrash size={11} /></button>
                                )}
                              </div>
                            ))}
                            <button onClick={() => set('bundleItems', [...form.bundleItems, { productId: '', productName: '', qty: '1' }])}
                              className="flex items-center gap-1 text-[10px] text-idpxyz-accent hover:underline"><IconPlus size={10} /> 添加商品</button>
                          </div>
                        </Row>
                        <Row label="组合原价" hint="各商品原价合计（自动计算或手动输入）">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">$</span>
                            <Inp value={form.bundleOriginalTotal} onChange={v => set('bundleOriginalTotal', v)} placeholder="自动" className="w-[100px]" />
                          </div>
                        </Row>
                        <Row label="组合价" required hint="打包后的优惠价格">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">$</span>
                            <Inp value={form.bundlePrice} onChange={v => set('bundlePrice', v)} placeholder="199" className="w-[100px]" />
                            {form.bundleOriginalTotal && form.bundlePrice && (
                              <span className="text-[9px] text-green-400 ml-1">
                                省 ${(Number(form.bundleOriginalTotal) - Number(form.bundlePrice)).toFixed(0)} ({((1 - Number(form.bundlePrice) / Number(form.bundleOriginalTotal)) * 100).toFixed(0)}% OFF)
                              </span>
                            )}
                          </div>
                        </Row>
                      </>
                    )}

                    {/* ── buy_x_get_y ── */}
                    {form.type === 'buy_x_get_y' && (
                      <>
                        <Row label="购买数量" required hint="买满 IconClose 件">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">买</span>
                            <Inp value={form.buyQty} onChange={v => set('buyQty', v)} placeholder="2" className="w-[60px]" />
                            <span className="text-[10px] text-idpxyz-textMuted">件</span>
                          </div>
                        </Row>
                        <Row label="赠送数量" required hint="送 Y 件">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">送</span>
                            <Inp value={form.getQty} onChange={v => set('getQty', v)} placeholder="1" className="w-[60px]" />
                            <span className="text-[10px] text-idpxyz-textMuted">件</span>
                          </div>
                        </Row>
                        <Row label="赠品" hint="不填则赠送同款商品">
                          <ProductPicker selectedId={form.giftProductId} selectedName={form.giftProductName} icon={IconGift} placeholder="点击选择赠品... (留空赠同款)" onSelect={(id, name) => { set('giftProductId', id); set('giftProductName', name); }} onClear={() => { set('giftProductId', ''); set('giftProductName', ''); }} />
                        </Row>
                      </>
                    )}

                    {/* ── percentage_off ── */}
                    {form.type === 'percentage_off' && (
                      <>
                        <Row label="使用阶梯">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-idpxyz-text">
                            <input type="checkbox" checked={form.usePctTiers} onChange={e => set('usePctTiers', e.target.checked)} className="accent-[var(--idpxyz-accent)]" />
                            启用阶梯折扣（按消费金额递增折扣力度）
                          </label>
                        </Row>
                        {!form.usePctTiers ? (
                          <>
                            <Row label="折扣百分比" required>
                              <div className="flex items-center gap-1.5">
                                <Inp value={form.discountPct} onChange={v => set('discountPct', v)} placeholder="20" className="w-[80px]" />
                                <span className="text-[10px] text-idpxyz-textMuted">% OFF</span>
                              </div>
                            </Row>
                            <Row label="最低消费" hint="达到此金额才可享受">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-idpxyz-textMuted">$</span>
                                <Inp value={form.minOrderAmount} onChange={v => set('minOrderAmount', v)} placeholder="0" className="w-[100px]" />
                              </div>
                            </Row>
                            <Row label="最高优惠" hint="封顶优惠金额">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-idpxyz-textMuted">$</span>
                                <Inp value={form.maxDiscountAmount} onChange={v => set('maxDiscountAmount', v)} placeholder="100" className="w-[100px]" />
                              </div>
                            </Row>
                          </>
                        ) : (
                          <Row label="阶梯折扣" required hint="满不同金额享受不同折扣">
                            <TierEditor tiers={form.pctTiers} onChange={v => set('pctTiers', v)} thLabel="满" valLabel="折扣 %" thPlaceholder="100" valPlaceholder="10" />
                          </Row>
                        )}
                      </>
                    )}

                    {/* ── fixed_off ── */}
                    {form.type === 'fixed_off' && (
                      <Row label="满减阶梯" required hint="可设置多级满减">
                        <TierEditor tiers={form.fixedTiers} onChange={v => set('fixedTiers', v)} thLabel="满 $" valLabel="减 $" thPlaceholder="100" valPlaceholder="10" />
                      </Row>
                    )}

                    {/* ── free_shipping ── */}
                    {form.type === 'free_shipping' && (
                      <>
                        <Row label="最低消费" hint="满此金额免运费，0 = 无条件">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-idpxyz-textMuted">$</span>
                            <Inp value={form.freeShipMinAmount} onChange={v => set('freeShipMinAmount', v)} placeholder="0" className="w-[100px]" />
                          </div>
                        </Row>
                        <Row label="最大重量" hint="包裹重量不超过此值，0 = 不限">
                          <div className="flex items-center gap-1.5">
                            <Inp value={form.freeShipMaxWeight} onChange={v => set('freeShipMaxWeight', v)} placeholder="0" className="w-[80px]" />
                            <span className="text-[10px] text-idpxyz-textMuted">kg</span>
                          </div>
                        </Row>
                        <Row label="适用区域" hint="选择免运费覆盖区域">
                          <div className="flex flex-wrap gap-1">
                            {['全国', '华东', '华南', '华北', '西南', '东北', '港澳台', '海外'].map(r => {
                              const on = form.freeShipRegions.includes(r);
                              return (
                                <button key={r} type="button" onClick={() => {
                                  if (r === '全国') { set('freeShipRegions', ['全国']); return; }
                                  const cur = form.freeShipRegions.filter(x => x !== '全国');
                                  const next = cur.includes(r) ? cur.filter(x => x !== r) : [...cur, r];
                                  set('freeShipRegions', next.length === 0 ? ['全国'] : next);
                                }}
                                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${on ? 'border-idpxyz-accent bg-idpxyz-accent/15 text-idpxyz-accent' : 'border-idpxyz-border text-idpxyz-textMuted hover:bg-idpxyz-hover'}`}>
                                  {on && <IconCheck size={8} className="inline mr-0.5" />}{r}
                                </button>
                              );
                            })}
                          </div>
                        </Row>
                      </>
                    )}
                  </div>
                )}
              </>
            );
          })()}

          {/* 3. 适用范围 — hidden for flash_sale & bundle (products already defined in type rules) */}
          {form.type !== 'flash_sale' && form.type !== 'bundle' && (
            <>
          <SectionHead id="scope" icon={IconTarget} label={form.type === 'buy_x_get_y' ? '参与商品范围' : '适用范围'} expanded={isOpen('scope')} toggle={() => tog('scope')} status={ss('scope')} />
          {isOpen('scope') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-2">
              {form.type === 'buy_x_get_y' && (
                <div className="flex items-center gap-2 px-3 py-1.5 mb-1 rounded bg-yellow-400/8 text-[10px] text-yellow-400">
                  <IconAlertCircle size={11} />
                  <span>选择哪些商品参与「买 {form.buyQty} 送 {form.getQty}」活动</span>
                </div>
              )}
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
                          {'path' in item && <span className="text-[9px] text-idpxyz-textMuted ml-auto">{(item as { path: string }).path}</span>}
                          {'brand' in item && <span className="text-[9px] text-idpxyz-textMuted ml-auto">{(item as { brand: string }).brand}</span>}
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
            </>
          )}

          {/* 4. 活动时间 */}
          <SectionHead id="time" icon={IconCalendar} label="活动时间" expanded={isOpen('time')} toggle={() => tog('time')} status={ss('time')} />
          {isOpen('time') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="开始时间" required>
                <div className="flex items-center gap-1.5">
                  <Inp value={form.startDate} onChange={v => set('startDate', v)} placeholder="2025-03-15" type="date" className="w-[140px]" />
                  <Inp value={form.startTime} onChange={v => set('startTime', v)} placeholder="00:00" type="time" className="w-[100px]" />
                </div>
              </Row>
              <Row label="结束时间" required>
                <div className="flex items-center gap-1.5">
                  <Inp value={form.endDate} onChange={v => set('endDate', v)} placeholder="2025-03-31" type="date" className="w-[140px]" />
                  <Inp value={form.endTime} onChange={v => set('endTime', v)} placeholder="23:59" type="time" className="w-[100px]" />
                </div>
              </Row>
              {form.startDate && form.endDate && (
                <div className="pt-1 pl-[112px] text-[10px] text-idpxyz-textMuted">
                  活动时长: {Math.max(0, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / (1000 * 60 * 60 * 24)))} 天
                </div>
              )}
            </div>
          )}

          {/* 5. 高级规则 */}
          <SectionHead id="rules" icon={IconSettings} label="高级规则" expanded={isOpen('rules')} toggle={() => tog('rules')} status={ss('rules')} />
          {isOpen('rules') && (
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-0.5">
              <Row label="使用上限" hint="0 = 不限">
                <Inp value={form.usageLimit} onChange={v => set('usageLimit', v)} placeholder="0" className="w-[100px]" />
              </Row>
              <Row label="活动预算" required hint="总预算金额">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-idpxyz-textMuted">$</span>
                  <Inp value={form.budget} onChange={v => set('budget', v)} placeholder="50000" className="w-[120px]" />
                </div>
              </Row>
              <Row label="优先级" hint="数字越小越优先">
                <Inp value={form.priority} onChange={v => set('priority', v)} placeholder="10" className="w-[80px]" />
              </Row>
              <Row label="可叠加">
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-idpxyz-text">
                  <input type="checkbox" checked={form.stackable} onChange={e => set('stackable', e.target.checked)} className="accent-[var(--idpxyz-accent)]" />
                  允许与其他促销活动叠加使用
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
