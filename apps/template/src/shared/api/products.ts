import type { ProductCatalogEntry } from '../../mocks/types';
import { PRODUCT_CATALOG, getProductById as getMockProductById } from '../../mocks/products';
import { fetchJson } from './client';
import { ApiError } from './errors';

/** Mock when forced, or when no API base is configured. */
export function shouldUseMocks(): boolean {
  if (import.meta.env.VITE_USE_MOCKS === 'true') return true;
  if (!import.meta.env.VITE_API_BASE) return true;
  return false;
}

/**
 * List products for the catalog grid.
 * Remote: `GET {VITE_API_BASE}/api/v1/parcel/products` → JSON array of {@link ProductCatalogEntry}.
 */
export async function listProductCatalog(): Promise<ProductCatalogEntry[]> {
  if (shouldUseMocks()) {
    return [...PRODUCT_CATALOG];
  }
  return fetchJson<ProductCatalogEntry[]>('/api/v1/parcel/products');
}

/**
 * Single product for detail / inspector.
 * Remote: `GET {VITE_API_BASE}/api/v1/parcel/products/:id`
 */
export async function fetchProductById(id: string): Promise<ProductCatalogEntry | undefined> {
  if (shouldUseMocks()) {
    return getMockProductById(id);
  }
  try {
    return await fetchJson<ProductCatalogEntry>(`/api/v1/parcel/products/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  }
}
