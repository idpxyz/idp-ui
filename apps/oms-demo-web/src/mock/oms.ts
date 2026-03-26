/** Mock data for OMS demo — replace with API calls in production. */

export interface MockOrder {
  id: string;
  customer: string;
  channel: string;
  status: 'pending' | 'shipped' | 'completed';
  total: string;
  placedAt: string;
}

export interface MockStockAlert {
  sku: string;
  name: string;
  site: string;
  onHand: number;
  minLevel: number;
}


export const mockOrders: MockOrder[] = [
  { id: 'ORD-240315', customer: '华东 Retail A', channel: 'B2B', status: 'pending', total: '¥12,480', placedAt: '2025-03-15 09:42' },
  { id: 'ORD-240316', customer: '华南 DC-02', channel: 'B2C', status: 'shipped', total: '¥3,260', placedAt: '2025-03-15 11:05' },
  { id: 'ORD-240317', customer: '华北 Hub', channel: 'B2B', status: 'completed', total: '¥28,900', placedAt: '2025-03-14 16:22' },
  { id: 'ORD-240318', customer: '西南 Store-7', channel: 'B2C', status: 'pending', total: '¥1,099', placedAt: '2025-03-15 14:18' },
];

export const mockStockAlerts: MockStockAlert[] = [
  { sku: 'SKU-88421', name: '无线鼠标 M2', site: '上海仓', onHand: 12, minLevel: 40 },
  { sku: 'SKU-99102', name: '机械键盘 K87', site: '广州仓', onHand: 8, minLevel: 24 },
  { sku: 'SKU-11003', name: 'USB-C 线缆 2m', site: '成都仓', onHand: 120, minLevel: 200 },
];

export interface MockShipment {
  id: string;
  destination: string;
  carrier: string;
  shipBy: string;
  status: 'queued' | 'picked' | 'shipped';
}

export const mockFulfillmentQueue: MockShipment[] = [
  { id: 'SHP-9012', destination: '杭州 FC', carrier: '顺丰', shipBy: '今日 18:00', status: 'queued' },
  { id: 'SHP-9013', destination: '深圳 DC', carrier: '京东', shipBy: '明日 10:00', status: 'picked' },
  { id: 'SHP-9014', destination: '成都 Hub', carrier: '德邦', shipBy: '今日 14:00', status: 'shipped' },
];

export const tabTitles: Record<string, string> = {
  'orders-overview': '订单概览',
  'inventory-alerts': '库存预警',
  'fulfillment-queue': '发货队列',
};

export interface MockProduct {
  id: string;
  name: string;
  sku: string;
  price: string;
  quantity: number;
  image: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  supplier: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  warranty: string;
  warrantyPeriod: string;
  warrantyExpiration: string;
  warrantyType: string;
  warrantyCoverage: string;
  warrantyClaims: string;
  warrantyClaimsHistory: string;
  warrantyClaimsStatus: string;
  warrantyClaimsDate: string;
  warrantyClaimsAmount: string;
}

export const mockProducts: MockProduct[] = [
  { id: 'PROD-12345', name: '无线鼠标 M2', sku: 'SKU-88421', price: '¥120', quantity: 12, image: 'https://via.placeholder.com/150', description: '无线鼠标 M2', category: '电子产品', subCategory: '鼠标', brand: '罗技', supplier: '罗技', manufacturer: '罗技', model: 'M2', serialNumber: '1234567890', warranty: '3年', warrantyPeriod: '3年', warrantyExpiration: '2028-03-26', warrantyType: '有限保修', warrantyCoverage: '有限保修', warrantyClaims: '有限保修', warrantyClaimsHistory: '有限保修', warrantyClaimsStatus: '有限保修', warrantyClaimsDate: '2026-03-26', warrantyClaimsAmount: '¥120' },
  { id: 'PROD-12346', name: '机械键盘 K87', sku: 'SKU-99102', price: '¥240', quantity: 8, image: 'https://via.placeholder.com/150', description: '机械键盘 K87', category: '电子产品', subCategory: '键盘', brand: '罗技', supplier: '罗技', manufacturer: '罗技', model: 'K87', serialNumber: '1234567890', warranty: '3年', warrantyPeriod: '3年', warrantyExpiration: '2028-03-26', warrantyType: '有限保修', warrantyCoverage: '有限保修', warrantyClaims: '有限保修', warrantyClaimsHistory: '有限保修', warrantyClaimsStatus: '有限保修', warrantyClaimsDate: '2026-03-26', warrantyClaimsAmount: '¥240' },
  { id: 'PROD-12347', name: 'USB-C 线缆 2m', sku: 'SKU-11003', price: '¥30', quantity: 120, image: 'https://via.placeholder.com/150', description: 'USB-C 线缆 2m', category: '电子产品', subCategory: '线缆', brand: '罗技', supplier: '罗技', manufacturer: '罗技', model: '2m', serialNumber: '1234567890', warranty: '3年', warrantyPeriod: '3年', warrantyExpiration: '2028-03-26', warrantyType: '有限保修', warrantyCoverage: '有限保修', warrantyClaims: '有限保修', warrantyClaimsHistory: '有限保修', warrantyClaimsStatus: '有限保修', warrantyClaimsDate: '2026-03-26', warrantyClaimsAmount: '¥30' },
  { id: 'PROD-12348', name: '显示器 27寸', sku: 'SKU-11004', price: '¥40', quantity: 120, image: 'https://via.placeholder.com/150', description: '显示器 27寸', category: '电子产品', subCategory: '显示器', brand: '罗技', supplier: '罗技', manufacturer: '罗技', model: '27寸', serialNumber: '1234567890', warranty: '3年', warrantyPeriod: '3年', warrantyExpiration: '2028-03-26', warrantyType: '有限保修', warrantyCoverage: '有限保修', warrantyClaims: '有限保修', warrantyClaimsHistory: '有限保修', warrantyClaimsStatus: '有限保修', warrantyClaimsDate: '2026-03-26', warrantyClaimsAmount: '¥40' },
];