import { ChevronRight, Wifi, WifiOff, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface NetworkHealthProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

const carriers = [
  { name: 'Maersk', status: 'online', latency: '120ms', uptime: '99.8%', lastSync: '2m ago', apiCalls24h: 1842, errors24h: 3 },
  { name: 'DHL', status: 'online', latency: '85ms', uptime: '99.9%', lastSync: '1m ago', apiCalls24h: 2156, errors24h: 0 },
  { name: 'FedEx', status: 'online', latency: '95ms', uptime: '99.7%', lastSync: '3m ago', apiCalls24h: 1523, errors24h: 2 },
  { name: 'UPS', status: 'online', latency: '110ms', uptime: '99.6%', lastSync: '2m ago', apiCalls24h: 987, errors24h: 1 },
  { name: 'COSCO', status: 'degraded', latency: '450ms', uptime: '97.2%', lastSync: '8m ago', apiCalls24h: 634, errors24h: 18 },
  { name: 'Evergreen', status: 'online', latency: '130ms', uptime: '99.5%', lastSync: '4m ago', apiCalls24h: 412, errors24h: 0 },
  { name: 'MSC', status: 'online', latency: '105ms', uptime: '99.8%', lastSync: '1m ago', apiCalls24h: 789, errors24h: 1 },
  { name: 'KMTC', status: 'offline', latency: '-', uptime: '94.1%', lastSync: '45m ago', apiCalls24h: 156, errors24h: 42 },
  { name: 'PIL', status: 'online', latency: '140ms', uptime: '99.3%', lastSync: '5m ago', apiCalls24h: 321, errors24h: 2 },
  { name: 'ZIM', status: 'online', latency: '160ms', uptime: '99.1%', lastSync: '3m ago', apiCalls24h: 267, errors24h: 4 },
  { name: 'Hapag-Lloyd', status: 'online', latency: '115ms', uptime: '99.7%', lastSync: '2m ago', apiCalls24h: 445, errors24h: 1 },
];

const integrations = [
  { name: 'Customs API (CN)', status: 'online', latency: '200ms' },
  { name: 'Customs API (US)', status: 'online', latency: '180ms' },
  { name: 'Terminal OS - Shanghai', status: 'online', latency: '90ms' },
  { name: 'Terminal OS - Busan', status: 'degraded', latency: '380ms' },
  { name: 'Address Validation', status: 'online', latency: '50ms' },
  { name: 'Rate Engine', status: 'online', latency: '60ms' },
  { name: 'Document Service', status: 'online', latency: '75ms' },
];

export default function NetworkHealth({ onOpenTab }: NetworkHealthProps) {
  const online = carriers.filter((c) => c.status === 'online').length;
  const degraded = carriers.filter((c) => c.status === 'degraded').length;
  const offline = carriers.filter((c) => c.status === 'offline').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Overview</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">Network Health</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Status summary */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Carriers Online', value: online, icon: Wifi, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Degraded', value: degraded, icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { label: 'Offline', value: offline, icon: WifiOff, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Total API Calls (24h)', value: carriers.reduce((s, c) => s + c.apiCalls24h, 0).toLocaleString(), icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((kpi) => (
            <div key={kpi.label} className={`${kpi.bg} rounded-lg p-4 border border-vscode-border`}>
              <kpi.icon size={18} className={`${kpi.color} mb-2`} />
              <div className={`text-[24px] font-bold ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[12px] text-vscode-textMuted mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Carrier connectivity */}
        <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border mb-4">
          <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
            <Wifi size={14} className="text-vscode-textMuted" />
            Carrier Connectivity
          </h3>
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-vscode-textMuted text-left">
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Carrier</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">Status</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Latency</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Uptime (30d)</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Last Sync</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-right">API Calls (24h)</th>
                <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-right">Errors (24h)</th>
              </tr>
            </thead>
            <tbody>
              {carriers.map((c) => (
                <tr key={c.name} className="hover:bg-vscode-hover cursor-pointer">
                  <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text font-medium">{c.name}</td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-center">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${
                      c.status === 'online' ? 'bg-green-500/20 text-green-400' :
                      c.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {c.status === 'online' ? <CheckCircle size={10} /> : c.status === 'degraded' ? <AlertTriangle size={10} /> : <WifiOff size={10} />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text font-mono">{c.latency}</td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text">{c.uptime}</td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-textMuted">{c.lastSync}</td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-right text-vscode-text">{c.apiCalls24h.toLocaleString()}</td>
                  <td className="px-3 py-1.5 border-b border-vscode-border text-right">
                    <span className={c.errors24h > 10 ? 'text-red-400 font-medium' : c.errors24h > 0 ? 'text-yellow-400' : 'text-vscode-textMuted'}>{c.errors24h}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Integration endpoints */}
        <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
          <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
            <RefreshCw size={14} className="text-vscode-textMuted" />
            Integration Endpoints
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {integrations.map((ep) => (
              <div key={ep.name} className="flex items-center gap-3 p-2.5 rounded border border-vscode-border hover:bg-vscode-hover">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  ep.status === 'online' ? 'bg-green-400' : ep.status === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-[12px] text-vscode-text flex-1">{ep.name}</span>
                <span className="text-[11px] text-vscode-textMuted font-mono">{ep.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




