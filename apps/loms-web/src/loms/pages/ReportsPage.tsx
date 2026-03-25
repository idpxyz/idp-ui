import { useState } from 'react';
import {
  BarChart3, TrendingUp, Clock, Download, Calendar, Filter,
  PieChart, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Button } from '@idpxyz/ui-primitives';

interface ReportsPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type ReportTab = 'operational' | 'sla' | 'carrier' | 'cost';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export default function ReportsPage({ onOpenTab }: ReportsPageProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('operational');
  const [dateRange, setDateRange] = useState('7d');

  const tabs: { id: ReportTab; label: string }[] = [
    { id: 'operational', label: 'Operational' },
    { id: 'sla', label: 'SLA Performance' },
    { id: 'carrier', label: 'Carrier Analytics' },
    { id: 'cost', label: 'Cost Analysis' },
  ];

  const operationalMetrics: MetricCard[] = [
    { label: 'Total Shipments', value: '1,247', change: '+12%', trend: 'up', color: 'text-blue-400' },
    { label: 'On-Time Delivery', value: '94.2%', change: '+2.1%', trend: 'up', color: 'text-green-400' },
    { label: 'Avg Lead Time', value: '8.2 days', change: '-0.5d', trend: 'down', color: 'text-green-400' },
    { label: 'Exception Rate', value: '6.8%', change: '-1.2%', trend: 'down', color: 'text-green-400' },
    { label: 'Avg Resolution Time', value: '4.3h', change: '+0.2h', trend: 'up', color: 'text-yellow-400' },
    { label: 'Cost per Shipment', value: '$142', change: '-$8', trend: 'down', color: 'text-green-400' },
  ];

  const slaMetrics: MetricCard[] = [
    { label: 'SLA Compliance', value: '91.5%', change: '+1.8%', trend: 'up', color: 'text-green-400' },
    { label: 'Breached Today', value: '3', change: '-2', trend: 'down', color: 'text-green-400' },
    { label: 'At Risk Now', value: '7', change: '+1', trend: 'up', color: 'text-yellow-400' },
    { label: 'Avg SLA Margin', value: '6.2h', change: '+0.8h', trend: 'up', color: 'text-green-400' },
  ];

  const carrierRanking = [
    { carrier: 'Maersk', onTime: '96%', volume: 342, avgTime: '7.8d', cost: '$138', score: 92 },
    { carrier: 'DHL', onTime: '93%', volume: 218, avgTime: '3.2d', cost: '$165', score: 88 },
    { carrier: 'FedEx', onTime: '91%', volume: 156, avgTime: '2.8d', cost: '$178', score: 85 },
    { carrier: 'COSCO', onTime: '89%', volume: 289, avgTime: '12.4d', cost: '$98', score: 82 },
    { carrier: 'UPS', onTime: '94%', volume: 134, avgTime: '3.5d', cost: '$155', score: 87 },
    { carrier: 'MSC', onTime: '88%', volume: 108, avgTime: '14.2d', cost: '$92', score: 79 },
  ];

  const currentMetrics = activeTab === 'sla' ? slaMetrics : operationalMetrics;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-vscode-border shrink-0 bg-vscode-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-vscode-textBright font-semibold">Reports & Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-2 rounded border border-vscode-border outline-none cursor-pointer">
            <option value="1d">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download size={11} /> Export
          </Button>
        </div>
      </div>

      <div className="flex items-center h-[32px] border-b border-vscode-border shrink-0 px-2 bg-vscode-editor">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant="ghost"
            size="sm"
            className={`h-full rounded-none px-3 text-[11px] border-b-2 border-r border-vscode-border/50 last:border-r-0 ${
              activeTab === tab.id ? 'text-vscode-text border-b-vscode-accent' : 'text-vscode-textMuted border-transparent hover:text-vscode-text'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Metric Cards */}
        <div className={`grid gap-3 mb-4 ${currentMetrics.length > 4 ? 'grid-cols-3 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'}`}>
          {currentMetrics.map((m) => (
            <div key={m.label} className="bg-vscode-sidebar rounded-lg p-3 border border-vscode-border">
              <div className="text-[10px] text-vscode-textMuted mb-1">{m.label}</div>
              <div className={`text-[20px] font-bold ${m.color}`}>{m.value}</div>
              <div className="flex items-center gap-1 mt-1 text-[10px]">
                {m.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                <span className={m.color}>{m.change}</span>
                <span className="text-vscode-textMuted">vs prev period</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab-specific content */}
        {(activeTab === 'carrier' || activeTab === 'cost') && (
          <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
            <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-vscode-textMuted" />
              {activeTab === 'carrier' ? 'Carrier Performance Ranking' : 'Cost by Carrier'}
            </h3>
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="text-vscode-textMuted text-left">
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Carrier</th>
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">On-Time %</th>
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">Volume</th>
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">Avg Time</th>
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border text-center">Avg Cost</th>
                  <th className="px-3 py-1.5 font-medium border-b border-vscode-border">Score</th>
                </tr>
              </thead>
              <tbody>
                {carrierRanking.map((c) => (
                  <tr key={c.carrier} className="hover:bg-vscode-hover cursor-pointer" onClick={() => onOpenTab?.('carrier-ops', 'Carrier Ops')}>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text font-medium">{c.carrier}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center">
                      <span className={parseFloat(c.onTime) >= 93 ? 'text-green-400' : parseFloat(c.onTime) >= 90 ? 'text-yellow-400' : 'text-red-400'}>{c.onTime}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center text-vscode-text">{c.volume}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center text-vscode-textMuted">{c.avgTime}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center text-vscode-text">{c.cost}</td>
                    <td className="px-3 py-2 border-b border-vscode-border">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-vscode-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${c.score >= 90 ? 'bg-green-400' : c.score >= 85 ? 'bg-yellow-400' : 'bg-orange-400'}`} style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="text-vscode-textMuted text-[10px]">{c.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'operational' || activeTab === 'sla') && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
              <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-vscode-textMuted" />
                {activeTab === 'operational' ? 'Shipment Volume Trend' : 'SLA Compliance Trend'}
              </h3>
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const value = activeTab === 'operational' ? [42, 38, 51, 45, 48, 22, 18][i] : [94, 92, 95, 91, 93, 96, 95][i];
                  const max = activeTab === 'operational' ? 55 : 100;
                  return (
                    <div key={day} className="flex items-center gap-2 text-[11px]">
                      <span className="w-8 text-vscode-textMuted">{day}</span>
                      <div className="flex-1 h-2 bg-vscode-border rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(value / max) * 100}%` }} />
                      </div>
                      <span className="w-8 text-right text-vscode-text">{value}{activeTab === 'sla' ? '%' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-vscode-sidebar rounded-lg p-4 border border-vscode-border">
              <h3 className="text-[12px] font-semibold text-vscode-textBright mb-3 flex items-center gap-2">
                <PieChart size={14} className="text-vscode-textMuted" />
                {activeTab === 'operational' ? 'Exception Distribution' : 'Breach by Reason'}
              </h3>
              <div className="space-y-2">
                {(activeTab === 'operational'
                  ? [
                      { label: 'Customs Hold', pct: 28, color: 'bg-red-400' },
                      { label: 'Carrier Delay', pct: 22, color: 'bg-orange-400' },
                      { label: 'Missing Scan', pct: 18, color: 'bg-yellow-400' },
                      { label: 'Address Issue', pct: 15, color: 'bg-blue-400' },
                      { label: 'Booking Failure', pct: 10, color: 'bg-purple-400' },
                      { label: 'Other', pct: 7, color: 'bg-gray-400' },
                    ]
                  : [
                      { label: 'Late Pickup', pct: 32, color: 'bg-red-400' },
                      { label: 'Transit Delay', pct: 28, color: 'bg-orange-400' },
                      { label: 'Customs', pct: 20, color: 'bg-yellow-400' },
                      { label: 'Last Mile', pct: 12, color: 'bg-blue-400' },
                      { label: 'Other', pct: 8, color: 'bg-gray-400' },
                    ]
                ).map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-vscode-text">{item.label}</span>
                      <span className="text-vscode-textMuted">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-vscode-border rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




