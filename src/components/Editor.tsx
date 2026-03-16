import { useState } from 'react';
import { ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight, Eye } from 'lucide-react';
import { orders, statusConfig, type Order } from '../data/orders';
import { Button } from './ui/button';

interface EditorProps {
  fileName: string;
  onSelectOrder?: (order: Order) => void;
}

export default function Editor({ fileName, onSelectOrder }: EditorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const pageSize = 8;

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.includes(searchTerm) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowClick = (order: Order) => {
    setSelectedOrderId(order.id);
    onSelectOrder?.(order);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Breadcrumbs */}
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">{"订单管理"}</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">{fileName}</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[320px]">
          <Search size={13} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder="搜索订单号、客户、商品..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="bg-transparent border-none outline-none text-[12px] text-vscode-text w-full placeholder:text-vscode-textMuted"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-vscode-inputBg text-vscode-text text-[12px] h-[28px] px-2 rounded border border-vscode-border outline-none cursor-pointer"
        >
          <option value="all">{"全部状态"}</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <span className="text-[12px] text-vscode-textMuted ml-auto">
          {"共 "}{filtered.length}{" 条"}        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-vscode-sidebar text-vscode-textMuted text-left">
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap">{"订单号"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap">{"客户"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap">{"商品"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">{"数量"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-right">{"单价"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-right">{"总额"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">{"状态"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap">{"日期"}</th>
              <th className="px-4 py-2 font-medium border-b border-vscode-border whitespace-nowrap text-center">{"操作"}</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((order) => {
              const st = statusConfig[order.status];
              return (
                <tr
                  key={order.id}
                  onClick={() => handleRowClick(order)}
                  className={`cursor-pointer transition-colors ${
                    selectedOrderId === order.id
                      ? 'bg-vscode-activeItem'
                      : 'hover:bg-vscode-hover'
                  }`}
                >
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-accent font-medium whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-text whitespace-nowrap">{order.customerName}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-text">{order.product}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-text text-center">{order.quantity}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-text text-right whitespace-nowrap">{"¥"}{order.price.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-textBright font-medium text-right whitespace-nowrap">{"¥"}{order.total.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-center whitespace-nowrap">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-[11px] font-medium"
                      style={{ color: st.color, backgroundColor: st.bgColor }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-vscode-border text-vscode-textMuted whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-2 border-b border-vscode-border text-center">
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleRowClick(order); }}
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      title="查看详情"
                    >
                      <Eye size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-vscode-textMuted">
                  {"没有找到匹配的订单"}                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-vscode-border shrink-0 text-[12px] text-vscode-textMuted select-none">
        <span>{"第 "}{currentPage}{" / "}{totalPages}{" 页"}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}



