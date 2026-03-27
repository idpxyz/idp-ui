import { useMemo,useState } from 'react';
import { mockOrders, type MockOrder } from '../mock/oms';
import { Check, Clock, Key, Ship } from 'lucide-react';

function statusStyle(s: MockOrder['status']) {
  switch (s) {
    case 'pending':
      return 'bg-yellow-500/15 text-yellow-400';
    case 'shipped':
      return 'bg-blue-500/15 text-blue-400';
    case 'completed':
      return 'bg-green-500/15 text-green-400';
    default:
      return 'bg-idpxyz-hover text-idpxyz-textMuted';
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
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MockOrder['status']>('all');

  type sortKey = 'id' | 'customer' | 'channel' | 'status' | 'total' | 'placedAt';
  type sortDir = 'asc' | 'desc';

  const [sortKey, setSortKey] = useState<sortKey | null>(null);
  const [sortDir, setSortDir] = useState<sortDir>('asc');

  function handlerSortClick(key: sortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir('asc');
      return;
    } 
    if (sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setSortKey(null);
      setSortDir('asc');
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockOrders.filter((o: MockOrder)=> {
      const matchQuery =
        !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.channel.toLowerCase().includes(q);
      const matchStatus = status === 'all' || o.status === status;
      return matchQuery && matchStatus;
    });
  }, [query, status]);

  const sorted = useMemo(() => {
    if (!sortKey) {
      return filtered;
    }

    const dir = sortDir === 'asc' ? 1 : -1;

    // mock: '¥12,480' — strip ¥、逗号、空格等，只保留数字和小数点
    const parseTotal = (t: string) => {
      const n = Number(t.replace(/[^\d.]/g, ''));
      return Number.isFinite(n) ? n : 0;
    };

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id':
          cmp = a.id.localeCompare(b.id,undefined, {numeric: true});
          break;
        case 'customer':
          cmp = a.customer.localeCompare(b.customer,'zh-CN');
          break;
        case 'channel':
          cmp = a.channel.localeCompare(b.channel);
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'total':
          cmp = parseTotal(a.total) - parseTotal(b.total);
          break;
        case 'placedAt':
          cmp = a.placedAt.localeCompare(b.placedAt);
          break;
        default:
          cmp = 0;
      }
      return cmp * dir;
    });
  }, [filtered, sortKey, sortDir]);
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-idpxyz-editor text-idpxyz-text p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-[18px] font-semibold text-idpxyz-textBright mb-1">订单概览</h1>
        <p className="text-[13px] text-idpxyz-textMuted">Mock 数据 — 演示渠道与状态筛选前的列表视图。</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        
         <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索：订单号 / 客户 / 渠道"
          className="h-8 w-[320px] max-w-full rounded border border-idpxyz-border bg-idpxyz-inputBg px-3 text-[13px] text-idpxyz-text placeholder:text-idpxyz-textMuted outline-none focus-visible:ring-1 focus-visible:ring-idpxyz-accent/40"
        />
        <div className="flex items-center gap-2">
          {(
            [
              { key: 'all', label: '全部' },
              { key: 'pending', label: '待处理' },
              { key: 'shipped', label: '已发货' },
              { key: 'completed', label: '已完成' },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStatus(s.key)}
              className={`h-8 rounded px-3 text-[12px] border border-idpxyz-border ${
                status === s.key
                  ? 'bg-idpxyz-activeItem text-idpxyz-textBright'
                  : 'bg-idpxyz-sidebar text-idpxyz-textMuted hover:bg-idpxyz-hover hover:text-idpxyz-text'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="ml-auto text-[12px] text-idpxyz-textMuted">
          结果：<span className="text-idpxyz-text">{filtered.length}</span> / {mockOrders.length}
        </div>
      </div>
      </div>

      <div className="rounded border border-idpxyz-border overflow-x-auto bg-idpxyz-panelBg">
        <table className="w-full min-w-[720px] text-[13px] text-left border-collapse">
          <thead>
            <tr className="border-b border-idpxyz-border bg-idpxyz-sidebar text-idpxyz-textMuted text-[11px] uppercase tracking-wide">
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('id')} className="flex items-center gap-1">
                  订单号
                  <span className="text-[11px]">
                    {sortKey === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('customer')} className="flex items-center gap-1">
                  客户
                  <span className="text-[11px]">
                    {sortKey === 'customer' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('channel')} className="flex items-center gap-1">
                  渠道
                  <span className="text-[11px]">
                    {sortKey === 'channel' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('status')} className="flex items-center gap-1">
                  状态
                  <span className="text-[11px]">
                    {sortKey === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('total')} className="flex items-center gap-1">
                  金额
                  <span className="text-[11px]">
                    {sortKey === 'total' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">
                <button type="button" onClick={() => handlerSortClick('placedAt')} className="flex items-center gap-1">
                  下单时间
                  <span className="text-[11px]">
                    {sortKey === 'placedAt' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id} className="border-b border-idpxyz-border last:border-b-0 hover:bg-idpxyz-hover">
                <td className="px-4 py-2.5 font-mono text-idpxyz-accent whitespace-nowrap">{row.id}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{row.customer}</td>
                <td className="px-4 py-2.5 text-idpxyz-textMuted whitespace-nowrap">{row.channel}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${statusStyle(row.status)}`}>
                    {statusLabel(row.status)}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">{row.total}</td>
                <td className="px-4 py-2.5 text-idpxyz-textMuted whitespace-nowrap">{row.placedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
