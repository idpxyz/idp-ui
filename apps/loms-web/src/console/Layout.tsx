import { useState, useMemo } from "react";
import { LayoutDashboard, Search, Truck } from "lucide-react";
import { RESOURCES } from "./resources.generated";
import { ResourceExplorer } from "./ResourceExplorer";
import { DashboardPage } from "./pages/DashboardPage";

export function Layout() {
  const [active, setActive] = useState<string>("__dashboard");
  const [filter, setFilter] = useState("");
  const items = useMemo(
    () => RESOURCES.filter((r) => r.title.toLowerCase().includes(filter.toLowerCase())),
    [filter],
  );
  const activeRes = RESOURCES.find((r) => r.key === active);

  return (
    <div className="h-screen w-screen flex flex-col bg-idpxyz-bg text-idpxyz-text overflow-hidden">
      <div className="h-12 flex items-center gap-2 px-4 border-b border-idpxyz-border bg-idpxyz-titleBar shrink-0">
        <Truck className="h-5 w-5 text-idpxyz-accent" />
        <span className="text-[14px] font-bold text-idpxyz-textBright">LOMS</span>
        <span className="text-[12px] text-idpxyz-textMuted">/ IDP Operations Console</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r border-idpxyz-border bg-idpxyz-sidebar flex flex-col">
          <button
            onClick={() => setActive("__dashboard")}
            className={`flex items-center gap-2 px-3 py-2 text-[13px] m-2 rounded transition-colors ${active === "__dashboard" ? "bg-idpxyz-activeItem text-idpxyz-textBright" : "text-idpxyz-text hover:bg-idpxyz-hover"}`}
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <div className="px-2 pb-2">
            <div className="flex items-center bg-idpxyz-inputBg rounded px-2 h-7">
              <Search className="h-3.5 w-3.5 text-idpxyz-textMuted mr-1 shrink-0" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter modules…"
                className="bg-transparent outline-none text-[12px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto px-2 pb-4 space-y-0.5">
            {items.map((r) => (
              <button
                key={r.key}
                onClick={() => setActive(r.key)}
                className={`block w-full text-left px-3 py-1.5 text-[12px] rounded transition-colors ${active === r.key ? "bg-idpxyz-activeItem text-idpxyz-textBright" : "text-idpxyz-text hover:bg-idpxyz-hover"}`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-idpxyz-editor">
          <div className="max-w-6xl mx-auto p-6">
            {activeRes ? <ResourceExplorer key={activeRes.key} config={activeRes} /> : <DashboardPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
