import { useState } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { ActionModal, ModalTextarea, ModalSelect, ModalInput } from '../components/ActionModal';
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
  IconUserPlus,
  IconReturn,
  IconLocation,
  IconTag,
  IconTarget,
  IconDollar,
  IconMessage,
  IconPause,
  IconOrder,
  IconReceipt,
  IconCustomer,
  IconStar,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Order,
  type OMSException,
  type Promotion,
  type Coupon,
  type SPU,
  type Customer,
  type POSTransaction,
  type SidebarSelection,
  orderStatusConfig,
  paymentStatusConfig,
  fulfillmentStatusConfig,
  riskLevelConfig,
  promotionTypeConfig,
  promotionStatusConfig,
  couponTypeConfig,
  couponStatusConfig,
  exceptionSeverityConfig,
  exceptionTypeConfig,
  customerStatusConfig,
  customerTierConfig,
  rfmSegmentConfig,
  posTransactionStatusConfig,
  posPaymentMethodConfig,
  exceptions as allExceptions,
} from '../data/oms';

interface RightSidebarProps {
  width: number;
  selectedObject: SidebarSelection | null;
}

function Section({ title, defaultExpanded = false, children }: { title: string; defaultExpanded?: boolean; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="border-b border-vscode-border">
      <div
        className="flex items-center h-[22px] px-2 text-[11px] uppercase font-bold tracking-wide cursor-pointer hover:bg-vscode-hover"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <IconChevronDown size={14} className="mr-1" /> : <IconChevronRight size={14} className="mr-1" />}
        <span>{title}</span>
      </div>
      {expanded && <div className="pb-2">{children}</div>}
    </div>
  );
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5 px-3 py-1 text-[11px]">
      <Icon size={12} className="text-vscode-textMuted shrink-0 mt-0.5" />
      <span className="text-vscode-textMuted shrink-0 w-[60px]">{label}</span>
      <span className="text-vscode-text flex-1 text-right truncate">{value}</span>
    </div>
  );
}

export default function RightSidebar({ width, selectedObject }: RightSidebarProps) {
  if (!selectedObject) {
    return (
      <div className="bg-vscode-sidebar flex flex-col select-none shrink-0 overflow-hidden" style={{ width }}>
        <div className="flex items-center justify-between px-3 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0">
          <span>检查器</span>
          <IconMoreH size={16} className="text-vscode-textMuted cursor-pointer" />
        </div>
        <div className="flex-1 flex items-center justify-center text-[12px] text-vscode-textMuted px-4 text-center">
          选择一个对象以查看详情
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vscode-sidebar flex flex-col select-none shrink-0 overflow-hidden" style={{ width }}>
      <div className="flex items-center justify-between px-3 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0">
        <span>检查器</span>
        <IconMoreH size={16} className="text-vscode-textMuted cursor-pointer" />
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedObject.kind === 'order' && <OrderInspector order={selectedObject.payload} />}
        {selectedObject.kind === 'exception' && <ExceptionInspector exception={selectedObject.payload} />}
        {selectedObject.kind === 'promotion' && <PromotionInspector promotion={selectedObject.payload} />}
        {selectedObject.kind === 'coupon' && <CouponInspector coupon={selectedObject.payload} />}
        {selectedObject.kind === 'product' && <ProductInspector product={selectedObject.payload} />}
        {selectedObject.kind === 'customer' && <CustomerInspector customer={selectedObject.payload} />}
        {selectedObject.kind === 'pos_transaction' && <POSTransactionInspector txn={selectedObject.payload} />}
      </div>
    </div>
  );
}

