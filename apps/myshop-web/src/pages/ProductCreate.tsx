import { useState, useRef, useCallback } from 'react';
import {
  IconSave,
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconTrash,
  IconPackage,
  IconTag,
  IconFolderTree,
  IconDollar,
  IconImage,
  IconFileText,
  IconShipment,
  IconAlertCircle,
  IconChevronRight,
  IconChevronDown,
  IconClose,
  IconSearch,
  IconListFilter,
  IconLayers,
  IconMoreH,
  IconStore,
  IconWarehouse,
  IconGlobal,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  productCategories,
  type ProductCategory,
  type CategoryAttribute,
  channels as allChannels,
  channelStores as allStores,
} from '../data/oms';

// ── Section definitions ──
const sectionDefs = [
  { id: 'basic', label: '基本信息', icon: IconPackage },
  { id: 'catAttrs', label: '分类属性', icon: IconListFilter },
  { id: 'pricing', label: '价格与成本', icon: IconDollar },
  { id: 'variations', label: '变体 / SKU', icon: IconLayers },
  { id: 'images', label: '商品图片', icon: IconImage },
  { id: 'description', label: '商品描述', icon: IconFileText },
  { id: 'logistics', label: '物流与仓储', icon: IconShipment },
  { id: 'channels', label: '渠道分发', icon: IconStore },
] as const;
type SectionId = (typeof sectionDefs)[number]['id'];

// ── SKU row ──
interface SkuRow {
  id: string;
  combo: Record<string, string>;
  skuCode: string;
  costPrice: string;
  basePrice: string;
  qty: string;
  warehouse: string;
  barcode: string;
}

// ── Channel publish config per store ──
interface ChannelPublish {
  storeId: string;
  enabled: boolean;
  priceOverride: string; // empty = use base price
  titleOverride: string;
}

// ── Form state ──
interface FormData {
  // Basic
  name: string;
  brand: string;
  categoryId: string;
  spuCode: string;
  tags: string[];
  // Category attrs
  catAttrs: Record<string, string>;
  // Pricing
  basePrice: string;
  costPrice: string;
  currency: string;
  // Variations
  hasVariations: boolean;
  dims: { name: string; values: string[] }[];
  skus: SkuRow[];
  // Single product (no variations)
  singleQty: string;
  singleSkuCode: string;
  singleWarehouse: string;
  singleBarcode: string;
  // Images
  mainImage: string;
  gallery: string[];
  // Description
  bullets: string[];
  desc: string;
  // Logistics
  weight: string;
  weightUnit: string;
  pLength: string;
  pWidth: string;
  pHeight: string;
  dimUnit: string;
  fragile: boolean;
  hazmat: boolean;
  defaultWarehouse: string;
  // Channels
  channelPublish: ChannelPublish[];
}

const init: FormData = {
  name: '', brand: '', categoryId: '', spuCode: '', tags: [],
  catAttrs: {},
  basePrice: '', costPrice: '', currency: 'USD',
  hasVariations: false, dims: [], skus: [],
  singleQty: '', singleSkuCode: '', singleWarehouse: '华东仓', singleBarcode: '',
  mainImage: '', gallery: [],
  bullets: ['', '', '', '', ''], desc: '',
  weight: '', weightUnit: 'g', pLength: '', pWidth: '', pHeight: '', dimUnit: 'cm',
  fragile: false, hazmat: false, defaultWarehouse: '华东仓',
  channelPublish: [],
};

