import { useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconHash,
  IconClock,
  IconPackage,
  IconBilling,
  IconShipment,
  IconWarning,
  IconCheckCircle,
  IconMoreH,
  IconUser,
  IconShield,
  IconBell,
  IconRefresh,
  IconPause,
  IconPlay,
  IconClose,
  IconReturn,
  IconEdit,
  IconLocation,
  IconTag,
  IconFileText,
  IconMessage,
  IconUserPlus,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Order,
  orderStatusConfig,
  paymentStatusConfig,
  fulfillmentStatusConfig,
  riskLevelConfig,
  orderLineItems,
  orderTimelines,
  exceptions as allExceptions,
} from '../data/oms';

interface OrderDetailProps {
  orderId: string;
  onBack?: () => void;
}

function Section({ title, defaultExpanded = true, children }: { title: string; defaultExpanded?: boolean; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="border-b border-idpxyz-border">
      <div className="flex items-center h-[28px] px-3 text-[11px] uppercase font-bold tracking-wide cursor-pointer hover:bg-idpxyz-hover" onClick={() => setExpanded(!expanded)}>
        {expanded ? <IconChevronDown size={14} className="mr-1" /> : <IconChevronRight size={14} className="mr-1" />}
        <span>{title}</span>
      </div>
      {expanded && <div className="pb-3">{children}</div>}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, valueColor }: { icon: React.ElementType; label: string; value: string | React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-start gap-2 px-4 py-1.5 text-[12px]">
      <Icon size={13} className="text-idpxyz-textMuted shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-idpxyz-textMuted text-[11px]">{label}</div>
        <div className={`${valueColor || 'text-idpxyz-text'}`}>{value}</div>
      </div>
    </div>
  );
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

// Lookup order from mock data
import { orders as allOrders } from '../data/oms';

export default function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const order = allOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center text-idpxyz-textMuted text-[13px]">
        未找到订单: {orderId}
      </div>
    );
  }

  const os = orderStatusConfig[order.status];
  const ps = paymentStatusConfig[order.paymentStatus];
  const fs = fulfillmentStatusConfig[order.fulfillmentStatus];
  const rl = riskLevelConfig[order.riskLevel];
  const lineItems = orderLineItems[orderId] || [];
  const timeline = orderTimelines[orderId] || [];
  const relatedExceptions = allExceptions.filter(e => e.orderId === orderId);

  const tabs = [
    { id: 'overview', label: '概览' },
    { id: 'items', label: `商品 (${lineItems.length})` },
    { id: 'payment', label: '支付' },
    { id: 'fulfillment', label: '履约' },
    { id: 'timeline', label: '时间线' },
    { id: 'notes', label: '备注' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Object Header (Section 11.2) */}
        <div className="px-5 py-3 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="h-6 w-6">
                  <IconChevronRight size={14} className="rotate-180" />
                </Button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[14px] font-semibold text-idpxyz-textBright">{order.id}</h1>
                  <StatusBadge {...os} />
                  {order.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-idpxyz-textMuted">
                  <span>{order.channel} \u00B7 {order.store}</span>
                  <span>创建于 {order.createdAt}</span>
                  <span>{order.customerName}</span>
                </div>
              </div>
            </div>
            {/* Header Actions (Section 11.3) */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm"><IconEdit size={12} /> 编辑</Button>
              <Button variant="ghost" size="sm"><IconPause size={12} /> 暂挂</Button>
              <Button variant="ghost" size="sm"><IconRefresh size={12} /> 重新分配</Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><IconClose size={12} /> 取消</Button>
              <Button variant="ghost" size="icon"><IconMoreH size={14} /></Button>
            </div>
          </div>

          {/* Context Bar (Section 11.4) */}
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-idpxyz-border/50">
            <div className="flex items-center gap-1.5">
              <IconPackage size={12} className="text-idpxyz-textMuted" />
              <span className="text-[11px] text-idpxyz-textMuted">订单:</span>
              <StatusBadge {...os} />
            </div>
            <div className="flex items-center gap-1.5">
              <IconBilling size={12} className="text-idpxyz-textMuted" />
              <span className="text-[11px] text-idpxyz-textMuted">支付:</span>
              <StatusBadge {...ps} />
            </div>
            <div className="flex items-center gap-1.5">
              <IconShipment size={12} className="text-idpxyz-textMuted" />
              <span className="text-[11px] text-idpxyz-textMuted">履约:</span>
              <StatusBadge {...fs} />
            </div>
            <div className="flex items-center gap-1.5">
              <IconShield size={12} className="text-idpxyz-textMuted" />
              <span className="text-[11px] text-idpxyz-textMuted">风险:</span>
              <StatusBadge {...rl} />
            </div>
            <div className="flex items-center gap-1.5">
              <IconClock size={12} className={order.slaHoursRemaining < 0 ? 'text-red-400' : order.slaHoursRemaining <= 6 ? 'text-yellow-400' : 'text-idpxyz-textMuted'} />
              <span className={`text-[11px] font-mono ${order.slaHoursRemaining < 0 ? 'text-red-400' : order.slaHoursRemaining <= 6 ? 'text-yellow-400' : 'text-idpxyz-textMuted'}`}>
                SLA: {order.slaHoursRemaining > 0 ? `剩余 ${order.slaHoursRemaining}小时` : order.slaHoursRemaining < 0 ? `超期 ${Math.abs(order.slaHoursRemaining)}小时` : '无'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs (Section 12) */}
        <div className="flex items-center h-[35px] border-b border-idpxyz-border shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-full px-4 text-[11px] uppercase tracking-wide border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-idpxyz-text border-b-idpxyz-accent font-medium'
                  : 'text-idpxyz-textMuted border-transparent hover:text-idpxyz-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === 'overview' && <OverviewTab order={order} lineItems={lineItems} relatedExceptions={relatedExceptions} timeline={timeline} />}
          {activeTab === 'items' && <ItemsTab lineItems={lineItems} currency={order.currency} />}
          {activeTab === 'payment' && <PaymentTab order={order} />}
          {activeTab === 'fulfillment' && <FulfillmentTab order={order} lineItems={lineItems} />}
          {activeTab === 'timeline' && <TimelineTab events={timeline} />}
          {activeTab === 'notes' && <NotesTab />}
        </div>
      </div>

      {/* Right Inspector (Section 13) */}
      <div className="w-[280px] border-l border-idpxyz-border bg-idpxyz-sidebar flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-idpxyz-breadcrumb shrink-0">
          <span>检查器</span>
          <IconMoreH size={14} className="text-idpxyz-textMuted cursor-pointer" />
        </div>
        <InspectorPanel order={order} relatedExceptions={relatedExceptions} />
      </div>
    </div>
  );
}

// ── Overview Tab (Section 12.1) ──
function OverviewTab({ order, lineItems, relatedExceptions, timeline }: { order: Order; lineItems: any[]; relatedExceptions: any[]; timeline: any[] }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-4">
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-idpxyz-breadcrumb mb-2">订单概况</h3>
          <div className="space-y-1 border border-idpxyz-border rounded-md p-3">
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">客户</span><span className="text-idpxyz-text">{order.customerName}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">邮箱</span><span className="text-idpxyz-text">{order.customerEmail}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">渠道</span><span className="text-idpxyz-text">{order.channel} / {order.store}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">国家</span><span className="text-idpxyz-text">{order.country}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">总额</span><span className="text-idpxyz-textBright font-medium">{order.currency} {order.totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">商品</span><span className="text-idpxyz-text">{order.itemCount}</span></div>
            {order.tags.length > 0 && (
              <div className="flex justify-between text-[12px] items-start">
                <span className="text-idpxyz-textMuted">标签</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {order.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-idpxyz-breadcrumb mb-2">履约概况</h3>
          <div className="space-y-1 border border-idpxyz-border rounded-md p-3">
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">仓库</span><span className="text-idpxyz-text">{order.warehouse}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">已分配</span><span className="text-idpxyz-text">{lineItems.filter(l => l.allocatedQty > 0).length}/{lineItems.length}</span></div>
            <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">已履约</span><span className="text-idpxyz-text">{lineItems.filter(l => l.fulfilledQty > 0).length}/{lineItems.length}</span></div>
            {lineItems.some(l => l.issue) && (
              <div className="mt-1 px-2 py-1.5 rounded bg-red-500/10 text-[11px] text-red-400 flex items-center gap-1.5">
                <IconWarning size={12} /> {lineItems.filter(l => l.issue).length} 件商品存在问题
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {relatedExceptions.length > 0 && (
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-idpxyz-breadcrumb mb-2">风险 / 异常</h3>
            <div className="space-y-1">
              {relatedExceptions.map(exc => (
                <div key={exc.id} className="flex items-start gap-2 p-2.5 rounded border border-idpxyz-border">
                  <IconWarning size={13} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 text-[11px]">
                    <div className="text-idpxyz-accent font-medium">{exc.id} - {exc.type.replace(/_/g, ' ')}</div>
                    <div className="text-idpxyz-text mt-0.5">{exc.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-idpxyz-breadcrumb mb-2">最近动态</h3>
          <div className="space-y-0">
            {timeline.slice(0, 5).map((evt, i) => (
              <div key={i} className="flex gap-2 py-1.5 text-[11px] border-l-2 border-idpxyz-border ml-1 pl-2 relative">
                <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${i === 0 ? 'bg-idpxyz-accent' : 'bg-idpxyz-border'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-idpxyz-text">{evt.action}</div>
                  <div className="text-idpxyz-textMuted">{evt.actor} \u00B7 {evt.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Items Tab (Section 12.2) ──
function ItemsTab({ lineItems, currency }: { lineItems: any[]; currency: string }) {
  const sym = currency === 'USD' ? '$' : currency === 'EUR' ? '\u20AC' : currency;
  return (
    <table className="w-full text-[12px] border-collapse">
      <thead>
        <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left">
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border">SKU</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border">商品名称</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">下单数</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">已分配</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">已履约</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-center">已退货</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">单价</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">折扣</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right">税费</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border">来源</th>
          <th className="px-3 py-2 font-medium border-b border-idpxyz-border">问题</th>
        </tr>
      </thead>
      <tbody>
        {lineItems.map(item => (
          <tr key={item.sku} className="hover:bg-idpxyz-hover">
            <td className="px-3 py-2 border-b border-idpxyz-border text-idpxyz-accent font-mono">{item.sku}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-idpxyz-text">{item.name}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-center text-idpxyz-text">{item.orderedQty}</td>
            <td className={`px-3 py-2 border-b border-idpxyz-border text-center ${item.allocatedQty < item.orderedQty ? 'text-yellow-400' : 'text-idpxyz-text'}`}>{item.allocatedQty}</td>
            <td className={`px-3 py-2 border-b border-idpxyz-border text-center ${item.fulfilledQty < item.orderedQty ? 'text-idpxyz-textMuted' : 'text-green-400'}`}>{item.fulfilledQty}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-center text-idpxyz-textMuted">{item.returnedQty}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-right text-idpxyz-text">{sym}{item.unitPrice.toFixed(2)}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-right text-idpxyz-textMuted">{item.discount > 0 ? `-${sym}${item.discount.toFixed(2)}` : '-'}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-right text-idpxyz-textMuted">{sym}{item.tax.toFixed(2)}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border text-idpxyz-textMuted">{item.inventorySource}</td>
            <td className="px-3 py-2 border-b border-idpxyz-border">
              {item.issue ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">{item.issue}</span> : <span className="text-idpxyz-textMuted">-</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Payment Tab (Section 12.3) ──
function PaymentTab({ order }: { order: Order }) {
  const ps = paymentStatusConfig[order.paymentStatus];
  return (
    <div className="max-w-lg space-y-4">
      <div className="border border-idpxyz-border rounded-md p-4 space-y-2">
        <h3 className="text-[12px] font-semibold text-idpxyz-breadcrumb uppercase tracking-wider mb-2">支付信息</h3>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">状态</span><StatusBadge {...ps} /></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">支付方式</span><span className="text-idpxyz-text">Visa ****4821</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">金额</span><span className="text-idpxyz-textBright font-medium">{order.currency} {order.totalAmount.toLocaleString()}</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">授权号</span><span className="text-idpxyz-text">AUTH-{order.id.slice(-6)}</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">扣款</span><span className="text-idpxyz-text">{order.paymentStatus === 'captured' ? '已扣款' : '待扣款'}</span></div>
      </div>
      <div className="border border-idpxyz-border rounded-md p-4">
        <h3 className="text-[12px] font-semibold text-idpxyz-breadcrumb uppercase tracking-wider mb-2">交易记录</h3>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2 py-1"><IconClock size={11} className="text-idpxyz-textMuted" /><span className="text-idpxyz-textMuted">{order.createdAt}</span><span className="text-idpxyz-text">请求授权</span></div>
          <div className="flex items-center gap-2 py-1"><IconCheckCircle size={11} className="text-green-400" /><span className="text-idpxyz-textMuted">{order.createdAt}</span><span className="text-idpxyz-text">授权成功</span></div>
          {order.paymentStatus === 'captured' && (
            <div className="flex items-center gap-2 py-1"><IconCheckCircle size={11} className="text-green-400" /><span className="text-idpxyz-textMuted">{order.updatedAt}</span><span className="text-idpxyz-text">已扣款</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Fulfillment Tab (Section 12.4) ──
function FulfillmentTab({ order, lineItems }: { order: Order; lineItems: any[] }) {
  const fs = fulfillmentStatusConfig[order.fulfillmentStatus];
  return (
    <div className="max-w-lg space-y-4">
      <div className="border border-idpxyz-border rounded-md p-4 space-y-2">
        <h3 className="text-[12px] font-semibold text-idpxyz-breadcrumb uppercase tracking-wider mb-2">履约状态</h3>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">状态</span><StatusBadge {...fs} /></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">仓库</span><span className="text-idpxyz-text">{order.warehouse}</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">已分配</span><span className="text-idpxyz-text">{lineItems.filter(l => l.allocatedQty > 0).length}/{lineItems.length} 件</span></div>
        <div className="flex justify-between text-[12px]"><span className="text-idpxyz-textMuted">已履约</span><span className="text-idpxyz-text">{lineItems.filter(l => l.fulfilledQty > 0).length}/{lineItems.length} 件</span></div>
      </div>
      {lineItems.some(l => l.issue) && (
        <div className="border border-red-500/30 rounded-md p-4 bg-red-500/5">
          <h3 className="text-[12px] font-semibold text-red-400 uppercase tracking-wider mb-2">履约问题</h3>
          {lineItems.filter(l => l.issue).map(item => (
            <div key={item.sku} className="flex items-center gap-2 py-1 text-[11px]">
              <IconWarning size={12} className="text-red-400 shrink-0" />
              <span className="text-idpxyz-accent font-mono">{item.sku}</span>
              <span className="text-idpxyz-text">{item.issue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Timeline Tab (Section 12.7) ──
function TimelineTab({ events }: { events: any[] }) {
  const typeIcon: Record<string, React.ElementType> = { system: IconRefresh, human: IconUser, external: IconPackage, payment: IconBilling, shipment: IconShipment };
  const typeColor: Record<string, string> = { system: 'text-idpxyz-textMuted', human: 'text-idpxyz-accent', external: 'text-green-400', payment: 'text-yellow-400', shipment: 'text-blue-400' };
  return (
    <div className="max-w-2xl space-y-0">
      {events.map((evt, i) => {
        const Icon = typeIcon[evt.type] || IconPackage;
        const color = typeColor[evt.type] || 'text-idpxyz-textMuted';
        return (
          <div key={i} className="flex gap-3 py-2.5 border-l-2 border-idpxyz-border ml-3 pl-3 relative">
            <div className={`absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-idpxyz-editor border-2 border-idpxyz-border flex items-center justify-center ${i === 0 ? 'border-idpxyz-accent' : ''}`}>
              <Icon size={9} className={i === 0 ? 'text-idpxyz-accent' : color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-idpxyz-text">{evt.action}</div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                <span className={color}>{evt.actor}</span>
                <span className="text-idpxyz-textMuted">{evt.time}</span>
              </div>
            </div>
          </div>
        );
      })}
      {events.length === 0 && (
        <div className="text-[12px] text-idpxyz-textMuted py-4">此订单暂无时间线事件。</div>
      )}
    </div>
  );
}

// ── Notes Tab (Section 12.8) ──
function NotesTab() {
  return (
    <div className="max-w-2xl space-y-3">
      {[
        { time: '14:30', user: '王丽', avatar: '王', text: '客户来电要求更新收货地址，需要与仓库确认是否需要重新分配。' },
        { time: '10:15', user: '刘建', avatar: '刘', text: '审查了风险标记。客户账户是新账户但支付已验证。谨慎处理中。' },
      ].map((note, i) => (
        <div key={i} className="flex gap-2 py-2">
          <div className="w-7 h-7 rounded-full bg-idpxyz-accent/20 text-idpxyz-accent text-[10px] font-bold flex items-center justify-center shrink-0">{note.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-idpxyz-accent font-medium text-[11px]">{note.user}</span>
              <span className="text-idpxyz-textMuted text-[10px] font-mono">{note.time}</span>
            </div>
            <div className="text-idpxyz-text text-[12px] mt-0.5 leading-relaxed">{note.text}</div>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-3 border-t border-idpxyz-border">
        <input type="text" placeholder="添加备注..." className="flex-1 bg-idpxyz-inputBg border border-idpxyz-border rounded px-2.5 py-1.5 text-[12px] text-idpxyz-text outline-none placeholder:text-idpxyz-textMuted" />
        <Button variant="default" size="sm">添加备注</Button>
      </div>
    </div>
  );
}

// ── Inspector Panel (Section 13) ──
function InspectorPanel({ order, relatedExceptions }: { order: Order; relatedExceptions: any[] }) {
  const os = orderStatusConfig[order.status];
  const ps = paymentStatusConfig[order.paymentStatus];
  const fs = fulfillmentStatusConfig[order.fulfillmentStatus];
  return (
    <>
      <Section title="概览">
        <div className="px-4 space-y-1.5 text-[12px]">
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">订单</span><StatusBadge {...os} /></div>
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">支付</span><StatusBadge {...ps} /></div>
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">履约</span><StatusBadge {...fs} /></div>
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">金额</span><span className="text-idpxyz-textBright font-medium">{order.currency} {order.totalAmount.toLocaleString()}</span></div>
        </div>
      </Section>

      <Section title="快捷操作">
        <div className="px-3 space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconMessage size={12} /> 添加备注</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconUserPlus size={12} /> 分配负责人</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconPause size={12} /> 暂挂 / 释放</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconRefresh size={12} /> 重试支付</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconReturn size={12} /> 重试分配</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconShipment size={12} /> 创建发货单</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start"><IconBell size={12} /> 发送通知</Button>
        </div>
      </Section>

      <Section title="关联对象">
        <div className="px-4 space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-idpxyz-hover cursor-pointer">
            <IconUser size={11} className="text-idpxyz-textMuted" />
            <span className="text-idpxyz-textMuted">客户</span>
            <span className="text-idpxyz-accent ml-auto">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-idpxyz-hover cursor-pointer">
            <IconLocation size={11} className="text-idpxyz-textMuted" />
            <span className="text-idpxyz-textMuted">仓库</span>
            <span className="text-idpxyz-accent ml-auto">{order.warehouse}</span>
          </div>
          <div className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-idpxyz-hover cursor-pointer">
            <IconTag size={11} className="text-idpxyz-textMuted" />
            <span className="text-idpxyz-textMuted">渠道</span>
            <span className="text-idpxyz-accent ml-auto">{order.store}</span>
          </div>
          {relatedExceptions.map(exc => (
            <div key={exc.id} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-idpxyz-hover cursor-pointer">
              <IconWarning size={11} className="text-red-400" />
              <span className="text-idpxyz-textMuted">异常</span>
              <span className="text-idpxyz-accent ml-auto">{exc.id}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="审计">
        <div className="px-4 space-y-1 text-[11px]">
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">创建时间</span><span className="text-idpxyz-text">{order.createdAt}</span></div>
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">更新时间</span><span className="text-idpxyz-text">{order.updatedAt}</span></div>
          <div className="flex justify-between"><span className="text-idpxyz-textMuted">负责人</span><span className="text-idpxyz-text">{order.assignedTo || '未分配'}</span></div>
        </div>
      </Section>
    </>
  );
}
