import { useState } from 'react';
import { ChevronRight, CreditCard, DollarSign, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface BillingPageProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

type BillingTab = 'cost-review' | 'settlement';

const costItems = [
  { id: 'INV-2024-001', carrier: 'Maersk', shipment: 'SHP-20240301', service: 'Ocean FCL', quoted: '$2,450', actual: '$2,450', variance: '$0', status: 'matched', date: '2024-03-01' },
  { id: 'INV-2024-002', carrier: 'DHL', shipment: 'SHP-20240302', service: 'Air Express', quoted: '$4,800', actual: '$5,120', variance: '+$320', status: 'discrepancy', date: '2024-03-02' },
  { id: 'INV-2024-003', carrier: 'FedEx', shipment: 'SHP-20240306', service: 'Air Freight', quoted: '$3,200', actual: '$3,200', variance: '$0', status: 'matched', date: '2024-03-05' },
  { id: 'INV-2024-004', carrier: 'Evergreen', shipment: 'SHP-20240305', service: 'Ocean FCL', quoted: '$1,980', actual: '$2,150', variance: '+$170', status: 'discrepancy', date: '2024-03-04' },
  { id: 'INV-2024-005', carrier: 'UPS', shipment: 'SHP-20240309', service: 'Ground', quoted: '$890', actual: '$890', variance: '$0', status: 'matched', date: '2024-03-07' },
  { id: 'INV-2024-006', carrier: 'COSCO', shipment: 'SHP-20240307', service: 'Ocean LCL', quoted: '$1,200', actual: '$1,380', variance: '+$180', status: 'discrepancy', date: '2024-03-05' },
  { id: 'INV-2024-007', carrier: 'Maersk', shipment: 'SHP-20240303', service: 'Ocean FCL', quoted: '$2,100', actual: '$2,100', variance: '$0', status: 'matched', date: '2024-03-03' },
  { id: 'INV-2024-008', carrier: 'DHL', shipment: 'SHP-20240308', service: 'Express', quoted: '$1,650', actual: '$1,650', variance: '$0', status: 'matched', date: '2024-03-06' },
];

const settlementExceptions = [
  { id: 'SE-001', carrier: 'DHL', invoice: 'INV-2024-002', amount: '+$320', reason: 'Fuel surcharge not in quote', status: 'open', age: '3d', assignee: 'Finance Team' },
  { id: 'SE-002', carrier: 'Evergreen', invoice: 'INV-2024-004', amount: '+$170', reason: 'Weight adjustment after measurement', status: 'investigating', age: '2d', assignee: 'Lisa Wang' },
  { id: 'SE-003', carrier: 'COSCO', invoice: 'INV-2024-006', amount: '+$180', reason: 'Port congestion surcharge added', status: 'open', age: '1d', assignee: 'Unassigned' },
  { id: 'SE-004', carrier: 'FedEx', invoice: 'INV-2024-009', amount: '-$450', reason: 'Credit note for delayed delivery', status: 'resolved', age: '5d', assignee: 'James Chen' },
  { id: 'SE-005', carrier: 'UPS', invoice: 'INV-2024-010', amount: '+$95', reason: 'Address correction fee', status: 'resolved', age: '4d', assignee: 'Finance Team' },
];

export default function BillingPage({ onOpenTab }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState<BillingTab>('cost-review');

  const totalQuoted = costItems.reduce((s, c) => s + parseFloat(c.quoted.replace(/[$,]/g, '')), 0);
  const totalActual = costItems.reduce((s, c) => s + parseFloat(c.actual.replace(/[$,]/g, '')), 0);
  const discrepancies = costItems.filter((c) => c.status === 'discrepancy').length;

  const tabs: { id: BillingTab; label: string; badge?: number }[] = [
    { id: 'cost-review', label: 'Cost Review' },
    { id: 'settlement', label: 'Settlement Exceptions', badge: settlementExceptions.filter((s) => s.status !== 'resolved').length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Management</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">Billing</span>
      </div>

      <div className="flex items-center h-[32px] border-b border-vscode-border shrink-0 px-2">
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
            {tab.badge !== undefined && tab.badge > 0 && (
              <Badge variant="warning">{tab.badge}</Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'cost-review' && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Quoted', value: `$${totalQuoted.toLocaleString()}`, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { label: 'Total Actual', value: `$${totalActual.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
                { label: 'Variance', value: `+$${(totalActual - totalQuoted).toLocaleString()}`, icon: AlertTriangle, color: totalActual > totalQuoted ? 'text-red-400' : 'text-green-400', bg: totalActual > totalQuoted ? 'bg-red-500/10' : 'bg-green-500/10' },
                { label: 'Discrepancies', value: discrepancies, icon: CreditCard, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map((kpi) => (
                <div key={kpi.label} className={`${kpi.bg} rounded-lg p-4 border border-vscode-border`}>
                  <kpi.icon size={16} className={`${kpi.color} mb-2`} />
                  <div className={`text-[20px] font-bold ${kpi.color}`}>{kpi.value}</div>
                  <div className="text-[12px] text-vscode-textMuted mt-0.5">{kpi.label}</div>
                </div>
              ))}
            </div>

            <table className="w-full text-[12px] border-collapse">
              <thead className="sticky top-0 bg-vscode-sidebar z-10">
                <tr className="text-vscode-textMuted text-left">
                  <th className="px-3 py-2 font-medium border-b border-vscode-border">Invoice</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border">Carrier</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border">Shipment</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border">Service</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border text-right">Quoted</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border text-right">Actual</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border text-right">Variance</th>
                  <th className="px-3 py-2 font-medium border-b border-vscode-border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {costItems.map((c) => (
                  <tr key={c.id} className="hover:bg-vscode-hover">
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-accent font-medium">{c.id}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{c.carrier}</td>
                    <td className="px-3 py-2 border-b border-vscode-border">
                      <span className="text-vscode-accent cursor-pointer hover:underline" onClick={() => onOpenTab?.(`shipment-detail-${c.shipment}`, `Shipment ${c.shipment}`)}>{c.shipment}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-vscode-border text-vscode-text">{c.service}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-right text-vscode-text">{c.quoted}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-right text-vscode-textBright font-medium">{c.actual}</td>
                    <td className={`px-3 py-2 border-b border-vscode-border text-right font-medium ${c.variance !== '$0' ? 'text-red-400' : 'text-vscode-textMuted'}`}>{c.variance}</td>
                    <td className="px-3 py-2 border-b border-vscode-border text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${
                        c.status === 'matched' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {c.status === 'matched' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'settlement' && (
          <div className="space-y-2">
            {settlementExceptions.map((se) => (
              <div key={se.id} className={`bg-vscode-sidebar rounded p-3 border ${se.status === 'resolved' ? 'border-vscode-border' : 'border-yellow-500/30'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] text-vscode-accent font-medium">{se.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vscode-hover text-vscode-textMuted font-medium">{se.carrier}</span>
                  <span className="text-[12px] text-vscode-textMuted">{se.invoice}</span>
                  <span className={`text-[12px] font-bold ${se.amount.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>{se.amount}</span>
                  <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    se.status === 'open' ? 'bg-red-500/20 text-red-400' :
                    se.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>{se.status}</span>
                </div>
                <div className="text-[12px] text-vscode-text mb-1">{se.reason}</div>
                <div className="flex items-center gap-4 text-[11px] text-vscode-textMuted">
                  <span>Age: {se.age}</span>
                  <span>Assignee: {se.assignee}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




