import { mockFulfillmentQueue, type MockShipment } from '../mock/oms';

function statusStyle(s: MockShipment['status']) {
  switch (s) {
    case 'queued':
      return 'bg-vscode-hover text-vscode-textMuted';
    case 'picked':
      return 'bg-blue-500/15 text-blue-400';
    case 'shipped':
      return 'bg-green-500/15 text-green-400';
    default:
      return 'bg-vscode-hover text-vscode-textMuted';
  }
}

function statusLabel(s: MockShipment['status']) {
  switch (s) {
    case 'queued':
      return '待拣货';
    case 'picked':
      return '已拣货';
    case 'shipped':
      return '已发运';
    default:
      return s;
  }
}

export function FulfillmentQueuePage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-vscode-editor text-vscode-text p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-vscode-textBright mb-1">发货队列</h1>
        <p className="text-[13px] text-vscode-textMuted">Mock 发运单 — 可配合多 Tab 拖拽、右键关闭等操作体验。</p>
      </div>

      <div className="grid gap-3 max-w-3xl">
        {mockFulfillmentQueue.map((row) => (
          <div
            key={row.id}
            className="rounded border border-vscode-border bg-vscode-sidebar/25 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <div className="font-mono text-[13px] text-vscode-accent">{row.id}</div>
              <div className="text-[14px] text-vscode-textBright mt-0.5">{row.destination}</div>
              <div className="text-[12px] text-vscode-textMuted mt-1">
                {row.carrier} · 截单 {row.shipBy}
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusStyle(row.status)}`}>
              {statusLabel(row.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
