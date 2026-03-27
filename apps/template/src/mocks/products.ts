/**
 * Sellable international small-parcel products — realistic scenarios (CN hub → global).
 * No prices here (0327-03 §0.1): rates live on RatePlan / Quote.
 */
import type { ProductCatalogEntry } from './types';

const V = (productVersionId: string) => ({
  physical_limit: {
    product_version_id: productVersionId,
    min_weight_g: 1,
    max_weight_g: 2000,
    max_length_mm: 600,
    max_width_mm: 400,
    max_height_mm: 400,
    max_dim_sum_mm: 900,
    max_length_plus_girth_mm: null,
    piece_count_max: 1,
    dimensions_required: false,
    remark_internal: 'Economy postal — typical ePacket-class limits',
  },
});

export const PRODUCT_CATALOG: ProductCatalogEntry[] = [
  {
    product: {
      id: 'prd-cn-us-economy',
      code: 'LINE_CN_US_ECON',
      kind: 'POSTAL',
      status: 'active',
      effective_from: '2024-01-01',
      owner_team: 'network-parcel',
      tags: ['economy', 'us', 'last-mile-usps'],
    },
    commercial: {
      product_id: 'prd-cn-us-economy',
      display_name: {
        'en-US': 'Economy Line — United States (tracked)',
        'zh-CN': '美国经济线（可追踪）',
      },
      short_description: {
        'en-US': 'Consolidation from CN hubs; USPS last-mile delivery. Best for sub-2kg light goods.',
        'zh-CN': '国内仓集货，美国末端 USPS 派送；适合 2kg 内轻小件。',
      },
      sales_channels: ['portal', 'api', 'internal'],
    },
    version: {
      id: 'pv-cn-us-econ-v3',
      product_id: 'prd-cn-us-economy',
      version_seq: 3,
      effective_from: '2025-03-01',
      effective_to: null,
      status: 'published',
      changelog: 'Tighten max_dim_sum to 900mm; add backup lane',
    },
    physical_limit: {
      ...V('pv-cn-us-econ-v3').physical_limit,
      max_weight_g: 2000,
      max_dim_sum_mm: 900,
    },
    origins: [
      {
        id: 'pvo-cn-us-1',
        product_version_id: 'pv-cn-us-econ-v3',
        country_code: 'CN',
        warehouse_id: 'WH-YIWU-01',
        sort_key: 0,
        remark_internal: 'Yiwu consolidation hub',
      },
      {
        id: 'pvo-cn-us-2',
        product_version_id: 'pv-cn-us-econ-v3',
        country_code: 'CN',
        warehouse_id: 'WH-SZX-01',
        sort_key: 1,
        remark_internal: 'Shenzhen — electronics-heavy',
      },
    ],
    zone_destinations: [
      { id: 'pvzd-usw', product_version_id: 'pv-cn-us-econ-v3', zone_id: 'z-us-west', policy: 'ALLOW', priority: 10 },
      { id: 'pvzd-use', product_version_id: 'pv-cn-us-econ-v3', zone_id: 'z-us-east', policy: 'ALLOW', priority: 10 },
      { id: 'pvzd-ca', product_version_id: 'pv-cn-us-econ-v3', zone_id: 'z-ca', policy: 'ALLOW', priority: 5 },
    ],
    destinations: [
      {
        id: 'pvd-us-ak',
        product_version_id: 'pv-cn-us-econ-v3',
        country_code: 'US',
        subdivision_code: 'US-AK',
        postal_prefix: null,
        match_kind: 'SUBDIVISION',
        policy: 'DENY',
        priority: 100,
        remark_internal: 'Economy lane not offered to AK — use courier line',
      },
    ],
    fulfillments: [
      {
        id: 'pvf-cn-us-a',
        product_version_id: 'pv-cn-us-econ-v3',
        priority: 0,
        network_carrier_code: 'USPS',
        carrier_account_id: 'acct-EXAMPLE_AGGREGATOR-pool-1',
        carrier_product_code: 'AGG_USPS_PMIX_STD',
        carrier_product_code_alt: 'AGG_USPS_PMIX_STD_B',
        label_profile_id: 'lbl-4x6-usps-01',
        tracking_adapter: 'carrier_adapter:EXAMPLE_AGGREGATOR',
        weight_dim_rule_id: 'rule-bubble-6000',
        booking_mode: 'API_CREATE',
        enabled: true,
        remark_internal: 'Primary: aggregator inject → USPS last mile',
      },
      {
        id: 'pvf-cn-us-b',
        product_version_id: 'pv-cn-us-econ-v3',
        priority: 1,
        network_carrier_code: 'DHL_EXPRESS',
        carrier_account_id: 'acct-DHL-DIRECT-POOL',
        carrier_product_code: 'DHL_PACKET_INTL',
        carrier_product_code_alt: null,
        label_profile_id: null,
        tracking_adapter: 'carrier_adapter:DHL_DIRECT',
        weight_dim_rule_id: 'rule-bubble-5000',
        booking_mode: 'API_CREATE',
        enabled: true,
        remark_internal: 'Overflow / peak season — higher cost tier',
      },
    ],
  },

  {
    product: {
      id: 'prd-cn-eu-std',
      code: 'LINE_CN_EU_STD',
      kind: 'COURIER',
      status: 'active',
      effective_from: '2024-06-01',
      owner_team: 'network-parcel',
      tags: ['eu', 'ddp-option', 'b2c'],
    },
    commercial: {
      product_id: 'prd-cn-eu-std',
      display_name: {
        'en-US': 'Standard Line — European Union',
        'zh-CN': '欧盟标准线',
      },
      short_description: {
        'en-US': 'Commercial express handover; DDP optional per account. 30 kg billing weight cap.',
        'zh-CN': '商业快件交接；大客户可选 DDP。计费重上限 30kg。',
      },
      sales_channels: ['portal', 'api'],
    },
    version: {
      id: 'pv-cn-eu-v2',
      product_id: 'prd-cn-eu-std',
      version_seq: 2,
      effective_from: '2025-01-15',
      effective_to: null,
      status: 'published',
    },
    physical_limit: {
      product_version_id: 'pv-cn-eu-v2',
      min_weight_g: 50,
      max_weight_g: 30000,
      max_length_mm: 1200,
      max_width_mm: 800,
      max_height_mm: 800,
      max_dim_sum_mm: 2500,
      max_length_plus_girth_mm: 3000,
      piece_count_max: 1,
      dimensions_required: true,
      remark_internal: 'Courier — dimensions mandatory for DIM weight',
    },
    origins: [
      {
        id: 'pvo-eu-1',
        product_version_id: 'pv-cn-eu-v2',
        country_code: 'CN',
        warehouse_id: 'WH-SZX-01',
        sort_key: 0,
      },
    ],
    zone_destinations: [
      { id: 'pvzd-eu-core', product_version_id: 'pv-cn-eu-v2', zone_id: 'z-eu-core', policy: 'ALLOW', priority: 10 },
      { id: 'pvzd-eu-nordic', product_version_id: 'pv-cn-eu-v2', zone_id: 'z-eu-nordic', policy: 'ALLOW', priority: 10 },
    ],
    destinations: [],
    fulfillments: [
      {
        id: 'pvf-eu-0',
        product_version_id: 'pv-cn-eu-v2',
        priority: 0,
        network_carrier_code: 'UPS',
        carrier_account_id: 'acct-UPS-BROKER-CN',
        carrier_product_code: 'UPS_WORLDWIDE_EXPEDITED',
        carrier_product_code_alt: 'UPS_SAVER',
        label_profile_id: 'lbl-a4-ups-01',
        tracking_adapter: 'carrier_adapter:UPS_REST',
        weight_dim_rule_id: 'rule-dim-5000',
        booking_mode: 'API_CREATE',
        enabled: true,
      },
      {
        id: 'pvf-eu-1',
        product_version_id: 'pv-cn-eu-v2',
        priority: 1,
        network_carrier_code: 'FEDEX',
        carrier_account_id: 'acct-FDX-CN-01',
        carrier_product_code: 'FEDEX_INTERNATIONAL_PRIORITY',
        carrier_product_code_alt: null,
        label_profile_id: 'lbl-4x6-fedex-01',
        tracking_adapter: 'carrier_adapter:FEDEX_SHIP',
        weight_dim_rule_id: 'rule-dim-5000',
        booking_mode: 'API_CREATE',
        enabled: true,
        remark_internal: 'Backup when UPS capacity constrained',
      },
    ],
  },

  {
    product: {
      id: 'prd-cn-gb-std',
      code: 'LINE_CN_GB_STD',
      kind: 'POSTAL',
      status: 'active',
      tags: ['gb', 'brexit', 'vat-ioss'],
    },
    commercial: {
      product_id: 'prd-cn-gb-std',
      display_name: {
        'en-US': 'United Kingdom — tracked postal',
        'zh-CN': '英国专线（邮政类可追踪）',
      },
      short_description: {
        'en-US': 'Post-Brexit customs model; IOSS / DDP flags per shipper setup — product only defines service lane.',
        'zh-CN': '脱欧后关务模式；IOSS/DDP 由账号与申报侧配置，本产品仅定义服务线。',
      },
      sales_channels: ['portal', 'api', 'internal'],
    },
    version: {
      id: 'pv-gb-v1',
      product_id: 'prd-cn-gb-std',
      version_seq: 1,
      effective_from: '2025-02-01',
      effective_to: null,
      status: 'published',
    },
    physical_limit: {
      product_version_id: 'pv-gb-v1',
      min_weight_g: 1,
      max_weight_g: 20000,
      max_length_mm: 900,
      max_width_mm: 600,
      max_height_mm: 600,
      max_dim_sum_mm: 2000,
      max_length_plus_girth_mm: null,
      piece_count_max: 1,
      dimensions_required: false,
    },
    origins: [{ id: 'pvo-gb-1', product_version_id: 'pv-gb-v1', country_code: 'CN', warehouse_id: null, sort_key: 0 }],
    zone_destinations: [{ id: 'pvzd-gb', product_version_id: 'pv-gb-v1', zone_id: 'z-gb', policy: 'ALLOW', priority: 10 }],
    destinations: [],
    fulfillments: [
      {
        id: 'pvf-gb-0',
        product_version_id: 'pv-gb-v1',
        priority: 0,
        network_carrier_code: 'DHL_EXPRESS',
        carrier_account_id: 'acct-DHL-UK-POST',
        carrier_product_code: 'DHL_PARCEL_UK_STD',
        carrier_product_code_alt: null,
        label_profile_id: 'lbl-gb-c6-01',
        tracking_adapter: 'carrier_adapter:DHL_DIRECT',
        weight_dim_rule_id: 'rule-bubble-6000',
        booking_mode: 'API_CREATE',
        enabled: true,
      },
    ],
  },

  {
    product: {
      id: 'prd-cn-apac-express',
      code: 'LINE_CN_APAC_EXP',
      kind: 'COURIER',
      status: 'active',
      tags: ['apac', 'jp', 'sg', 'au'],
    },
    commercial: {
      product_id: 'prd-cn-apac-express',
      display_name: {
        'en-US': 'APAC Express — JP / SG / AU-NZ',
        'zh-CN': '亚太快递 — 日本 / 新加坡 / 澳新',
      },
      short_description: {
        'en-US': 'Regional express from CN; typical 3–5 business days to JP/SG metro.',
        'zh-CN': '华南/华东始发区域快递；日本/新加坡都市区常见 3–5 个工作日。',
      },
      sales_channels: ['portal', 'api'],
    },
    version: {
      id: 'pv-apac-v1',
      product_id: 'prd-cn-apac-express',
      version_seq: 1,
      effective_from: '2025-01-01',
      effective_to: null,
      status: 'published',
    },
    physical_limit: {
      product_version_id: 'pv-apac-v1',
      min_weight_g: 100,
      max_weight_g: 30000,
      max_length_mm: 1500,
      max_width_mm: 800,
      max_height_mm: 800,
      max_dim_sum_mm: 2800,
      max_length_plus_girth_mm: null,
      piece_count_max: 1,
      dimensions_required: true,
    },
    origins: [
      { id: 'pvo-apac-1', product_version_id: 'pv-apac-v1', country_code: 'CN', warehouse_id: 'WH-SZX-01', sort_key: 0 },
      { id: 'pvo-apac-2', product_version_id: 'pv-apac-v1', country_code: 'CN', warehouse_id: 'WH-YIWU-01', sort_key: 1 },
    ],
    zone_destinations: [
      { id: 'pvzd-jp', product_version_id: 'pv-apac-v1', zone_id: 'z-jp', policy: 'ALLOW', priority: 10 },
      { id: 'pvzd-sg', product_version_id: 'pv-apac-v1', zone_id: 'z-sg', policy: 'ALLOW', priority: 10 },
      { id: 'pvzd-au', product_version_id: 'pv-apac-v1', zone_id: 'z-au-nz', policy: 'ALLOW', priority: 10 },
    ],
    destinations: [],
    fulfillments: [
      {
        id: 'pvf-apac-0',
        product_version_id: 'pv-apac-v1',
        priority: 0,
        network_carrier_code: 'FEDEX',
        carrier_account_id: 'acct-FDX-APAC-POOL',
        carrier_product_code: 'FEDEX_INTERNATIONAL_PRIORITY',
        carrier_product_code_alt: null,
        label_profile_id: 'lbl-4x6-fedex-01',
        tracking_adapter: 'carrier_adapter:FEDEX_SHIP',
        weight_dim_rule_id: 'rule-dim-5000',
        booking_mode: 'API_CREATE',
        enabled: true,
      },
      {
        id: 'pvf-apac-1',
        product_version_id: 'pv-apac-v1',
        priority: 1,
        network_carrier_code: 'DHL_EXPRESS',
        carrier_account_id: 'acct-DHL-DIRECT-POOL',
        carrier_product_code: 'DHL_EXPRESS_WORLDWIDE',
        carrier_product_code_alt: null,
        label_profile_id: null,
        tracking_adapter: 'carrier_adapter:DHL_DIRECT',
        weight_dim_rule_id: 'rule-dim-5000',
        booking_mode: 'API_CREATE',
        enabled: true,
      },
    ],
  },

  {
    product: {
      id: 'prd-cn-global-deferred',
      code: 'LINE_CN_GLOBAL_DEF',
      kind: 'DEFERRED',
      status: 'sunset',
      effective_from: '2023-01-01',
      effective_to: '2025-06-30',
      tags: ['deprecated', 'slow-boat'],
    },
    commercial: {
      product_id: 'prd-cn-global-deferred',
      display_name: {
        'en-US': 'Deferred consolidation (legacy)',
        'zh-CN': '海运集货（旧版）',
      },
      short_description: {
        'en-US': 'Sunset SKU — existing shipments only; no new orders after effective date.',
        'zh-CN': '已下线产品 — 仅历史运单解释用。',
      },
      sales_channels: ['internal'],
    },
    version: {
      id: 'pv-def-v1',
      product_id: 'prd-cn-global-deferred',
      version_seq: 1,
      effective_from: '2023-01-01',
      effective_to: '2025-06-30',
      status: 'published',
      changelog: 'Product sunset — replaced by LINE_CN_US_ECON + regional lines',
    },
    physical_limit: {
      product_version_id: 'pv-def-v1',
      min_weight_g: 500,
      max_weight_g: 50000,
      max_length_mm: null,
      max_width_mm: null,
      max_height_mm: null,
      max_dim_sum_mm: null,
      max_length_plus_girth_mm: null,
      piece_count_max: 10,
      dimensions_required: false,
      remark_internal: 'Loose consolidation — rules on booking, not product row',
    },
    origins: [{ id: 'pvo-def-1', product_version_id: 'pv-def-v1', country_code: 'CN', warehouse_id: 'WH-YIWU-01', sort_key: 0 }],
    zone_destinations: [
      { id: 'pvzd-def-us', product_version_id: 'pv-def-v1', zone_id: 'z-us-west', policy: 'ALLOW', priority: 1 },
      { id: 'pvzd-def-eu', product_version_id: 'pv-def-v1', zone_id: 'z-eu-core', policy: 'ALLOW', priority: 1 },
    ],
    destinations: [],
    fulfillments: [
      {
        id: 'pvf-def-0',
        product_version_id: 'pv-def-v1',
        priority: 0,
        network_carrier_code: null,
        carrier_account_id: 'acct-FREIGHT-FORWARDER-01',
        carrier_product_code: 'SEA_LCL_CONSOL',
        carrier_product_code_alt: null,
        label_profile_id: null,
        tracking_adapter: 'manual:booking_sheet',
        weight_dim_rule_id: null,
        booking_mode: 'MANUAL',
        enabled: false,
        remark_internal: 'Disabled for new bookings',
      },
    ],
  },
];

export function getProductByCode(code: string): ProductCatalogEntry | undefined {
  return PRODUCT_CATALOG.find((e) => e.product.code === code);
}

export function getProductById(id: string): ProductCatalogEntry | undefined {
  return PRODUCT_CATALOG.find((e) => e.product.id === id);
}

export function listActiveProducts(): ProductCatalogEntry[] {
  return PRODUCT_CATALOG.filter((e) => e.product.status === 'active');
}