function OrderInspector({ order }: { order: Order }) {
  const os = orderStatusConfig[order.status];
  const ps = paymentStatusConfig[order.paymentStatus];
  const fs = fulfillmentStatusConfig[order.fulfillmentStatus];
  const rl = riskLevelConfig[order.riskLevel];
  const relatedExc = allExceptions.filter(e => e.orderId === order.id);
  const { addToast } = useToast();

  const [modal, setModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [assignee, setAssignee] = useState('');
  const [notifyChannel, setNotifyChannel] = useState('email');

  return (
    <>
      {/* Header */}
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconOrder size={13} className="text-vscode-accent" />
          <span className="text-[12px] text-vscode-accent font-medium">{order.id}</span>
        </div>
        <div className="text-[11px] text-vscode-textMuted">{order.customerName} · {order.channel}</div>
      </div>

      <Section title="状态概览" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">订单</span><StatusBadge {...os} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">支付</span><StatusBadge {...ps} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">履约</span><StatusBadge {...fs} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">风险</span><StatusBadge {...rl} /></div>
          <div className="flex justify-between items-center">
            <span className="text-vscode-textMuted">SLA</span>
            <span className={`font-mono text-[10px] ${order.slaHoursRemaining < 0 ? 'text-red-400' : order.slaHoursRemaining <= 6 ? 'text-yellow-400' : 'text-vscode-text'}`}>
              {order.slaHoursRemaining > 0 ? `剩余 ${order.slaHoursRemaining}小时` : order.slaHoursRemaining < 0 ? `超期 ${Math.abs(order.slaHoursRemaining)}小时` : '-'}
            </span>
          </div>
        </div>
      </Section>

      <Section title="订单信息" defaultExpanded={true}>
        <DetailRow icon={IconUser} label="客户" value={order.customerName} />
        <DetailRow icon={IconTag} label="渠道" value={`${order.channel} / ${order.store}`} />
        <DetailRow icon={IconBilling} label="金额" value={`${order.currency} ${order.totalAmount.toLocaleString()}`} />
        <DetailRow icon={IconPackage} label="商品" value={`${order.itemCount} 件`} />
        <DetailRow icon={IconLocation} label="仓库" value={order.warehouse} />
        <DetailRow icon={IconUser} label="负责人" value={order.assignedTo || '未分配'} />
        <DetailRow icon={IconClock} label="创建" value={order.createdAt} />
        {order.tags.length > 0 && (
          <div className="px-3 py-1 flex items-center gap-1 flex-wrap">
            {order.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted">{t}</span>)}
          </div>
        )}
      </Section>

      <Section title="快捷操作" defaultExpanded={true}>
        <div className="px-2 space-y-0.5">
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setNoteText(''); setModal('note'); }}><IconMessage size={12} /> 添加备注</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setAssignee(''); setModal('assign'); }}><IconUserPlus size={12} /> 分配负责人</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'info', title: '操作成功', message: `订单 ${order.id} 已${order.status === 'on_hold' ? '释放' : '暂挂'}` })}><IconPause size={12} /> 暂挂 / 释放</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'info', title: '重试中', message: `正在重试订单 ${order.id} 的支付...` })}><IconRefresh size={12} /> 重试支付</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '已重新分配', message: `订单 ${order.id} 已重新分配至最优仓库` })}><IconReturn size={12} /> 重新分配</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '发货单已创建', message: `订单 ${order.id} 的发货单已生成` })}><IconShipment size={12} /> 创建发货单</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setNotifyChannel('email'); setModal('notify'); }}><IconBell size={12} /> 发送通知</Button>
        </div>
      </Section>

      {relatedExc.length > 0 && (
        <Section title={`相关异常 (${relatedExc.length})`} defaultExpanded={true}>
          <div className="px-3 space-y-1">
            {relatedExc.map(exc => {
              const sev = exceptionSeverityConfig[exc.severity];
              return (
                <div key={exc.id} className="flex items-center gap-1.5 text-[11px] py-0.5">
                  <IconWarning size={11} style={{ color: sev.color }} />
                  <span className="text-vscode-accent">{exc.id}</span>
                  <span className="text-vscode-text flex-1 truncate">{exceptionTypeConfig[exc.type].label}</span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="关联对象">
        <div className="px-3 space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5 px-1 py-0.5 rounded hover:bg-vscode-hover cursor-pointer">
            <IconUser size={11} className="text-vscode-textMuted" />
            <span className="text-vscode-textMuted">客户</span>
            <span className="text-vscode-accent ml-auto">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-1.5 px-1 py-0.5 rounded hover:bg-vscode-hover cursor-pointer">
            <IconLocation size={11} className="text-vscode-textMuted" />
            <span className="text-vscode-textMuted">仓库</span>
            <span className="text-vscode-accent ml-auto">{order.warehouse}</span>
          </div>
          <div className="flex items-center gap-1.5 px-1 py-0.5 rounded hover:bg-vscode-hover cursor-pointer">
            <IconTag size={11} className="text-vscode-textMuted" />
            <span className="text-vscode-textMuted">店铺</span>
            <span className="text-vscode-accent ml-auto">{order.store}</span>
          </div>
        </div>
      </Section>

      {/* Modals */}
      <ActionModal
        open={modal === 'note'}
        onClose={() => setModal(null)}
        title={`添加备注 — ${order.id}`}
        confirmLabel="保存备注"
        onConfirm={() => addToast({ type: 'success', title: '备注已保存', message: `订单 ${order.id} 的备注已更新` })}
      >
        <ModalTextarea label="备注内容" placeholder="请输入备注..." value={noteText} onChange={setNoteText} rows={4} />
      </ActionModal>

      <ActionModal
        open={modal === 'assign'}
        onClose={() => setModal(null)}
        title={`分配负责人 — ${order.id}`}
        confirmLabel="确认分配"
        onConfirm={() => addToast({ type: 'success', title: '已分配', message: `订单 ${order.id} 已分配给 ${assignee || '当前用户'}` })}
      >
        <ModalSelect
          label="负责人"
          value={assignee}
          onChange={setAssignee}
          options={[
            { value: '', label: '选择负责人...' },
            { value: '王丽', label: '王丽' },
            { value: '刘建', label: '刘建' },
            { value: '周明', label: '周明' },
            { value: '孙文静', label: '孙文静' },
          ]}
        />
      </ActionModal>

      <ActionModal
        open={modal === 'notify'}
        onClose={() => setModal(null)}
        title={`发送通知 — ${order.id}`}
        description={`向客户 ${order.customerName} 发送订单状态通知`}
        confirmLabel="发送"
        onConfirm={() => addToast({ type: 'success', title: '通知已发送', message: `已通过${notifyChannel === 'email' ? '邮件' : notifyChannel === 'sms' ? '短信' : '站内信'}通知 ${order.customerName}` })}
      >
        <ModalSelect
          label="通知渠道"
          value={notifyChannel}
          onChange={setNotifyChannel}
          options={[
            { value: 'email', label: '邮件' },
            { value: 'sms', label: '短信' },
            { value: 'in_app', label: '站内信' },
          ]}
        />
      </ActionModal>
    </>
  );
}

function ExceptionInspector({ exception }: { exception: OMSException }) {
  const sev = exceptionSeverityConfig[exception.severity];
  const tp = exceptionTypeConfig[exception.type];
  const { addToast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const [escalateReason, setEscalateReason] = useState('');

  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconWarning size={13} className="text-red-400" />
          <span className="text-[12px] text-vscode-accent font-medium">{exception.id}</span>
          <StatusBadge {...sev} />
        </div>
        <div className="text-[11px] text-vscode-textMuted">{exception.orderId} · {exception.customerName}</div>
      </div>

      <Section title="异常信息" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-vscode-textMuted">类型</span><StatusBadge {...tp} /></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">严重度</span><StatusBadge {...sev} /></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">金额</span><span className="text-vscode-textBright font-medium">${exception.amount.toLocaleString()}</span></div>
          <div className="flex justify-between">
            <span className="text-vscode-textMuted">SLA</span>
            <span className={exception.slaHoursRemaining < 0 ? 'text-red-400 font-medium' : 'text-vscode-text'}>
              {exception.slaHoursRemaining > 0 ? `剩余 ${exception.slaHoursRemaining}小时` : `超期 ${Math.abs(exception.slaHoursRemaining)}小时`}
            </span>
          </div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">负责人</span><span className="text-vscode-text">{exception.assignedTo || '未分配'}</span></div>
        </div>
      </Section>

      <Section title="描述" defaultExpanded={true}>
        <div className="px-3 text-[11px] text-vscode-text leading-relaxed">{exception.description}</div>
      </Section>

      <Section title="快捷操作" defaultExpanded={true}>
        <div className="px-2 space-y-0.5">
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '已分配', message: `异常 ${exception.id} 已分配给当前用户` })}><IconUserPlus size={12} /> 分配给我</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'info', title: '重试中', message: `正在重试异常 ${exception.id} 的关联操作...` })}><IconRefresh size={12} /> 重试操作</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '已解决', message: `异常 ${exception.id} 已标记为解决` })}><IconCheckCircle size={12} /> 标记解决</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px] text-red-400" onClick={() => { setEscalateReason(''); setModal('escalate'); }}><IconWarning size={12} /> 升级处理</Button>
        </div>
      </Section>

      <ActionModal
        open={modal === 'escalate'}
        onClose={() => setModal(null)}
        title={`升级处理 — ${exception.id}`}
        description="将此异常升级至高级运维团队处理，请说明原因。"
        confirmLabel="确认升级"
        variant="danger"
        onConfirm={() => addToast({ type: 'warning', title: '已升级', message: `异常 ${exception.id} 已升级至高级运维团队` })}
      >
        <ModalTextarea label="升级原因" placeholder="请输入升级原因..." value={escalateReason} onChange={setEscalateReason} rows={3} />
      </ActionModal>
    </>
  );
}

