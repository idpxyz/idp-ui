import { useState } from 'react';
import {
  ChevronRight, AlertTriangle, Clock, User, ArrowRight, CheckCircle,
  Search, UserPlus, RefreshCw, ArrowUpRight, Tag, XCircle, Copy,
  RotateCcw, GitBranch, PenLine, MessageSquare, Star, Download,
} from 'lucide-react';
import { exceptions, exceptionSeverityConfig, type Exception } from '../../data/loms';
import { Button } from '../ui/button';
import { useDensity } from '../../contexts/DensityContext';

interface ExceptionWorkbenchProps {
  onSelectException?: (exc: Exception) => void;
  onOpenObject?: (objectId: string) => void;
}

export default function ExceptionWorkbench({ onSelectException, onOpenObject }: ExceptionWorkbenchProps) {
  const { density } = useDensity();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [dueWindowFilter, setDueWindowFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'sla' | 'severity' | 'age'>('sla');
  const [groupBy, setGroupBy] = useState<'none' | 'reason' | 'severity' | 'owner'>('none');

  const filtered = exceptions.filter((e) => {
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchSeverity = severityFilter === 'all' || e.severity === severityFilter;
    const matchOwner = ownerFilter === 'all' || (ownerFilter === 'unassigned' ? e.owner === 'Unassigned' : e.owner !== 'Unassigned');
    const matchSearch = searchTerm === '' || e.id.toLowerCase().includes(searchTerm.toLowerCase()) || e.reason.toLowerCase().includes(searchTerm.toLowerCase()) || e.objectId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchReason = reasonFilter === 'all' || e.reason.toLowerCase().includes(reasonFilter.toLowerCase());
    const matchDueWindow = dueWindowFilter === 'all' ||
      (dueWindowFilter === 'overdue' && e.slaDue.includes('overdue')) ||
      (dueWindowFilter === '2h' && !e.slaDue.includes('overdue') && (e.slaDue.includes('h remaining') && parseInt(e.slaDue) <= 2)) ||
      (dueWindowFilter === '1d' && e.slaDue.includes('remaining'));
    return matchStatus && matchSeverity && matchOwner && matchSearch && matchReason && matchDueWindow;
  });

  const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  filtered.sort((a, b) => {
    if (sortBy === 'severity') return (sevOrder[a.severity] ?? 9) - (sevOrder[b.severity] ?? 9);
    if (sortBy === 'age') return a.age.localeCompare(b.age);
    return a.slaDue.localeCompare(b.slaDue);
  });
  const selected = exceptions.find((e) => e.id === selectedId);

  const handleSelect = (exc: Exception) => {
    setSelectedId(exc.id);
    onSelectException?.(exc);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const owners = [...new Set(exceptions.map((e) => e.owner))];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      {/* Header */}
      <div className="flex items-center justify-between h-[36px] px-4 border-b border-vscode-border shrink-0 bg-vscode-sidebar select-none">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-vscode-textBright font-semibold">Exception Workbench</span>
          <span className="text-[11px] text-vscode-textMuted">All Queues</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Star size={11} /> Save View
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={11} /> Export
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-vscode-border shrink-0">
        <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[26px] w-[220px]">
          <Search size={12} className="text-vscode-textMuted mr-1.5 shrink-0" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted"
          />
        </div>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-1.5 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Severity</option>
          {Object.entries(exceptionSeverityConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-1.5 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-1.5 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Owners</option>
          <option value="unassigned">Unassigned</option>
          <option value="assigned">Assigned</option>
        </select>
        <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-1.5 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Reasons</option>
          {[...new Set(exceptions.map((e) => e.reason))].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select value={dueWindowFilter} onChange={(e) => setDueWindowFilter(e.target.value)} className="bg-vscode-inputBg text-vscode-text text-[11px] h-[26px] px-1.5 rounded border border-vscode-border outline-none cursor-pointer">
          <option value="all">All Due</option>
          <option value="overdue">Overdue</option>
          <option value="2h">Due &lt; 2h</option>
          <option value="1d">Due &lt; 1d</option>
        </select>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <>
            <div className="w-px h-4 bg-vscode-border mx-1" />
            <span className="text-[11px] text-vscode-accent font-medium">{selectedIds.size} selected</span>
            {[
              { icon: UserPlus, label: 'Assign' },
              { icon: RefreshCw, label: 'Resync' },
              { icon: Tag, label: 'Tag' },
              { icon: XCircle, label: 'Suppress' },
            ].map((a) => (
              <Button key={a.label} variant="ghost" size="sm" title={a.label}>
                <a.icon size={11} /> {a.label}
              </Button>
            ))}
          </>
        )}

        <div className="flex items-center gap-1.5 ml-auto text-[11px]">
          {[
            { label: 'Open', value: exceptions.filter((e) => e.status === 'open').length, color: 'text-red-400' },
            { label: 'Inv', value: exceptions.filter((e) => e.status === 'investigating').length, color: 'text-yellow-400' },
            { label: 'Crit', value: exceptions.filter((e) => e.severity === 'critical').length, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-0.5">
              <span className={`font-bold ${s.color}`}>{s.value}</span>
              <span className="text-vscode-textMuted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-column split: Queue + Investigation + Action */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Case Queue */}
        <div className="w-[360px] shrink-0 flex flex-col border-r border-vscode-border overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-vscode-border shrink-0">
            <span className="text-[10px] text-vscode-textMuted uppercase tracking-wider font-semibold">Queue</span>
            <span className="text-[10px] text-vscode-textMuted ml-auto">{filtered.length} cases</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 border-b border-vscode-border shrink-0">
            <span className="text-[10px] text-vscode-textMuted">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'sla' | 'severity' | 'age')} className="bg-vscode-inputBg text-vscode-text text-[10px] h-[20px] px-1 rounded border border-vscode-border outline-none cursor-pointer">
              <option value="sla">SLA 鈻?</option>
              <option value="severity">Severity</option>
              <option value="age">Age</option>
            </select>
            <span className="text-[10px] text-vscode-textMuted ml-1">Group:</span>
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as 'none' | 'reason' | 'severity' | 'owner')} className="bg-vscode-inputBg text-vscode-text text-[10px] h-[20px] px-1 rounded border border-vscode-border outline-none cursor-pointer">
              <option value="none">None</option>
              <option value="reason">Reason</option>
              <option value="severity">Severity</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((exc) => {
              const sev = exceptionSeverityConfig[exc.severity];
              return (
                <div
                  key={exc.id}
                  onClick={() => handleSelect(exc)}
                  className={`px-3 ${density === 'compact' ? 'py-1.5' : 'py-3'} border-b border-vscode-border cursor-pointer transition-colors ${
                    selectedId === exc.id ? 'bg-vscode-activeItem' : 'hover:bg-vscode-hover'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(exc.id)}
                      onChange={(e) => { e.stopPropagation(); toggleSelect(exc.id); }}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-vscode-accent"
                    />
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ color: sev.color, backgroundColor: sev.bgColor }}
                    >
                      <AlertTriangle size={10} />
                      {sev.label}
                    </span>
                    <span className="text-[11px] text-vscode-accent font-medium">{exc.id}</span>
                    <span className="text-[10px] text-vscode-textMuted ml-auto">{exc.age}</span>
                  </div>
                  <div className="text-[12px] text-vscode-text truncate mb-1">{exc.reason}</div>
                  <div className="flex items-center gap-3 text-[11px] text-vscode-textMuted">
                    <span>{exc.objectType}: {exc.objectId}</span>
                    <span className="flex items-center gap-0.5">
                      <User size={10} />
                      {exc.owner}
                    </span>
                    <span className="flex items-center gap-0.5 ml-auto">
                      <Clock size={10} />
                      {exc.slaDue}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Case Investigation Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <div className="flex-1 overflow-y-auto p-4">
              {/* Case Summary */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[16px] font-bold text-vscode-textBright">{selected.id}</span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase"
                  style={{ color: exceptionSeverityConfig[selected.severity].color, backgroundColor: exceptionSeverityConfig[selected.severity].bgColor }}
                >
                  {exceptionSeverityConfig[selected.severity].label}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-vscode-hover text-vscode-text capitalize">{selected.status}</span>
              </div>
              <div className="text-[13px] text-vscode-text mb-4">{selected.reason}</div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-1.5">Symptom / Description</h4>
                <p className="text-[12px] text-vscode-text leading-relaxed bg-vscode-sidebar rounded p-3 border border-vscode-border">{selected.description}</p>
              </div>

              {/* Linked Facts */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-1.5">Linked Facts</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-vscode-sidebar rounded p-2 border border-vscode-border">
                    <span className="text-vscode-textMuted">Object</span>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-vscode-accent hover:underline" onClick={() => onOpenObject?.(selected.objectId)}>
                      {selected.objectType}: {selected.objectId} <ArrowRight size={10} className="inline" />
                    </Button>
                  </div>
                  <div className="bg-vscode-sidebar rounded p-2 border border-vscode-border">
                    <span className="text-vscode-textMuted">Owner</span>
                    <div className="flex items-center gap-1 mt-0.5 text-vscode-text"><User size={11} /> {selected.owner}</div>
                  </div>
                  <div className="bg-vscode-sidebar rounded p-2 border border-vscode-border">
                    <span className="text-vscode-textMuted">SLA Due</span>
                    <div className="text-vscode-text mt-0.5">{selected.slaDue}</div>
                  </div>
                  <div className="bg-vscode-sidebar rounded p-2 border border-vscode-border">
                    <span className="text-vscode-textMuted">Age</span>
                    <div className="text-vscode-text mt-0.5">{selected.age}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-1.5">Case Timeline</h4>
                <div className="space-y-2 pl-3 border-l-2 border-vscode-border">
                  {[
                    { time: 'Now', event: `Status: ${selected.status}`, type: 'status' },
                    { time: selected.age + ' ago', event: 'Case created', type: 'create' },
                    { time: selected.age + ' ago', event: 'Alert raised by system', type: 'alert' },
                    ...(selected.owner !== 'Unassigned' ? [{ time: '30m later', event: `Assigned to ${selected.owner}`, type: 'assign' }] : []),
                  ].map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-vscode-textMuted mt-1.5 shrink-0" />
                      <span className="text-vscode-textMuted w-[70px] shrink-0">{t.time}</span>
                      <span className="text-vscode-text">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Root Cause Hints */}
              <div className="mb-4">
                <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-1.5">Root Cause Hints</h4>
                <div className="flex items-start gap-2 bg-blue-500/10 rounded p-3 text-[12px] border border-blue-500/20">
                  <CheckCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-vscode-text">{selected.recommendedAction}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-vscode-textMuted text-[12px]">
              Select a case from the queue to investigate
            </div>
          )}
        </div>

        {/* Right: Action Panel */}
        {selected && (
          <div className="w-[200px] shrink-0 border-l border-vscode-border overflow-y-auto bg-vscode-sidebar">
            {/* Ownership */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">Ownership</h4>
              <div className="space-y-1">
                {[
                  { icon: UserPlus, label: 'Assign to me' },
                  { icon: User, label: 'Assign to...' },
                  { icon: ArrowRight, label: 'Transfer queue' },
                ].map((a) => (
                  <Button key={a.label} variant="ghost" size="sm" className="w-full justify-start">
                    <a.icon size={12} className="text-vscode-textMuted shrink-0" /> {a.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Recovery */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">Recovery</h4>
              <div className="space-y-1">
                {[
                  { icon: RefreshCw, label: 'Re-sync tracking' },
                  { icon: RotateCcw, label: 'Retry booking' },
                  { icon: GitBranch, label: 'Recompute route' },
                  { icon: PenLine, label: 'Create manual leg' },
                ].map((a) => (
                  <Button key={a.label} variant="ghost" size="sm" className="w-full justify-start">
                    <a.icon size={12} className="text-vscode-textMuted shrink-0" /> {a.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Escalation */}
            <div className="p-3 border-b border-vscode-border">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">Escalation</h4>
              <div className="space-y-1">
                {[
                  { icon: ArrowUpRight, label: 'Escalate to carrier' },
                  { icon: ArrowUpRight, label: 'Escalate to super' },
                  { icon: MessageSquare, label: 'Notify stakeholder' },
                ].map((a) => (
                  <Button key={a.label} variant="ghost" size="sm" className="w-full justify-start">
                    <a.icon size={12} className="text-vscode-textMuted shrink-0" /> {a.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="p-3">
              <h4 className="text-[10px] uppercase tracking-wider text-vscode-textMuted font-semibold mb-2">Resolution</h4>
              <div className="space-y-1">
                {[
                  { icon: CheckCircle, label: 'Mark resolved', color: 'text-green-400' },
                  { icon: Copy, label: 'Close as duplicate' },
                  { icon: XCircle, label: 'Suppress noise' },
                  { icon: PenLine, label: 'Add resolution note' },
                ].map((a) => (
                  <Button key={a.label} variant="ghost" size="sm" className={`w-full justify-start ${a.color || ''}`}>
                    <a.icon size={12} className={`shrink-0 ${a.color ? '' : 'text-vscode-textMuted'}`} /> {a.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




