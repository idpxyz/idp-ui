import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import {
  IconSearch,
  IconScan,
  IconBarcode,
  IconCustomer,
  IconTag,
  IconDollar,
  IconShoppingBag,
  IconReceipt,
  IconTrash,
  IconPlus,
  IconMinus,
  IconCheckCircle,
  IconStore,
  IconStar,
  IconSettings,
} from '@idpxyz/ui-icons';
import { ActionModal, ModalInput } from '../components/ActionModal';
import {
  type POSCartItem,
  type POSPaymentMethod,
  type SidebarSelection,
  spuList,
  skuList,
  customers,
  posPaymentMethodConfig,
  coupons,
} from '../data/oms';

interface POSTerminalProps {
  onOpenTab?: (tabId: string, tabName: string, subtitle?: string) => void;
  onSelectObject?: (obj: SidebarSelection | null) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: (next: boolean) => void;
}

interface POSConfig {
  storeName: string;
  cashierName: string;
  gridCols: 3 | 4 | 5 | 6;
  fontSize: 'small' | 'medium' | 'large';
  taxRate: number;
  defaultPayment: POSPaymentMethod;
  showStock: boolean;
  showBrand: boolean;
  quickAmounts: number[];
  receiptFooter: string;
  enableCustomSpec: boolean;
  sugarOptions: string[];
  iceOptions: string[];
  tempOptions: string[];
  toppingOptions: string[];
}

const defaultConfig: POSConfig = {
  storeName: '上海南京路旗舰店',
  cashierName: '张晓',
  gridCols: 4,
  fontSize: 'medium',
  taxRate: 6.4,
  defaultPayment: 'wechat_pay',
  showStock: true,
  showBrand: true,
  quickAmounts: [50, 100, 200, 500],
  receiptFooter: '感谢光临 · 欢迎再次惠顾',
  enableCustomSpec: true,
  sugarOptions: ['全糖', '七分糖', '半糖', '三分糖', '无糖'],
  iceOptions: ['正常冰', '少冰', '去冰'],
  tempOptions: ['冷饮', '常温', '热饮'],
  toppingOptions: ['无加料', '珍珠 +2', '椰果 +2', '奶盖 +3'],
};

const fontSizeMap = {
  small:  { tile: 'text-[10px]', tileEmoji: 'text-[24px]', tilePrice: 'text-[12px]', cart: 'text-[11px]', cartPrice: 'text-[12px]', heading: 'text-[12px]', total: 'text-[16px]', pay: 'text-[13px]', cat: 'text-[11px]' },
  medium: { tile: 'text-[12px]', tileEmoji: 'text-[32px]', tilePrice: 'text-[15px]', cart: 'text-[13px]', cartPrice: 'text-[14px]', heading: 'text-[14px]', total: 'text-[20px]', pay: 'text-[15px]', cat: 'text-[13px]' },
  large:  { tile: 'text-[14px]', tileEmoji: 'text-[40px]', tilePrice: 'text-[18px]', cart: 'text-[15px]', cartPrice: 'text-[16px]', heading: 'text-[16px]', total: 'text-[24px]', pay: 'text-[17px]', cat: 'text-[15px]' },
};

const categoryTabs = ['全部', '电子产品', '服装鞋帽', '美妆个护', '家居生活', '食品生鲜', '母婴玩具'];

