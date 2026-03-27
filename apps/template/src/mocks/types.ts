/**
 * Mock shapes aligned with `docs/0327-03-product.md` (conceptual — not a DB migration).
 * Weight: grams (int). Dimensions: mm (int). Country: ISO 3166-1 alpha-2.
 */

export type ProductKind = 'POSTAL' | 'COURIER' | 'LINE_HAUL' | 'DEFERRED';
export type ProductStatus = 'draft' | 'active' | 'sunset' | 'deprecated';
export type VersionStatus = 'draft' | 'published';
export type DestinationMatchKind = 'COUNTRY' | 'SUBDIVISION' | 'POSTAL_PREFIX';
export type DestinationPolicy = 'ALLOW' | 'DENY';
export type ZonePolicy = 'ALLOW' | 'DENY';
export type BookingMode = 'API_CREATE' | 'MANUAL';

/** §3.1 */
export interface Product {
  id: string;
  code: string;
  kind: ProductKind;
  status: ProductStatus;
  effective_from?: string;
  effective_to?: string | null;
  owner_team?: string;
  tags?: string[];
}

/** §3.3 */
export interface CommercialProfile {
  product_id: string;
  display_name: { 'en-US': string; 'zh-CN': string };
  short_description: { 'en-US': string; 'zh-CN': string };
  sales_channels: ('portal' | 'api' | 'internal')[];
}

/** §3.7 — version header */
export interface ProductVersion {
  id: string;
  product_id: string;
  version_seq: number;
  effective_from: string;
  effective_to: string | null;
  status: VersionStatus;
  changelog?: string;
}

/** §3.7.1 `product_version_physical_limit` */
export interface ProductVersionPhysicalLimit {
  product_version_id: string;
  min_weight_g: number;
  max_weight_g: number;
  max_length_mm: number | null;
  max_width_mm: number | null;
  max_height_mm: number | null;
  max_dim_sum_mm: number | null;
  max_length_plus_girth_mm: number | null;
  piece_count_max: number | null;
  dimensions_required: boolean;
  remark_internal?: string | null;
}

/** §3.7.2 `product_version_origin` */
export interface ProductVersionOrigin {
  id: string;
  product_version_id: string;
  country_code: string | null;
  warehouse_id: string | null;
  sort_key: number;
  remark_internal?: string | null;
}

/** §3.7.2 `product_version_destination` — country / exception rows */
export interface ProductVersionDestination {
  id: string;
  product_version_id: string;
  country_code: string;
  subdivision_code: string | null;
  postal_prefix: string | null;
  match_kind: DestinationMatchKind;
  policy: DestinationPolicy;
  priority: number;
  remark_internal?: string | null;
}

/** §3.7.3 `product_version_zone_dest` — preferred path with Zone MD */
export interface ProductVersionZoneDest {
  id: string;
  product_version_id: string;
  zone_id: string;
  policy: ZonePolicy;
  priority: number;
  remark_internal?: string | null;
}

/** §3.7.1 `product_version_fulfillment` — matches `config/carrier-networks.v1.yaml` network codes */
export interface ProductVersionFulfillment {
  id: string;
  product_version_id: string;
  priority: number;
  network_carrier_code: string | null;
  carrier_account_id: string | null;
  carrier_product_code: string;
  carrier_product_code_alt: string | null;
  label_profile_id: string | null;
  tracking_adapter: string;
  weight_dim_rule_id: string | null;
  booking_mode: BookingMode;
  enabled: boolean;
  remark_internal?: string | null;
}

/** §2 `zone` + §2.3 `zone_schema` (mode A: single schema) */
export interface ZoneSchema {
  id: string;
  code: string;
  name: string;
  status: 'draft' | 'active' | 'deprecated';
}

export interface Zone {
  id: string;
  zone_schema_id: string;
  code: string;
  name: string;
  status: 'draft' | 'active' | 'deprecated';
  sort_key: number;
  remark_internal?: string | null;
}

/** Simplified country → zone resolution for demos (full §3 mapping is backend). */
export interface ZoneCountryDefault {
  zone_schema_id: string;
  country_code: string;
  zone_id: string;
  priority: number;
}

/** Bundle for one sellable product line */
export interface ProductCatalogEntry {
  product: Product;
  commercial: CommercialProfile;
  version: ProductVersion;
  physical_limit: ProductVersionPhysicalLimit;
  origins: ProductVersionOrigin[];
  /** Prefer zone-based reachability when non-empty */
  zone_destinations: ProductVersionZoneDest[];
  /** Optional fine-grained rows (exceptions, transition) */
  destinations: ProductVersionDestination[];
  fulfillments: ProductVersionFulfillment[];
}
