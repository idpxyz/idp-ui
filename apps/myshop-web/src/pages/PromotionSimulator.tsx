import { useState, useMemo } from 'react';
import {
  IconCalculator,
  IconPlus,
  IconClose,
  IconWarning,
  IconCheck,
  IconSecurityAlert,
  IconTrendingDown,
  IconAutomation,
  IconTicket,
  IconPackage,
  IconChevronDown,
  IconChevronRight,
  IconSearch,
  IconTrash,
  IconArrowRight,
  IconInfo,
  IconDollar,
  IconShield,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  spuList,
  promotions,
  coupons,
  promotionTypeConfig,
  couponTypeConfig,
  productCategories,
  type Promotion,
  type Coupon,
  type SPU,
} from '../data/oms';

// ── Types ──
interface CartItem { spu: SPU; qty: number; unitPrice: number; }
interface AppliedDiscount { source: string; sourceType: 'promotion' | 'coupon'; label: string; amount: number; description: string; }
interface Conflict { a: string; b: string; reason: string; severity: 'error' | 'warning' | 'info'; }
interface RiskAlert { level: 'critical' | 'warning' | 'info'; title: string; detail: string; }

// ── Discount calculation engine ──
function calcPromotionDiscount(promo: Promotion, cart: CartItem[]): number {
  if (promo.status !== 'active' && promo.status !== 'scheduled') return 0;
  const eligible = cart.filter(item => {
    if (promo.scope === 'all') return true;
    if (promo.scope === 'category') return promo.scopeIds.some(cid => item.spu.categoryId === cid || productCategories.find(c => c.id === item.spu.categoryId)?.parentId === cid);
    if (promo.scope === 'product') return promo.scopeIds.includes(item.spu.id);
    return false;
  });
  if (eligible.length === 0) return 0;
  const subtotal = eligible.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  if (subtotal < promo.minOrderAmount) return 0;

  let discount = 0;
  if (promo.discountUnit === '%') {
    discount = subtotal * (promo.discountValue / 100);
    if (promo.maxDiscountAmount > 0) discount = Math.min(discount, promo.maxDiscountAmount);
  } else if (promo.discountUnit === 'fixed') {
    discount = promo.discountValue;
  }
  return Math.round(discount * 100) / 100;
}

function calcCouponDiscount(cpn: Coupon, cart: CartItem[]): number {
  if (cpn.status !== 'active') return 0;
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  if (subtotal < cpn.minOrderAmount) return 0;

  let discount = 0;
  if (cpn.type === 'percentage') {
    discount = subtotal * (cpn.discountValue / 100);
    if (cpn.maxDiscountAmount > 0) discount = Math.min(discount, cpn.maxDiscountAmount);
  } else if (cpn.type === 'fixed') {
    discount = cpn.discountValue;
  } else if (cpn.type === 'free_shipping') {
    discount = cpn.maxDiscountAmount;
  }
  return Math.round(discount * 100) / 100;
}

// ── Conflict detection ──
function detectConflicts(activePromos: Promotion[], activeCoupons: Coupon[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const all = [...activePromos];

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j];
      // Time overlap
      const timeOverlap = a.startAt <= b.endAt && b.startAt <= a.endAt;
      if (!timeOverlap) continue;

      // Scope overlap
      const scopeOverlap = a.scope === 'all' || b.scope === 'all' ||
        (a.scope === b.scope && a.scopeIds.some(id => b.scopeIds.includes(id)));
      if (!scopeOverlap) continue;

      // Both not stackable
      if (!a.stackable && !b.stackable) {
        conflicts.push({ a: a.name, b: b.name, reason: '时间和范围重叠，且双方均不可叠加', severity: 'error' });
      } else if (!a.stackable || !b.stackable) {
        conflicts.push({ a: a.name, b: b.name, reason: '时间和范围重叠，其中一方不可叠加', severity: 'warning' });
      } else {
        conflicts.push({ a: a.name, b: b.name, reason: '时间和范围重叠，可叠加 — 注意优惠力度', severity: 'info' });
      }
    }
  }

  // Promo-coupon conflicts
  for (const p of activePromos) {
    for (const c of activeCoupons) {
      if (!p.stackable) {
        conflicts.push({ a: p.name, b: c.name, reason: '促销不可叠加，但优惠券可能同时使用', severity: 'warning' });
      }
    }
  }
  return conflicts;
}

// ── Risk assessment ──
function assessRisks(cart: CartItem[], totalDiscount: number, discounts: AppliedDiscount[]): RiskAlert[] {
  const alerts: RiskAlert[] = [];
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  if (subtotal === 0) return alerts;
  const pct = totalDiscount / subtotal * 100;

  if (pct > 60) {
    alerts.push({ level: 'critical', title: '极端优惠风险', detail: `总折扣率 ${pct.toFixed(1)}% 超过 60%，可能被恶意利用（薅羊毛）` });
  } else if (pct > 40) {
    alerts.push({ level: 'warning', title: '高折扣警告', detail: `总折扣率 ${pct.toFixed(1)}% 超过 40%，建议检查规则合理性` });
  } else if (pct > 25) {
    alerts.push({ level: 'info', title: '折扣力度较大', detail: `总折扣率 ${pct.toFixed(1)}%，处于正常偏高范围` });
  }

  if (discounts.length >= 3) {
    alerts.push({ level: 'warning', title: '多重优惠叠加', detail: `共有 ${discounts.length} 项优惠同时生效，建议限制叠加层数` });
  }

  const promoDiscounts = discounts.filter(d => d.sourceType === 'promotion');
  const couponDiscounts = discounts.filter(d => d.sourceType === 'coupon');
  if (promoDiscounts.length > 0 && couponDiscounts.length > 0) {
    alerts.push({ level: 'info', title: '促销 + 优惠券并用', detail: '订单同时享受了促销活动和优惠券，确认是否符合业务规则' });
  }

  // Budget burn rate check
  for (const p of promotions.filter(x => x.status === 'active')) {
    if (p.budget > 0 && p.spent / p.budget > 0.8) {
      alerts.push({ level: 'warning', title: `预算即将耗尽: ${p.name}`, detail: `已使用 ${((p.spent / p.budget) * 100).toFixed(0)}% 预算 ($${p.spent.toLocaleString()} / $${p.budget.toLocaleString()})` });
    }
  }

  return alerts;
}

