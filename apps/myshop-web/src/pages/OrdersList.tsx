import { useState, useMemo } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDownload,
  IconPlus,
  IconFilter,
  IconMoreH,
  IconPause,
  IconPlay,
  IconTag,
  IconUserPlus,
  IconStar,
} from '@idpxyz/ui-icons';
import {
  Button,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Select, SelectOption,
} from '@idpxyz/ui-primitives';
import {
  PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, PageHeaderActions,
  FilterBar, FilterSearch,
} from '@idpxyz/ui-patterns';
import {
  orders as allOrders,
  orderStatusConfig,
  paymentStatusConfig,
  fulfillmentStatusConfig,
  riskLevelConfig,
  type Order,
  type OrderStatus,
} from '../data/oms';

interface OrdersListProps {
  onSelectOrder?: (order: Order) => void;
  onOpenOrderDetail?: (orderId: string) => void;
}

const savedViews: { id: string; label: string; filter?: (o: Order) => boolean }[] = [
  { id: 'all', label: '全部订单' },
  { id: 'new', label: '新订单', filter: o => o.status === 'submitted' },
  { id: 'confirmed', label: '已确认', filter: o => o.status === 'confirmed' },
  { id: 'pending_payment', label: '待支付', filter: o => o.paymentStatus === 'pending' || o.paymentStatus === 'failed' },
  { id: 'awaiting_alloc', label: '待分配', filter: o => o.fulfillmentStatus === 'unallocated' && o.status !== 'cancelled' && o.status !== 'draft' },
  { id: 'in_fulfillment', label: '履约中', filter: o => ['picking', 'packing', 'allocated'].includes(o.fulfillmentStatus) },
  { id: 'partial', label: '部分履约', filter: o => o.status === 'partially_fulfilled' },
  { id: 'on_hold', label: '暂挂', filter: o => o.status === 'on_hold' },
  { id: 'exceptions', label: '异常', filter: o => o.riskLevel === 'high' || o.slaHoursRemaining < 0 },
  { id: 'closed', label: '已关闭', filter: o => o.status === 'completed' || o.status === 'cancelled' || o.status === 'closed' },
];

