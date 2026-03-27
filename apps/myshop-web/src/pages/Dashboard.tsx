import { useState } from 'react';
import {
  IconChart,
  IconWarning,
  IconClock,
  IconPackage,
  IconBilling,
  IconShipment,
  IconArrowRight,
  IconUsers,
  IconRefresh,
  IconSecurityAlert,
} from '@idpxyz/ui-icons';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@idpxyz/ui-primitives';
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderActions } from '@idpxyz/ui-patterns';
import {
  dashboardMetrics,
  channelDistribution,
  fulfillmentStageDistribution,
  recentExceptions,
  exceptionSeverityConfig,
} from '../data/oms';

interface DashboardProps {
  onOpenTab?: (tabId: string) => void;
}

function MetricCard({ icon: Icon, label, value, accent, onClick }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-md border border-idpxyz-border bg-idpxyz-sidebar ${onClick ? 'cursor-pointer hover:bg-idpxyz-hover' : ''}`}
    >
      <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: accent ? `${accent}20` : 'rgba(0,122,204,0.12)' }}>
        <Icon size={18} style={{ color: accent || '#007acc' }} />
      </div>
      <div className="min-w-0">
        <div className="text-[20px] font-semibold text-idpxyz-textBright leading-tight">{value}</div>
        <div className="text-[11px] text-idpxyz-textMuted">{label}</div>
      </div>
    </div>
  );
}

function SectionTitle({ children, action, onAction }: { children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-idpxyz-breadcrumb">{children}</h3>
      {action && (
        <Button variant="ghost" size="sm" onClick={onAction} className="text-[11px] text-idpxyz-accent">
          {action} <IconArrowRight size={12} />
        </Button>
      )}
    </div>
  );
}

export default function Dashboard({ onOpenTab }: DashboardProps) {
  const [dateRange, setDateRange] = useState('today');
  const [channelScope, setChannelScope] = useState('all');
  const m = dashboardMetrics;
  const maxStage = Math.max(...fulfillmentStageDistribution.map(s => s.count));

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
      {/* Page Header */}
      <PageHeader className="px-6 py-3 shrink-0">
        <PageHeaderContent>
          <IconChart size={18} className="text-idpxyz-accent" />
          <PageHeaderTitle>OMS 控制台</PageHeaderTitle>
        </PageHeaderContent>
        <PageHeaderActions>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger size="sm" className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今天</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
            </SelectContent>
          </Select>
          <Select value={channelScope} onValueChange={setChannelScope}>
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部渠道</SelectItem>
              <SelectItem value="官网">官网</SelectItem>
              <SelectItem value="App">App</SelectItem>
              <SelectItem value="平台">平台</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" title="刷新"><IconRefresh size={14} /></Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Context Bar - Summary Metrics (Section 9.3) */}
      <div className="grid grid-cols-6 gap-3 px-6 py-3 border-b border-idpxyz-border shrink-0 bg-idpxyz-sidebar/50">
        <MetricCard icon={IconPackage} label="今日订单总数" value={m.totalOrdersToday} onClick={() => onOpenTab?.('orders')} />
        <MetricCard icon={IconBilling} label="已付款订单" value={m.paidOrders} accent="#6a9955" />
        <MetricCard icon={IconClock} label="待分配" value={m.awaitingAllocation} accent="#569cd6" onClick={() => onOpenTab?.('fulfillment')} />
        <MetricCard icon={IconSecurityAlert} label="暂挂中" value={m.onHold} accent="#d19a66" />
        <MetricCard icon={IconWarning} label="异常订单" value={m.exceptionOrders} accent="#f44747" onClick={() => onOpenTab?.('exceptions')} />
        <MetricCard icon={IconClock} label="SLA 风险" value={m.slaRiskOrders} accent="#f44747" />
      </div>

      {/* Main Layout (Section 9.4) */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="grid grid-cols-3 gap-5">

          {/* Zone A: Core Overview */}
          <div className="space-y-4">
            <SectionTitle>渠道分布</SectionTitle>
            <div className="space-y-2">
              {channelDistribution.map(ch => (
                <div key={ch.channel} className="flex items-center gap-3">
                  <span className="text-[11px] text-idpxyz-text w-20 shrink-0">{ch.channel}</span>
                  <div className="flex-1 h-[14px] bg-idpxyz-border/40 rounded-sm overflow-hidden">
                    <div className="h-full bg-idpxyz-accent/70 rounded-sm transition-all" style={{ width: `${ch.pct}%` }} />
                  </div>
                  <span className="text-[11px] text-idpxyz-textMuted w-12 text-right shrink-0">{ch.count} ({ch.pct}%)</span>
                </div>
              ))}
            </div>

            <SectionTitle>履约流水线</SectionTitle>
            <div className="space-y-1.5">
              {fulfillmentStageDistribution.map(s => (
                <div key={s.stage} className="flex items-center gap-3">
                  <span className="text-[11px] text-idpxyz-text w-20 shrink-0 truncate">{s.stage}</span>
                  <div className="flex-1 h-[14px] bg-idpxyz-border/40 rounded-sm overflow-hidden">
                    <div className="h-full rounded-sm transition-all" style={{
                      width: `${(s.count / maxStage) * 100}%`,
                      backgroundColor: s.stage === '已发货' || s.stage === '已签收' ? 'rgba(106,153,85,0.6)' : 'rgba(86,156,214,0.5)',
                    }} />
                  </div>
                  <span className="text-[11px] text-idpxyz-textMuted w-8 text-right shrink-0">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zone B: Risks & Bottlenecks */}
          <div className="space-y-4">
            <SectionTitle action="查看全部" onAction={() => onOpenTab?.('exceptions')}>活跃异常</SectionTitle>
            <div className="space-y-1">
              {recentExceptions.map(exc => {
                const sev = exceptionSeverityConfig[exc.severity];
                return (
                  <div
                    key={exc.id}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-idpxyz-hover cursor-pointer border border-idpxyz-border/50"
                    onClick={() => onOpenTab?.('exceptions')}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sev.color }} />
                    <span className="text-[11px] text-idpxyz-accent font-medium shrink-0">{exc.id}</span>
                    <span className="text-[11px] text-idpxyz-text truncate flex-1">{exc.type}</span>
                    <span className="text-[10px] text-idpxyz-textMuted shrink-0">{exc.order}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0" style={{ color: sev.color, backgroundColor: sev.bgColor }}>{sev.label}</span>
                  </div>
                );
              })}
            </div>

            <SectionTitle>风险摘要</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded border border-idpxyz-border bg-idpxyz-sidebar">
                <IconBilling size={14} className="text-red-400 shrink-0" />
                <div>
                  <div className="text-[14px] font-semibold text-idpxyz-textBright">3</div>
                  <div className="text-[10px] text-idpxyz-textMuted">支付失败</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded border border-idpxyz-border bg-idpxyz-sidebar">
                <IconShipment size={14} className="text-orange-400 shrink-0" />
                <div>
                  <div className="text-[14px] font-semibold text-idpxyz-textBright">2</div>
                  <div className="text-[10px] text-idpxyz-textMuted">物流异常</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded border border-idpxyz-border bg-idpxyz-sidebar">
                <IconSecurityAlert size={14} className="text-red-400 shrink-0" />
                <div>
                  <div className="text-[14px] font-semibold text-idpxyz-textBright">1</div>
                  <div className="text-[10px] text-idpxyz-textMuted">高风险订单</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded border border-idpxyz-border bg-idpxyz-sidebar">
                <IconPackage size={14} className="text-yellow-400 shrink-0" />
                <div>
                  <div className="text-[14px] font-semibold text-idpxyz-textBright">4</div>
                  <div className="text-[10px] text-idpxyz-textMuted">库存不足</div>
                </div>
              </div>
            </div>
          </div>

          {/* Zone C: Work & Collaboration */}
          <div className="space-y-4">
            <SectionTitle>我的任务</SectionTitle>
            <div className="space-y-1">
              {[
                { label: '审核高风险订单 ORD-..002', priority: 'high' as const, age: '4小时' },
                { label: '处理履约失败 ORD-..006', priority: 'high' as const, age: '7小时' },
                { label: '确认地址 ORD-..010', priority: 'medium' as const, age: '3小时' },
                { label: '处理地址变更 ORD-..001', priority: 'low' as const, age: '30分钟' },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-idpxyz-hover cursor-pointer border border-idpxyz-border/50">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                  <span className="text-[11px] text-idpxyz-text truncate flex-1">{task.label}</span>
                  <span className="text-[10px] text-idpxyz-textMuted shrink-0">{task.age}</span>
                </div>
              ))}
            </div>

            <SectionTitle>团队队列</SectionTitle>
            <div className="space-y-1">
              {[
                { name: '王丽', pending: 3, active: 1 },
                { name: '刘建', pending: 2, active: 2 },
                { name: '周明', pending: 1, active: 1 },
                { name: '未分配', pending: 6, active: 0 },
              ].map(member => (
                <div key={member.name} className="flex items-center gap-2 px-3 py-2 rounded border border-idpxyz-border/50">
                  <IconUsers size={12} className="text-idpxyz-textMuted shrink-0" />
                  <span className="text-[11px] text-idpxyz-text flex-1">{member.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-accent/15 text-idpxyz-accent shrink-0">{member.active} 处理中</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-idpxyz-hover text-idpxyz-textMuted shrink-0">{member.pending} 待处理</span>
                </div>
              ))}
            </div>

            <SectionTitle>最近动态</SectionTitle>
            <div className="space-y-0.5">
              {[
                { time: '14:30', action: '客户请求更改收货地址', actor: '张晓明' },
                { time: '14:10', action: '承运商费率差异检测', actor: '系统' },
                { time: '12:15', action: '地址验证置信度低', actor: '系统' },
                { time: '11:05', action: '支付被拒 - 自动重试', actor: '系统' },
                { time: '10:45', action: '已升级至仓库运营团队', actor: '王丽' },
              ].map((evt, i) => (
                <div key={i} className="flex items-center gap-2 py-1 text-[11px]">
                  <span className="text-idpxyz-textMuted font-mono shrink-0 w-10">{evt.time}</span>
                  <span className="text-idpxyz-text truncate flex-1">{evt.action}</span>
                  <span className="text-idpxyz-accent shrink-0">{evt.actor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick volume indicator */}
        <div className="mt-5 pt-4 border-t border-idpxyz-border">
          <SectionTitle>今日订单量趋势</SectionTitle>
          <div className="flex items-end gap-1 h-[60px] mt-2">
            {[8, 12, 18, 22, 15, 11, 9, 6, 14, 19, 25, 20, 17, 13, 10, 8, 5, 3, 2, 1, 0, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t-sm transition-all" style={{
                  height: `${(v / 25) * 48}px`,
                  backgroundColor: i < new Date().getHours() ? 'rgba(0,122,204,0.5)' : 'rgba(133,133,133,0.2)',
                  minHeight: v > 0 ? '2px' : '0px',
                }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-idpxyz-textMuted mt-0.5 px-0.5">
            <span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
