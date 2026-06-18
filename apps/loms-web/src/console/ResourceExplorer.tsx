/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@idpxyz/ui-primitives";
import { api, qs, setTenant } from "./api";
import { RESOURCES, type ResConfig } from "./resources.generated";

function rowsOf(d: any): any[] {
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") for (const k of Object.keys(d)) if (Array.isArray(d[k])) return d[k];
  return [];
}
function rowId(r: any): string {
  if (!r || typeof r !== "object") return "";
  for (const k of Object.keys(r)) if (k.endsWith("_id")) return String(r[k]);
  for (const k of Object.keys(r)) if (k.endsWith("_ref") || k.endsWith("_no") || k === "id") return String(r[k]);
  return "";
}
function coerce(v: string): any {
  if (v === "") return "";
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v;
}
function pick(src: Record<string, string>, keys: string[]): Record<string, any> {
  const o: Record<string, any> = {};
  for (const k of keys) if (src[k] !== undefined && src[k] !== "") o[k] = coerce(src[k]);
  return o;
}

export function ResourceExplorer({ config }: { config: ResConfig }) {
  const [tenant, setTenant_] = useState("default");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [createF, setCreateF] = useState<Record<string, string>>({});
  const [selId, setSelId] = useState("");
  const [subF, setSubF] = useState<Record<string, string>>({});
  const [actF, setActF] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!config.list) return;
    setLoading(true);
    setTenant(tenant);
    try { setData(await api.get(`${config.base}${qs({ tenant_id: tenant })}`)); }
    catch (e: any) { setData({ __error: e?.message || "failed" }); }
    finally { setLoading(false); }
  }, [config, tenant]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<any>) => {
    setTenant(tenant);
    try { const r = await fn(); setResult(r); if (config.list) load(); }
    catch (e: any) { setResult({ error: e?.message, reason: e?.reasonCode }); }
  };

  const list = rowsOf(data);
  const listErr = data?.__error as string | undefined;
  const subUnion = [...new Set(config.sub.flatMap((s) => s.fields))];
  const actUnion = [...new Set(config.actions.flatMap((a) => a.fields))];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[20px] font-semibold text-idpxyz-textBright">{config.title}</h1>
        <p className="text-[12px] text-idpxyz-textMuted">Live API · <code className="text-idpxyz-accent">/api/v1{config.base}</code></p>
      </div>

      {config.list && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[14px]">Records {loading && <span className="text-[11px] text-idpxyz-textMuted">(loading…)</span>}</CardTitle>
            <div className="flex gap-2 items-center">
              <Input className="w-40" placeholder="tenant_id" value={tenant} onChange={(e) => setTenant_(e.target.value)} />
              <Button size="sm" variant="outline" onClick={() => load()}>Refresh</Button>
            </div>
          </CardHeader>
          <CardContent>
            {listErr ? <p className="text-[12px] text-red-500">Failed: {listErr}</p>
              : list.length === 0 ? <p className="text-[12px] text-idpxyz-textMuted">No records.</p>
              : (
                <div className="overflow-auto max-h-[420px]">
                  <table className="w-full text-[12px] border-collapse">
                    <thead className="sticky top-0">
                      <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left">
                        <th className="px-3 py-2 font-medium border-b border-idpxyz-border">ID</th>
                        <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Status</th>
                        <th className="px-3 py-2 font-medium border-b border-idpxyz-border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((r, i) => (
                        <tr key={rowId(r) || i} className="hover:bg-idpxyz-hover">
                          <td className="px-3 py-1.5 border-b border-idpxyz-border text-idpxyz-accent font-mono text-[11px]">{rowId(r) || "—"}</td>
                          <td className="px-3 py-1.5 border-b border-idpxyz-border text-idpxyz-text">{r.status ?? r.state ?? "—"}</td>
                          <td className="px-3 py-1.5 border-b border-idpxyz-border">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setSelId(rowId(r))}>Select</Button>
                              <Button size="sm" variant="ghost" onClick={() => setResult(r)}>View</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {config.create && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[14px]">Create</CardTitle>
              {!config.list && <Input className="w-40" placeholder="tenant_id" value={tenant} onChange={(e) => setTenant_(e.target.value)} />}
            </CardHeader>
            <CardContent className="space-y-3">
              {config.create.length === 0 && <p className="text-[11px] text-idpxyz-textMuted">No body fields.</p>}
              <div className="grid grid-cols-2 gap-3">
                {config.create.map((f) => <Input key={f} placeholder={f} value={createF[f] ?? ""} onChange={(e) => setCreateF((s) => ({ ...s, [f]: e.target.value }))} />)}
              </div>
              <Button size="sm" onClick={() => run(() => api.post(config.base, { tenant_id: tenant, ...pick(createF, config.create || []) }))}>Create</Button>
            </CardContent>
          </Card>
        )}

        {(config.get || config.sub.length > 0 || config.actions.length > 0) && (
          <Card>
            <CardHeader><CardTitle className="text-[14px]">Selected record</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="record id" value={selId} onChange={(e) => setSelId(e.target.value)} />
              {config.get && <Button size="sm" variant="outline" onClick={() => run(() => api.get(`${config.base}/${selId}`))} disabled={!selId}>Get</Button>}
              {subUnion.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {subUnion.map((f) => <Input key={f} placeholder={f} value={subF[f] ?? ""} onChange={(e) => setSubF((s) => ({ ...s, [f]: e.target.value }))} />)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {config.sub.map((s) => <Button key={s.path} size="sm" variant="secondary" onClick={() => run(() => api.post(`${config.base}/${selId}/${s.path}`, { tenant_id: tenant, ...pick(subF, s.fields) }))} disabled={!selId}>+ {s.path}</Button>)}
              </div>
              {actUnion.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {actUnion.map((f) => <Input key={f} placeholder={f} value={actF[f] ?? ""} onChange={(e) => setActF((s) => ({ ...s, [f]: e.target.value }))} />)}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {config.actions.map((a) => <Button key={a.name} size="sm" onClick={() => run(() => api.post(`${config.base}/${selId}:${a.name}`, { tenant_id: tenant, ...pick(actF, a.fields) }))} disabled={!selId}>{a.name}</Button>)}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {result && (
        <Card>
          <CardHeader><CardTitle className="text-[14px]">Result</CardTitle></CardHeader>
          <CardContent><pre className="text-[11px] overflow-auto max-h-[360px] text-idpxyz-text">{JSON.stringify(result, null, 2)}</pre></CardContent>
        </Card>
      )}
    </div>
  );
}

export function resourceByKey(key: string): ResConfig | undefined {
  return RESOURCES.find((r) => r.key === key);
}