// ── Auto-audit engine ──
interface PromoRiskCard {
  promo: Promotion;
  overlapCount: number;
  budgetPct: number;
  maxDiscountPct: number;
  riskScore: number; // 0-100
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  issues: string[];
}

interface WorstCaseRow {
  spu: SPU;
  originalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  discountPct: number;
  appliedPromos: string[];
  appliedCoupons: string[];
}

function runAutoAudit(activePromos: Promotion[], activeCpns: Coupon[]): {
  riskCards: PromoRiskCard[];
  worstCases: WorstCaseRow[];
  globalConflicts: Conflict[];
  summaryStats: { totalActive: number; totalConflicts: number; criticalCount: number; avgDiscountPct: number; totalBudget: number; totalSpent: number };
} {
  // 1. Global conflicts
  const globalConflicts = detectConflicts(activePromos, activeCpns);

  // 2. Per-promo risk cards
  const riskCards: PromoRiskCard[] = activePromos.map(p => {
    const issues: string[] = [];
    const overlaps = globalConflicts.filter(c => c.a === p.name || c.b === p.name);
    const overlapCount = overlaps.length;
    const budgetPct = p.budget > 0 ? (p.spent / p.budget) * 100 : 0;

    if (overlapCount >= 3) issues.push(`与 ${overlapCount} 个活动存在时间/范围重叠`);
    else if (overlapCount > 0) issues.push(`与 ${overlapCount} 个活动存在重叠`);
    if (budgetPct > 90) issues.push(`预算已消耗 ${budgetPct.toFixed(0)}%`);
    else if (budgetPct > 70) issues.push(`预算消耗 ${budgetPct.toFixed(0)}%，接近上限`);
    if (p.discountValue >= 30 && p.discountUnit === '%') issues.push(`折扣力度较大 (${p.discountValue}%)`);
    if (p.stackable) issues.push('允许叠加，可能与其他活动累计折扣');
    if (p.usageLimit === 0) issues.push('无使用次数上限');

    const maxDiscountPct = p.discountUnit === '%' ? p.discountValue : (p.minOrderAmount > 0 ? (p.discountValue / p.minOrderAmount) * 100 : 0);

    let riskScore = 0;
    riskScore += Math.min(30, overlapCount * 10);
    riskScore += Math.min(25, budgetPct > 80 ? 25 : budgetPct > 60 ? 15 : budgetPct > 40 ? 5 : 0);
    riskScore += Math.min(25, maxDiscountPct > 40 ? 25 : maxDiscountPct > 25 ? 15 : maxDiscountPct > 15 ? 8 : 0);
    riskScore += p.stackable ? 10 : 0;
    riskScore += p.usageLimit === 0 ? 10 : 0;
    riskScore = Math.min(100, riskScore);

    const riskLevel: PromoRiskCard['riskLevel'] = riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    return { promo: p, overlapCount, budgetPct, maxDiscountPct, riskScore, riskLevel, issues };
  });

  // 3. Worst-case simulation: for each on-sale SPU, calculate max discount
  const onSale = spuList.filter(s => s.status === 'on_sale').slice(0, 20);
  const worstCases: WorstCaseRow[] = onSale.map(spu => {
    const cart: CartItem[] = [{ spu, qty: 1, unitPrice: spu.minPrice }];
    const appliedPromoNames: string[] = [];
    const appliedCpnNames: string[] = [];
    let totalDisc = 0;

    for (const p of activePromos) {
      const d = calcPromotionDiscount(p, cart);
      if (d > 0) { totalDisc += d; appliedPromoNames.push(p.name); }
    }
    for (const c of activeCpns) {
      const d = calcCouponDiscount(c, cart);
      if (d > 0) { totalDisc += d; appliedCpnNames.push(c.name); }
    }

    const finalPrice = Math.max(0, spu.minPrice - totalDisc);
    const discPct = spu.minPrice > 0 ? (totalDisc / spu.minPrice) * 100 : 0;
    return { spu, originalPrice: spu.minPrice, totalDiscount: totalDisc, finalPrice, discountPct: discPct, appliedPromos: appliedPromoNames, appliedCoupons: appliedCpnNames };
  }).sort((a, b) => b.discountPct - a.discountPct);

  // 4. Summary stats
  const totalBudget = activePromos.reduce((s, p) => s + p.budget, 0);
  const totalSpent = activePromos.reduce((s, p) => s + p.spent, 0);
  const avgDisc = worstCases.length > 0 ? worstCases.reduce((s, w) => s + w.discountPct, 0) / worstCases.length : 0;
  const criticalCount = riskCards.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high').length;

  return {
    riskCards: riskCards.sort((a, b) => b.riskScore - a.riskScore),
    worstCases,
    globalConflicts,
    summaryStats: { totalActive: activePromos.length, totalConflicts: globalConflicts.length, criticalCount, avgDiscountPct: avgDisc, totalBudget, totalSpent },
  };
}

// ── Risk Resolver ──
interface FixSuggestion { action: string; detail: string; impact: 'high' | 'medium' | 'low'; param?: string; currentValue?: string; suggestedValue?: string; }

