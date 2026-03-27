import { mockStockAlerts } from '../mock/oms';

export function InventoryAlertsPage() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-idpxyz-editor text-idpxyz-text p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-idpxyz-textBright mb-1">库存预警</h1>
        <p className="text-[13px] text-idpxyz-textMuted">低于安全库存的 SKU 列表示例（mock）。</p>
      </div>

      <ul className="space-y-3 max-w-3xl">
        {mockStockAlerts.map((row) => {
          const ratio = row.minLevel > 0 ? Math.min(100, Math.round((row.onHand / row.minLevel) * 100)) : 0;
          const critical = ratio < 50;
          return (
            <li
              key={row.sku}
              className={`rounded border px-4 py-3 ${
                critical ? 'border-red-500/40 bg-red-500/5' : 'border-idpxyz-border bg-idpxyz-sidebar/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[12px] text-idpxyz-accent">{row.sku}</div>
                  <div className="text-[14px] text-idpxyz-textBright mt-0.5">{row.name}</div>
                  <div className="text-[12px] text-idpxyz-textMuted mt-1">{row.site}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] uppercase tracking-wide text-idpxyz-textMuted">在库 / 安全线</div>
                  <div className="text-[15px] font-medium tabular-nums mt-1">
                    <span className={critical ? 'text-red-400' : 'text-idpxyz-text'}>{row.onHand}</span>
                    <span className="text-idpxyz-textMuted"> / {row.minLevel}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-idpxyz-hover overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${critical ? 'bg-red-500/80' : 'bg-idpxyz-accent/70'}`}
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