// ── Tiny field components (match system density) ──
function Row({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="w-[100px] shrink-0 pt-0.5">
        <span className="text-[11px] text-vscode-textMuted">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</span>
        {hint && <div className="text-[9px] text-vscode-textMuted/70 mt-0.5 leading-tight">{hint}</div>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function Inp({ value, onChange, placeholder, className = '', mono }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string; mono?: boolean;
}) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1 text-[11px] text-vscode-text outline-none focus:border-vscode-accent placeholder:text-vscode-textMuted w-full ${mono ? 'font-mono' : ''} ${className}`} />
  );
}

function Sel({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; placeholder?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1 text-[11px] text-vscode-text outline-none focus:border-vscode-accent w-full">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );
}

// ── Category attribute field ──
function CatAttrField({ attr, value, onChange }: { attr: CategoryAttribute; value: string; onChange: (v: string) => void }) {
  if (attr.type === '布尔') {
    return (
      <div className="flex items-center gap-3">
        {['是', '否'].map(o => (
          <label key={o} className="flex items-center gap-1 cursor-pointer text-[11px] text-vscode-text">
            <input type="radio" name={`ca-${attr.name}`} checked={value === o} onChange={() => onChange(o)} className="accent-[var(--vscode-accent)]" />{o}
          </label>
        ))}
      </div>
    );
  }
  if (attr.type === '多选' && attr.options) {
    const sel = value ? value.split(',').filter(Boolean) : [];
    return (
      <div className="flex flex-wrap gap-1">
        {attr.options.map(o => {
          const on = sel.includes(o);
          return (
            <button key={o} type="button" onClick={() => { const n = on ? sel.filter(s => s !== o) : [...sel, o]; onChange(n.join(',')); }}
              className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${on ? 'border-vscode-accent bg-vscode-accent/15 text-vscode-accent' : 'border-vscode-border text-vscode-textMuted hover:bg-vscode-hover'}`}>
              {on && <IconCheck size={8} className="inline mr-0.5" />}{o}
            </button>
          );
        })}
      </div>
    );
  }
  if (attr.type === '单选' && attr.options) {
    return <Sel value={value} onChange={onChange} options={attr.options.map(o => ({ v: o, l: o }))} placeholder={`选择${attr.name}`} />;
  }
  return <Inp value={value} onChange={onChange} placeholder={`输入${attr.name}`} />;
}

// ── Collapsible section header ──
function SectionHead({ id, icon: Icon, label, expanded, toggle, status }: {
  id: string; icon: React.ElementType; label: string; expanded: boolean; toggle: () => void; status?: 'ok' | 'warn';
}) {
  return (
    <button id={`sec-${id}`}
      onClick={toggle}
      className="w-full flex items-center gap-2 px-4 h-[32px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb border-b border-vscode-border bg-vscode-sidebar hover:bg-vscode-hover transition-colors shrink-0"
    >
      {expanded ? <IconChevronDown size={11} /> : <IconChevronRight size={11} />}
      <Icon size={12} className="text-vscode-accent" />
      <span className="font-bold">{label}</span>
      {status === 'ok' && <IconCheck size={10} className="text-green-400 ml-auto" />}
      {status === 'warn' && <IconAlertCircle size={10} className="text-yellow-400 ml-auto" />}
    </button>
  );
}

// ══════════════════════════════════════
// Main Component
// ══════════════════════════════════════
interface ProductCreateProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
  onBack?: () => void;
}