function generateFixes(rc: PromoRiskCard, allConflicts: Conflict[]): FixSuggestion[] {
  const fixes: FixSuggestion[] = [];
  const p = rc.promo;
  if (rc.overlapCount > 0) {
    const nonStack = allConflicts.filter(c => c.severity === 'error' && (c.a === p.name || c.b === p.name));
    if (nonStack.length > 0) {
      fixes.push({ action: '\u8c03\u6574\u6d3b\u52a8\u65f6\u95f4\u907f\u514d\u91cd\u53e0', detail: `\u4e0e ${nonStack.map(c => c.a === p.name ? c.b : c.a).join('\u3001')} \u65f6\u95f4\u548c\u8303\u56f4\u5747\u91cd\u53e0\u4e14\u4e0d\u53ef\u53e0\u52a0\uff0c\u5efa\u8bae\u9519\u5f00\u65f6\u95f4\u6bb5\u6216\u7f29\u5c0f\u9002\u7528\u8303\u56f4`, impact: 'high', param: '\u6d3b\u52a8\u65f6\u95f4', currentValue: `${p.startAt} ~ ${p.endAt}`, suggestedValue: '\u9519\u5f00\u81f3\u4e0d\u91cd\u53e0\u65f6\u95f4\u6bb5' });
    }
    if (p.stackable && rc.overlapCount >= 2) {
      fixes.push({ action: '\u5173\u95ed\u53e0\u52a0\u5f00\u5173', detail: `\u5f53\u524d\u5141\u8bb8\u53e0\u52a0\u4e14\u4e0e ${rc.overlapCount} \u4e2a\u6d3b\u52a8\u91cd\u53e0\uff0c\u5173\u95ed\u53e0\u52a0\u53ef\u9632\u6b62\u6298\u6263\u7d2f\u8ba1\u8fc7\u6df1`, impact: 'high', param: 'stackable', currentValue: '\u2705 \u5141\u8bb8\u53e0\u52a0', suggestedValue: '\ud83d\udead \u7981\u6b62\u53e0\u52a0' });
    }
  }
  if (p.discountUnit === '%' && p.discountValue >= 30) {
    const sug = Math.min(25, Math.round(p.discountValue * 0.7));
    fixes.push({ action: '\u964d\u4f4e\u6298\u6263\u529b\u5ea6', detail: `${p.discountValue}% \u6298\u6263\u529b\u5ea6\u504f\u9ad8\uff0c\u5efa\u8bae\u964d\u81f3 ${sug}% \u6216\u8bbe\u7f6e\u66f4\u9ad8\u7684\u6700\u4f4e\u6d88\u8d39\u95e8\u69db`, impact: 'high', param: 'discountValue', currentValue: `${p.discountValue}%`, suggestedValue: `${sug}%` });
  }
  if (p.discountUnit === '%' && p.maxDiscountAmount === 0) {
    fixes.push({ action: '\u8bbe\u7f6e\u4f18\u60e0\u5c01\u9876\u91d1\u989d', detail: '\u5f53\u524d\u65e0\u5c01\u9876\u91d1\u989d\u9650\u5236\uff0c\u9ad8\u4ef7\u5546\u54c1\u53ef\u80fd\u4ea7\u751f\u8fc7\u5927\u6298\u6263', impact: 'medium', param: 'maxDiscountAmount', currentValue: '\u65e0\u4e0a\u9650', suggestedValue: `$${Math.round(p.minOrderAmount * 0.3) || 100}` });
  }
  if (p.usageLimit === 0) {
    const sug = Math.max(1000, p.usedCount * 2);
    fixes.push({ action: '\u8bbe\u7f6e\u4f7f\u7528\u6b21\u6570\u4e0a\u9650', detail: `\u5f53\u524d\u65e0\u4f7f\u7528\u4e0a\u9650\uff08\u5df2\u7528 ${p.usedCount.toLocaleString()} \u6b21\uff09\uff0c\u5efa\u8bae\u8bbe\u7f6e\u5408\u7406\u4e0a\u9650\u9632\u6b62\u9884\u7b97\u5931\u63a7`, impact: 'medium', param: 'usageLimit', currentValue: '\u65e0\u9650\u5236', suggestedValue: `${sug.toLocaleString()} \u6b21` });
  }
  if (rc.budgetPct > 80) {
    const remaining = p.budget - p.spent;
    fixes.push({ action: '\u8ffd\u52a0\u9884\u7b97\u6216\u964d\u4f4e\u6298\u6263', detail: `\u4ec5\u5269\u4f59 $${remaining.toLocaleString()} \u9884\u7b97 (${(100 - rc.budgetPct).toFixed(0)}%)\uff0c\u5efa\u8bae\u8ffd\u52a0\u9884\u7b97\u6216\u964d\u4f4e\u6298\u6263\u529b\u5ea6\u5ef6\u957f\u6d3b\u52a8\u5bff\u547d`, impact: rc.budgetPct > 90 ? 'high' : 'medium', param: 'budget', currentValue: `$${p.budget.toLocaleString()}`, suggestedValue: `$${Math.round(p.budget * 1.5).toLocaleString()}` });
  }
  if (p.minOrderAmount === 0 && p.discountUnit !== 'free') {
    fixes.push({ action: '\u8bbe\u7f6e\u6700\u4f4e\u6d88\u8d39\u95e8\u69db', detail: '\u5f53\u524d\u65e0\u6700\u4f4e\u6d88\u8d39\u8981\u6c42\uff0c\u4efb\u4f55\u8ba2\u5355\u5747\u53ef\u4eab\u53d7\u4f18\u60e0\uff0c\u6613\u88ab\u5c0f\u989d\u8ba2\u5355\u6ee5\u7528', impact: 'medium', param: 'minOrderAmount', currentValue: '$0', suggestedValue: '$50' });
  }
  if (fixes.length === 0) {
    fixes.push({ action: '\u5f53\u524d\u914d\u7f6e\u5408\u7406', detail: '\u672a\u53d1\u73b0\u660e\u663e\u98ce\u63a7\u95ee\u9898\uff0c\u5efa\u8bae\u5b9a\u671f\u76d1\u63a7\u6d3b\u52a8\u6570\u636e', impact: 'low' });
  }
  return fixes;
}

// ── Helpers ──
function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-medium" style={{ color, backgroundColor: bg }}>{children}</span>;
}

// ══════════════════════════════════
interface Props { onOpenTab?: (tabId: string, tabName: string) => void; }

