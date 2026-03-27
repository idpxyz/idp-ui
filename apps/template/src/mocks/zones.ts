/**
 * Zone master data (mode A: one global schema) — aligns with `0327-04-zone.md` concepts.
 */
import type { Zone, ZoneCountryDefault, ZoneSchema } from './types';

export const ZONE_SCHEMA_RETAIL_2025: ZoneSchema = {
  id: 'zs-retail-2025',
  code: 'SCHEMA-RETAIL-2025',
  name: 'Retail small-parcel zoning (2025)',
  status: 'active',
};

/** Billing / eligibility zones — IDs stable for product_version_zone_dest + rate cards */
export const ZONES: Zone[] = [
  {
    id: 'z-us-west',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'US-W',
    name: 'United States — West',
    status: 'active',
    sort_key: 10,
    remark_internal: 'Typically Pacific / Mountain inbound from Asia',
  },
  {
    id: 'z-us-east',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'US-E',
    name: 'United States — East',
    status: 'active',
    sort_key: 11,
  },
  {
    id: 'z-us-remote',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'US-REMOTE',
    name: 'United States — AK/HI/PR/USVI',
    status: 'active',
    sort_key: 12,
    remark_internal: 'Surcharge tier; not always offered on economy lines',
  },
  {
    id: 'z-eu-core',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'EU-CORE',
    name: 'EU core (DE/FR/IT/ES/NL/BE…)',
    status: 'active',
    sort_key: 20,
  },
  {
    id: 'z-eu-nordic',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'EU-NORDIC',
    name: 'Nordics',
    status: 'active',
    sort_key: 21,
  },
  {
    id: 'z-gb',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'GB',
    name: 'United Kingdom',
    status: 'active',
    sort_key: 30,
  },
  {
    id: 'z-ca',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'CA',
    name: 'Canada',
    status: 'active',
    sort_key: 40,
  },
  {
    id: 'z-au-nz',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'AU-NZ',
    name: 'Australia / New Zealand',
    status: 'active',
    sort_key: 50,
  },
  {
    id: 'z-jp',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'JP',
    name: 'Japan',
    status: 'active',
    sort_key: 60,
  },
  {
    id: 'z-sg',
    zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id,
    code: 'SG',
    name: 'Singapore',
    status: 'active',
    sort_key: 61,
  },
];

/** Default country → zone for quoting demos (real systems use postal/region tables). */
export const ZONE_COUNTRY_DEFAULTS: ZoneCountryDefault[] = [
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'US', zone_id: 'z-us-west', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'DE', zone_id: 'z-eu-core', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'FR', zone_id: 'z-eu-core', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'GB', zone_id: 'z-gb', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'CA', zone_id: 'z-ca', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'AU', zone_id: 'z-au-nz', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'JP', zone_id: 'z-jp', priority: 0 },
  { zone_schema_id: ZONE_SCHEMA_RETAIL_2025.id, country_code: 'SG', zone_id: 'z-sg', priority: 0 },
];

export function getZoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}

/** Demo resolver — production uses postal/region priority per `0327-04-zone.md` §3.4. */
export function resolveDemoZoneForCountry(countryCode: string): Zone | undefined {
  const upper = countryCode.trim().toUpperCase();
  const row = ZONE_COUNTRY_DEFAULTS.filter((r) => r.country_code === upper).sort((a, b) => b.priority - a.priority)[0];
  return row ? getZoneById(row.zone_id) : undefined;
}
