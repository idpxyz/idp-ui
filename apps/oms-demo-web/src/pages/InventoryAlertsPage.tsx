import { mockStockAlerts } from '../mock/oms';

export function InventoryAlertsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-vscode-editor text-vscode-text p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-vscode-textBright mb-1">库存预警</h1>
        <p className="text-[13px] text-vscode-textMuted">低于安全库存的 SKU 列表示例（mock）。</p>
      </div>

      <ul className="space-y-3 max-w-3xl">
        {mockStockAlerts.map((row) => {
          const ratio = row.minLevel > 0 ? Math.min(100, Math.round((row.onHand / row.minLevel) * 100)) : 0;
          const critical = ratio < 50;
          return (
            <li
              key={row.sku}
              className={`rounded border px-4 py-3 ${
                critical ? 'border-red-500/40 bg-red-500/5' : 'border-vscode-border bg-vscode-sidebar/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[12px] text-vscode-accent">{row.sku}</div>
                  <div className="text-[14px] text-vscode-textBright mt-0.5">{row.name}</div>
                  <div className="text-[12px] text-vscode-textMuted mt-1">{row.site}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] uppercase tracking-wide text-vscode-textMuted">在库 / 安全线</div>
                  <div className="text-[15px] font-medium tabular-nums mt-1">
                    <span className={critical ? 'text-red-400' : 'text-vscode-text'}>{row.onHand}</span>
                    <span className="text-vscode-textMuted"> / {row.minLevel}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-vscode-hover overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${critical ? 'bg-red-500/80' : 'bg-vscode-accent/70'}`}
                  style={{ width: `${Math.min(ratio, 100)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