function PromotionInspector({ promotion }: { promotion: Promotion }) {
  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconTag size={13} className="text-vscode-accent" />
          <span className="text-[12px] text-vscode-accent font-medium">{promotion.id}</span>
        </div>
        <div className="text-[11px] text-vscode-text">{promotion.name}</div>
      </div>
      <Section title="状态概览" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">类型</span><StatusBadge {...promotionTypeConfig[promotion.type]} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">状态</span><StatusBadge {...promotionStatusConfig[promotion.status]} /></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">可叠加</span><span className="text-vscode-text">{promotion.stackable ? '是' : '否'}</span></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">优先级</span><span className="text-vscode-text">{promotion.priority}</span></div>
        </div>
      </Section>
      <Section title="活动信息" defaultExpanded={true}>
        <DetailRow icon={IconClock} label="时间" value={`${promotion.startAt} ~ ${promotion.endAt}`} />
        <DetailRow icon={IconTarget} label="范围" value={promotion.scopeNames.join(' / ')} />
        <DetailRow icon={IconBilling} label="优惠" value={promotion.discountUnit === '%' ? `${promotion.discountValue}%` : promotion.discountUnit === 'fixed' ? `$${promotion.discountValue}` : 'free'} />
        <DetailRow icon={IconPackage} label="订单数" value={promotion.orderCount.toLocaleString()} />
        <DetailRow icon={IconDollar} label="收入" value={`$${promotion.revenue.toLocaleString()}`} />
      </Section>
    </>
  );
}