export default function ProductCreate({ onOpenTab, onBack }: ProductCreateProps) {
  const [form, setForm] = useState<FormData>({ ...init });
  const [tagInput, setTagInput] = useState('');
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set(['basic', 'pricing', 'variations']));
  const scrollRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => setForm(p => ({ ...p, [k]: v })), []);
  const tog = (id: SectionId) => setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const isOpen = (id: SectionId) => expanded.has(id);

  const cat = productCategories.find(c => c.id === form.categoryId);

  // Category selection
  const selectCat = useCallback((id: string) => {
    set('categoryId', id);
    const c = productCategories.find(x => x.id === id);
    if (c) {
      const vals: Record<string, string> = {};
      c.attributes.forEach(a => { vals[a.name] = ''; });
      set('catAttrs', vals);
      setExpanded(p => new Set([...p, 'catAttrs']));
    }
  }, [set]);

  const setCatAttr = (name: string, val: string) => set('catAttrs', { ...form.catAttrs, [name]: val });

  // Variations
  const addDim = () => set('dims', [...form.dims, { name: '', values: [''] }]);
  const rmDim = (i: number) => set('dims', form.dims.filter((_, x) => x !== i));
  const setDimName = (i: number, v: string) => { const d = [...form.dims]; d[i] = { ...d[i], name: v }; set('dims', d); };
  const setDimVals = (i: number, vals: string[]) => { const d = [...form.dims]; d[i] = { ...d[i], values: vals }; set('dims', d); };

  const genSkus = () => {
    const ds = form.dims.filter(d => d.name && d.values.some(Boolean));
    if (!ds.length) { set('skus', []); return; }
    let combos: Record<string, string>[] = [{}];
    for (const d of ds) {
      const next: Record<string, string>[] = [];
      for (const c of combos) for (const v of d.values.filter(Boolean)) next.push({ ...c, [d.name]: v });
      combos = next;
    }
    set('skus', combos.map((c, i) => ({
      id: `s${Date.now()}-${i}`, combo: c, skuCode: '', costPrice: form.costPrice, basePrice: form.basePrice, qty: '', warehouse: form.defaultWarehouse, barcode: '',
    })));
  };

  const updSku = (i: number, f: keyof SkuRow, v: string) => { const s = [...form.skus]; s[i] = { ...s[i], [f]: v }; set('skus', s); };

  // Tags
  const addTag = () => { const t = tagInput.trim(); if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]); setTagInput(''); };
  const setBullet = (i: number, v: string) => { const b = [...form.bullets]; b[i] = v; set('bullets', b); };

  // Channel publish
  const initChannels = () => {
    if (form.channelPublish.length > 0) return;
    set('channelPublish', allStores.filter(s => s.status === 'active').map(s => ({
      storeId: s.id, enabled: false, priceOverride: '', titleOverride: '',
    })));
  };

  const toggleChannelStore = (storeId: string) => {
    set('channelPublish', form.channelPublish.map(cp =>
      cp.storeId === storeId ? { ...cp, enabled: !cp.enabled } : cp
    ));
  };

  const updateChannelPublish = (storeId: string, field: 'priceOverride' | 'titleOverride', val: string) => {
    set('channelPublish', form.channelPublish.map(cp =>
      cp.storeId === storeId ? { ...cp, [field]: val } : cp
    ));
  };

  // Section status
  const ss = (id: SectionId): 'ok' | 'warn' | undefined => {
    switch (id) {
      case 'basic': return form.name && form.brand && form.categoryId ? 'ok' : (form.name || form.brand) ? 'warn' : undefined;
      case 'catAttrs': {
        if (!cat || !cat.attributes.length) return 'ok';
        return cat.attributes.filter(a => a.required).every(a => !!form.catAttrs[a.name]) ? 'ok' : 'warn';
      }
      case 'pricing': return form.basePrice && form.costPrice ? 'ok' : form.basePrice ? 'warn' : undefined;
      case 'variations': return form.hasVariations ? (form.skus.length > 0 ? 'ok' : 'warn') : (form.singleQty ? 'ok' : undefined);
      case 'images': return undefined;
      case 'description': return form.bullets.some(Boolean) || form.desc ? 'ok' : undefined;
      case 'logistics': return form.weight ? 'ok' : undefined;
      case 'channels': return form.channelPublish.some(c => c.enabled) ? 'ok' : undefined;
    }
  };

  const scrollTo = (id: SectionId) => {
    if (!expanded.has(id)) setExpanded(p => new Set([...p, id]));
    if (id === 'channels') initChannels();
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  // Category tree
  const [catSearch, setCatSearch] = useState('');
  const [catExpanded, setCatExpanded] = useState<Set<string>>(() => new Set(productCategories.filter(c => c.level === 0).map(c => c.id)));
  const activeCats = productCategories.filter(c => c.status === 'active');
  const catToggle = (id: string) => setCatExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const renderCatNode = (c: ProductCategory, depth: number): React.ReactNode => {
    const ch = activeCats.filter(x => x.parentId === c.id);
    const isE = catExpanded.has(c.id);
    const isSel = form.categoryId === c.id;
    return (
      <div key={c.id}>
        <div
          className={`flex items-center gap-1 py-1 pr-3 cursor-pointer text-[11px] transition-colors ${isSel ? 'bg-vscode-accent/15 text-vscode-accent font-medium' : 'hover:bg-vscode-hover text-vscode-text'}`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onClick={() => selectCat(c.id)}
        >
          {ch.length > 0 ? (
            <span className="w-3 h-3 flex items-center justify-center shrink-0" onClick={e => { e.stopPropagation(); catToggle(c.id); }}>
              {isE ? <IconChevronDown size={10} /> : <IconChevronRight size={10} />}
            </span>
          ) : <span className="w-3" />}
          <span className="text-[12px]">{c.image}</span>
          <span className="truncate">{c.name}</span>
          {isSel && <IconCheck size={10} className="ml-auto shrink-0" />}
        </div>
        {isE && !catSearch && ch.sort((a, b) => a.sortOrder - b.sortOrder).map(x => renderCatNode(x, depth + 1))}
      </div>
    );
  };

  const warehouseOpts = [
    { v: '华东仓', l: '华东仓' }, { v: '华西仓', l: '华西仓' }, { v: '华南仓', l: '华南仓' },
    { v: '欧洲仓', l: '欧洲仓' }, { v: '北美仓', l: '北美仓' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          {onBack && <button onClick={onBack} className="text-vscode-textMuted hover:text-vscode-text"><IconArrowLeft size={14} /></button>}
          <IconPackage size={15} className="text-vscode-accent" />
          <h1 className="text-[14px] font-semibold text-vscode-textBright">添加商品</h1>
          {form.name && <span className="text-[11px] text-vscode-textMuted truncate max-w-[200px]">— {form.name}</span>}
          {cat && <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted">{cat.name}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-vscode-textMuted mr-1">
            {sectionDefs.filter(s => ss(s.id) === 'ok').length}/{sectionDefs.length}
          </span>
          <div className="w-px h-4 bg-vscode-border mx-1" />
          <Button variant="ghost" size="sm"><IconSave size={12} /> 保存草稿</Button>
          <Button variant="default" size="sm"><IconCheck size={12} /> 提交审核</Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left nav */}
        <div className="w-[190px] border-r border-vscode-border bg-vscode-sidebar flex flex-col overflow-auto shrink-0">
          <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0 border-b border-vscode-border">
            <span>表单区块</span>
            <IconMoreH size={14} className="text-vscode-textMuted" />
          </div>
          {sectionDefs.map(s => {
            const st = ss(s.id);
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => scrollTo(s.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-[11px] text-left border-b border-vscode-border transition-colors hover:bg-vscode-hover ${expanded.has(s.id) ? 'text-vscode-text' : 'text-vscode-textMuted'}`}>
                <Icon size={11} className={st === 'ok' ? 'text-green-400' : st === 'warn' ? 'text-yellow-400' : 'text-vscode-textMuted'} />
                <span className="flex-1 truncate">{s.label}</span>
                {st === 'ok' && <IconCheck size={9} className="text-green-400 shrink-0" />}
                {st === 'warn' && <IconAlertCircle size={9} className="text-yellow-400 shrink-0" />}
              </button>
            );
          })}
          <div className="mt-auto px-4 py-3 border-t border-vscode-border">
            <div className="flex gap-1 mb-1.5">
              {sectionDefs.map(s => <div key={s.id} className={`flex-1 h-1.5 rounded-full ${ss(s.id) === 'ok' ? 'bg-green-400' : ss(s.id) === 'warn' ? 'bg-yellow-400' : 'bg-vscode-border'}`} />)}
            </div>
            <div className="text-[10px] text-vscode-textMuted">{sectionDefs.filter(s => ss(s.id) === 'ok').length}/{sectionDefs.length} 区块完成</div>
          </div>
        </div>

        {/* Form area */}
        <div ref={scrollRef} className="flex-1 overflow-auto">

          {/* ═══ 1. 基本信息 ═══ */}
          <SectionHead id="basic" icon={IconPackage} label="基本信息" expanded={isOpen('basic')} toggle={() => tog('basic')} status={ss('basic')} />
          {isOpen('basic') && (
            <div className="px-4 py-3 border-b border-vscode-border space-y-0.5">
              <Row label="商品名称" required>
                <div>
                  <Inp value={form.name} onChange={v => set('name', v)} placeholder="商品标题，建议包含品牌+品名+核心卖点" />
                  <div className="text-[9px] text-vscode-textMuted text-right mt-0.5">{form.name.length}/120</div>
                </div>
              </Row>
              <Row label="品牌" required>
                <Inp value={form.brand} onChange={v => set('brand', v)} placeholder="品牌名称" />
              </Row>
              <Row label="SPU 编码" hint="内部编码，可自动生成">
                <Inp value={form.spuCode} onChange={v => set('spuCode', v)} placeholder="留空则自动生成" mono />
              </Row>
              <Row label="商品分类" required>
                <div>
                  {cat && (
                    <div className="flex items-center gap-2 p-2 mb-2 rounded border border-vscode-accent/30 bg-vscode-accent/5 text-[11px]">
                      <span>{cat.image}</span>
                      <span className="text-vscode-textBright font-medium">{cat.name}</span>
                      <span className="text-vscode-textMuted text-[10px]">{cat.path}</span>
                      <span className="text-vscode-accent text-[10px] ml-auto">佣金 {cat.commissionRate}%</span>
                      <button onClick={() => { set('categoryId', ''); set('catAttrs', {}); }} className="text-vscode-textMuted hover:text-red-400"><IconClose size={11} /></button>
                    </div>
                  )}
                  <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[26px] border border-vscode-border mb-2">
                    <IconSearch size={11} className="text-vscode-textMuted mr-1.5 shrink-0" />
                    <input type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="搜索分类..."
                      className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted" />
                    {catSearch && <IconClose size={10} className="text-vscode-textMuted cursor-pointer shrink-0" onClick={() => setCatSearch('')} />}
                  </div>
                  <div className="border border-vscode-border rounded max-h-[180px] overflow-auto">
                    {(catSearch
                      ? activeCats.filter(c => c.name.includes(catSearch) || c.path.includes(catSearch))
                      : activeCats.filter(c => !c.parentId).sort((a, b) => a.sortOrder - b.sortOrder)
                    ).map(c => renderCatNode(c, 0))}
                  </div>
                </div>
              </Row>
              <Row label="标签" hint="按 Enter 添加">
                <div>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                      placeholder="输入标签"
                      className="flex-1 bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1 text-[11px] text-vscode-text outline-none focus:border-vscode-accent placeholder:text-vscode-textMuted" />
                    <button onClick={addTag} className="text-vscode-textMuted hover:text-vscode-accent"><IconPlus size={12} /></button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {form.tags.map(t => (
                        <span key={t} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-vscode-hover text-[10px] text-vscode-text">
                          <IconTag size={8} className="text-vscode-accent" />{t}
                          <IconClose size={8} className="cursor-pointer text-vscode-textMuted hover:text-red-400" onClick={() => set('tags', form.tags.filter(x => x !== t))} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Row>
            </div>
          )}

          {/* ═══ 2. 分类属性 ═══ */}
          <SectionHead id="catAttrs" icon={IconListFilter} label="分类属性" expanded={isOpen('catAttrs')} toggle={() => tog('catAttrs')} status={ss('catAttrs')} />
          {isOpen('catAttrs') && (
            <div className="px-4 py-3 border-b border-vscode-border">
              {!cat ? (
                <div className="text-[11px] text-vscode-textMuted py-2">请先在基本信息中选择商品分类</div>
              ) : cat.attributes.length === 0 ? (
                <div className="text-[11px] text-vscode-text py-2 flex items-center gap-1.5"><IconCheck size={11} className="text-green-400" /> 此分类无额外属性要求</div>
              ) : (
                <div className="space-y-0.5">
                  {cat.attributes.map((attr, i) => (
                    <Row key={i} label={attr.name} required={attr.required} hint={attr.type}>
                      <CatAttrField attr={attr} value={form.catAttrs[attr.name] || ''} onChange={v => setCatAttr(attr.name, v)} />
                    </Row>
                  ))}
                  <div className="pt-2 text-[10px] text-vscode-textMuted flex items-center gap-2">
                    已填 {cat.attributes.filter(a => !!form.catAttrs[a.name]).length}/{cat.attributes.length}
                    {cat.attributes.filter(a => a.required).every(a => !!form.catAttrs[a.name])
                      ? <span className="text-green-400 flex items-center gap-0.5"><IconCheck size={9} /> 必填完成</span>
                      : <span className="text-yellow-400 flex items-center gap-0.5"><IconAlertCircle size={9} /> 有必填未完成</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ 3. 价格与成本 ═══ */}
          <SectionHead id="pricing" icon={IconDollar} label="价格与成本" expanded={isOpen('pricing')} toggle={() => tog('pricing')} status={ss('pricing')} />
          {isOpen('pricing') && (
            <div className="px-4 py-3 border-b border-vscode-border space-y-0.5">
              <Row label="币种" required>
                <Sel value={form.currency} onChange={v => set('currency', v)} options={[
                  { v: 'USD', l: 'USD - 美元' }, { v: 'EUR', l: 'EUR - 欧元' }, { v: 'GBP', l: 'GBP - 英镑' },
                  { v: 'CNY', l: 'CNY - 人民币' }, { v: 'JPY', l: 'JPY - 日元' },
                ]} />
              </Row>
              <Row label="基准售价" required hint="统一售价，各渠道可覆盖">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-vscode-textMuted w-7">{form.currency}</span>
                  <Inp value={form.basePrice} onChange={v => set('basePrice', v)} placeholder="0.00" />
                </div>
              </Row>
              <Row label="成本价" required hint="用于利润核算">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-vscode-textMuted w-7">{form.currency}</span>
                  <Inp value={form.costPrice} onChange={v => set('costPrice', v)} placeholder="0.00" />
                </div>
              </Row>
              {form.basePrice && form.costPrice && parseFloat(form.basePrice) > 0 && (
                <div className="pt-1.5 pl-[112px]">
                  <div className="text-[10px] text-vscode-textMuted flex items-center gap-3">
                    <span>毛利 <span className="text-vscode-textBright font-medium">{form.currency} {(parseFloat(form.basePrice) - parseFloat(form.costPrice)).toFixed(2)}</span></span>
                    <span>毛利率 <span className={`font-medium ${((parseFloat(form.basePrice) - parseFloat(form.costPrice)) / parseFloat(form.basePrice)) > 0.3 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(((parseFloat(form.basePrice) - parseFloat(form.costPrice)) / parseFloat(form.basePrice)) * 100).toFixed(1)}%
                    </span></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ 4. 变体 / SKU ═══ */}
          <SectionHead id="variations" icon={IconLayers} label="变体 / SKU" expanded={isOpen('variations')} toggle={() => tog('variations')} status={ss('variations')} />
          {isOpen('variations') && (
            <div className="px-4 py-3 border-b border-vscode-border">
              <Row label="有变体？">
                <div className="flex items-center gap-4 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={!form.hasVariations} onChange={() => { set('hasVariations', false); set('skus', []); set('dims', []); }} className="accent-[var(--vscode-accent)]" />
                    <span className="text-vscode-text">否，单一商品</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={form.hasVariations} onChange={() => set('hasVariations', true)} className="accent-[var(--vscode-accent)]" />
                    <span className="text-vscode-text">是，多变体</span>
                  </label>
                </div>
              </Row>

              {!form.hasVariations ? (
                <div className="space-y-0.5 mt-1">
                  <Row label="SKU 编码">
                    <Inp value={form.singleSkuCode} onChange={v => set('singleSkuCode', v)} placeholder="SKU-001" mono />
                  </Row>
                  <Row label="库存数量" required>
                    <Inp value={form.singleQty} onChange={v => set('singleQty', v)} placeholder="0" className="w-[100px]" />
                  </Row>
                  <Row label="仓库">
                    <Sel value={form.singleWarehouse} onChange={v => set('singleWarehouse', v)} options={warehouseOpts} />
                  </Row>
                  <Row label="条码">
                    <Inp value={form.singleBarcode} onChange={v => set('singleBarcode', v)} placeholder="EAN/UPC" mono />
                  </Row>
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-vscode-text font-medium">变体维度</span>
                    <button onClick={addDim} className="text-[10px] text-vscode-accent hover:underline flex items-center gap-0.5"><IconPlus size={10} /> 添加维度</button>
                  </div>
                  {form.dims.length === 0 && (
                    <div className="text-[10px] text-vscode-textMuted border border-dashed border-vscode-border rounded p-3 text-center">添加变体维度（如颜色、尺码、容量）</div>
                  )}
                  {form.dims.map((dim, di) => (
                    <div key={di} className="border border-vscode-border rounded p-2.5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Inp value={dim.name} onChange={v => setDimName(di, v)} placeholder="维度名（如：颜色）" className="w-[130px]" />
                        <button onClick={() => rmDim(di)} className="text-vscode-textMuted hover:text-red-400"><IconTrash size={11} /></button>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center">
                        {dim.values.map((v, vi) => (
                          <div key={vi} className="flex items-center gap-0.5">
                            <input type="text" value={v} onChange={e => { const vs = [...dim.values]; vs[vi] = e.target.value; setDimVals(di, vs); }}
                              placeholder="值" className="w-[80px] bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent" />
                            {dim.values.length > 1 && <IconClose size={8} className="cursor-pointer text-vscode-textMuted hover:text-red-400" onClick={() => setDimVals(di, dim.values.filter((_, i) => i !== vi))} />}
                          </div>
                        ))}
                        <button onClick={() => setDimVals(di, [...dim.values, ''])} className="text-[9px] text-vscode-accent">+ 值</button>
                      </div>
                    </div>
                  ))}
                  {form.dims.length > 0 && (
                    <button onClick={genSkus} className="text-[10px] text-vscode-accent hover:underline flex items-center gap-1"><IconLayers size={10} /> 生成 SKU 矩阵</button>
                  )}

                  {form.skus.length > 0 && (
                    <div className="mt-2">
                      <div className="text-[11px] text-vscode-text font-medium mb-1">SKU 矩阵 ({form.skus.length})</div>
                      <div className="border border-vscode-border rounded overflow-x-auto">
                        <table className="w-full text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-vscode-sidebar text-vscode-textMuted">
                              {form.dims.filter(d => d.name).map(d => <th key={d.name} className="px-2 py-1 text-left font-medium border-b border-vscode-border">{d.name}</th>)}
                              <th className="px-2 py-1 text-left font-medium border-b border-vscode-border">SKU 编码</th>
                              <th className="px-2 py-1 text-right font-medium border-b border-vscode-border w-[70px]">成本*</th>
                              <th className="px-2 py-1 text-right font-medium border-b border-vscode-border w-[70px]">售价*</th>
                              <th className="px-2 py-1 text-right font-medium border-b border-vscode-border w-[60px]">库存*</th>
                              <th className="px-2 py-1 text-left font-medium border-b border-vscode-border w-[80px]">仓库</th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.skus.map((sku, si) => (
                              <tr key={sku.id} className="hover:bg-vscode-hover">
                                {form.dims.filter(d => d.name).map(d => (
                                  <td key={d.name} className="px-2 py-1 border-b border-vscode-border">
                                    <span className="px-1 py-0.5 rounded bg-vscode-hover text-[9px] text-vscode-text">{sku.combo[d.name]}</span>
                                  </td>
                                ))}
                                <td className="px-1 py-0.5 border-b border-vscode-border">
                                  <input type="text" value={sku.skuCode} onChange={e => updSku(si, 'skuCode', e.target.value)} placeholder="SKU"
                                    className="w-full bg-vscode-inputBg border border-vscode-border rounded px-1.5 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent font-mono" />
                                </td>
                                <td className="px-1 py-0.5 border-b border-vscode-border">
                                  <input type="text" value={sku.costPrice} onChange={e => updSku(si, 'costPrice', e.target.value)} placeholder="0.00"
                                    className="w-full bg-vscode-inputBg border border-vscode-border rounded px-1.5 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent text-right" />
                                </td>
                                <td className="px-1 py-0.5 border-b border-vscode-border">
                                  <input type="text" value={sku.basePrice} onChange={e => updSku(si, 'basePrice', e.target.value)} placeholder="0.00"
                                    className="w-full bg-vscode-inputBg border border-vscode-border rounded px-1.5 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent text-right" />
                                </td>
                                <td className="px-1 py-0.5 border-b border-vscode-border">
                                  <input type="text" value={sku.qty} onChange={e => updSku(si, 'qty', e.target.value)} placeholder="0"
                                    className="w-full bg-vscode-inputBg border border-vscode-border rounded px-1.5 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent text-right" />
                                </td>
                                <td className="px-1 py-0.5 border-b border-vscode-border">
                                  <select value={sku.warehouse} onChange={e => updSku(si, 'warehouse', e.target.value)}
                                    className="w-full bg-vscode-inputBg border border-vscode-border rounded px-1 py-0.5 text-[9px] text-vscode-text outline-none">
                                    {warehouseOpts.map(w => <option key={w.v} value={w.v}>{w.l}</option>)}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ═══ 5. 商品图片 ═══ */}
          <SectionHead id="images" icon={IconImage} label="商品图片" expanded={isOpen('images')} toggle={() => tog('images')} status={ss('images')} />
          {isOpen('images') && (
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="grid grid-cols-5 gap-2 mb-2">
                <div className="border-2 border-dashed border-vscode-accent/40 rounded aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-vscode-accent/5 transition-colors">
                  <IconImage size={16} className="text-vscode-accent/40 mb-0.5" />
                  <span className="text-[8px] text-vscode-accent font-medium">主图 *</span>
                </div>
                {[2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                  <div key={i} className="border border-dashed border-vscode-border rounded aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-vscode-hover transition-colors">
                    <IconPlus size={12} className="text-vscode-textMuted/30 mb-0.5" />
                    <span className="text-[7px] text-vscode-textMuted">附图 {i - 1}</span>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-vscode-textMuted">建议: 白色背景, 1000×1000px 以上, 商品占比≥85%, 主图+最多8张附图</div>
            </div>
          )}

          {/* ═══ 6. 商品描述 ═══ */}
          <SectionHead id="description" icon={IconFileText} label="商品描述" expanded={isOpen('description')} toggle={() => tog('description')} status={ss('description')} />
          {isOpen('description') && (
            <div className="px-4 py-3 border-b border-vscode-border space-y-2">
              <div>
                <div className="text-[11px] text-vscode-textMuted mb-1.5">卖点要点 (5条)</div>
                <div className="space-y-1">
                  {form.bullets.map((bp, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[9px] text-vscode-textMuted w-2.5 shrink-0">{i + 1}</span>
                      <Inp value={bp} onChange={v => setBullet(i, v)} placeholder={
                        i === 0 ? '核心卖点' : i === 1 ? '材质/技术' : i === 2 ? '规格参数' : i === 3 ? '包装内容' : '其他亮点'
                      } />
                    </div>
                  ))}
                </div>
              </div>
              <Row label="详细描述" hint="支持富文本">
                <textarea value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="商品详细描述..." rows={5}
                  className="w-full bg-vscode-inputBg border border-vscode-border rounded px-2.5 py-1.5 text-[11px] text-vscode-text outline-none focus:border-vscode-accent placeholder:text-vscode-textMuted resize-none" />
              </Row>
            </div>
          )}

          {/* ═══ 7. 物流与仓储 ═══ */}
          <SectionHead id="logistics" icon={IconShipment} label="物流与仓储" expanded={isOpen('logistics')} toggle={() => tog('logistics')} status={ss('logistics')} />
          {isOpen('logistics') && (
            <div className="px-4 py-3 border-b border-vscode-border space-y-0.5">
              <Row label="重量" required>
                <div className="flex items-center gap-1.5">
                  <Inp value={form.weight} onChange={v => set('weight', v)} placeholder="0" className="w-[80px]" />
                  <Sel value={form.weightUnit} onChange={v => set('weightUnit', v)} options={[{ v: 'g', l: '克' }, { v: 'kg', l: '千克' }]} />
                </div>
              </Row>
              <Row label="包装尺寸" hint="长×宽×高">
                <div className="flex items-center gap-1">
                  <Inp value={form.pLength} onChange={v => set('pLength', v)} placeholder="长" className="w-[60px]" />
                  <span className="text-vscode-textMuted text-[10px]">×</span>
                  <Inp value={form.pWidth} onChange={v => set('pWidth', v)} placeholder="宽" className="w-[60px]" />
                  <span className="text-vscode-textMuted text-[10px]">×</span>
                  <Inp value={form.pHeight} onChange={v => set('pHeight', v)} placeholder="高" className="w-[60px]" />
                  <Sel value={form.dimUnit} onChange={v => set('dimUnit', v)} options={[{ v: 'cm', l: 'cm' }, { v: 'in', l: 'in' }]} />
                </div>
              </Row>
              <Row label="默认仓库">
                <Sel value={form.defaultWarehouse} onChange={v => set('defaultWarehouse', v)} options={warehouseOpts} />
              </Row>
              <Row label="特殊标记">
                <div className="flex items-center gap-4 text-[11px] text-vscode-text">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={form.fragile} onChange={e => set('fragile', e.target.checked)} className="accent-[var(--vscode-accent)]" />
                    易碎品
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={form.hazmat} onChange={e => set('hazmat', e.target.checked)} className="accent-[var(--vscode-accent)]" />
                    危险品
                  </label>
                </div>
              </Row>
            </div>
          )}

          {/* ═══ 8. 渠道分发 ═══ */}
          <SectionHead id="channels" icon={IconStore} label="渠道分发" expanded={isOpen('channels')} toggle={() => { tog('channels'); initChannels(); }} status={ss('channels')} />
          {isOpen('channels') && (
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[11px] text-vscode-textMuted mb-3">选择要分发的店铺，可为每个店铺设置独立的价格和标题覆盖。未设置覆盖项将使用基准值。</div>
              {form.channelPublish.length === 0 ? (
                <div className="text-[11px] text-vscode-textMuted py-2">暂无可用店铺</div>
              ) : (
                <div className="space-y-2">
                  {form.channelPublish.map(cp => {
                    const store = allStores.find(s => s.id === cp.storeId);
                    const channel = store ? allChannels.find(c => c.id === store.channelId) : null;
                    if (!store || !channel) return null;
                    return (
                      <div key={cp.storeId} className={`border rounded p-2.5 transition-colors ${cp.enabled ? 'border-vscode-accent/40 bg-vscode-accent/5' : 'border-vscode-border'}`}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={cp.enabled} onChange={() => toggleChannelStore(cp.storeId)} className="accent-[var(--vscode-accent)]" />
                          <IconGlobal size={11} className={cp.enabled ? 'text-vscode-accent' : 'text-vscode-textMuted'} />
                          <span className={`text-[11px] font-medium ${cp.enabled ? 'text-vscode-textBright' : 'text-vscode-textMuted'}`}>{store.name}</span>
                          <span className="text-[9px] text-vscode-textMuted">{channel.name} · {store.region}</span>
                        </label>
                        {cp.enabled && (
                          <div className="mt-2 ml-6 space-y-1.5">
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-vscode-textMuted w-[60px]">渠道售价</span>
                              <input type="text" value={cp.priceOverride} onChange={e => updateChannelPublish(cp.storeId, 'priceOverride', e.target.value)}
                                placeholder={form.basePrice ? `${form.currency} ${form.basePrice} (基准)` : '使用基准售价'}
                                className="flex-1 bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent placeholder:text-vscode-textMuted" />
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-vscode-textMuted w-[60px]">渠道标题</span>
                              <input type="text" value={cp.titleOverride} onChange={e => updateChannelPublish(cp.storeId, 'titleOverride', e.target.value)}
                                placeholder={form.name || '使用默认商品标题'}
                                className="flex-1 bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[10px] text-vscode-text outline-none focus:border-vscode-accent placeholder:text-vscode-textMuted" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-2 text-[10px] text-vscode-textMuted">
                已选 {form.channelPublish.filter(c => c.enabled).length}/{form.channelPublish.length} 个店铺
              </div>
            </div>
          )}

          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}
