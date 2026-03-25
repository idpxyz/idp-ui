import { useState, useMemo } from 'react';
import {
  IconWarning,
  IconClock,
  IconBilling,
  IconLocation,
  IconPackage,
  IconShipment,
  IconSecurityAlert,
  IconUserPlus,
  IconRefresh,
  IconReturn,
  IconCheckCircle,
  IconPhone,
  IconChevronDown,
  IconChevronRight,
  IconMoreH,
  IconDownload,
} from '@idpxyz/ui-icons';
import { Button, Select, SelectOption } from '@idpxyz/ui-primitives';
import {
  PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions,
  FilterBar, FilterSearch,
} from '@idpxyz/ui-patterns';
import {
  exceptions as allExceptions,
  exceptionSeverityConfig,
  exceptionTypeConfig,
  type OMSException,
  type ExceptionSeverity,
  type ExceptionType,
} from '../data/oms';

interface ExceptionCenterProps {
  onOpenOrder?: (orderId: string) => void;
}

const savedViews: { id: string; label: string; filter?: (e: OMSException) => boolean }[] = [
  { id: 'all', label: '全部异常' },
  { id: 'payment', label: '支付失败', filter: e => e.type === 'payment_failed' },
  { id: 'address', label: '地址异常', filter: e => e.type === 'address_validation' },
  { id: 'inventory', label: '库存不足', filter: e => e.type === 'inventory_shortage' },
  { id: 'fulfillment', label: '履约失败', filter: e => e.type === 'fulfillment_failure' },
  { id: 'shipment', label: '物流异常', filter: e => e.type === 'shipment_exception' },
  { id: 'fraud', label: '欺诈 / 风控', filter: e => e.type === 'fraud_risk' },
  { id: 'escalated', label: '已升级', filter: e => e.severity === 'escalated' || e.severity === 'blocked' },
];

// Quick resolve actions by exception type (Section 15.3)
const resolveActions: Record<ExceptionType, { icon: React.ElementType; label: string; priority: 'high' | 'medium' | 'low' }[]> = {
  payment_failed: [
    { icon: IconRefresh, label: '重试授权', priority: 'high' },
    { icon: IconBilling, label: '更换支付方式', priority: 'medium' },
    { icon: IconCheckCircle, label: '标记人工已验证', priority: 'low' },
  ],
  inventory_shortage: [
    { icon: IconReturn, label: '重新分配', priority: 'high' },
    { icon: IconPackage, label: '拆单发货', priority: 'medium' },
    { icon: IconClock, label: '转为延期订单', priority: 'low' },
  ],
  address_validation: [
    { icon: IconLocation, label: '验证地址', priority: 'high' },
    { icon: IconPhone, label: '联系客户', priority: 'medium' },
    { icon: IconCheckCircle, label: '覆盖挂起', priority: 'low' },
  ],
  fulfillment_failure: [
    { icon: IconRefresh, label: '重试履约', priority: 'high' },
    { icon: IconReturn, label: '重新分配仓库', priority: 'medium' },
    { icon: IconUserPlus, label: '升级至运营团队', priority: 'high' },
  ],
  shipment_exception: [
    { icon: IconRefresh, label: '重新同步物流', priority: 'high' },
    { icon: IconShipment, label: '联系承运商', priority: 'medium' },
    { icon: IconCheckCircle, label: '确认人工覆盖', priority: 'low' },
  ],
  fraud_risk: [
    { icon: IconSecurityAlert, label: '审查风险详情', priority: 'high' },
    { icon: IconCheckCircle, label: '审批订单', priority: 'medium' },
    { icon: IconWarning, label: '取消并退款', priority: 'high' },
  ],
  pricing_anomaly: [
    { icon: IconRefresh, label: '重新计算价格', priority: 'high' },
    { icon: IconCheckCircle, label: '接受当前价格', priority: 'low' },
  ],
  customer_change: [
    { icon: IconCheckCircle, label: '应用变更', priority: 'medium' },
    { icon: IconReturn, label: '必要时重新分配', priority: 'medium' },
    { icon: IconPhone, label: '联系客户', priority: 'low' },
  ],
};