export default function PromotionSimulator({ onOpenTab }: Props) {
  const [mode, setMode] = useState<'manual' | 'audit'>('audit');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [channel, setChannel] = useState('官网');
  const [simDate, setSimDate] = useState('2025-03-10');

  // Active promos/coupons
  const activePromos = useMemo(() =>
    promotions.filter(p => (p.status === 'active' || p.status === 'scheduled') && p.startAt <= simDate && p.endAt >= simDate),
    [simDate]
  );
  const activeCpns = useMemo(() => coupons.filter(c => c.status === 'active'), []);

  // Auto-audit
  const audit = useMemo(() => runAutoAudit(activePromos, activeCpns), [activePromos, activeCpns]);

  // Calculate discounts
  const { discounts, totalDiscount, finalPrice, subtotal } = useMemo(() => {
    const sub = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const d: AppliedDiscount[] = [];

    // Apply promotions by priority
    const sorted = [...activePromos].sort((a, b) => a.priority - b.priority);
    for (const p of sorted) {
      const amt = calcPromotionDiscount(p, cart);
      if (amt > 0) {
        d.push({ source: p.id, sourceType: 'promotion', label: p.name, amount: amt, description: `${promotionTypeConfig[p.type].label} — ${p.discountUnit === '%' ? `${p.discountValue}%` : `$${p.discountValue}`}` });
      }
    }

    // Apply coupons
    for (const c of appliedCoupons) {
      const amt = calcCouponDiscount(c, cart);
      if (amt > 0) {
        d.push({ source: c.id, sourceType: 'coupon', label: c.name, amount: amt, description: `${couponTypeConfig[c.type].label} — ${c.type === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}` });
      }
    }

    const total = d.reduce((s, x) => s + x.amount, 0);
    return { discounts: d, totalDiscount: total, finalPrice: Math.max(0, sub - total), subtotal: sub };
  }, [cart, activePromos, appliedCoupons]);

  // Conflicts & risks
  const conflicts = useMemo(() => detectConflicts(activePromos, appliedCoupons), [activePromos, appliedCoupons]);
  const risks = useMemo(() => assessRisks(cart, totalDiscount, discounts), [cart, totalDiscount, discounts]);

  // Add product
  const addProduct = (spu: SPU) => {
    setCart(prev => {
      const existing = prev.find(i => i.spu.id === spu.id);
      if (existing) return prev.map(i => i.spu.id === spu.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { spu, qty: 1, unitPrice: spu.minPrice }];
    });
    setShowProductPicker(false);
    setProductSearch('');
  };

  // Apply coupon
  const applyCoupon = () => {
    const found = coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase() && c.status === 'active');
    if (found && !appliedCoupons.find(c => c.id === found.id)) {
      setAppliedCoupons(prev => [...prev, found]);
    }
    setCouponCode('');
  };

  const productResults = spuList.filter(s => s.status === 'on_sale' && (!productSearch || s.name.toLowerCase().includes(productSearch.toLowerCase()) || s.id.includes(productSearch))).slice(0, 10);

  const discountPct = subtotal > 0 ? (totalDiscount / subtotal * 100) : 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
        <div className="flex items-center gap-3">
          <IconCalculator size={15} className="text-vscode-accent" />
          <h1 className="text-[14px] font-semibold text-vscode-textBright">促销模拟器</h1>
          {/* Mode tabs */}
          <div className="flex items-center bg-vscode-sidebar border border-vscode-border rounded overflow-hidden ml-2">
            {([['audit', '🛡️ 自动审计'], ['manual', '🛒 手动模拟']] as const).map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 text-[10px] font-medium transition-colors ${mode === m ? 'bg-vscode-accent/15 text-vscode-accent' : 'text-vscode-textMuted hover:bg-vscode-hover'}`}>
                {label}
              </button>
            ))}
          </div>
          {audit.summaryStats.criticalCount > 0 && mode === 'audit' && (
            <span className="px-1.5 py-0.5 rounded bg-red-400/15 text-red-400 text-[9px] font-bold">{audit.summaryStats.criticalCount} 高风险</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-vscode-textMuted">模拟日期</span>
          <input type="date" value={simDate} onChange={e => setSimDate(e.target.value)}
            className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[11px] text-vscode-text outline-none focus:border-vscode-accent" />
          <select value={channel} onChange={e => setChannel(e.target.value)}
            className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-0.5 text-[11px] text-vscode-text outline-none">
            <option>官网</option><option>App</option><option>亚马逊</option><option>Shopee</option><option>eBay</option>
          </select>
        </div>
      </div>

      {/* ═══ AUDIT MODE ═══ */}
      {mode === 'audit' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Summary + Risk Cards */}
          <div className="flex-1 flex flex-col overflow-auto min-w-0">
            {/* Summary cards */}
            <div className="grid grid-cols-6 gap-2.5 px-4 py-3 border-b border-vscode-border shrink-0">
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">生效活动</div>
                <div className="text-[16px] font-bold text-vscode-text">{audit.summaryStats.totalActive}</div>
              </div>
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">规则冲突</div>
                <div className={`text-[16px] font-bold ${audit.summaryStats.totalConflicts > 0 ? 'text-yellow-400' : 'text-green-400'}`}>{audit.summaryStats.totalConflicts}</div>
              </div>
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">高风险项</div>
                <div className={`text-[16px] font-bold ${audit.summaryStats.criticalCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{audit.summaryStats.criticalCount}</div>
              </div>
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">平均折扣率</div>
                <div className={`text-[16px] font-bold ${audit.summaryStats.avgDiscountPct > 30 ? 'text-red-400' : audit.summaryStats.avgDiscountPct > 20 ? 'text-yellow-400' : 'text-green-400'}`}>{audit.summaryStats.avgDiscountPct.toFixed(1)}%</div>
              </div>
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">总预算</div>
                <div className="text-[16px] font-bold text-vscode-text">${(audit.summaryStats.totalBudget / 1000).toFixed(0)}k</div>
              </div>
              <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                <div className="text-[9px] text-vscode-textMuted mb-0.5">已消耗</div>
                <div className="text-[16px] font-bold text-[#dcdcaa]">${(audit.summaryStats.totalSpent / 1000).toFixed(0)}k</div>
                {audit.summaryStats.totalBudget > 0 && <div className="text-[9px] text-vscode-textMuted">{((audit.summaryStats.totalSpent / audit.summaryStats.totalBudget) * 100).toFixed(0)}%</div>}
              </div>
            </div>

            {/* Risk cards */}
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                <IconSecurityAlert size={11} className="text-red-400" /> 活动风险评估 ({audit.riskCards.length})
              </div>
              <div className="space-y-2">
                {audit.riskCards.map(rc => {
                  const tc = promotionTypeConfig[rc.promo.type];
                  const barColor = rc.riskLevel === 'critical' ? 'bg-red-400' : rc.riskLevel === 'high' ? 'bg-orange-400' : rc.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400';
                  const textColor = rc.riskLevel === 'critical' ? 'text-red-400' : rc.riskLevel === 'high' ? 'text-orange-400' : rc.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400';
                  return (
                    <div key={rc.promo.id} className="rounded border border-vscode-border bg-vscode-sidebar overflow-hidden">
                      <div className="px-3 py-2.5 cursor-pointer hover:bg-vscode-hover/50 transition-colors"
                        onClick={() => setExpandedCard(expandedCard === rc.promo.id ? null : rc.promo.id)}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge color={tc.color} bg={tc.bgColor}>{tc.label}</Badge>
                          <span className="text-[11px] text-vscode-text flex-1 truncate font-medium">{rc.promo.name}</span>
                          <span className={`text-[10px] font-bold ${textColor}`}>{rc.riskScore}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                            rc.riskLevel === 'critical' ? 'bg-red-400/15 text-red-400' :
                            rc.riskLevel === 'high' ? 'bg-orange-400/15 text-orange-400' :
                            rc.riskLevel === 'medium' ? 'bg-yellow-400/15 text-yellow-400' :
                            'bg-green-400/15 text-green-400'
                          }`}>{rc.riskLevel === 'critical' ? '极高' : rc.riskLevel === 'high' ? '高' : rc.riskLevel === 'medium' ? '中' : '低'}</span>
                          <IconChevronRight size={10} className={`text-vscode-textMuted shrink-0 transition-transform ${expandedCard === rc.promo.id ? 'rotate-90' : ''}`} />
                        </div>
                        {/* Risk bar */}
                        <div className="h-[4px] rounded-full bg-vscode-border mb-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${rc.riskScore}%` }} />
                        </div>
                        {/* Metrics row */}
                        <div className="flex items-center gap-3 text-[9px] text-vscode-textMuted mb-1">
                          <span>重叠: <span className="text-vscode-text">{rc.overlapCount}</span></span>
                          <span>预算: <span className="text-vscode-text">{rc.budgetPct.toFixed(0)}%</span></span>
                          <span>折扣: <span className="text-vscode-text">{rc.maxDiscountPct.toFixed(0)}%</span></span>
                          <span>{rc.promo.stackable ? '✅ 可叠加' : '🚫 不叠加'}</span>
                        </div>
                        {/* Issues */}
                        {rc.issues.length > 0 && (
                          <div className="space-y-0.5">
                            {rc.issues.map((issue, i) => (
                              <div key={i} className="flex items-start gap-1 text-[9px] text-vscode-textMuted">
                                <span className="text-yellow-400 mt-px shrink-0">⚠</span>
                                <span>{issue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* ── Resolver Panel ── */}
                      {expandedCard === rc.promo.id && (
                        <div className="border-t border-vscode-border bg-vscode-editor px-3 py-2.5">
                          <div className="text-[10px] text-vscode-accent font-bold mb-2 flex items-center gap-1.5">
                            <IconAutomation size={10} /> 风险求解建议
                          </div>
                          <div className="space-y-2">
                            {generateFixes(rc, audit.globalConflicts).map((fix, fi) => (
                              <div key={fi} className={`px-2.5 py-2 rounded border text-[10px] ${
                                fix.impact === 'high' ? 'border-red-400/20 bg-red-400/5' :
                                fix.impact === 'medium' ? 'border-yellow-400/20 bg-yellow-400/5' :
                                'border-green-400/20 bg-green-400/5'
                              }`}>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${
                                    fix.impact === 'high' ? 'bg-red-400' : fix.impact === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                  }`} />
                                  <span className="text-vscode-text font-bold">{fix.action}</span>
                                  <span className={`text-[8px] px-1 py-0.5 rounded ml-auto shrink-0 ${
                                    fix.impact === 'high' ? 'bg-red-400/15 text-red-400' :
                                    fix.impact === 'medium' ? 'bg-yellow-400/15 text-yellow-400' :
                                    'bg-green-400/15 text-green-400'
                                  }`}>{fix.impact === 'high' ? '高优先' : fix.impact === 'medium' ? '中优先' : '建议'}</span>
                                </div>
                                <div className="text-vscode-textMuted leading-tight mb-1">{fix.detail}</div>
                                {fix.param && (
                                  <div className="flex items-center gap-2 mt-1.5 px-2 py-1.5 rounded bg-vscode-sidebar border border-vscode-border">
                                    <span className="text-[9px] text-vscode-textMuted shrink-0">{fix.param}:</span>
                                    <span className="text-[9px] text-red-400/80 line-through">{fix.currentValue}</span>
                                    <IconArrowRight size={8} className="text-vscode-textMuted shrink-0" />
                                    <span className="text-[9px] text-green-400 font-bold">{fix.suggestedValue}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global conflicts */}
            {audit.globalConflicts.length > 0 && (
              <div className="px-4 py-3 border-b border-vscode-border">
                <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                  <IconWarning size={11} className="text-yellow-400" /> 全局冲突矩阵 ({audit.globalConflicts.length})
                </div>
                <div className="space-y-1.5">
                  {audit.globalConflicts.map((c, i) => (
                    <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded border text-[10px] ${
                      c.severity === 'error' ? 'border-red-400/30 bg-red-400/5' :
                      c.severity === 'warning' ? 'border-yellow-400/30 bg-yellow-400/5' :
                      'border-vscode-border bg-vscode-sidebar'
                    }`}>
                      <span className={`w-[5px] h-[5px] rounded-full mt-1 shrink-0 ${
                        c.severity === 'error' ? 'bg-red-400' : c.severity === 'warning' ? 'bg-yellow-400' : 'bg-vscode-accent'
                      }`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-vscode-text font-medium truncate">{c.a}</span>
                          <span className="text-vscode-textMuted">×</span>
                          <span className="text-vscode-text font-medium truncate">{c.b}</span>
                        </div>
                        <div className="text-vscode-textMuted">{c.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Worst-case + Budget health */}
          <div className="w-[380px] border-l border-vscode-border flex flex-col overflow-auto shrink-0">
            {/* Budget health */}
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                <IconDollar size={11} /> 预算健康度
              </div>
              <div className="space-y-2">
                {activePromos.filter(p => p.budget > 0).map(p => {
                  const pct = (p.spent / p.budget) * 100;
                  const tc = promotionTypeConfig[p.type];
                  return (
                    <div key={p.id} className="text-[10px]">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-vscode-text truncate flex-1">{p.name}</span>
                        <span className={`font-bold ${pct > 90 ? 'text-red-400' : pct > 70 ? 'text-yellow-400' : 'text-green-400'}`}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-[6px] rounded-full bg-vscode-border overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-yellow-400' : 'bg-green-400'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <div className="flex justify-between text-[8px] text-vscode-textMuted mt-0.5">
                        <span>${p.spent.toLocaleString()} 已用</span>
                        <span>${p.budget.toLocaleString()} 总额</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Worst-case simulation */}
            <div className="px-4 py-3">
              <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                <IconTrendingDown size={11} className="text-red-400" /> 最差场景模拟
                <span className="text-vscode-textMuted font-normal">(单件商品最大折扣)</span>
              </div>
              <div className="space-y-1.5">
                {audit.worstCases.filter(w => w.totalDiscount > 0).map(w => (
                  <div key={w.spu.id} className={`px-3 py-2 rounded border text-[10px] ${
                    w.discountPct > 50 ? 'border-red-400/30 bg-red-400/5' :
                    w.discountPct > 30 ? 'border-yellow-400/30 bg-yellow-400/5' :
                    'border-vscode-border bg-vscode-sidebar'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[13px]">{w.spu.mainImage}</span>
                      <span className="text-vscode-text truncate flex-1">{w.spu.name}</span>
                      <span className={`font-bold ${w.discountPct > 50 ? 'text-red-400' : w.discountPct > 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {w.discountPct.toFixed(1)}% OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px]">
                      <span className="text-vscode-textMuted line-through">${w.originalPrice}</span>
                      <IconArrowRight size={8} className="text-vscode-textMuted" />
                      <span className="text-red-400 font-bold">${w.finalPrice.toFixed(0)}</span>
                      <span className="text-vscode-textMuted ml-auto">{w.appliedPromos.length} 促销 + {w.appliedCoupons.length} 券</span>
                    </div>
                    {(w.appliedPromos.length + w.appliedCoupons.length) > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {w.appliedPromos.map((n, i) => (
                          <span key={i} className="px-1 py-0.5 rounded bg-[#dcdcaa]/10 text-[8px] text-[#dcdcaa]">{n}</span>
                        ))}
                        {w.appliedCoupons.map((n, i) => (
                          <span key={i} className="px-1 py-0.5 rounded bg-vscode-accent/10 text-[8px] text-vscode-accent">{n}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {audit.worstCases.filter(w => w.totalDiscount > 0).length === 0 && (
                  <div className="text-[10px] text-vscode-textMuted py-4 text-center">无商品受到当前活动影响</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MANUAL MODE ═══ */}
      {mode === 'manual' && (
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Cart Builder ── */}
        <div className="w-[320px] border-r border-vscode-border flex flex-col overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-4 h-[32px] text-[10px] uppercase tracking-wider text-vscode-breadcrumb shrink-0 border-b border-vscode-border bg-vscode-sidebar">
            <span className="font-bold">模拟购物车</span>
            <span className="text-vscode-textMuted">{cart.length} 件商品</span>
          </div>

          <div className="flex-1 overflow-auto">
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-vscode-textMuted">
                <IconPackage size={28} className="opacity-20 mb-2" />
                <span className="text-[11px]">添加商品开始模拟</span>
              </div>
            )}
            {cart.map((item, idx) => (
              <div key={item.spu.id} className="flex items-center gap-2 px-3 py-2 border-b border-vscode-border hover:bg-vscode-hover">
                <span className="text-[16px]">{item.spu.mainImage}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-vscode-text truncate">{item.spu.name}</div>
                  <div className="text-[9px] text-vscode-textMuted">{item.spu.brand} · {item.spu.categoryPath}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: Math.max(1, c.qty - 1) } : c))}
                    className="w-[18px] h-[18px] flex items-center justify-center rounded border border-vscode-border text-[10px] text-vscode-textMuted hover:bg-vscode-hover">−</button>
                  <span className="text-[11px] text-vscode-text w-[20px] text-center">{item.qty}</span>
                  <button onClick={() => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: c.qty + 1 } : c))}
                    className="w-[18px] h-[18px] flex items-center justify-center rounded border border-vscode-border text-[10px] text-vscode-textMuted hover:bg-vscode-hover">+</button>
                </div>
                <div className="text-[11px] text-vscode-text w-[55px] text-right">${(item.unitPrice * item.qty).toFixed(0)}</div>
                <IconClose size={10} className="text-vscode-textMuted cursor-pointer hover:text-red-400 shrink-0" onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))} />
              </div>
            ))}
          </div>

          {/* Add product */}
          <div className="px-3 py-2 border-t border-vscode-border bg-vscode-sidebar relative">
            <div className="flex items-center bg-vscode-inputBg border border-vscode-border rounded px-2 h-[28px] cursor-pointer"
              onClick={() => setShowProductPicker(!showProductPicker)}>
              <IconPlus size={11} className="text-vscode-accent mr-1.5" />
              {showProductPicker ? (
                <input autoFocus type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  onClick={e => e.stopPropagation()} placeholder="搜索商品..."
                  className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted" />
              ) : (
                <span className="text-[11px] text-vscode-textMuted">添加商品到购物车...</span>
              )}
            </div>
            {showProductPicker && (
              <div className="absolute bottom-full left-3 right-3 mb-1 border border-vscode-border rounded bg-vscode-sidebar shadow-lg max-h-[250px] overflow-auto z-20">
                {productResults.map(s => (
                  <div key={s.id} onClick={() => addProduct(s)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer text-[11px] hover:bg-vscode-hover text-vscode-text border-b border-vscode-border last:border-b-0">
                    <span className="text-[14px]">{s.mainImage}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{s.name}</div>
                      <div className="text-[9px] text-vscode-textMuted">{s.brand} · ${s.minPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon code */}
          <div className="px-3 py-2 border-t border-vscode-border bg-vscode-sidebar">
            <div className="flex items-center gap-1.5">
              <IconTicket size={11} className="text-vscode-textMuted shrink-0" />
              <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                placeholder="输入优惠券码..."
                className="bg-vscode-inputBg border border-vscode-border rounded px-2 py-1 text-[11px] text-vscode-text outline-none focus:border-vscode-accent flex-1 placeholder:text-vscode-textMuted" />
              <Button variant="ghost" size="sm" onClick={applyCoupon}>兑换</Button>
            </div>
            {appliedCoupons.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {appliedCoupons.map(c => (
                  <span key={c.id} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-vscode-accent/10 text-[9px] text-vscode-accent">
                    <IconTicket size={8} />{c.code}
                    <IconClose size={7} className="cursor-pointer hover:text-red-400 ml-0.5" onClick={() => setAppliedCoupons(prev => prev.filter(x => x.id !== c.id))} />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Subtotal */}
          <div className="px-4 py-2 border-t border-vscode-border bg-vscode-sidebar">
            <div className="flex justify-between text-[11px]">
              <span className="text-vscode-textMuted">商品小计</span>
              <span className="text-vscode-text">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── CENTER: Calculation Result ── */}
        <div className="flex-1 flex flex-col overflow-auto min-w-0">
          <div className="flex items-center justify-between px-4 h-[32px] text-[10px] uppercase tracking-wider text-vscode-breadcrumb shrink-0 border-b border-vscode-border bg-vscode-sidebar">
            <span className="font-bold">优惠计算结果</span>
            <span className="text-vscode-textMuted">{discounts.length} 项优惠命中</span>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-vscode-border">
            <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
              <div className="text-[9px] text-vscode-textMuted mb-1">商品原价</div>
              <div className="text-[16px] font-bold text-vscode-text">${subtotal.toFixed(2)}</div>
            </div>
            <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
              <div className="text-[9px] text-vscode-textMuted mb-1">总优惠</div>
              <div className="text-[16px] font-bold text-red-400">−${totalDiscount.toFixed(2)}</div>
              {subtotal > 0 && <div className="text-[9px] text-red-400/70">{discountPct.toFixed(1)}% OFF</div>}
            </div>
            <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
              <div className="text-[9px] text-vscode-textMuted mb-1">实付金额</div>
              <div className="text-[16px] font-bold text-green-400">${finalPrice.toFixed(2)}</div>
            </div>
            <div className="px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
              <div className="text-[9px] text-vscode-textMuted mb-1">优惠叠加</div>
              <div className="text-[16px] font-bold text-vscode-text">{discounts.length} <span className="text-[10px] font-normal text-vscode-textMuted">项</span></div>
            </div>
          </div>

          {/* Discount breakdown */}
          {discounts.length > 0 && (
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold">优惠明细</div>
              <div className="space-y-1.5">
                {discounts.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded border border-vscode-border bg-vscode-sidebar">
                    <div className={`w-[6px] h-[6px] rounded-full shrink-0 ${d.sourceType === 'promotion' ? 'bg-[#dcdcaa]' : 'bg-vscode-accent'}`} />
                    {d.sourceType === 'promotion' ? <IconAutomation size={11} className="text-[#dcdcaa] shrink-0" /> : <IconTicket size={11} className="text-vscode-accent shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-vscode-text truncate">{d.label}</div>
                      <div className="text-[9px] text-vscode-textMuted">{d.description}</div>
                    </div>
                    <span className="text-[12px] font-bold text-red-400 shrink-0">−${d.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price waterfall */}
          {discounts.length > 0 && (
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold">价格瀑布</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="px-2 py-1 rounded bg-vscode-sidebar border border-vscode-border text-[11px] text-vscode-text">
                  ${subtotal.toFixed(2)}
                </div>
                {discounts.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <IconArrowRight size={10} className="text-vscode-textMuted" />
                    <div className="px-2 py-1 rounded bg-red-400/10 border border-red-400/20 text-[10px] text-red-400">
                      −${d.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                <IconArrowRight size={10} className="text-vscode-textMuted" />
                <div className="px-2.5 py-1 rounded bg-green-400/10 border border-green-400/30 text-[12px] font-bold text-green-400">
                  ${finalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Active promotions on this date */}
          <div className="px-4 py-3 border-b border-vscode-border">
            <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold">
              当前生效促销 <span className="text-vscode-textMuted font-normal">({simDate})</span>
            </div>
            <div className="space-y-1">
              {activePromos.length === 0 && <div className="text-[10px] text-vscode-textMuted py-2">该日期无生效促销</div>}
              {activePromos.map(p => {
                const tc = promotionTypeConfig[p.type];
                const hit = discounts.some(d => d.source === p.id);
                return (
                  <div key={p.id} className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[11px] ${hit ? 'border-green-400/30 bg-green-400/5' : 'border-vscode-border bg-vscode-sidebar'}`}>
                    {hit ? <IconCheck size={10} className="text-green-400 shrink-0" /> : <div className="w-[10px]" />}
                    <Badge color={tc.color} bg={tc.bgColor}>{tc.label}</Badge>
                    <span className={`flex-1 truncate ${hit ? 'text-vscode-text' : 'text-vscode-textMuted'}`}>{p.name}</span>
                    {p.stackable && <span className="text-[8px] px-1 rounded bg-yellow-400/10 text-yellow-400">可叠加</span>}
                    <span className="text-[9px] text-vscode-textMuted shrink-0">P{p.priority}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {cart.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-vscode-textMuted">
                <IconCalculator size={32} className="mx-auto mb-2 opacity-20" />
                <div className="text-[12px]">添加商品到左侧购物车</div>
                <div className="text-[10px] mt-0.5">系统将自动计算所有适用优惠</div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Conflict & Risk Panel ── */}
        <div className="w-[280px] border-l border-vscode-border flex flex-col overflow-hidden shrink-0">
          <div className="flex items-center justify-between px-4 h-[32px] text-[10px] uppercase tracking-wider text-vscode-breadcrumb shrink-0 border-b border-vscode-border bg-vscode-sidebar">
            <span className="font-bold">冲突 & 风控</span>
            {(conflicts.length > 0 || risks.length > 0) && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-400/15 text-red-400">{conflicts.length + risks.length}</span>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {/* Risk alerts */}
            {risks.length > 0 && (
              <div className="px-3 py-2 border-b border-vscode-border">
                <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                  <IconSecurityAlert size={10} className="text-red-400" /> 风控预警
                </div>
                <div className="space-y-1.5">
                  {risks.map((r, i) => (
                    <div key={i} className={`px-2.5 py-2 rounded border text-[10px] ${
                      r.level === 'critical' ? 'border-red-400/30 bg-red-400/8' :
                      r.level === 'warning' ? 'border-yellow-400/30 bg-yellow-400/8' :
                      'border-vscode-border bg-vscode-sidebar'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {r.level === 'critical' && <IconWarning size={10} className="text-red-400" />}
                        {r.level === 'warning' && <IconWarning size={10} className="text-yellow-400" />}
                        {r.level === 'info' && <IconInfo size={10} className="text-vscode-accent" />}
                        <span className={`font-bold ${
                          r.level === 'critical' ? 'text-red-400' :
                          r.level === 'warning' ? 'text-yellow-400' : 'text-vscode-text'
                        }`}>{r.title}</span>
                      </div>
                      <div className="text-vscode-textMuted leading-tight">{r.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {conflicts.length > 0 && (
              <div className="px-3 py-2 border-b border-vscode-border">
                <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-1.5 font-bold flex items-center gap-1.5">
                  <IconWarning size={10} className="text-yellow-400" /> 规则冲突 ({conflicts.length})
                </div>
                <div className="space-y-1.5">
                  {conflicts.map((c, i) => (
                    <div key={i} className={`px-2.5 py-2 rounded border text-[10px] ${
                      c.severity === 'error' ? 'border-red-400/30 bg-red-400/8' :
                      c.severity === 'warning' ? 'border-yellow-400/30 bg-yellow-400/8' :
                      'border-vscode-border bg-vscode-sidebar'
                    }`}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${
                          c.severity === 'error' ? 'bg-red-400' : c.severity === 'warning' ? 'bg-yellow-400' : 'bg-vscode-accent'
                        }`} />
                        <span className="text-vscode-text truncate">{c.a}</span>
                        <span className="text-vscode-textMuted">×</span>
                        <span className="text-vscode-text truncate">{c.b}</span>
                      </div>
                      <div className="text-vscode-textMuted leading-tight pl-[9px]">{c.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discount gauge */}
            {subtotal > 0 && (
              <div className="px-3 py-3 border-b border-vscode-border">
                <div className="text-[10px] text-vscode-breadcrumb uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
                  <IconShield size={10} /> 折扣率仪表盘
                </div>
                <div className="relative h-[10px] rounded-full bg-vscode-border overflow-hidden mb-1.5">
                  <div className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                    discountPct > 60 ? 'bg-red-400' : discountPct > 40 ? 'bg-yellow-400' : discountPct > 25 ? 'bg-[#dcdcaa]' : 'bg-green-400'
                  }`} style={{ width: `${Math.min(100, discountPct)}%` }} />
                  {/* threshold markers */}
                  <div className="absolute top-0 h-full w-px bg-vscode-text/30" style={{ left: '25%' }} />
                  <div className="absolute top-0 h-full w-px bg-vscode-text/30" style={{ left: '40%' }} />
                  <div className="absolute top-0 h-full w-px bg-vscode-text/30" style={{ left: '60%' }} />
                </div>
                <div className="flex justify-between text-[8px] text-vscode-textMuted">
                  <span>0%</span><span>25%</span><span>40%</span><span>60%</span><span>100%</span>
                </div>
                <div className="text-center mt-1.5">
                  <span className={`text-[14px] font-bold ${
                    discountPct > 60 ? 'text-red-400' : discountPct > 40 ? 'text-yellow-400' : discountPct > 25 ? 'text-[#dcdcaa]' : 'text-green-400'
                  }`}>{discountPct.toFixed(1)}%</span>
                  <span className="text-[9px] text-vscode-textMuted ml-1">总折扣率</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {conflicts.length === 0 && risks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-vscode-textMuted">
                <IconShield size={24} className="opacity-20 mb-2" />
                <span className="text-[11px]">暂无冲突或风险</span>
                <span className="text-[9px] mt-0.5">添加商品后自动检测</span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
