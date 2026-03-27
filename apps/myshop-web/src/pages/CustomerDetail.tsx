import { useState } from 'react';
import { useToast } from '@idpxyz/ui-theme-runtime';
import { ActionModal, ModalTextarea, ModalSelect } from '../components/ActionModal';
import {
  IconChevronDown,
  IconChevronRight,
  IconHash,
  IconClock,
  IconMail,
  IconWarning,
  IconCheckCircle,
  IconMoreH,
  IconUser,
  IconShield,
  IconBell,
  IconRefresh,
  IconEdit,
  IconLocation,
  IconTag,
  IconDollar,
  IconMessage,
  IconReturn,
  IconStar,
  IconCustomer,
  IconOrder,
  IconTicket,
  IconArrowLeft,
  IconTrending,
  IconGift,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Customer,
  customers,
  customerStatusConfig,
  customerTierConfig,
  rfmSegmentConfig,
  orders,
  orderStatusConfig,
} from '../data/oms';

interface CustomerDetailProps {
  customerId: string;
  onBack: () => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function RFMCell({ label, value }: { label: string; value: number }) {
  const color = value >= 4 ? 'bg-green-400' : value >= 3 ? 'bg-yellow-400' : value >= 2 ? 'bg-orange-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-idpxyz-textMuted w-[80px]">{label}</span>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`w-[8px] h-[14px] rounded-[2px] ${i < value ? color : 'bg-idpxyz-border'}`} />
        ))}
      </div>
      <span className="text-[11px] text-idpxyz-textBright font-medium">{value}/5</span>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, valueClass }: { icon: React.ElementType; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon size={12} className="text-idpxyz-textMuted shrink-0" />
      <span className="text-[11px] text-idpxyz-textMuted w-[80px] shrink-0">{label}</span>
      <span className={`text-[11px] ${valueClass || 'text-idpxyz-text'}`}>{value}</span>
    </div>
  );
}

function SectionHeader({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-idpxyz-border">
      <button
        className="flex items-center gap-1.5 w-full px-5 py-2 text-left hover:bg-idpxyz-hover transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <IconChevronDown size={12} className="text-idpxyz-textMuted" /> : <IconChevronRight size={12} className="text-idpxyz-textMuted" />}
        <span className="text-[12px] font-medium text-idpxyz-textBright">{title}</span>
      </button>
      {open && <div className="px-5 pb-3">{children}</div>}
    </div>
  );
}

