/* LOMS API client (dep-free). Talks to loms-api via the Vite dev proxy (/api).
 * Sends the tenant + dev RBAC headers the backend requires. */
const BASE = "/api/v1";

export let CURRENT_TENANT = "default";
export function setTenant(t: string) { CURRENT_TENANT = t || "default"; }

export class ApiError extends Error {
  status: number;
  reasonCode: string;
  constructor(status: number, reasonCode: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.reasonCode = reasonCode;
  }
}

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Id": CURRENT_TENANT,
      "X-Actor-Role": "dev_superuser",
      "X-Actor-Id": "dev",
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.code ?? body.reason_code ?? "UNKNOWN", body.message ?? res.statusText);
  }
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("json") ? res.json() : res.text()) as Promise<T>;
}

export const api = {
  get: <T = any>(path: string) => request<T>(path),
  post: <T = any>(path: string, body?: Record<string, any>) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body || {}) }),
  del: <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};

export function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : "";
}
