import {
  LayoutDashboard,
  Package,
  MapPinned,
  type LucideIcon,
} from 'lucide-react';
import type { ProductCatalogEntry } from '../../mocks/types';
import type { DataLocaleKey } from '../../i18n/dataLocale';

export const parcelSidebarIconMap: Record<string, LucideIcon> = {
  home: LayoutDashboard,
  package: Package,
  map: MapPinned,
};

/** i18n keys under `tabs.*` — use with `t(key)` */
export const PARCEL_NAV_TAB_KEYS: Record<string, string> = {
  welcome: 'tabs.welcome',
  'product-catalog': 'tabs.productCatalog',
  zones: 'tabs.zones',
};

export const parcelTabIconMap: Record<string, LucideIcon> = {
  welcome: LayoutDashboard,
  'product-catalog': Package,
  zones: MapPinned,
};

const DETAIL_PREFIX = 'product-detail-';

export function productDetailTabId(productId: string): string {
  return `${DETAIL_PREFIX}${productId}`;
}

export function parseProductDetailTab(tabId: string): string | null {
  if (!tabId.startsWith(DETAIL_PREFIX)) return null;
  return tabId.slice(DETAIL_PREFIX.length) || null;
}

export function productDetailTabTitle(entry: ProductCatalogEntry, lng: DataLocaleKey): string {
  return entry.commercial.display_name[lng];
}