function CouponInspector({ coupon }: { coupon: Coupon }) {
  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconTag size={13} className="text-vscode-accent" />
          <span className="text-[12px] text-vscode-accent font-medium">{coupon.code}</span>
        </div>
        <div className="text-[11px] text-vscode-text">{coupon.name}</div>
      </div>
      <Section title="状态概览" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">类型</span><StatusBadge {...couponTypeConfig[coupon.type]} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">状态</span><StatusBadge {...couponStatusConfig[coupon.status]} /></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">新客专享</span><span className="text-vscode-text">{coupon.newUserOnly ? '是' : '否'}</span></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">可叠加</span><span className="text-vscode-text">{coupon.stackable ? '是' : '否'}</span></div>
        </div>
      </Section>
      <Section title="券信息" defaultExpanded={true}>
        <DetailRow icon={IconBilling} label="优惠" value={coupon.type === 'percentage' ? `${coupon.discountValue}%` : coupon.type === 'fixed' ? `$${coupon.discountValue}` : 'free shipping'} />
        <DetailRow icon={IconPackage} label="已领用" value={`${coupon.issuedQty.toLocaleString()} / ${coupon.totalQty > 0 ? coupon.totalQty.toLocaleString() : '不限'}`} />
        <DetailRow icon={IconCheckCircle} label="已使用" value={coupon.usedQty.toLocaleString()} />
        <DetailRow icon={IconClock} label="有效期" value={`${coupon.startAt} ~ ${coupon.endAt}`} />
        <DetailRow icon={IconDollar} label="收入" value={`$${coupon.revenue.toLocaleString()}`} />
      </Section>
    </>
  );
}

