import { useState, useCallback } from "react";
import { Truck } from "lucide-react";
import { Sidebar } from "@idpxyz/ui-workspace";
import {
  navigationSections,
  lomsSidebarIconMap,
  lomsTabNameMap,
  PageRouter,
  type Shipment,
  type Exception,
} from "../loms";

/**
 * Traditional console shell: branded header + left nav sidebar + single page
 * area — reusing the original rich pages (OpsDashboard, ShipmentMonitor, …) via
 * PageRouter, minus the IDE-workspace tabs / activity-bar / panels.
 */
export function Layout() {
  const [active, setActive] = useState<string>("ops-dashboard");
  const [, setSelected] = useState<Shipment | Exception | null>(null);

  const onOpenTab = useCallback((tabId: string) => setActive(tabId), []);

  return (
    <div className="h-screen w-screen flex flex-col bg-idpxyz-bg text-idpxyz-text overflow-hidden">
      <div className="h-12 flex items-center gap-2 px-4 border-b border-idpxyz-border bg-idpxyz-titleBar shrink-0">
        <Truck className="h-5 w-5 text-idpxyz-accent" />
        <span className="text-[14px] font-bold text-idpxyz-textBright">LOMS</span>
        <span className="text-[12px] text-idpxyz-textMuted">/ IDP Operations Console</span>
        <span className="ml-auto text-[12px] text-idpxyz-textMuted">{lomsTabNameMap[active] || active}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          width={240}
          onFileClick={setActive}
          activeFile={active}
          navigationSections={navigationSections}
          iconMap={lomsSidebarIconMap}
        />
        <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor">
          <PageRouter
            tabId={active}
            onSelectObject={setSelected}
            onOpenTab={(tid) => onOpenTab(tid)}
          />
        </div>
      </div>
    </div>
  );
}
