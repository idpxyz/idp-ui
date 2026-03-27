import type { TFunction } from 'i18next';
import type { i18n as I18nType } from 'i18next';
import type { ProductCatalogEntry } from '../../mocks/types';
import { getProductById } from '../../mocks/products';
import { productKeys } from '../../shared/api/keys';
import { queryClient } from '../../shared/api/queryClient';
import { shouldUseMocks } from '../../shared/api/products';
import { parseProductDetailTab, PARCEL_NAV_TAB_KEYS } from './navigation';
import { dataLocaleKey, pickLocalizedName } from '../../i18n/dataLocale';

function findProductInCache(id: string): ProductCatalogEntry | undefined {
  const list = queryClient.getQueryData<ProductCatalogEntry[]>(productKeys.catalog());
  return list?.find((e) => e.product.id === id);
}

/**
 * Tab strip shows `tab.name` from workspace state (snapshot). Call `syncTabLabels` when locale changes
 * so names stay in sync with `t()` and product `display_name`.
 */
export function resolveParcelTabTitle(tabId: string, t: TFunction, i18n: I18nType): string {
  const pid = parseProductDetailTab(tabId);
  if (pid) {
    const e = findProductInCache(pid) ?? (shouldUseMocks() ? getProductById(pid) : undefined);
    if (e) return pickLocalizedName(e, dataLocaleKey(i18n));
    return tabId;
  }
  const key = PARCEL_NAV_TAB_KEYS[tabId];
  if (key) return String(t(key));
  return tabId;
}