function CustomerInspector({ customer }: { customer: Customer }) {
  const ss = customerStatusConfig[customer.status];
  const ts = customerTierConfig[customer.tier];
  const rs = rfmSegmentConfig[customer.rfmSegment];
  const { addToast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgChannel, setMsgChannel] = useState('email');
  const [couponCode, setCouponCode] = useState('');
  const [newTier, setNewTier] = useState(customer.tier);

  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[18px]">{customer.avatar}</span>
          <span className="text-[12px] text-vscode-textBright font-medium">{customer.name}</span>
          <StatusBadge {...ts} />
        </div>
        <div className="text-[10px] text-vscode-textMuted">{customer.id} · {customer.email}</div>
      </div>

      <Section title="状态概览" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">状态</span><StatusBadge {...ss} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">等级</span><StatusBadge {...ts} /></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">RFM分群</span><StatusBadge {...rs} /></div>
          <div className="flex justify-between"><span className="text-vscode-textMuted">积分</span><span className="text-vscode-textBright font-medium">{customer.loyaltyPoints.toLocaleString()}</span></div>
        </div>
      </Section>

      <Section title="消费数据" defaultExpanded={true}>
        <DetailRow icon={IconOrder} label="订单数" value={customer.totalOrders.toString()} />
        <DetailRow icon={IconDollar} label="总消费" value={`$${customer.totalSpent.toLocaleString()}`} />
        <DetailRow icon={IconBilling} label="客单价" value={`$${customer.avgOrderValue.toFixed(0)}`} />
        <DetailRow icon={IconReturn} label="退货率" value={`${customer.returnRate}%`} />
        <DetailRow icon={IconTag} label="持有券" value={`${customer.couponsHeld} 张`} />
      </Section>

      <Section title="基本信息" defaultExpanded={false}>
        <DetailRow icon={IconUser} label="性别" value={customer.gender} />
        <DetailRow icon={IconLocation} label="地区" value={`${customer.city}, ${customer.country}`} />
        <DetailRow icon={IconTag} label="渠道" value={customer.registrationChannel} />
        <DetailRow icon={IconClock} label="注册" value={customer.registeredAt} />
        <DetailRow icon={IconClock} label="最后下单" value={customer.lastOrderAt || '-'} />
      </Section>

      {customer.tags.length > 0 && (
        <Section title="标签" defaultExpanded={true}>
          <div className="px-3 flex gap-1 flex-wrap">
            {customer.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted">{t}</span>)}
          </div>
        </Section>
      )}

      {customer.notes && (
        <Section title="备注" defaultExpanded={false}>
          <div className="px-3 text-[11px] text-vscode-text leading-relaxed">{customer.notes}</div>
        </Section>
      )}

      <Section title="快捷操作" defaultExpanded={true}>
        <div className="px-2 space-y-0.5">
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setMsgContent(''); setMsgChannel('email'); setModal('message'); }}><IconMessage size={12} /> 发消息</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setCouponCode(''); setModal('coupon'); }}><IconTag size={12} /> 发优惠券</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => { setNewTier(customer.tier); setModal('tier'); }}><IconShield size={12} /> 调整等级</Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '已标记', message: `客户 ${customer.name} 已加入关注列表` })}><IconBell size={12} /> 标记关注</Button>
        </div>
      </Section>

      {/* Modals */}
      <ActionModal
        open={modal === 'message'}
        onClose={() => setModal(null)}
        title={`发消息 — ${customer.name}`}
        confirmLabel="发送"
        onConfirm={() => addToast({ type: 'success', title: '消息已发送', message: `已通过${msgChannel === 'email' ? '邮件' : msgChannel === 'sms' ? '短信' : '站内信'}向 ${customer.name} 发送消息` })}
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
        title={`发放优惠券 — ${customer.name}`}
        confirmLabel="发放"
        onConfirm={() => addToast({ type: 'success', title: '优惠券已发放', message: `已向 ${customer.name} 发放优惠券 ${couponCode || 'SPRING20'}` })}
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
        open={modal === 'tier'}
        onClose={() => setModal(null)}
        title={`调整等级 — ${customer.name}`}
        description={`当前等级: ${customerTierConfig[customer.tier].label}`}
        confirmLabel="确认调整"
        onConfirm={() => addToast({ type: 'success', title: '等级已调整', message: `${customer.name} 等级已调整为 ${customerTierConfig[newTier].label}` })}
      >
        <ModalSelect label="新等级" value={newTier} onChange={v => setNewTier(v as typeof newTier)} options={[
          { value: 'regular', label: '普通' },
          { value: 'silver', label: '白银' },
          { value: 'gold', label: '黄金' },
          { value: 'platinum', label: '铂金' },
          { value: 'diamond', label: '钻石' },
        ]} />
      </ActionModal>
    </>
  );
}

