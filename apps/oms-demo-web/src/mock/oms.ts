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
