import { ApiError } from './errors';

/**
 * Central HTTP entry for backend integration.
 * Set `VITE_API_BASE` (e.g. https://api.example.com); paths are appended without double slashes.
 */
const base = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '';

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = input.startsWith('http') ? input : apiUrl(input);
  return fetch(url, init);
}

/**
 * JSON helper: throws {@link ApiError} on non-OK; parses JSON body on success.
 * Skips `Content-Type: application/json` on GET/HEAD (some gateways reject it).
 */
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body != null && init.method !== 'GET' && init.method !== 'HEAD';
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await apiFetch(path, { ...init, headers });

  if (!res.ok) {
    let body: unknown;
    const ct = res.headers.get('content-type') ?? '';
    try {
      if (ct.includes('application/json')) {
        body = await res.json();
      } else {
        const text = await res.text();
        body = text || undefined;
      }
    } catch {
      body = undefined;
    }
    const msg =
      typeof body === 'object' && body !== null && 'message' in body && typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : res.statusText || 'Request failed';
    throw new ApiError(msg, res.status, body);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