function ProductInspector({ product }: { product: SPU }) {
  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconPackage size={13} className="text-vscode-accent" />
          <span className="text-[12px] text-vscode-accent font-medium">{product.id}</span>
        </div>
        <div className="text-[11px] text-vscode-text">{product.name}</div>
      </div>
      <Section title="商品信息" defaultExpanded={true}>
        <DetailRow icon={IconTag} label="品牌" value={product.brand} />
        <DetailRow icon={IconTarget} label="分类" value={product.categoryPath} />
        <DetailRow icon={IconBilling} label="价格" value={product.minPrice === product.maxPrice ? `$${product.minPrice}` : `$${product.minPrice} - $${product.maxPrice}`} />
        <DetailRow icon={IconPackage} label="库存" value={product.totalStock.toLocaleString()} />
        <DetailRow icon={IconCheckCircle} label="30天销量" value={product.salesVolume30d.toLocaleString()} />
        <DetailRow icon={IconDollar} label="30天收入" value={`$${product.revenue30d.toLocaleString()}`} />
      </Section>
    </>
  );
}

function POSTransactionInspector({ txn }: { txn: POSTransaction }) {
  const ts = posTransactionStatusConfig[txn.status];
  const pm = posPaymentMethodConfig[txn.paymentMethod];
  const { addToast } = useToast();

  return (
    <>
      <div className="px-3 py-2 border-b border-vscode-border">
        <div className="flex items-center gap-2 mb-1">
          <IconReceipt size={13} className="text-vscode-accent" />
          <span className="text-[12px] text-vscode-accent font-medium font-mono">{txn.id}</span>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: ts.color, backgroundColor: ts.bgColor }}>{ts.label}</span>
        </div>
        <div className="text-[11px] text-vscode-textMuted">{txn.storeName} · {txn.cashierName} · {txn.createdAt}</div>
      </div>

      <Section title="商品明细" defaultExpanded={true}>
        <div className="px-3 space-y-1.5">
          {txn.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="text-[16px]">{item.image}</span>
              <div className="flex-1 min-w-0">
                <div className="text-vscode-textBright truncate">{item.name}</div>
                <div className="text-[10px] text-vscode-textMuted">{item.skuName} · ${item.price} x{item.qty}</div>
              </div>
              <span className="text-vscode-textBright font-medium shrink-0">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="支付信息" defaultExpanded={true}>
        <div className="px-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-vscode-textMuted">小计</span><span className="text-vscode-text">${txn.subtotal.toFixed(2)}</span></div>
          {txn.discount > 0 && <div className="flex justify-between"><span className="text-vscode-textMuted">优惠</span><span className="text-green-400">-${txn.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between"><span className="text-vscode-textMuted">税费</span><span className="text-vscode-text">${txn.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-[12px]"><span className="text-vscode-textBright">合计</span><span className="text-vscode-accent">${txn.total.toFixed(2)}</span></div>
          <div className="flex justify-between items-center"><span className="text-vscode-textMuted">支付方式</span><span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: pm.color, backgroundColor: pm.bgColor }}>{pm.label}</span></div>
          {txn.paymentRef && <div className="flex justify-between"><span className="text-vscode-textMuted">流水号</span><span className="text-[10px] font-mono text-vscode-text">{txn.paymentRef}</span></div>}
          {txn.paymentMethod === 'cash' && <>
            <div className="flex justify-between"><span className="text-vscode-textMuted">收取</span><span>${txn.cashReceived.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-vscode-textMuted">找零</span><span className="text-yellow-400">${txn.changeGiven.toFixed(2)}</span></div>
          </>}
        </div>
      </Section>

      {txn.memberName && (
        <Section title="会员信息" defaultExpanded={true}>
          <DetailRow icon={IconCustomer} label="会员" value={txn.memberName} />
          <DetailRow icon={IconHash} label="会员ID" value={txn.memberId} />
          {txn.pointsEarned > 0 && <DetailRow icon={IconStar} label="获得积分" value={`+${txn.pointsEarned}`} />}
        </Section>
      )}

      {txn.note && (
        <Section title="备注" defaultExpanded={false}>
          <div className="px-3 text-[11px] text-vscode-text leading-relaxed">{txn.note}</div>
        </Section>
      )}

      <Section title="快捷操作" defaultExpanded={true}>
        <div className="px-2 space-y-0.5">
          <Button variant="ghost" size="sm" className="w-full justify-start text-[11px]" onClick={() => addToast({ type: 'success', title: '打印中', message: '正在打印交易小票...' })}><IconReceipt size={12} /> 重打小票</Button>
          {txn.status === 'completed' && (
            <Button variant="ghost" size="sm" className="w-full justify-start text-[11px] text-red-400" onClick={() => addToast({ type: 'warning', title: '退款发起', message: `交易 ${txn.id} 退款流程已发起` })}><IconReturn size={12} /> 发起退款</Button>
          )}
        </div>
      </Section>
    </>
  );
}
