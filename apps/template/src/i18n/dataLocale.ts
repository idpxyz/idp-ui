import type { ProductCatalogEntry } from '../mocks/types';

export type DataLocaleKey = 'en-US' | 'zh-CN';

/** Map i18next language to mock `display_name` / API BCP-47 keys */
export function dataLocaleKey(i18n: { language: string }): DataLocaleKey {
  return i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';
}

export function pickLocalizedName(entry: ProductCatalogEntry, lng: DataLocaleKey): string {
  return entry.commercial.display_name[lng];
}

export function pickLocalizedDescription(entry: ProductCatalogEntry, lng: DataLocaleKey): string {
  return entry.commercial.short_description[lng];
}
