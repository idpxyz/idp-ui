/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@idpxyz/ui-primitives";
import { api, qs, setTenant } from "../api";

const KPIS: { label: string; base: string }[] = [
  { label: "Shipments", base: "/shipments" },
  { label: "Fulfillment Requests", base: "/fulfillment-requests" },
  { label: "Exceptions", base: "/exceptions" },
  { label: "Returns", base: "/returns" },
  { label: "Settlements", base: "/settlements" },
  { label: "Quotes", base: "/quotes" },
];

function count(d: any): number | string {
  if (Array.isArray(d)) return d.length;
  if (d && typeof d === "object") {
    if (typeof d.total === "number") return d.total;
    for (const k of Object.keys(d)) if (Array.isArray(d[k])) return d[k].length;
  }
  return "—";
}

export function DashboardPage() {
  const [stats, setStats] = useState<Record<string, number | string>>({});

  useEffect(() => {
    setTenant("default");
    let alive = true;
    Promise.all(KPIS.map(async (k) => {
      try { return [k.label, count(await api.get(`${k.base}${qs({ tenant_id: "default" })}`))] as const; }
      catch { return [k.label, "—"] as const; }
    })).then((entries) => { if (alive) setStats(Object.fromEntries(entries)); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-semibold text-idpxyz-textBright">Operations Dashboard</h1>
        <p className="text-[12px] text-idpxyz-textMuted">LOMS — Transportation Fulfillment Orchestration &amp; Governance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPIS.map((k) => (
          <Card key={k.label}>
            <CardContent className="py-4">
              <div className="text-[24px] font-bold text-idpxyz-textBright">{stats[k.label] ?? "…"}</div>
              <div className="text-[11px] text-idpxyz-textMuted mt-1">{k.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-[14px]">Welcome</CardTitle></CardHeader>
        <CardContent className="text-[12px] text-idpxyz-text space-y-1">
          <p>This is the LOMS operations console built on the IDP design system (<code className="text-idpxyz-accent">@idpxyz/ui</code>).</p>
          <p className="text-idpxyz-textMuted">Pick a module from the sidebar. Every backend resource group is reachable; create / lifecycle actions call the live API.</p>
        </CardContent>
      </Card>
    </div>
  );
}
