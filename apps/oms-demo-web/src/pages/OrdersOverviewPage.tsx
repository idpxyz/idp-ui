import { mockOrders, type MockOrder } from '../mock/oms';

function statusStyle(s: MockOrder['status']) {
  switch (s) {
    case 'pending':
      return 'bg-yellow-500/15 text-yellow-400';
    case 'shipped':
      return 'bg-blue-500/15 text-blue-400';
    case 'completed':
      return 'bg-green-500/15 text-green-400';
    default:
      return 'bg-vscode-hover text-vscode-textMuted';
  }
}

function statusLabel(s: MockOrder['status']) {
  switch (s) {
    case 'pending':
      return '待处理';
    case 'shipped':
      return '已发货';
    case 'completed':
      return '已完成';
    default:
      return s;
  }
}

export function OrdersOverviewPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-vscode-editor text-vscode-text p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-vscode-textBright mb-1">订单概览</h1>
        <p className="text-[13px] text-vscode-textMuted">Mock 数据 — 演示渠道与状态筛选前的列表视图。</p>
      </div>

      <div className="rounded border border-vscode-border overflow-x-auto bg-vscode-panelBg">
        <table className="w-full min-w-[720px] text-[13px] text-left border-collapse">
          <thead>
            <tr className="border-b border-vscode-border bg-vscode-sidebar text-vscode-textMuted text-[11px] uppercase tracking-wide">
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">订单号</th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">客户</th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">渠道</th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">状态</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">金额</th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">下单时间</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((row) => (
              <tr key={row.id} className="border-b border-vscode-border last:border-b-0 hover:bg-vscode-hover">
                <td className="px-4 py-2.5 font-mono text-vscode-accent whitespace-nowrap">{row.id}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{row.customer}</td>
                <td className="px-4 py-2.5 text-vscode-textMuted whitespace-nowrap">{row.channel}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${statusStyle(row.status)}`}>
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">{row.total}</td>
                <td className="px-4 py-2.5 text-vscode-textMuted whitespace-nowrap">{row.placedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
