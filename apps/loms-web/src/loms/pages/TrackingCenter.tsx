import { useState } from 'react';
import { ChevronRight, Search, MapPin, Clock, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { shipments, trackingEvents, shipmentStatusConfig, slaStatusConfig } from '../data/loms';

interface TrackingCenterProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

export default function TrackingCenter({ onOpenTab }: TrackingCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(shipments[0]?.id || null);

  const filtered = shipments.filter((s) =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = shipments.find((s) => s.id === selectedShipmentId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-vscode-editor">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-vscode-breadcrumb bg-vscode-editor border-b border-vscode-border shrink-0 select-none">
        <span className="hover:text-vscode-textBright cursor-pointer">Operations</span>
        <ChevronRight size={14} className="mx-0.5 text-vscode-textMuted" />
        <span className="text-vscode-text">Tracking Center</span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Shipment list */}
        <div className="w-[320px] shrink-0 flex flex-col border-r border-vscode-border overflow-hidden">
          <div className="px-3 py-2 border-b border-vscode-border shrink-0">
            <div className="flex items-center bg-vscode-sidebar border border-vscode-border rounded px-2 py-1 gap-1.5">
              <Search size={14} className="text-vscode-textMuted" />
              <input
                className="bg-transparent text-[12px] text-vscode-text placeholder-vscode-textMuted outline-none flex-1"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((s) => {
              const st = shipmentStatusConfig[s.status];
              const sla = slaStatusConfig[s.slaStatus];
              return (
                <div
                  key={s.id}
                  className={`px-3 py-2.5 border-b border-vscode-border cursor-pointer hover:bg-vscode-hover ${selectedShipmentId === s.id ? 'bg-vscode-activeItem' : ''}`}
                  onClick={() => setSelectedShipmentId(s.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-vscode-accent font-medium">{s.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ color: st.color, backgroundColor: st.bgColor }}>{st.label}</span>
                  </div>
                  <div className="text-[11px] text-vscode-textMuted flex items-center gap-1">
                    <MapPin size={10} /> {s.origin} ¡ú{s.destination}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ color: sla.color, backgroundColor: sla.bgColor }}>{sla.label}</span>
                    <span className="text-[10px] text-vscode-textMuted">{s.carrier}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {Array.from({ length: s.legs }).map((_, i) => (
                        <div key={i} className={`w-2 h-1 rounded-full ${i < s.completedLegs ? 'bg-green-400' : 'bg-vscode-border'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tracking timeline */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-vscode-border shrink-0 bg-vscode-sidebar">
                <div className="flex items-center gap-3 mb-1.5">
                  <Truck size={16} className="text-vscode-textMuted" />
                  <span className="text-[14px] font-bold text-vscode-textBright">{selected.id}</span>
                  <span
                    className="text-[12px] text-vscode-accent hover:underline cursor-pointer"
                    onClick={() => onOpenTab?.(`shipment-detail-${selected.id}`, `Shipment ${selected.id}`)}
                  >
                    Open Detail ¡ú                  </span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-vscode-textMuted">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {selected.origin} ¡ú{selected.destination}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> Promise: {selected.promisedDate}</span>
                  <span className="flex items-center gap-1">Last: {selected.lastEvent}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-auto p-4">
                <div className="max-w-[600px]">
                  {trackingEvents.map((evt, i) => (
                    <div key={i} className="flex items-stretch gap-3">
                      <div className="flex flex-col items-center w-6 shrink-0">
                        <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${
                          i === 0 ? 'bg-vscode-accent' : evt.isAnomaly ? 'bg-red-400' : 'bg-vscode-border'
                        }`} />
                        {i < trackingEvents.length - 1 && <div className="flex-1 w-0.5 my-0.5 bg-vscode-border" />}
                      </div>
                      <div className={`flex-1 mb-2 rounded p-3 border text-[12px] ${
                        evt.isAnomaly ? 'bg-red-500/5 border-red-500/30' : 'bg-vscode-sidebar border-vscode-border'
                      }`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-vscode-textBright font-medium">{evt.event}</span>
                          {evt.isAnomaly && <AlertTriangle size={13} className="text-red-400" />}
                        </div>
                        <div className="flex items-center gap-3 text-vscode-textMuted text-[11px]">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {evt.location}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {evt.time}</span>
                          <span className="ml-auto px-1.5 py-0.5 rounded bg-vscode-hover text-[10px]">{evt.source}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-vscode-textMuted text-[12px]">
              Select a shipment to view tracking
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