export default function POSTerminal({ onOpenTab, isFocusMode = false, onToggleFocusMode }: POSTerminalProps) {
  const { addToast } = useToast();

  // Config state
  const [config, setConfig] = useState<POSConfig>(defaultConfig);
  const [showSettings, setShowSettings] = useState(false);
  const fs = fontSizeMap[config.fontSize];
  const taxRate = config.taxRate / 100;

  // Cart state
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [member, setMember] = useState<{ id: string; name: string; tier: string; points: number } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<POSPaymentMethod>(config.defaultPayment);
  const [cashReceived, setCashReceived] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceiptNo, setLastReceiptNo] = useState('');

  // Member lookup modal
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberSearchInput, setMemberSearchInput] = useState('');
  const [pendingSpuId, setPendingSpuId] = useState<string | null>(null);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [specSugar, setSpecSugar] = useState('半糖');
  const [specIce, setSpecIce] = useState('少冰');
  const [specTemp, setSpecTemp] = useState('冷饮');
  const [specTopping, setSpecTopping] = useState('无加料');
  const [specNote, setSpecNote] = useState('');

  // Filtered products for display
  const displayProducts = useMemo(() => {
    const onSale = spuList.filter(s => s.status === 'on_sale');
    let filtered = onSale;
    if (activeCategory !== '全部') {
      filtered = filtered.filter(s => s.categoryPath.startsWith(activeCategory));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.brand.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    return filtered;
  }, [activeCategory, searchTerm]);

  // Cart calculations
  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const itemDiscount = cart.reduce((s, item) => s + item.discount * item.qty, 0);
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const totalDiscount = itemDiscount + couponDiscount;
  const taxableAmount = subtotal - totalDiscount;
  const tax = Math.round(taxableAmount * taxRate * 100) / 100;
  const total = Math.round((taxableAmount + tax) * 100) / 100;
  const totalQty = cart.reduce((s, item) => s + item.qty, 0);
  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const change = paymentMethod === 'cash' ? Math.max(0, Math.round((cashReceivedNum - total) * 100) / 100) : 0;

  const resolveExtraFee = (topping: string) => {
    const match = /\+(\d+(\.\d+)?)$/.exec(topping);
    return match ? Number(match[1]) : 0;
  };

  const addSkuToCart = (sku: typeof skuList[number], spuImage: string, customSuffix?: string, extraFee = 0) => {
    const lineSkuId = customSuffix ? `${sku.id}::${customSuffix}` : sku.id;
    const lineSkuName = customSuffix ? `${sku.name} · ${customSuffix}` : sku.name;
    setCart(prev => {
      const existing = prev.find(c => c.skuId === lineSkuId);
      if (existing) {
        return prev.map(c => c.skuId === lineSkuId ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, {
        skuId: lineSkuId,
        spuId: sku.spuId,
        name: sku.spuName,
        skuName: lineSkuName,
        image: spuImage || '📦',
        price: sku.price + extraFee,
        originalPrice: sku.originalPrice + extraFee,
        qty: 1,
        discount: 0,
        barcode: sku.barcode,
      }];
    });
  };

  // Add item by barcode
  const handleBarcodeScan = useCallback(() => {
    if (!barcodeInput.trim()) return;
    const sku = skuList.find(s => s.barcode === barcodeInput.trim() && s.status === 'active');
    if (!sku) {
      addToast({ type: 'error', title: '未找到商品', message: `条码 ${barcodeInput} 无匹配商品` });
      setBarcodeInput('');
      return;
    }
    const spu = spuList.find(s => s.id === sku.spuId);
    addSkuToCart(sku, spu?.mainImage || '📦');
    addToast({ type: 'success', title: '已添加', message: `${sku.spuName} ${sku.name}` });
    setBarcodeInput('');
  }, [barcodeInput, addToast]);

  // Add item by clicking product tile
  const handleAddProduct = useCallback((spuId: string, forceCustomize = false) => {
    const spuSkus = skuList.filter(s => s.spuId === spuId && s.status === 'active');
    if (spuSkus.length === 0) {
      addToast({ type: 'warning', title: '库存不足', message: '该商品暂无可售规格' });
      return;
    }
    const sku = spuSkus[0];
    const spu = spuList.find(s => s.id === spuId);
    const shouldCustomize = config.enableCustomSpec && (forceCustomize || spu?.categoryPath.includes('食品') || /(茶|饮|咖啡|奶)/.test(spu?.name || ''));
    if (shouldCustomize) {
      setPendingSpuId(spuId);
      setSpecSugar(config.sugarOptions.includes('半糖') ? '半糖' : config.sugarOptions[0] || '半糖');
      setSpecIce(config.iceOptions.includes('少冰') ? '少冰' : config.iceOptions[0] || '少冰');
      setSpecTemp(config.tempOptions[0] || '冷饮');
      setSpecTopping(config.toppingOptions[0] || '无加料');
      setSpecNote('');
      setShowSpecModal(true);
      return;
    }
    addSkuToCart(sku, spu?.mainImage || '📦');
  }, [addToast, config]);

  const handleConfirmSpecAdd = () => {
    if (!pendingSpuId) return;
    const spuSkus = skuList.filter(s => s.spuId === pendingSpuId && s.status === 'active');
    if (spuSkus.length === 0) return;
    const sku = spuSkus[0];
    const spu = spuList.find(s => s.id === pendingSpuId);
    const suffixCore = `${specSugar}/${specIce}/${specTemp}/${specTopping}`;
    const suffix = specNote.trim() ? `${suffixCore} · ${specNote.trim()}` : suffixCore;
    const extraFee = resolveExtraFee(specTopping);
    addSkuToCart(sku, spu?.mainImage || '📦', suffix, extraFee);
    setShowSpecModal(false);
    setPendingSpuId(null);
    addToast({ type: 'success', title: '已添加定制商品', message: `${spu?.name || sku.spuName} (${suffixCore})` });
  };

  const handleQtyChange = (skuId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.skuId !== skuId) return c;
      const newQty = c.qty + delta;
      return newQty <= 0 ? c : { ...c, qty: newQty };
    }));
  };

  const handleRemoveItem = (skuId: string) => {
    setCart(prev => prev.filter(c => c.skuId !== skuId));
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setMember(null);
    setCouponCode('');
  };

  // Member lookup
  const handleMemberLookup = () => {
    const q = memberSearchInput.trim();
    const found = customers.find(c =>
      c.phone.includes(q) || c.email.includes(q) || c.name === q || c.id === q
    );
    if (found && found.status === 'active') {
      setMember({ id: found.id, name: found.name, tier: found.tier, points: found.loyaltyPoints });
      addToast({ type: 'success', title: '会员已识别', message: `${found.name} (${found.tier.toUpperCase()}) 积分: ${found.loyaltyPoints.toLocaleString()}` });
      setShowMemberModal(false);
    } else if (found) {
      addToast({ type: 'warning', title: '会员状态异常', message: `${found.name} 当前状态: ${found.status}` });
    } else {
      addToast({ type: 'error', title: '未找到会员', message: '请检查输入信息' });
    }
  };

  // Apply coupon
  const handleApplyCoupon = () => {
    const c = coupons.find(cp => cp.code === couponCode.toUpperCase() && cp.status === 'active');
    if (!c) {
      addToast({ type: 'error', title: '无效优惠券', message: `券码 ${couponCode} 无效或已过期` });
      return;
    }
    if (subtotal < c.minOrderAmount) {
      addToast({ type: 'warning', title: '不满足条件', message: `需满 $${c.minOrderAmount} 才可使用` });
      return;
    }
    let discount = 0;
    if (c.type === 'fixed') discount = c.discountValue;
    else if (c.type === 'percentage') discount = Math.min(Math.round(subtotal * c.discountValue / 100 * 100) / 100, c.maxDiscountAmount);
    setAppliedCoupon({ code: c.code, discount });
    addToast({ type: 'success', title: '优惠券已使用', message: `${c.name} 减免 $${discount}` });
  };

  // Checkout
  const handleConfirmPayment = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && cashReceivedNum < total) {
      addToast({ type: 'error', title: '金额不足', message: `现金收取 $${cashReceivedNum.toFixed(2)} 不足以支付 $${total.toFixed(2)}` });
      return;
    }
    const receiptNo = `RCP-${Date.now()}`;
    setLastReceiptNo(receiptNo);
    setShowPayment(false);
    setShowReceipt(true);
    addToast({ type: 'success', title: '收款成功', message: `${posPaymentMethodConfig[paymentMethod].label} $${total.toFixed(2)}` });
  };

  const handleNewTransaction = () => {
    setShowReceipt(false);
    handleClearCart();
    setCashReceived('');
    setPaymentMethod(config.defaultPayment);
  };

  const gridColsClass = { 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' }[config.gridCols];

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor min-w-0">
      {/* Left: Product Catalog — fills all available space */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-idpxyz-border">
        {/* Top bar: store info + barcode + quick nav + settings */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <IconStore size={18} className="text-idpxyz-accent" />
          <span className={`${fs.heading} font-semibold text-idpxyz-textBright`}>{config.storeName}</span>
          <span className={`${fs.tile} text-idpxyz-textMuted`}>· {config.cashierName}</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-idpxyz-inputBg border-2 border-idpxyz-accent/60 rounded-lg px-3 py-1.5">
            <IconBarcode size={18} className="text-idpxyz-accent" />
            <input
              className={`bg-transparent ${fs.cart} text-idpxyz-text outline-none w-[200px] placeholder:text-idpxyz-textMuted`}
              placeholder="扫码 / 输入条码..."
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleBarcodeScan(); }}
            />
            <button className="p-1.5 rounded-md bg-idpxyz-accent text-white hover:opacity-90 active:scale-95 transition-all" onClick={handleBarcodeScan}>
              <IconScan size={18} />
            </button>
          </div>
          <button className="p-2 rounded-lg border border-idpxyz-border hover:bg-idpxyz-hover active:scale-95 transition-all" onClick={() => onOpenTab?.('pos-pickup', 'O2O 核销')}>
            <IconReceipt size={18} className="text-idpxyz-textMuted" />
          </button>
          <button
            className={`px-3 py-2 rounded-lg border transition-all active:scale-95 ${isFocusMode ? 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10' : 'border-idpxyz-border text-idpxyz-textMuted hover:bg-idpxyz-hover'}`}
            onClick={() => onToggleFocusMode?.(!isFocusMode)}
            title={isFocusMode ? '退出 POS 全屏' : '进入 POS 全屏'}
          >
            <span className={fs.tile}>{isFocusMode ? '退出全屏' : '全屏'}</span>
          </button>
          <button className="p-2 rounded-lg border border-idpxyz-border hover:bg-idpxyz-hover active:scale-95 transition-all" onClick={() => setShowSettings(true)}>
            <IconSettings size={18} className="text-idpxyz-textMuted" />
          </button>
        </div>

        {/* Category tabs — large touch targets */}
        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-idpxyz-border shrink-0 overflow-x-auto">
          {categoryTabs.map(cat => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-lg ${fs.cat} font-medium whitespace-nowrap transition-all active:scale-95 ${activeCategory === cat
                ? 'bg-idpxyz-accent text-white shadow-md'
                : 'bg-idpxyz-sidebar text-idpxyz-textMuted border border-idpxyz-border hover:bg-idpxyz-hover'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-1.5">
            <IconSearch size={16} className="text-idpxyz-textMuted" />
            <input
              className={`bg-transparent ${fs.cart} text-idpxyz-text outline-none w-[160px] placeholder:text-idpxyz-textMuted`}
              placeholder="搜索商品..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product grid — large touch tiles */}
        <div className="flex-1 overflow-auto p-4">
          <div className={`grid ${gridColsClass} gap-3`}>
            {displayProducts.map(spu => {
              const inCart = cart.find(c => c.spuId === spu.id);
              const supportsCustomSpec = config.enableCustomSpec;
              return (
                <button
                  key={spu.id}
                  className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all active:scale-[0.97] cursor-pointer text-left ${inCart ? 'border-idpxyz-accent bg-idpxyz-accent/5 shadow-lg' : 'border-idpxyz-border bg-idpxyz-sidebar hover:border-idpxyz-accent/50 hover:shadow-md'}`}
                  onClick={() => handleAddProduct(spu.id)}
                >
                  <span className={`${fs.tileEmoji} mb-2`}>{spu.mainImage}</span>
                  <span className={`${fs.tile} text-idpxyz-textBright font-semibold text-center leading-tight line-clamp-2 w-full`}>{spu.name}</span>
                  {config.showBrand && <span className={`${fs.tile} text-idpxyz-textMuted mt-0.5 opacity-70`}>{spu.brand}</span>}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`${fs.tilePrice} font-bold text-idpxyz-accent`}>${spu.minPrice}</span>
                    {spu.minPrice !== spu.maxPrice && (
                      <span className={`${fs.tile} text-idpxyz-textMuted`}>- ${spu.maxPrice}</span>
                    )}
                  </div>
                  {config.showStock && <span className={`${fs.tile} text-idpxyz-textMuted mt-1 opacity-60`}>库存: {spu.totalStock}</span>}
                  {inCart && (
                    <span className="absolute top-2 right-2 bg-idpxyz-accent text-white text-[13px] font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                      {inCart.qty}
                    </span>
                  )}
                  {spu.tags.includes('热销') && (
                    <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-bold">热销</span>
                  )}
                  {supportsCustomSpec && (
                    <button
                      type="button"
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-[10px] font-medium border border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10 hover:bg-idpxyz-accent/20 active:scale-95"
                      onClick={(e) => { e.stopPropagation(); handleAddProduct(spu.id, true); }}
                    >
                      定制
                    </button>
                  )}
                </button>
              );
            })}
          </div>
          {displayProducts.length === 0 && (
            <div className={`flex items-center justify-center py-20 ${fs.heading} text-idpxyz-textMuted`}>没有匹配商品</div>
          )}
        </div>
      </div>

      {/* Right: Cart + Checkout — wider for touch */}
      <div className="w-[400px] flex flex-col overflow-hidden bg-idpxyz-sidebar shrink-0">
        {/* Cart header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-2">
            <IconShoppingBag size={20} className="text-idpxyz-accent" />
            <span className={`${fs.heading} font-bold text-idpxyz-textBright`}>购物车</span>
            {totalQty > 0 && <span className="text-[12px] px-2 py-0.5 rounded-full bg-idpxyz-accent text-white font-bold">{totalQty}</span>}
          </div>
          {cart.length > 0 && (
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-400/10 active:scale-95 transition-all" onClick={handleClearCart}>
              <IconTrash size={14} /> <span className={fs.tile}>清空</span>
            </button>
          )}
        </div>

        {/* Member bar — large touch */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-idpxyz-border shrink-0">
          <IconCustomer size={16} className="text-idpxyz-textMuted" />
          {member ? (
            <div className="flex items-center gap-2 flex-1">
              <span className={`${fs.cart} text-idpxyz-textBright font-semibold`}>{member.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-idpxyz-accent/20 text-idpxyz-accent font-bold">{member.tier.toUpperCase()}</span>
              <span className={`${fs.tile} text-idpxyz-textMuted ml-auto`}><IconStar size={12} className="inline" /> {member.points.toLocaleString()}</span>
              <button className="text-red-400 hover:bg-red-400/10 px-1.5 py-0.5 rounded" onClick={() => setMember(null)}>
                <IconTrash size={12} />
              </button>
            </div>
          ) : (
            <button className={`${fs.cart} px-4 py-1.5 rounded-lg border border-idpxyz-accent text-idpxyz-accent font-medium hover:bg-idpxyz-accent/10 active:scale-95 transition-all`} onClick={() => { setMemberSearchInput(''); setShowMemberModal(true); }}>
              识别会员
            </button>
          )}
        </div>

        {/* Cart items — larger rows for touch */}
        <div className="flex-1 overflow-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-idpxyz-textMuted">
              <IconShoppingBag size={48} className="opacity-15 mb-3" />
              <span className={`${fs.heading}`}>购物车为空</span>
              <span className={`${fs.tile} mt-1.5 opacity-60`}>扫码或点击商品添加</span>
            </div>
          ) : (
            <div className="divide-y divide-idpxyz-border">
              {cart.map(item => {
                const [baseSkuName, ...specParts] = item.skuName.split(' · ');
                const specText = specParts.join(' · ');
                const specTags = specText ? specText.split('/').map(s => s.trim()).filter(Boolean) : [];
                return (
                  <div key={item.skuId} className="flex items-start gap-3 px-4 py-3 hover:bg-idpxyz-hover/50 active:bg-idpxyz-hover transition-colors">
                    <span className={`${fs.tileEmoji} shrink-0`}>{item.image}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`${fs.cart} text-idpxyz-textBright font-semibold`}>{item.name}</div>
                      <div className={`${fs.tile} text-idpxyz-textMuted mt-0.5`}>{baseSkuName}</div>
                      {specTags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {specTags.map((tag, idx) => (
                            <span key={`${item.skuId}-spec-${idx}`} className="px-1.5 py-0.5 rounded-md text-[10px] border border-idpxyz-accent/40 text-idpxyz-accent bg-idpxyz-accent/10">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`${fs.cartPrice} text-idpxyz-accent font-bold`}>${item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className={`${fs.tile} text-idpxyz-textMuted line-through`}>${item.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-idpxyz-border hover:bg-idpxyz-hover active:scale-90 transition-all text-idpxyz-textMuted" onClick={() => handleQtyChange(item.skuId, -1)}>
                        <IconMinus size={14} />
                      </button>
                      <span className={`${fs.cartPrice} w-10 text-center font-bold text-idpxyz-textBright`}>{item.qty}</span>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-idpxyz-border hover:bg-idpxyz-hover active:scale-90 transition-all text-idpxyz-textMuted" onClick={() => handleQtyChange(item.skuId, 1)}>
                        <IconPlus size={14} />
                      </button>
                    </div>
                    <span className={`${fs.cartPrice} text-idpxyz-textBright font-bold w-[60px] text-right`}>${(item.price * item.qty).toFixed(2)}</span>
                    <button className="p-1.5 rounded-lg text-idpxyz-textMuted hover:text-red-400 hover:bg-red-400/10 active:scale-90 transition-all shrink-0" onClick={() => handleRemoveItem(item.skuId)}>
                      <IconTrash size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coupon input */}
        {cart.length > 0 && !showPayment && !showReceipt && (
          <div className="flex items-center gap-2 px-4 py-2 border-t border-idpxyz-border shrink-0">
            <IconTag size={14} className="text-idpxyz-textMuted" />
            {appliedCoupon ? (
              <div className="flex items-center gap-2 flex-1">
                <span className={`${fs.cart} text-green-400 font-semibold`}>{appliedCoupon.code} -${appliedCoupon.discount}</span>
                <button className={`${fs.tile} text-red-400 hover:underline ml-auto px-2 py-1 rounded hover:bg-red-400/10`} onClick={() => setAppliedCoupon(null)}>移除</button>
              </div>
            ) : (
              <>
                <input
                  className={`flex-1 bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 ${fs.cart} text-idpxyz-text outline-none focus:border-idpxyz-accent`}
                  placeholder="输入优惠券码..."
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleApplyCoupon(); }}
                />
                <button className={`${fs.cart} px-4 py-2 rounded-lg bg-idpxyz-accent/10 text-idpxyz-accent font-medium hover:bg-idpxyz-accent/20 active:scale-95 transition-all`} onClick={handleApplyCoupon}>使用</button>
              </>
            )}
          </div>
        )}

        {/* Cart summary + pay button */}
        {cart.length > 0 && !showPayment && !showReceipt && (
          <div className="border-t border-idpxyz-border px-4 py-3 shrink-0 space-y-1.5">
            <div className={`flex justify-between ${fs.cart}`}><span className="text-idpxyz-textMuted">小计 ({totalQty}件)</span><span className="text-idpxyz-text">${subtotal.toFixed(2)}</span></div>
            {totalDiscount > 0 && <div className={`flex justify-between ${fs.cart}`}><span className="text-idpxyz-textMuted">优惠</span><span className="text-green-400">-${totalDiscount.toFixed(2)}</span></div>}
            <div className={`flex justify-between ${fs.cart}`}><span className="text-idpxyz-textMuted">税费 ({config.taxRate}%)</span><span className="text-idpxyz-text">${tax.toFixed(2)}</span></div>
            <div className={`flex justify-between ${fs.total} font-bold pt-2 border-t border-idpxyz-border mt-2`}>
              <span className="text-idpxyz-textBright">应收</span>
              <span className="text-idpxyz-accent">${total.toFixed(2)}</span>
            </div>
            <button className={`w-full mt-3 py-4 rounded-xl bg-idpxyz-accent text-white ${fs.pay} font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg`} onClick={() => setShowPayment(true)}>
              <IconDollar size={20} /> 收款 ${total.toFixed(2)}
            </button>
          </div>
        )}

        {/* Payment panel */}
        {showPayment && !showReceipt && (
          <div className="border-t border-idpxyz-border px-4 py-4 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`${fs.heading} font-bold text-idpxyz-textBright`}>选择支付方式</span>
              <button className={`${fs.cart} px-3 py-1 rounded-lg text-idpxyz-accent hover:bg-idpxyz-accent/10`} onClick={() => setShowPayment(false)}>返回</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(posPaymentMethodConfig) as [POSPaymentMethod, { label: string }][]).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 ${fs.cart} transition-all active:scale-95 ${paymentMethod === key ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent font-bold shadow-md' : 'border-idpxyz-border text-idpxyz-textMuted hover:border-idpxyz-accent/50'}`}
                  onClick={() => setPaymentMethod(key)}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            {paymentMethod === 'cash' && (
              <div className="space-y-2">
                <div className={`${fs.cart} text-idpxyz-textMuted`}>收取现金</div>
                <input
                  className={`w-full bg-idpxyz-inputBg border-2 border-idpxyz-border rounded-xl px-4 py-3 ${fs.total} font-bold text-idpxyz-textBright outline-none focus:border-idpxyz-accent text-center`}
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={e => setCashReceived(e.target.value)}
                  type="number"
                  step="0.01"
                  autoFocus
                />
                <div className="flex gap-2">
                  {[total, ...config.quickAmounts].filter((v, i, arr) => arr.indexOf(v) === i && v >= total).sort((a, b) => a - b).slice(0, 4).map(v => (
                    <button key={v} className={`flex-1 py-2.5 rounded-xl border-2 border-idpxyz-border ${fs.cart} text-idpxyz-text font-medium hover:border-idpxyz-accent active:scale-95 transition-all`} onClick={() => setCashReceived(v.toFixed(2))}>
                      ${v.toFixed(0)}
                    </button>
                  ))}
                </div>
                {cashReceivedNum >= total && (
                  <div className={`flex justify-between ${fs.heading} font-bold mt-1`}>
                    <span className="text-idpxyz-textMuted">找零</span>
                    <span className="text-yellow-400">${change.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
            <div className={`flex justify-between ${fs.total} font-bold pt-2 border-t border-idpxyz-border`}>
              <span className="text-idpxyz-textBright">应收</span>
              <span className="text-idpxyz-accent">${total.toFixed(2)}</span>
            </div>
            <button
              className={`w-full py-4 rounded-xl bg-green-600 text-white ${fs.pay} font-bold flex items-center justify-center gap-2 hover:bg-green-500 active:scale-[0.98] transition-all shadow-lg`}
              onClick={handleConfirmPayment}
            >
              <IconCheckCircle size={22} /> 确认收款
            </button>
          </div>
        )}

        {/* Receipt panel */}
        {showReceipt && (
          <div className="border-t border-idpxyz-border px-4 py-4 flex-1 overflow-auto">
            <div className="flex flex-col items-center mb-4">
              <IconCheckCircle size={40} className="text-green-400 mb-2" />
              <span className={`${fs.total} font-bold text-green-400`}>收款成功</span>
            </div>
            <div className="bg-idpxyz-editor border border-idpxyz-border rounded-xl p-4 space-y-2 text-[12px]">
              <div className={`text-center font-bold ${fs.heading} text-idpxyz-textBright mb-3 pb-3 border-b border-dashed border-idpxyz-border`}>
                MyShop · {config.storeName}
              </div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">单号</span><span className="text-idpxyz-text font-mono">{lastReceiptNo}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">时间</span><span className="text-idpxyz-text">{new Date().toLocaleString('zh-CN')}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">收银员</span><span className="text-idpxyz-text">{config.cashierName}</span></div>
              {member && <div className="flex justify-between"><span className="text-idpxyz-textMuted">会员</span><span className="text-idpxyz-text">{member.name}</span></div>}
              <div className="border-t border-dashed border-idpxyz-border pt-2 mt-2 space-y-1.5">
                {cart.map(item => (
                  <div key={item.skuId} className="flex justify-between">
                    <span className="text-idpxyz-text truncate flex-1">{item.name} x{item.qty}</span>
                    <span className="text-idpxyz-text ml-2">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-idpxyz-border pt-2 mt-2 space-y-1">
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">小计</span><span>${subtotal.toFixed(2)}</span></div>
                {totalDiscount > 0 && <div className="flex justify-between"><span className="text-idpxyz-textMuted">优惠</span><span className="text-green-400">-${totalDiscount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">税费</span><span>${tax.toFixed(2)}</span></div>
                <div className={`flex justify-between font-bold ${fs.heading}`}><span className="text-idpxyz-textBright">合计</span><span className="text-idpxyz-accent">${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-idpxyz-textMuted">支付方式</span><span>{posPaymentMethodConfig[paymentMethod].label}</span></div>
                {paymentMethod === 'cash' && <>
                  <div className="flex justify-between"><span className="text-idpxyz-textMuted">收取</span><span>${cashReceivedNum.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-idpxyz-textMuted">找零</span><span className="text-yellow-400">${change.toFixed(2)}</span></div>
                </>}
                {member && <div className="flex justify-between"><span className="text-idpxyz-textMuted">获得积分</span><span className="text-yellow-400">+{Math.floor(total)}</span></div>}
              </div>
              <div className={`text-center ${fs.tile} text-idpxyz-textMuted pt-3 border-t border-dashed border-idpxyz-border mt-3`}>
                {config.receiptFooter}
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className={`flex-1 py-3 rounded-xl border-2 border-idpxyz-border ${fs.cart} text-idpxyz-text font-medium flex items-center justify-center gap-2 hover:bg-idpxyz-hover active:scale-95 transition-all`} onClick={() => addToast({ type: 'success', title: '打印中', message: '小票正在打印...' })}>
                <IconReceipt size={16} /> 打印小票
              </button>
              <button className={`flex-1 py-3 rounded-xl bg-idpxyz-accent text-white ${fs.cart} font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg`} onClick={handleNewTransaction}>
                <IconPlus size={16} /> 下一单
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Member lookup modal */}
      <ActionModal
        open={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title="会员识别"
        description="输入会员手机号、邮箱或会员ID查询"
        confirmLabel="查询"
        onConfirm={handleMemberLookup}
      >
        <ModalInput label="手机号 / 邮箱 / 会员ID" placeholder="请输入..." value={memberSearchInput} onChange={setMemberSearchInput} />
      </ActionModal>

      {showSpecModal && (
        <div className="absolute inset-0 z-50 bg-black/55 flex items-center justify-center p-4" onClick={() => { setShowSpecModal(false); setPendingSpuId(null); }}>
          <div className="w-full max-w-[980px] h-[76vh] bg-idpxyz-sidebar border border-idpxyz-border rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-idpxyz-border flex items-center justify-between">
              <div>
                <div className="text-[18px] font-bold text-idpxyz-textBright">规格定制</div>
                <div className="text-[12px] text-idpxyz-textMuted mt-1">居中面板 · 触屏优化 · 快速预设</div>
              </div>
              <button
                type="button"
                className="px-4 h-10 rounded-lg border border-idpxyz-border text-[13px] text-idpxyz-text hover:bg-idpxyz-hover active:scale-95 transition-all"
                onClick={() => { setShowSpecModal(false); setPendingSpuId(null); }}
              >
                关闭
              </button>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-[320px_1fr]">
              <div className="border-r border-idpxyz-border p-5 space-y-4 overflow-auto">
                <div className="rounded-xl border border-idpxyz-border bg-idpxyz-editor p-4">
                  <div className="text-[11px] text-idpxyz-textMuted">当前配置</div>
                  <div className="mt-2 text-[14px] text-idpxyz-textBright font-semibold leading-relaxed">
                    {specSugar} · {specIce} · {specTemp}
                  </div>
                  <div className="mt-1 text-[13px] text-idpxyz-accent font-medium">{specTopping}</div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold text-idpxyz-textBright mb-2">快捷预设</div>
                  <div className="space-y-2">
                    <button type="button" className="w-full h-12 rounded-lg border-2 border-idpxyz-border text-[13px] text-idpxyz-text hover:border-idpxyz-accent/60 active:scale-95 transition-all text-left px-3" onClick={() => { setSpecSugar('半糖'); setSpecIce('少冰'); setSpecTemp('冷饮'); setSpecTopping('无加料'); }}>
                      标准：半糖 / 少冰 / 冷饮
                    </button>
                    <button type="button" className="w-full h-12 rounded-lg border-2 border-idpxyz-border text-[13px] text-idpxyz-text hover:border-idpxyz-accent/60 active:scale-95 transition-all text-left px-3" onClick={() => { setSpecSugar('无糖'); setSpecIce('去冰'); setSpecTemp('冷饮'); setSpecTopping('无加料'); }}>
                      健康：无糖 / 去冰 / 冷饮
                    </button>
                    <button type="button" className="w-full h-12 rounded-lg border-2 border-idpxyz-border text-[13px] text-idpxyz-text hover:border-idpxyz-accent/60 active:scale-95 transition-all text-left px-3" onClick={() => { setSpecSugar('全糖'); setSpecIce('正常冰'); setSpecTemp('冷饮'); setSpecTopping('珍珠 +2'); }}>
                      重口：全糖 / 正常冰 / 珍珠+2
                    </button>
                  </div>
                </div>

                <ModalInput label="备注（可选）" placeholder="例如：少奶/先做热饮后加冰" value={specNote} onChange={setSpecNote} />
              </div>

              <div className="p-5 overflow-auto space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-idpxyz-textBright mb-2">糖度</label>
                  <div className="grid grid-cols-4 gap-2">
                    {config.sugarOptions.map(op => (
                      <button key={op} type="button" className={`h-12 rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95 ${specSugar === op ? 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10' : 'border-idpxyz-border text-idpxyz-text hover:border-idpxyz-accent/60'}`} onClick={() => setSpecSugar(op)}>
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-idpxyz-textBright mb-2">冰度</label>
                  <div className="grid grid-cols-4 gap-2">
                    {config.iceOptions.map(op => (
                      <button key={op} type="button" className={`h-12 rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95 ${specIce === op ? 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10' : 'border-idpxyz-border text-idpxyz-text hover:border-idpxyz-accent/60'}`} onClick={() => setSpecIce(op)}>
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-idpxyz-textBright mb-2">温度</label>
                  <div className="grid grid-cols-3 gap-2">
                    {config.tempOptions.map(op => (
                      <button key={op} type="button" className={`h-12 rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95 ${specTemp === op ? 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10' : 'border-idpxyz-border text-idpxyz-text hover:border-idpxyz-accent/60'}`} onClick={() => setSpecTemp(op)}>
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-idpxyz-textBright mb-2">加料</label>
                  <div className="grid grid-cols-3 gap-2">
                    {config.toppingOptions.map(op => (
                      <button key={op} type="button" className={`h-12 rounded-lg border-2 text-[13px] font-semibold transition-all active:scale-95 ${specTopping === op ? 'border-idpxyz-accent text-idpxyz-accent bg-idpxyz-accent/10' : 'border-idpxyz-border text-idpxyz-text hover:border-idpxyz-accent/60'}`} onClick={() => setSpecTopping(op)}>
                        {op}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-idpxyz-border grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-14 rounded-xl border-2 border-idpxyz-border text-[16px] font-bold text-idpxyz-text hover:bg-idpxyz-hover active:scale-95 transition-all"
                onClick={() => { setShowSpecModal(false); setPendingSpuId(null); }}
              >
                取消
              </button>
              <button
                type="button"
                className="h-14 rounded-xl bg-idpxyz-accent text-white text-[16px] font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
                onClick={handleConfirmSpecAdd}
              >
                加入购物车
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings panel overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSettings(false)}>
          <div className="bg-idpxyz-sidebar border border-idpxyz-border rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-idpxyz-border">
              <div className="flex items-center gap-2">
                <IconSettings size={18} className="text-idpxyz-accent" />
                <span className="text-[16px] font-bold text-idpxyz-textBright">POS 终端设置</span>
              </div>
              <button className="px-4 py-1.5 rounded-lg text-[13px] text-idpxyz-accent hover:bg-idpxyz-accent/10 active:scale-95 transition-all" onClick={() => setShowSettings(false)}>关闭</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Store & Cashier */}
              <div className="space-y-3">
                <div className="text-[12px] font-bold text-idpxyz-textMuted uppercase tracking-wider">门店信息</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">门店名称</label>
                    <input className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent" value={config.storeName} onChange={e => setConfig(c => ({ ...c, storeName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">收银员</label>
                    <input className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent" value={config.cashierName} onChange={e => setConfig(c => ({ ...c, cashierName: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Display */}
              <div className="space-y-3">
                <div className="text-[12px] font-bold text-idpxyz-textMuted uppercase tracking-wider">显示设置</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">商品列数</label>
                    <div className="flex gap-1.5">
                      {([3, 4, 5, 6] as const).map(n => (
                        <button key={n} className={`flex-1 py-2 rounded-lg border-2 text-[13px] font-medium transition-all active:scale-95 ${config.gridCols === n ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent' : 'border-idpxyz-border text-idpxyz-textMuted hover:border-idpxyz-accent/50'}`} onClick={() => setConfig(c => ({ ...c, gridCols: n }))}>
                          {n}列
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">字体大小</label>
                    <div className="flex gap-1.5">
                      {(['small', 'medium', 'large'] as const).map(s => (
                        <button key={s} className={`flex-1 py-2 rounded-lg border-2 text-[13px] font-medium transition-all active:scale-95 ${config.fontSize === s ? 'border-idpxyz-accent bg-idpxyz-accent/10 text-idpxyz-accent' : 'border-idpxyz-border text-idpxyz-textMuted hover:border-idpxyz-accent/50'}`} onClick={() => setConfig(c => ({ ...c, fontSize: s }))}>
                          {{ small: '小', medium: '中', large: '大' }[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={config.showStock} onChange={e => setConfig(c => ({ ...c, showStock: e.target.checked }))} className="w-4 h-4 accent-idpxyz-accent" />
                    <span className="text-[13px] text-idpxyz-text">显示库存</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={config.showBrand} onChange={e => setConfig(c => ({ ...c, showBrand: e.target.checked }))} className="w-4 h-4 accent-idpxyz-accent" />
                    <span className="text-[13px] text-idpxyz-text">显示品牌</span>
                  </label>
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-3">
                <div className="text-[12px] font-bold text-idpxyz-textMuted uppercase tracking-wider">收银设置</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">税率 (%)</label>
                    <input type="number" step="0.1" min="0" max="30" className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent" value={config.taxRate} onChange={e => setConfig(c => ({ ...c, taxRate: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">默认支付方式</label>
                    <select className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none" value={config.defaultPayment} onChange={e => setConfig(c => ({ ...c, defaultPayment: e.target.value as POSPaymentMethod }))}>
                      {(Object.entries(posPaymentMethodConfig) as [POSPaymentMethod, { label: string }][]).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[12px] font-bold text-idpxyz-textMuted uppercase tracking-wider">规格定制</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enableCustomSpec}
                    onChange={e => setConfig(c => ({ ...c, enableCustomSpec: e.target.checked }))}
                    className="w-4 h-4 accent-idpxyz-accent"
                  />
                  <span className="text-[13px] text-idpxyz-text">启用饮品/食品规格选择（无糖/去冰）</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">糖度选项（逗号分隔）</label>
                    <input
                      className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent"
                      value={config.sugarOptions.join('，')}
                      onChange={e => setConfig(c => ({ ...c, sugarOptions: e.target.value.split(/[，,]/).map(v => v.trim()).filter(Boolean) }))}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">冰度选项（逗号分隔）</label>
                    <input
                      className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent"
                      value={config.iceOptions.join('，')}
                      onChange={e => setConfig(c => ({ ...c, iceOptions: e.target.value.split(/[，,]/).map(v => v.trim()).filter(Boolean) }))}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">温度选项（逗号分隔）</label>
                    <input
                      className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent"
                      value={config.tempOptions.join('，')}
                      onChange={e => setConfig(c => ({ ...c, tempOptions: e.target.value.split(/[，,]/).map(v => v.trim()).filter(Boolean) }))}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-idpxyz-textMuted mb-1 block">加料选项（如“珍珠 +2”）</label>
                    <input
                      className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent"
                      value={config.toppingOptions.join('，')}
                      onChange={e => setConfig(c => ({ ...c, toppingOptions: e.target.value.split(/[，,]/).map(v => v.trim()).filter(Boolean) }))}
                    />
                  </div>
                </div>
              </div>

              {/* Receipt */}
              <div className="space-y-3">
                <div className="text-[12px] font-bold text-idpxyz-textMuted uppercase tracking-wider">小票设置</div>
                <div>
                  <label className="text-[11px] text-idpxyz-textMuted mb-1 block">小票底部文字</label>
                  <input className="w-full bg-idpxyz-inputBg border border-idpxyz-border rounded-lg px-3 py-2 text-[13px] text-idpxyz-text outline-none focus:border-idpxyz-accent" value={config.receiptFooter} onChange={e => setConfig(c => ({ ...c, receiptFooter: e.target.value }))} />
                </div>
              </div>

              {/* Reset */}
              <div className="flex justify-end pt-2 border-t border-idpxyz-border">
                <button className="px-4 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-400/10 active:scale-95 transition-all" onClick={() => { setConfig(defaultConfig); addToast({ type: 'info', title: '已重置', message: '所有设置已恢复默认值' }); }}>
                  恢复默认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