export default function ExceptionCenter({ onOpenOrder }: ExceptionCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedExcId, setSelectedExcId] = useState<string | null>(allExceptions[0]?.id || null);

  const filtered = useMemo(() => {
    let result = [...allExceptions];
    const view = savedViews.find(v => v.id === activeView);
    if (view?.filter) result = result.filter(view.filter);
    if (severityFilter !== 'all') result = result.filter(e => e.severity === severityFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(e =>
        e.id.toLowerCase().includes(q) ||
        e.orderId.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchTerm, activeView, severityFilter]);

  const selectedExc = allExceptions.find(e => e.id === selectedExcId) || null;
  const actions = selectedExc ? (resolveActions[selectedExc.type] || []) : [];

  return (
    <div className="flex-1 flex overflow-hidden bg-vscode-editor">
      {/* Main Queue Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Section 15.3) */}
        <PageHeader className="px-5 shrink-0">
          <PageHeaderContent>
            <IconWarning size={16} className="text-red-400" />
            <PageHeaderTitle>异常中心</PageHeaderTitle>
            <PageHeaderDescription>{filtered.length} 条异常</PageHeaderDescription>
          </PageHeaderContent>
          <PageHeaderActions>
            <Button variant="ghost" size="sm"><IconUserPlus size={13} /> 分配</Button>
            <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
          </PageHeaderActions>
        </PageHeader>

        {/* Saved Views */}
        <div className="flex items-center gap-1 px-5 py-1.5 border-b border-vscode-border shrink-0 overflow-x-auto tab-scroll-hidden">
          {savedViews.map(v => (
            <button
              key={v.id}
              onClick={() => { setActiveView(v.id); }}
              className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
                activeView === v.id
                  ? 'bg-vscode-accent/15 text-vscode-accent font-medium'
                  : 'text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-hover'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <FilterBar className="px-5 shrink-0">
          <FilterSearch
            placeholder="搜索异常..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            className="max-w-[280px]"
          />
          <Select
            size="sm"
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
          >
            <SelectOption value="all">全部严重度</SelectOption>
            {Object.entries(exceptionSeverityConfig).map(([k, v]) => (
              <SelectOption key={k} value={k}>{v.label}</SelectOption>
            ))}
          </Select>
        </FilterBar>

        {/* Queue Table (Section 15.3) */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-vscode-sidebar text-vscode-textMuted text-left">
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">订单号</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">异常类型</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">严重度</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">渠道</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">客户</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-right">金额</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">SLA</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">负责人</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">创建时间</th>
                <th className="px-3 py-2 font-medium border-b border-vscode-border whitespace-nowrap">最近操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(exc => {
                const sev = exceptionSeverityConfig[exc.severity];
                const tp = exceptionTypeConfig[exc.type];
                const slaColor = exc.slaHoursRemaining < 0 ? 'text-red-400' : exc.slaHoursRemaining <= 4 ? 'text-yellow-400' : 'text-vscode-textMuted';
                return (
                  <tr
                    key={exc.id}
                    onClick={() => setSelectedExcId(exc.id)}
                    onDoubleClick={() => onOpenOrder?.(exc.orderId)}
                    className={`cursor-pointer transition-colors ${
                      selectedExcId === exc.id ? 'bg-vscode-activeItem' : 'hover:bg-vscode-hover'
                    }`}
                  >
                    <td className="px-3 py-2 border-b border-vscode-border">
                      <span className="text-vscode-accent font-medium cursor-pointer hover:underline" onClick={e => { e.stopPropagation(); onOpenOrder?.(exc.orderId); }}>
                        {exc.orderId}
                      </span>
                      <div className="text-[10px] text-vscode-textMuted">{exc.id}</div>
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: tp.color, backgroundColor: tp.bgColor }}>{tp.label}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: sev.color, backgroundColor: sev.bgColor }}>{sev.label}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{exc.channel}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{exc.customerName}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-right text-vscode-textBright font-medium">${exc.amount.toLocaleString()}</td>
                    <td className={`px-3 py-2 border-b border-vscode-border text-center font-mono text-[11px] ${slaColor}`}>
                      {exc.slaHoursRemaining > 0 ? `${exc.slaHoursRemaining}小时` : exc.slaHoursRemaining < 0 ? `超${Math.abs(exc.slaHoursRemaining)}小时` : '-'}
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text text-[11px]">{exc.assignedTo || '-'}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted text-[11px]">{exc.createdAt}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-textMuted text-[11px] truncate max-w-[200px]">{exc.lastAction}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-vscode-textMuted">没有匹配当前筛选条件的异常。</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Quick Resolve Panel (Section 15.3) */}
      <div className="w-[300px] border-l border-vscode-border bg-vscode-sidebar flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-vscode-breadcrumb shrink-0 border-b border-vscode-border">
          <span>快速处理</span>
          <IconMoreH size={14} className="text-vscode-textMuted cursor-pointer" />
        </div>

        {selectedExc ? (
          <>
            {/* Exception summary */}
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] text-vscode-accent font-medium">{selectedExc.id}</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: exceptionSeverityConfig[selectedExc.severity].color, backgroundColor: exceptionSeverityConfig[selectedExc.severity].bgColor }}>
                  {exceptionSeverityConfig[selectedExc.severity].label}
                </span>
              </div>
              <div className="text-[11px] text-vscode-text leading-relaxed">{selectedExc.description}</div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-vscode-textMuted">
                <span>订单：<span className="text-vscode-accent cursor-pointer hover:underline" onClick={() => onOpenOrder?.(selectedExc.orderId)}>{selectedExc.orderId}</span></span>
              </div>
            </div>

            {/* Exception Details */}
            <div className="px-4 py-3 border-b border-vscode-border space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-vscode-textMuted">类型</span><span className="text-vscode-text">{exceptionTypeConfig[selectedExc.type].label}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">客户</span><span className="text-vscode-text">{selectedExc.customerName}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">金额</span><span className="text-vscode-textBright font-medium">${selectedExc.amount.toLocaleString()}</span></div>
              <div className="flex justify-between">
                <span className="text-vscode-textMuted">SLA</span>
                <span className={selectedExc.slaHoursRemaining < 0 ? 'text-red-400 font-medium' : selectedExc.slaHoursRemaining <= 4 ? 'text-yellow-400' : 'text-vscode-text'}>
                  {selectedExc.slaHoursRemaining > 0 ? `剩余 ${selectedExc.slaHoursRemaining}小时` : `超期 ${Math.abs(selectedExc.slaHoursRemaining)}小时`}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">负责人</span><span className="text-vscode-text">{selectedExc.assignedTo || '未分配'}</span></div>
              <div className="flex justify-between"><span className="text-vscode-textMuted">最近操作</span><span className="text-vscode-text truncate ml-4">{selectedExc.lastAction}</span></div>
            </div>

            {/* Resolution Actions */}
            <div className="px-4 py-3 border-b border-vscode-border">
              <div className="text-[11px] uppercase font-bold tracking-wide text-vscode-breadcrumb mb-2">处理操作</div>
              <div className="space-y-1">
                {actions.map(a => (
                  <Button key={a.label} variant="ghost" size="sm" className="w-full justify-start">
                    <a.icon size={12} className={`shrink-0 ${a.priority === 'high' ? 'text-red-400' : a.priority === 'medium' ? 'text-yellow-400' : 'text-vscode-textMuted'}`} />
                    <span className="flex-1 text-left">{a.label}</span>
                    {a.priority === 'high' && <span className="text-[9px] px-1 py-0.5 rounded bg-red-500/20 text-red-400">!</span>}
                  </Button>
                ))}
              </div>
            </div>

            {/* Assign / Escalate */}
            <div className="px-4 py-3">
              <div className="text-[11px] uppercase font-bold tracking-wide text-vscode-breadcrumb mb-2">管理</div>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start"><IconUserPlus size={12} /> 分配给我</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start"><IconUserPlus size={12} /> 分配给...</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:text-red-300"><IconWarning size={12} /> 升级处理</Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-green-400 hover:text-green-300"><IconCheckCircle size={12} /> 标记解决</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-vscode-textMuted text-[12px] px-4 text-center">
            选择一个异常以查看处理操作
          </div>
        )}
      </div>
    </div>
  );
}