export default function CustomerDetail({ customerId, onBack }: CustomerDetailProps) {
  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
        <div className="text-center">
          <IconCustomer size={40} className="mx-auto mb-2 opacity-20" />
          <p className="text-[14px]">客户未找到</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={onBack}>返回客户列表</Button>
        </div>
      </div>
    );
  }

  const ss = customerStatusConfig[customer.status];
  const ts = customerTierConfig[customer.tier];
  const rs = rfmSegmentConfig[customer.rfmSegment];
  const { addToast } = useToast();
  const [modal, setModal] = useState<string | null>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgChannel, setMsgChannel] = useState('email');
  const [couponCode, setCouponCode] = useState('');

  // Find related orders
  const customerOrders = orders.filter(o =>
    o.customerEmail === customer.email || o.customerName === customer.name
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor min-w-0">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <IconArrowLeft size={14} />
            </Button>
            <span className="text-[24px]">{customer.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[14px] font-semibold text-idpxyz-textBright">{customer.name}</h1>
                <StatusBadge {...ss} />
                <StatusBadge {...ts} />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-idpxyz-textMuted mt-0.5">
                <span>{customer.id}</span>
                <span>·</span>
                <span>{customer.email}</span>
                <span>·</span>
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'info', title: '编辑模式', message: `正在编辑客户 ${customer.name} 的信息` })}><IconEdit size={12} /> 编辑</Button>
            <Button variant="ghost" size="sm" onClick={() => { setMsgContent(''); setMsgChannel('email'); setModal('message'); }}><IconMail size={12} /> 发消息</Button>
            <Button variant="ghost" size="sm" onClick={() => { setCouponCode(''); setModal('coupon'); }}><IconTicket size={12} /> 发券</Button>
            <Button variant="ghost" size="sm" onClick={() => addToast({ type: 'success', title: '已标记', message: `客户 ${customer.name} 已加入关注列表` })}><IconMoreH size={13} /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Key metrics cards */}
          <div className="grid grid-cols-6 gap-3 px-5 py-3 border-b border-idpxyz-border">
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconOrder size={14} className="text-idpxyz-accent mb-1" />
              <span className="text-[16px] font-semibold text-idpxyz-textBright">{customer.totalOrders}</span>
              <span className="text-[10px] text-idpxyz-textMuted">总订单</span>
            </div>
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconDollar size={14} className="text-green-400 mb-1" />
              <span className="text-[16px] font-semibold text-idpxyz-textBright">${customer.totalSpent.toLocaleString()}</span>
              <span className="text-[10px] text-idpxyz-textMuted">总消费</span>
            </div>
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconTrending size={14} className="text-idpxyz-accent mb-1" />
              <span className="text-[16px] font-semibold text-idpxyz-textBright">${customer.avgOrderValue.toFixed(0)}</span>
              <span className="text-[10px] text-idpxyz-textMuted">客单价</span>
            </div>
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconReturn size={14} className={`mb-1 ${customer.returnRate > 15 ? 'text-red-400' : 'text-idpxyz-textMuted'}`} />
              <span className={`text-[16px] font-semibold ${customer.returnRate > 15 ? 'text-red-400' : 'text-idpxyz-textBright'}`}>{customer.returnRate}%</span>
              <span className="text-[10px] text-idpxyz-textMuted">退货率</span>
            </div>
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconStar size={14} className="text-yellow-400 mb-1" />
              <span className="text-[16px] font-semibold text-idpxyz-textBright">{customer.loyaltyPoints.toLocaleString()}</span>
              <span className="text-[10px] text-idpxyz-textMuted">积分</span>
            </div>
            <div className="flex flex-col items-center py-2 px-3 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
              <IconGift size={14} className="text-[#c586c0] mb-1" />
              <span className="text-[16px] font-semibold text-idpxyz-textBright">{customer.couponsHeld}</span>
              <span className="text-[10px] text-idpxyz-textMuted">持有券</span>
            </div>
          </div>

          {/* Sections */}
          <SectionHeader title="基本信息">
            <div className="grid grid-cols-2 gap-x-8">
              <DetailRow icon={IconUser} label="性别" value={customer.gender} />
              <DetailRow icon={IconClock} label="生日" value={customer.birthday} />
              <DetailRow icon={IconLocation} label="地区" value={`${customer.city}, ${customer.region}, ${customer.country}`} />
              <DetailRow icon={IconHash} label="地址数" value={`${customer.addressCount} 个地址`} />
              <DetailRow icon={IconMail} label="邮箱" value={customer.email} />
              <DetailRow icon={IconMessage} label="手机" value={customer.phone} />
              <DetailRow icon={IconTag} label="注册渠道" value={customer.registrationChannel} />
              <DetailRow icon={IconClock} label="注册日期" value={customer.registeredAt} />
              <DetailRow icon={IconRefresh} label="最后登录" value={customer.lastLoginAt || '-'} />
              <DetailRow icon={IconOrder} label="最后下单" value={customer.lastOrderAt || '-'} />
            </div>
            {customer.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-idpxyz-border">
                <IconTag size={12} className="text-idpxyz-textMuted" />
                <div className="flex gap-1 flex-wrap">
                  {customer.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-idpxyz-hover text-[10px] text-idpxyz-textMuted">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </SectionHeader>

          <SectionHeader title="RFM 分析">
            <div className="flex items-start gap-8">
              <div className="flex flex-col gap-2">
                <RFMCell label="近度 (Recency)" value={customer.rfmRecency} />
                <RFMCell label="频度 (Frequency)" value={customer.rfmFrequency} />
                <RFMCell label="金额 (Monetary)" value={customer.rfmMonetary} />
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
                <span className="text-[10px] text-idpxyz-textMuted">客户分群</span>
                <StatusBadge {...rs} />
                <span className="text-[10px] text-idpxyz-textMuted mt-1">
                  综合评分 {customer.rfmRecency + customer.rfmFrequency + customer.rfmMonetary}/15
                </span>
              </div>
            </div>
          </SectionHeader>

          <SectionHeader title={`关联订单 (${customerOrders.length})`} defaultOpen={customerOrders.length > 0}>
            {customerOrders.length > 0 ? (
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="text-idpxyz-textMuted text-left">
                    <th className="py-1.5 pr-3 font-medium">订单号</th>
                    <th className="py-1.5 pr-3 font-medium">状态</th>
                    <th className="py-1.5 pr-3 font-medium">渠道</th>
                    <th className="py-1.5 pr-3 font-medium text-right">金额</th>
                    <th className="py-1.5 pr-3 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {customerOrders.map(o => {
                    const os = orderStatusConfig[o.status];
                    return (
                      <tr key={o.id} className="hover:bg-idpxyz-hover cursor-pointer">
                        <td className="py-1.5 pr-3 text-idpxyz-accent">{o.id}</td>
                        <td className="py-1.5 pr-3"><StatusBadge {...os} /></td>
                        <td className="py-1.5 pr-3 text-idpxyz-text">{o.channel} / {o.store}</td>
                        <td className="py-1.5 pr-3 text-right text-idpxyz-textBright font-medium">${o.totalAmount.toFixed(2)}</td>
                        <td className="py-1.5 pr-3 text-idpxyz-textMuted">{o.createdAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-[11px] text-idpxyz-textMuted py-2">暂无关联订单</p>
            )}
          </SectionHeader>

          <SectionHeader title="备注" defaultOpen={!!customer.notes}>
            <p className="text-[11px] text-idpxyz-text leading-relaxed">{customer.notes || '暂无备注'}</p>
          </SectionHeader>
        </div>
      </div>

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
    </div>
  );
}