export default function OrdersList({ onSelectOrder, onOpenOrderDetail }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let result = [...allOrders];
    const view = savedViews.find(v => v.id === activeView);
    if (view?.filter) result = result.filter(view.filter);
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (channelFilter !== 'all') result = result.filter(o => o.channel === channelFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.channel.toLowerCase().includes(q) ||
        o.store.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchTerm, activeView, statusFilter, channelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowClick = (order: Order) => {
    setSelectedOrderId(order.id);
    onSelectOrder?.(order);
  };

  const handleRowDoubleClick = (order: Order) => {
    onOpenOrderDetail?.(order.id);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map(o => o.id)));
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Page Header (Section 10.2) */}
      <PageHeader className="px-5 shrink-0">
        <PageHeaderContent>
          <PageHeaderTitle>订单列表</PageHeaderTitle>
          <PageHeaderDescription>{filtered.length} 条订单</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
          <Button variant="default" size="sm"><IconPlus size={13} /> 创建订单</Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Saved Views (Section 10.6) */}
      <div className="flex items-center gap-1 px-5 py-1.5 border-b border-vscode-border shrink-0 overflow-x-auto tab-scroll-hidden">
        {savedViews.map(v => (
          <button
            key={v.id}
            onClick={() => { setActiveView(v.id); setCurrentPage(1); }}
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

      {/* Filter Bar (Section 10.3) */}
      <FilterBar className="px-5 shrink-0">
        <FilterSearch
          placeholder="搜索订单号、客户、渠道..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          onClear={() => { setSearchTerm(''); setCurrentPage(1); }}
          className="max-w-[320px]"
        />
        <Select
          size="sm"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <SelectOption value="all">全部状态</SelectOption>
          {Object.entries(orderStatusConfig).map(([k, v]) => (
            <SelectOption key={k} value={k}>{v.label}</SelectOption>
          ))}
        </Select>
        <Select
          size="sm"
          value={channelFilter}
          onChange={e => { setChannelFilter(e.target.value); setCurrentPage(1); }}
        >
          <SelectOption value="all">全部渠道</SelectOption>
          <SelectOption value="官网">官网</SelectOption>
          <SelectOption value="App">App</SelectOption>
          <SelectOption value="平台">平台</SelectOption>
        </Select>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <IconFilter size={13} /> 更多筛选
        </Button>
      </FilterBar>

      {/* Bulk Action Bar (Section 10.7) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-5 py-1.5 bg-vscode-accent/10 border-b border-vscode-accent/30 shrink-0">
          <span className="text-[11px] text-vscode-accent font-medium">已选 {selectedIds.size} 项</span>
          <div className="h-3 w-px bg-vscode-border mx-1" />
          <Button variant="ghost" size="sm" className="text-[11px]"><IconPause size={12} /> 暂挂</Button>
          <Button variant="ghost" size="sm" className="text-[11px]"><IconPlay size={12} /> 释放</Button>
          <Button variant="ghost" size="sm" className="text-[11px]"><IconUserPlus size={12} /> 分配</Button>
          <Button variant="ghost" size="sm" className="text-[11px]"><IconTag size={12} /> 标签</Button>
          <Button variant="ghost" size="sm" className="text-[11px]"><IconStar size={12} /> 优先级</Button>
          <Button variant="ghost" size="sm" className="text-[11px]"><IconDownload size={12} /> 导出</Button>
        </div>
      )}

      {/* Dense Data Table (Section 10.4) */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-vscode-sidebar">
            <TableRow>
              <TableHead className="w-8">
                <input type="checkbox" checked={selectedIds.size === paged.length && paged.length > 0} onChange={toggleSelectAll} className="accent-vscode-accent" />
              </TableHead>
              <TableHead className="whitespace-nowrap">订单号</TableHead>
              <TableHead className="whitespace-nowrap">渠道</TableHead>
              <TableHead className="whitespace-nowrap">客户</TableHead>
              <TableHead className="whitespace-nowrap">创建时间</TableHead>
              <TableHead className="whitespace-nowrap text-center">状态</TableHead>
              <TableHead className="whitespace-nowrap text-center">支付</TableHead>
              <TableHead className="whitespace-nowrap text-center">履约</TableHead>
              <TableHead className="whitespace-nowrap text-right">金额</TableHead>
              <TableHead className="whitespace-nowrap text-center">商品</TableHead>
              <TableHead className="whitespace-nowrap text-center">风险</TableHead>
              <TableHead className="whitespace-nowrap text-center">SLA</TableHead>
              <TableHead className="whitespace-nowrap">仓库</TableHead>
              <TableHead className="whitespace-nowrap">负责人</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(order => {
              const os = orderStatusConfig[order.status];
              const ps = paymentStatusConfig[order.paymentStatus];
              const fs = fulfillmentStatusConfig[order.fulfillmentStatus];
              const rl = riskLevelConfig[order.riskLevel];
              const slaColor = order.slaHoursRemaining < 0 ? 'text-red-400' : order.slaHoursRemaining <= 6 ? 'text-yellow-400' : 'text-vscode-textMuted';
              return (
                <TableRow
                  key={order.id}
                  onClick={() => handleRowClick(order)}
                  onDoubleClick={() => handleRowDoubleClick(order)}
                  className={`cursor-pointer ${
                    selectedOrderId === order.id ? 'bg-vscode-activeItem' : ''
                  }`}
                >
                  <TableCell className="py-1.5">
                    <input type="checkbox" checked={selectedIds.has(order.id)} onClick={e => toggleSelect(order.id, e)} onChange={() => {}} className="accent-vscode-accent" />
                  </TableCell>
                  <TableCell className="py-1.5 text-vscode-accent font-medium whitespace-nowrap">{order.id}</TableCell>
                  <TableCell className="py-1.5 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{order.channel}</span>
                      <span className="text-[10px] text-vscode-textMuted">{order.store}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5 whitespace-nowrap">{order.customerName}</TableCell>
                  <TableCell className="py-1.5 text-vscode-textMuted whitespace-nowrap text-[11px]">{order.createdAt}</TableCell>
                  <TableCell className="py-1.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: os.color, backgroundColor: os.bgColor }}>{os.label}</span>
                  </TableCell>
                  <TableCell className="py-1.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: ps.color, backgroundColor: ps.bgColor }}>{ps.label}</span>
                  </TableCell>
                  <TableCell className="py-1.5 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color: fs.color, backgroundColor: fs.bgColor }}>{fs.label}</span>
                  </TableCell>
                  <TableCell className="py-1.5 text-right whitespace-nowrap text-vscode-textBright font-medium">
                    {order.currency === 'USD' ? '$' : order.currency === 'EUR' ? '\u20AC' : order.currency}{order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-1.5 text-center">{order.itemCount}</TableCell>
                  <TableCell className="py-1.5 text-center whitespace-nowrap">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ color: rl.color, backgroundColor: rl.bgColor }}>{rl.label}</span>
                  </TableCell>
                  <TableCell className={`py-1.5 text-center whitespace-nowrap text-[11px] font-mono ${slaColor}`}>
                    {order.slaHoursRemaining > 0 ? `${order.slaHoursRemaining}小时` : order.slaHoursRemaining < 0 ? `超${Math.abs(order.slaHoursRemaining)}小时` : '-'}
                  </TableCell>
                  <TableCell className="py-1.5 text-vscode-textMuted whitespace-nowrap text-[11px]">{order.warehouse}</TableCell>
                  <TableCell className="py-1.5 whitespace-nowrap text-[11px]">{order.assignedTo || '-'}</TableCell>
                  <TableCell className="py-1.5">
                    <Button variant="ghost" size="icon" className="h-5 w-5"><IconMoreH size={12} /></Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={15} className="px-4 py-8 text-center text-vscode-textMuted">
                  没有匹配当前筛选条件的订单，请调整搜索或视图。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-1.5 border-t border-vscode-border shrink-0 text-[12px] text-vscode-textMuted select-none">
        <span>第 {currentPage} / {totalPages} 页 · 共 {filtered.length} 条</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><IconChevronsLeft size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><IconChevronLeft size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}><IconChevronRight size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><IconChevronsRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}
