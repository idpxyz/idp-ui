// ── Status Config Types ──
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

// ── Order Lifecycle Status (Section 14.1) ──
export type OrderStatus = 'draft' | 'submitted' | 'confirmed' | 'on_hold' | 'in_fulfillment' | 'partially_fulfilled' | 'fulfilled' | 'completed' | 'cancelled' | 'closed';

export const orderStatusConfig: Record<OrderStatus, StatusConfig> = {
  draft:               { label: '草稿',       color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  submitted:           { label: '已提交',     color: '#007acc', bgColor: 'rgba(0,122,204,0.15)' },
  confirmed:           { label: '已确认',     color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
  on_hold:             { label: '暂挂',       color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  in_fulfillment:      { label: '履约中',     color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  partially_fulfilled: { label: '部分履约',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  fulfilled:           { label: '已履约',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  completed:           { label: '已完成',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  cancelled:           { label: '已取消',     color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  closed:              { label: '已关闭',     color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
};

// ── Payment Status (Section 14.2) ──
export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'partially_refunded' | 'refunded' | 'failed' | 'review_required';

export const paymentStatusConfig: Record<PaymentStatus, StatusConfig> = {
  pending:            { label: '待支付',     color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  authorized:         { label: '已授权',     color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  captured:           { label: '已收款',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  partially_refunded: { label: '部分退款',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  refunded:           { label: '已退款',     color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  failed:             { label: '支付失败',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  review_required:    { label: '需人工审核', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
};

// ── Fulfillment Status (Section 14.3) ──
export type FulfillmentStatus = 'unallocated' | 'partially_allocated' | 'allocated' | 'picking' | 'packing' | 'partially_shipped' | 'shipped' | 'delivered' | 'ff_failed';

export const fulfillmentStatusConfig: Record<FulfillmentStatus, StatusConfig> = {
  unallocated:         { label: '未分配',     color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  partially_allocated: { label: '部分分配',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  allocated:           { label: '已分配',     color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  picking:             { label: '拣货中',     color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  packing:             { label: '打包中',     color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
  partially_shipped:   { label: '部分发货',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  shipped:             { label: '已发货',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  delivered:           { label: '已签收',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  ff_failed:           { label: '履约失败',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
};

// ── Exception Severity (Section 14.5) ──
export type ExceptionSeverity = 'healthy' | 'warning' | 'blocked' | 'escalated' | 'manual_review';

export const exceptionSeverityConfig: Record<ExceptionSeverity, StatusConfig> = {
  healthy:       { label: '正常',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  warning:       { label: '警告',     color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  blocked:       { label: '阻塞',     color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  escalated:     { label: '已升级',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  manual_review: { label: '人工审核', color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
};

// ── Risk Level ──
export type RiskLevel = 'low' | 'medium' | 'high';

export const riskLevelConfig: Record<RiskLevel, StatusConfig> = {
  low:    { label: '低',  color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  medium: { label: '中',  color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  high:   { label: '高',  color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
};

// ── Order Type ──
export interface Order {
  id: string;
  channel: string;
  store: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  totalAmount: number;
  currency: string;
  itemCount: number;
  riskLevel: RiskLevel;
  slaHoursRemaining: number;
  warehouse: string;
  assignedTo: string;
  tags: string[];
  country: string;
}

// ── Exception Type ──
export type ExceptionType = 'payment_failed' | 'address_validation' | 'inventory_shortage' | 'fulfillment_failure' | 'shipment_exception' | 'fraud_risk' | 'pricing_anomaly' | 'customer_change';

export const exceptionTypeConfig: Record<ExceptionType, StatusConfig> = {
  payment_failed:      { label: '支付失败',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  address_validation:  { label: '地址异常',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  inventory_shortage:  { label: '库存不足',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  fulfillment_failure: { label: '履约失败',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  shipment_exception:  { label: '物流异常',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  fraud_risk:          { label: '欺诈风险',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  pricing_anomaly:     { label: '价格异常',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  customer_change:     { label: '客户变更',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
};

export interface OMSException {
  id: string;
  orderId: string;
  type: ExceptionType;
  severity: ExceptionSeverity;
  channel: string;
  customerName: string;
  amount: number;
  slaHoursRemaining: number;
  assignedTo: string;
  createdAt: string;
  lastAction: string;
  description: string;
}

// ── Order Line Item ──
export interface OrderLineItem {
  sku: string;
  name: string;
  orderedQty: number;
  allocatedQty: number;
  fulfilledQty: number;
  returnedQty: number;
  unitPrice: number;
  discount: number;
  tax: number;
  inventorySource: string;
  issue: string | null;
}

// ── Timeline Event ──
export interface TimelineEvent {
  time: string;
  actor: string;
  action: string;
  type: 'system' | 'human' | 'external' | 'payment' | 'shipment';
}

// ── Mock Orders (Section 10) ──
export const orders: Order[] = [
  { id: 'ORD-20250301-001', channel: '官网', store: 'MyShop 美国站', customerName: '张晓明', customerEmail: 'zhangxm@example.com', createdAt: '2025-03-01 09:15', updatedAt: '2025-03-01 14:30', status: 'confirmed', paymentStatus: 'captured', fulfillmentStatus: 'allocated', totalAmount: 289.99, currency: 'USD', itemCount: 3, riskLevel: 'low', slaHoursRemaining: 18, warehouse: '华东仓', assignedTo: '王丽', tags: ['VIP'], country: 'US' },
  { id: 'ORD-20250301-002', channel: 'App', store: 'MyShop 美国站', customerName: '陈博', customerEmail: 'chenbo@example.com', createdAt: '2025-03-01 10:22', updatedAt: '2025-03-01 11:05', status: 'on_hold', paymentStatus: 'review_required', fulfillmentStatus: 'unallocated', totalAmount: 1549.00, currency: 'USD', itemCount: 1, riskLevel: 'high', slaHoursRemaining: 4, warehouse: '-', assignedTo: '刘建', tags: ['高价值', '需审核'], country: 'US' },
  { id: 'ORD-20250301-003', channel: '平台', store: '亚马逊美国', customerName: '李婷婷', customerEmail: 'litt@example.com', createdAt: '2025-03-01 08:45', updatedAt: '2025-03-01 15:10', status: 'in_fulfillment', paymentStatus: 'captured', fulfillmentStatus: 'picking', totalAmount: 67.50, currency: 'USD', itemCount: 2, riskLevel: 'low', slaHoursRemaining: 22, warehouse: '华西仓', assignedTo: '', tags: [], country: 'US' },
  { id: 'ORD-20250301-004', channel: '官网', store: 'MyShop 欧洲站', customerName: '赵德明', customerEmail: 'zhaodm@example.com', createdAt: '2025-03-01 07:30', updatedAt: '2025-03-01 13:00', status: 'partially_fulfilled', paymentStatus: 'captured', fulfillmentStatus: 'partially_shipped', totalAmount: 432.00, currency: 'EUR', itemCount: 5, riskLevel: 'medium', slaHoursRemaining: 8, warehouse: '欧洲仓', assignedTo: '周明', tags: ['拆单发货'], country: 'DE' },
  { id: 'ORD-20250301-005', channel: 'App', store: 'MyShop 美国站', customerName: '孙文静', customerEmail: 'sunwj@example.com', createdAt: '2025-03-01 11:00', updatedAt: '2025-03-01 11:00', status: 'submitted', paymentStatus: 'pending', fulfillmentStatus: 'unallocated', totalAmount: 125.00, currency: 'USD', itemCount: 2, riskLevel: 'low', slaHoursRemaining: 36, warehouse: '-', assignedTo: '', tags: ['新订单'], country: 'US' },
  { id: 'ORD-20250301-006', channel: '官网', store: 'MyShop 美国站', customerName: '李帆', customerEmail: 'lifan@example.com', createdAt: '2025-02-28 16:20', updatedAt: '2025-03-01 10:45', status: 'confirmed', paymentStatus: 'captured', fulfillmentStatus: 'ff_failed', totalAmount: 89.99, currency: 'USD', itemCount: 1, riskLevel: 'high', slaHoursRemaining: -2, warehouse: '华东仓', assignedTo: '王丽', tags: ['SLA超期'], country: 'US' },
  { id: 'ORD-20250301-007', channel: '平台', store: 'Shopee 新加坡', customerName: '陈恩慧', customerEmail: 'chenh@example.sg', createdAt: '2025-03-01 06:15', updatedAt: '2025-03-01 12:30', status: 'fulfilled', paymentStatus: 'captured', fulfillmentStatus: 'shipped', totalAmount: 210.00, currency: 'SGD', itemCount: 4, riskLevel: 'low', slaHoursRemaining: 48, warehouse: '新加坡仓', assignedTo: '', tags: [], country: 'SG' },
  { id: 'ORD-20250301-008', channel: '官网', store: 'MyShop 美国站', customerName: '朴亨俊', customerEmail: 'park@example.com', createdAt: '2025-03-01 09:45', updatedAt: '2025-03-01 14:00', status: 'confirmed', paymentStatus: 'captured', fulfillmentStatus: 'packing', totalAmount: 345.50, currency: 'USD', itemCount: 3, riskLevel: 'low', slaHoursRemaining: 16, warehouse: '华东仓', assignedTo: '', tags: [], country: 'US' },
  { id: 'ORD-20250301-009', channel: 'App', store: 'MyShop 欧洲站', customerName: '马可', customerEmail: 'marco@example.it', createdAt: '2025-02-28 22:00', updatedAt: '2025-03-01 09:15', status: 'cancelled', paymentStatus: 'refunded', fulfillmentStatus: 'unallocated', totalAmount: 78.00, currency: 'EUR', itemCount: 1, riskLevel: 'low', slaHoursRemaining: 0, warehouse: '-', assignedTo: '', tags: [], country: 'IT' },
  { id: 'ORD-20250301-010', channel: '官网', store: 'MyShop 美国站', customerName: '杰克·汤普森', customerEmail: 'jack@example.com', createdAt: '2025-03-01 12:00', updatedAt: '2025-03-01 15:30', status: 'confirmed', paymentStatus: 'authorized', fulfillmentStatus: 'allocated', totalAmount: 599.00, currency: 'USD', itemCount: 2, riskLevel: 'medium', slaHoursRemaining: 12, warehouse: '华西仓', assignedTo: '刘建', tags: ['优先'], country: 'US' },
  { id: 'ORD-20250301-011', channel: '官网', store: 'MyShop 美国站', customerName: '凯伦·怀特', customerEmail: 'karen@example.com', createdAt: '2025-03-01 13:10', updatedAt: '2025-03-01 13:10', status: 'draft', paymentStatus: 'pending', fulfillmentStatus: 'unallocated', totalAmount: 42.00, currency: 'USD', itemCount: 1, riskLevel: 'low', slaHoursRemaining: 48, warehouse: '-', assignedTo: '', tags: [], country: 'US' },
  { id: 'ORD-20250301-012', channel: '平台', store: '亚马逊美国', customerName: '雷奥·加西亚', customerEmail: 'leo@example.com', createdAt: '2025-02-27 08:00', updatedAt: '2025-03-01 08:00', status: 'completed', paymentStatus: 'captured', fulfillmentStatus: 'delivered', totalAmount: 156.00, currency: 'USD', itemCount: 3, riskLevel: 'low', slaHoursRemaining: 0, warehouse: '华东仓', assignedTo: '', tags: [], country: 'US' },
];

// ── Mock Exceptions (Section 15) ──
export const exceptions: OMSException[] = [
  { id: 'EXC-001', orderId: 'ORD-20250301-002', type: 'fraud_risk', severity: 'blocked', channel: 'App', customerName: '陈博', amount: 1549.00, slaHoursRemaining: 2, assignedTo: '刘建', createdAt: '2025-03-01 10:30', lastAction: '风控引擎自动标记', description: '新账户高价值订单，多次支付失败后成功。发卡行所在国与收货地址不符。' },
  { id: 'EXC-002', orderId: 'ORD-20250301-006', type: 'fulfillment_failure', severity: 'escalated', channel: '官网', customerName: '李帆', amount: 89.99, slaHoursRemaining: -2, assignedTo: '王丽', createdAt: '2025-03-01 08:00', lastAction: '仓库API超时', description: '履约接口连续返回503错误3次，SLA已超期，客户已联系客服。' },
  { id: 'EXC-003', orderId: 'ORD-20250301-004', type: 'inventory_shortage', severity: 'warning', channel: '官网', customerName: '赵德明', amount: 432.00, slaHoursRemaining: 6, assignedTo: '周明', createdAt: '2025-03-01 11:00', lastAction: '部分分配完成', description: 'SKU-2045 在欧洲仓缺货，5件商品中2件待重新分配至华东仓。' },
  { id: 'EXC-004', orderId: 'ORD-20250301-010', type: 'address_validation', severity: 'manual_review', channel: '官网', customerName: '杰克·汤普森', amount: 599.00, slaHoursRemaining: 10, assignedTo: '刘建', createdAt: '2025-03-01 12:15', lastAction: '地址验证置信度低', description: '收货地址部分匹配，缺少公寓号。已向客户发送确认通知。' },
  { id: 'EXC-005', orderId: 'ORD-20250301-005', type: 'payment_failed', severity: 'warning', channel: 'App', customerName: '孙文静', amount: 125.00, slaHoursRemaining: 24, assignedTo: '', createdAt: '2025-03-01 11:05', lastAction: '支付网关拒绝', description: '银行卡授权被拒，原因：余额不足。已安排4小时后自动重试。' },
  { id: 'EXC-006', orderId: 'ORD-20250301-008', type: 'shipment_exception', severity: 'warning', channel: '官网', customerName: '朴亨俊', amount: 345.50, slaHoursRemaining: 14, assignedTo: '', createdAt: '2025-03-01 14:10', lastAction: '承运商费率差异', description: '计算运费与承运商报价差异超过15%，需要人工确认费率。' },
  { id: 'EXC-007', orderId: 'ORD-20250301-001', type: 'customer_change', severity: 'healthy', channel: '官网', customerName: '张晓明', amount: 289.99, slaHoursRemaining: 16, assignedTo: '王丽', createdAt: '2025-03-01 14:30', lastAction: '客户请求更改地址', description: '客户在分配后请求更新收货地址，若仓库变更则需重新分配。' },
];

// ── Order Line Items for detail view ──
export const orderLineItems: Record<string, OrderLineItem[]> = {
  'ORD-20250301-001': [
    { sku: 'SKU-1001', name: '无线蓝牙耳机', orderedQty: 1, allocatedQty: 1, fulfilledQty: 0, returnedQty: 0, unitPrice: 129.99, discount: 0, tax: 10.40, inventorySource: '华东仓', issue: null },
    { sku: 'SKU-1015', name: 'USB-C 充电线 2米', orderedQty: 2, allocatedQty: 2, fulfilledQty: 0, returnedQty: 0, unitPrice: 19.99, discount: 0, tax: 3.20, inventorySource: '华东仓', issue: null },
    { sku: 'SKU-1042', name: '透明手机壳', orderedQty: 1, allocatedQty: 1, fulfilledQty: 0, returnedQty: 0, unitPrice: 99.99, discount: 0, tax: 8.00, inventorySource: '华东仓', issue: null },
  ],
  'ORD-20250301-002': [
    { sku: 'SKU-3001', name: 'MacBook Pro 14" M3 Pro', orderedQty: 1, allocatedQty: 0, fulfilledQty: 0, returnedQty: 0, unitPrice: 1549.00, discount: 0, tax: 123.92, inventorySource: '-', issue: '支付审核中' },
  ],
  'ORD-20250301-004': [
    { sku: 'SKU-2010', name: '男士跑步鞋', orderedQty: 1, allocatedQty: 1, fulfilledQty: 1, returnedQty: 0, unitPrice: 120.00, discount: 12.00, tax: 8.64, inventorySource: '欧洲仓', issue: null },
    { sku: 'SKU-2022', name: '运动水杯 750ml', orderedQty: 2, allocatedQty: 2, fulfilledQty: 2, returnedQty: 0, unitPrice: 24.00, discount: 0, tax: 3.84, inventorySource: '欧洲仓', issue: null },
    { sku: 'SKU-2045', name: '压缩袜套装', orderedQty: 1, allocatedQty: 0, fulfilledQty: 0, returnedQty: 0, unitPrice: 35.00, discount: 0, tax: 2.80, inventorySource: '-', issue: '欧洲仓缺货' },
    { sku: 'SKU-2033', name: '超细纤维运动毛巾', orderedQty: 1, allocatedQty: 1, fulfilledQty: 0, returnedQty: 0, unitPrice: 18.00, discount: 0, tax: 1.44, inventorySource: '欧洲仓', issue: null },
    { sku: 'SKU-2051', name: '弹力带套装', orderedQty: 1, allocatedQty: 0, fulfilledQty: 0, returnedQty: 0, unitPrice: 45.00, discount: 0, tax: 3.60, inventorySource: '-', issue: '待重新分配至华东仓' },
  ],
};

// ── Timeline Events ──
export const orderTimelines: Record<string, TimelineEvent[]> = {
  'ORD-20250301-001': [
    { time: '2025-03-01 14:30', actor: '张晓明', action: '通过客服聊天请求更改收货地址', type: 'human' },
    { time: '2025-03-01 14:25', actor: '系统', action: '分配确认：华东仓，全部3件商品', type: 'system' },
    { time: '2025-03-01 12:00', actor: '支付网关', action: '已收款：$289.99，Visa ****4821', type: 'payment' },
    { time: '2025-03-01 09:20', actor: '系统', action: '订单已确认，进入履约队列', type: 'system' },
    { time: '2025-03-01 09:18', actor: '支付网关', action: '授权成功：$289.99', type: 'payment' },
    { time: '2025-03-01 09:15', actor: '客户', action: '通过官网下单', type: 'external' },
  ],
  'ORD-20250301-002': [
    { time: '2025-03-01 11:05', actor: '刘建', action: '领取订单进行人工审核', type: 'human' },
    { time: '2025-03-01 10:30', actor: '风控引擎', action: '订单标记：高风险评分 87/100', type: 'system' },
    { time: '2025-03-01 10:25', actor: '系统', action: '订单已暂挂，等待审核', type: 'system' },
    { time: '2025-03-01 10:23', actor: '支付网关', action: '第3次尝试后授权成功', type: 'payment' },
    { time: '2025-03-01 10:22', actor: '客户', action: '通过App下单', type: 'external' },
  ],
  'ORD-20250301-006': [
    { time: '2025-03-01 10:45', actor: '王丽', action: '已升级至仓库运营团队', type: 'human' },
    { time: '2025-03-01 10:00', actor: '系统', action: 'SLA已超期：超过承诺交付时间', type: 'system' },
    { time: '2025-03-01 08:00', actor: '系统', action: '履约接口错误：503 服务不可用（第3/3次）', type: 'system' },
    { time: '2025-03-01 07:30', actor: '系统', action: '履约接口错误：503（第2/3次）', type: 'system' },
    { time: '2025-03-01 07:00', actor: '系统', action: '履约接口错误：503（第1/3次）', type: 'system' },
    { time: '2025-02-28 17:00', actor: '系统', action: '分配确认：华东仓', type: 'system' },
    { time: '2025-02-28 16:25', actor: '支付网关', action: '已收款：$89.99', type: 'payment' },
    { time: '2025-02-28 16:20', actor: '客户', action: '通过官网下单', type: 'external' },
  ],
};

// ── Dashboard Metrics ──
export const dashboardMetrics = {
  totalOrdersToday: 142,
  paidOrders: 118,
  awaitingAllocation: 23,
  onHold: 8,
  exceptionOrders: 12,
  slaRiskOrders: 5,
};

export const channelDistribution = [
  { channel: '官网', count: 67, pct: 47 },
  { channel: 'App', count: 42, pct: 30 },
  { channel: '亚马逊', count: 21, pct: 15 },
  { channel: 'Shopee', count: 12, pct: 8 },
];

export const fulfillmentStageDistribution = [
  { stage: '未分配', count: 23 },
  { stage: '已分配', count: 31 },
  { stage: '拣货中', count: 18 },
  { stage: '打包中', count: 12 },
  { stage: '已发货', count: 45 },
  { stage: '已签收', count: 13 },
];

export const recentExceptions = [
  { id: 'EXC-001', type: '欺诈风险', order: 'ORD-20250301-002', severity: 'blocked' as ExceptionSeverity, age: '4小时' },
  { id: 'EXC-002', type: '履约失败', order: 'ORD-20250301-006', severity: 'escalated' as ExceptionSeverity, age: '7小时' },
  { id: 'EXC-003', type: '库存不足', order: 'ORD-20250301-004', severity: 'warning' as ExceptionSeverity, age: '4小时' },
  { id: 'EXC-004', type: '地址异常', order: 'ORD-20250301-010', severity: 'manual_review' as ExceptionSeverity, age: '3小时' },
  { id: 'EXC-005', type: '支付失败', order: 'ORD-20250301-005', severity: 'warning' as ExceptionSeverity, age: '4小时' },
];

// ── Channel / Store Types ──
export type ChannelType = 'direct' | 'marketplace' | 'social' | 'wholesale';
export type StoreStatus = 'active' | 'paused' | 'pending' | 'disconnected' | 'archived';

export const channelTypeConfig: Record<ChannelType, StatusConfig> = {
  direct:      { label: '直营',   color: '#007acc', bgColor: 'rgba(0,122,204,0.15)' },
  marketplace: { label: '平台',   color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
  social:      { label: '社交',   color: '#c586c0', bgColor: 'rgba(197,134,192,0.15)' },
  wholesale:   { label: '批发',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
};

export const storeStatusConfig: Record<StoreStatus, StatusConfig> = {
  active:       { label: '运营中',   color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  paused:       { label: '已暂停',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  pending:      { label: '接入中',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  disconnected: { label: '已断开',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  archived:     { label: '已归档',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
};

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  storeCount: number;
  totalOrders30d: number;
  revenue30d: number;
  currency: string;
  createdAt: string;
}

export interface ChannelStore {
  id: string;
  channelId: string;
  name: string;
  status: StoreStatus;
  region: string;
  url: string;
  ordersToday: number;
  orders30d: number;
  revenue30d: number;
  currency: string;
  lastSyncAt: string;
  syncStatus: 'ok' | 'warning' | 'error';
  apiVersion: string;
  createdAt: string;
  contactPerson: string;
  contactEmail: string;
}

// ── Mock Channels ──
export const channels: Channel[] = [
  { id: 'CH-001', name: '官网', type: 'direct', storeCount: 3, totalOrders30d: 2015, revenue30d: 582400, currency: 'USD', createdAt: '2023-06-15' },
  { id: 'CH-002', name: '亚马逊', type: 'marketplace', storeCount: 2, totalOrders30d: 890, revenue30d: 234500, currency: 'USD', createdAt: '2023-08-20' },
  { id: 'CH-003', name: 'Shopee', type: 'marketplace', storeCount: 3, totalOrders30d: 456, revenue30d: 98700, currency: 'SGD', createdAt: '2024-01-10' },
  { id: 'CH-004', name: '微信小程序', type: 'social', storeCount: 1, totalOrders30d: 320, revenue30d: 67800, currency: 'CNY', createdAt: '2024-03-05' },
  { id: 'CH-005', name: '抖音电商', type: 'social', storeCount: 1, totalOrders30d: 215, revenue30d: 45200, currency: 'CNY', createdAt: '2024-06-12' },
  { id: 'CH-006', name: 'B2B 批发', type: 'wholesale', storeCount: 1, totalOrders30d: 38, revenue30d: 189500, currency: 'USD', createdAt: '2024-02-28' },
];

// ── Mock Stores ──
export const channelStores: ChannelStore[] = [
  // 官网
  { id: 'ST-001', channelId: 'CH-001', name: 'MyShop 美国站', status: 'active', region: '北美', url: 'us.myshop.com', ordersToday: 42, orders30d: 1120, revenue30d: 324500, currency: 'USD', lastSyncAt: '2025-03-01 15:30', syncStatus: 'ok', apiVersion: 'v2.4', createdAt: '2023-06-15', contactPerson: '王丽', contactEmail: 'wangli@myshop.com' },
  { id: 'ST-002', channelId: 'CH-001', name: 'MyShop 欧洲站', status: 'active', region: '欧洲', url: 'eu.myshop.com', ordersToday: 28, orders30d: 745, revenue30d: 198600, currency: 'EUR', lastSyncAt: '2025-03-01 15:28', syncStatus: 'ok', apiVersion: 'v2.4', createdAt: '2023-09-01', contactPerson: '周明', contactEmail: 'zhouming@myshop.com' },
  { id: 'ST-003', channelId: 'CH-001', name: 'MyShop 日本站', status: 'pending', region: '亚太', url: 'jp.myshop.com', ordersToday: 0, orders30d: 150, revenue30d: 59300, currency: 'JPY', lastSyncAt: '2025-03-01 14:00', syncStatus: 'warning', apiVersion: 'v2.3', createdAt: '2024-11-20', contactPerson: '田中太郎', contactEmail: 'tanaka@myshop.com' },
  // 亚马逊
  { id: 'ST-004', channelId: 'CH-002', name: '亚马逊美国', status: 'active', region: '北美', url: 'amazon.com/myshop', ordersToday: 31, orders30d: 680, revenue30d: 178200, currency: 'USD', lastSyncAt: '2025-03-01 15:25', syncStatus: 'ok', apiVersion: 'SP-API v2', createdAt: '2023-08-20', contactPerson: '刘建', contactEmail: 'liujian@myshop.com' },
  { id: 'ST-005', channelId: 'CH-002', name: '亚马逊日本', status: 'active', region: '亚太', url: 'amazon.co.jp/myshop', ordersToday: 8, orders30d: 210, revenue30d: 56300, currency: 'JPY', lastSyncAt: '2025-03-01 15:20', syncStatus: 'ok', apiVersion: 'SP-API v2', createdAt: '2024-04-15', contactPerson: '田中太郎', contactEmail: 'tanaka@myshop.com' },
  // Shopee
  { id: 'ST-006', channelId: 'CH-003', name: 'Shopee 新加坡', status: 'active', region: '东南亚', url: 'shopee.sg/myshop', ordersToday: 12, orders30d: 220, revenue30d: 48500, currency: 'SGD', lastSyncAt: '2025-03-01 15:15', syncStatus: 'ok', apiVersion: 'v2.0', createdAt: '2024-01-10', contactPerson: '陈恩慧', contactEmail: 'chenh@myshop.com' },
  { id: 'ST-007', channelId: 'CH-003', name: 'Shopee 马来西亚', status: 'active', region: '东南亚', url: 'shopee.com.my/myshop', ordersToday: 9, orders30d: 156, revenue30d: 32800, currency: 'MYR', lastSyncAt: '2025-03-01 15:10', syncStatus: 'ok', apiVersion: 'v2.0', createdAt: '2024-03-20', contactPerson: '陈恩慧', contactEmail: 'chenh@myshop.com' },
  { id: 'ST-008', channelId: 'CH-003', name: 'Shopee 泰国', status: 'paused', region: '东南亚', url: 'shopee.co.th/myshop', ordersToday: 0, orders30d: 80, revenue30d: 17400, currency: 'THB', lastSyncAt: '2025-02-28 20:00', syncStatus: 'warning', apiVersion: 'v2.0', createdAt: '2024-05-01', contactPerson: '陈恩慧', contactEmail: 'chenh@myshop.com' },
  // 微信小程序
  { id: 'ST-009', channelId: 'CH-004', name: 'MyShop 微信小程序', status: 'active', region: '中国', url: 'weixin://myshop', ordersToday: 18, orders30d: 320, revenue30d: 67800, currency: 'CNY', lastSyncAt: '2025-03-01 15:32', syncStatus: 'ok', apiVersion: 'v3.1', createdAt: '2024-03-05', contactPerson: '张晓明', contactEmail: 'zhangxm@myshop.com' },
  // 抖音电商
  { id: 'ST-010', channelId: 'CH-005', name: 'MyShop 抖音旗舰店', status: 'active', region: '中国', url: 'douyin.com/myshop', ordersToday: 15, orders30d: 215, revenue30d: 45200, currency: 'CNY', lastSyncAt: '2025-03-01 15:18', syncStatus: 'ok', apiVersion: 'v2.0', createdAt: '2024-06-12', contactPerson: '孙文静', contactEmail: 'sunwj@myshop.com' },
  // B2B 批发
  { id: 'ST-011', channelId: 'CH-006', name: 'B2B 批发门户', status: 'active', region: '全球', url: 'b2b.myshop.com', ordersToday: 2, orders30d: 38, revenue30d: 189500, currency: 'USD', lastSyncAt: '2025-03-01 12:00', syncStatus: 'ok', apiVersion: 'v1.0', createdAt: '2024-02-28', contactPerson: '刘建', contactEmail: 'liujian@myshop.com' },
  // 已断开
  { id: 'ST-012', channelId: 'CH-002', name: '亚马逊欧洲（旧）', status: 'disconnected', region: '欧洲', url: 'amazon.de/myshop', ordersToday: 0, orders30d: 0, revenue30d: 0, currency: 'EUR', lastSyncAt: '2025-01-15 08:00', syncStatus: 'error', apiVersion: 'SP-API v1', createdAt: '2023-10-01', contactPerson: '周明', contactEmail: 'zhouming@myshop.com' },
];

// ── Product Category Types ──
export type CategoryStatus = 'active' | 'draft' | 'archived' | 'pending_review';

export const categoryStatusConfig: Record<CategoryStatus, StatusConfig> = {
  active:         { label: '已上线',   color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  draft:          { label: '草稿',     color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  archived:       { label: '已归档',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  pending_review: { label: '待审核',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
};

export interface CategoryAttribute {
  name: string;
  type: '文本' | '数值' | '单选' | '多选' | '布尔';
  required: boolean;
  options?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId: string | null;
  level: number;
  path: string;
  status: CategoryStatus;
  productCount: number;
  skuCount: number;
  description: string;
  image: string;
  sortOrder: number;
  attributes: CategoryAttribute[];
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ── Mock Product Categories (Amazon-style hierarchy) ──
export const productCategories: ProductCategory[] = [
  // Level 0 - Root categories
  { id: 'CAT-001', name: '电子产品', parentId: null, level: 0, path: '电子产品', status: 'active', productCount: 1245, skuCount: 3890, description: '电子设备、配件及相关产品', image: '📱', sortOrder: 1, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '保修期', type: '单选', required: true, options: ['无', '1年', '2年', '3年'] }], commissionRate: 8, createdAt: '2023-01-15', updatedAt: '2025-02-28', createdBy: '系统管理员' },
  { id: 'CAT-002', name: '服装鞋帽', parentId: null, level: 0, path: '服装鞋帽', status: 'active', productCount: 2380, skuCount: 8920, description: '男装、女装、童装、鞋类及配饰', image: '👔', sortOrder: 2, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '材质', type: '文本', required: true }, { name: '尺码', type: '多选', required: true, options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }], commissionRate: 15, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-003', name: '家居生活', parentId: null, level: 0, path: '家居生活', status: 'active', productCount: 890, skuCount: 2100, description: '家具、家居装饰、厨房用品及生活百货', image: '🏠', sortOrder: 3, attributes: [{ name: '品牌', type: '文本', required: false }, { name: '材料', type: '文本', required: true }], commissionRate: 12, createdAt: '2023-01-15', updatedAt: '2025-02-20', createdBy: '系统管理员' },
  { id: 'CAT-004', name: '运动户外', parentId: null, level: 0, path: '运动户外', status: 'active', productCount: 567, skuCount: 1560, description: '运动装备、健身器材、户外用品', image: '⚽', sortOrder: 4, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '适用运动', type: '多选', required: false, options: ['跑步', '篮球', '足球', '瑜伽', '游泳', '登山', '骑行'] }], commissionRate: 12, createdAt: '2023-02-01', updatedAt: '2025-02-15', createdBy: '系统管理员' },
  { id: 'CAT-005', name: '美妆个护', parentId: null, level: 0, path: '美妆个护', status: 'active', productCount: 1120, skuCount: 4200, description: '护肤、彩妆、个人护理、香水', image: '💄', sortOrder: 5, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '适用肤质', type: '多选', required: false, options: ['干性', '油性', '混合', '敏感', '中性'] }, { name: '功效', type: '多选', required: false, options: ['保湿', '美白', '抗衰', '控油', '防晒'] }], commissionRate: 20, createdAt: '2023-02-01', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-006', name: '食品生鲜', parentId: null, level: 0, path: '食品生鲜', status: 'active', productCount: 340, skuCount: 780, description: '食品、饮料、生鲜及进口食品', image: '🍎', sortOrder: 6, attributes: [{ name: '品牌', type: '文本', required: false }, { name: '保质期', type: '文本', required: true }, { name: '储存条件', type: '单选', required: true, options: ['常温', '冷藏', '冷冻'] }], commissionRate: 10, createdAt: '2023-03-01', updatedAt: '2025-02-10', createdBy: '系统管理员' },
  { id: 'CAT-007', name: '图书文具', parentId: null, level: 0, path: '图书文具', status: 'active', productCount: 2100, skuCount: 2100, description: '图书、办公用品、文具', image: '📚', sortOrder: 7, attributes: [{ name: '作者/品牌', type: '文本', required: false }, { name: 'ISBN', type: '文本', required: false }], commissionRate: 5, createdAt: '2023-03-01', updatedAt: '2025-01-20', createdBy: '系统管理员' },
  { id: 'CAT-008', name: '母婴玩具', parentId: null, level: 0, path: '母婴玩具', status: 'active', productCount: 450, skuCount: 1230, description: '婴幼儿用品、玩具、儿童服饰', image: '🧸', sortOrder: 8, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '适用年龄', type: '单选', required: true, options: ['0-6月', '6-12月', '1-3岁', '3-6岁', '6-12岁'] }], commissionRate: 10, createdAt: '2023-04-01', updatedAt: '2025-02-25', createdBy: '系统管理员' },
  { id: 'CAT-009', name: '汽车用品', parentId: null, level: 0, path: '汽车用品', status: 'draft', productCount: 0, skuCount: 0, description: '汽车配件、车载电子、美容养护', image: '🚗', sortOrder: 9, attributes: [{ name: '品牌', type: '文本', required: true }, { name: '适用车型', type: '文本', required: false }], commissionRate: 10, createdAt: '2025-02-01', updatedAt: '2025-02-01', createdBy: '周明' },

  // Level 1 - 电子产品 sub-categories
  { id: 'CAT-101', name: '手机通讯', parentId: 'CAT-001', level: 1, path: '电子产品 > 手机通讯', status: 'active', productCount: 320, skuCount: 890, description: '智能手机、功能手机及通讯配件', image: '📱', sortOrder: 1, attributes: [{ name: '操作系统', type: '单选', required: true, options: ['iOS', 'Android', '鸿蒙', '其他'] }, { name: '存储容量', type: '多选', required: true, options: ['64GB', '128GB', '256GB', '512GB', '1TB'] }, { name: '屏幕尺寸', type: '文本', required: true }], commissionRate: 6, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-102', name: '电脑办公', parentId: 'CAT-001', level: 1, path: '电子产品 > 电脑办公', status: 'active', productCount: 280, skuCount: 650, description: '笔记本电脑、台式机、显示器及外设', image: '💻', sortOrder: 2, attributes: [{ name: '处理器', type: '文本', required: true }, { name: '内存', type: '单选', required: true, options: ['8GB', '16GB', '32GB', '64GB'] }, { name: '硬盘', type: '单选', required: true, options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'] }], commissionRate: 7, createdAt: '2023-01-15', updatedAt: '2025-02-28', createdBy: '系统管理员' },
  { id: 'CAT-103', name: '影音设备', parentId: 'CAT-001', level: 1, path: '电子产品 > 影音设备', status: 'active', productCount: 185, skuCount: 420, description: '耳机、音箱、播放器、投影仪', image: '🎧', sortOrder: 3, attributes: [{ name: '连接方式', type: '多选', required: true, options: ['蓝牙', '有线', 'WiFi', 'USB'] }], commissionRate: 8, createdAt: '2023-01-15', updatedAt: '2025-02-20', createdBy: '系统管理员' },
  { id: 'CAT-104', name: '智能穿戴', parentId: 'CAT-001', level: 1, path: '电子产品 > 智能穿戴', status: 'active', productCount: 120, skuCount: 350, description: '智能手表、手环、VR/AR设备', image: '⌚', sortOrder: 4, attributes: [{ name: '兼容系统', type: '多选', required: true, options: ['iOS', 'Android', '鸿蒙'] }], commissionRate: 8, createdAt: '2023-06-01', updatedAt: '2025-02-15', createdBy: '王丽' },
  { id: 'CAT-105', name: '摄影摄像', parentId: 'CAT-001', level: 1, path: '电子产品 > 摄影摄像', status: 'active', productCount: 95, skuCount: 280, description: '相机、镜头、无人机、摄影配件', image: '📷', sortOrder: 5, attributes: [{ name: '传感器类型', type: '单选', required: false, options: ['全画幅', 'APS-C', 'M43', '1英寸'] }], commissionRate: 8, createdAt: '2023-06-01', updatedAt: '2025-01-30', createdBy: '王丽' },
  { id: 'CAT-106', name: '配件耗材', parentId: 'CAT-001', level: 1, path: '电子产品 > 配件耗材', status: 'active', productCount: 245, skuCount: 1300, description: '数据线、充电器、保护壳、存储卡等', image: '🔌', sortOrder: 6, attributes: [], commissionRate: 10, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },

  // Level 1 - 服装鞋帽 sub-categories
  { id: 'CAT-201', name: '男装', parentId: 'CAT-002', level: 1, path: '服装鞋帽 > 男装', status: 'active', productCount: 680, skuCount: 2800, description: '男士上装、裤装、外套', image: '👔', sortOrder: 1, attributes: [{ name: '季节', type: '多选', required: true, options: ['春', '夏', '秋', '冬'] }], commissionRate: 15, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-202', name: '女装', parentId: 'CAT-002', level: 1, path: '服装鞋帽 > 女装', status: 'active', productCount: 920, skuCount: 3600, description: '女士上装、裙装、裤装、外套', image: '👗', sortOrder: 2, attributes: [{ name: '季节', type: '多选', required: true, options: ['春', '夏', '秋', '冬'] }, { name: '风格', type: '多选', required: false, options: ['休闲', '商务', '运动', '潮流', '优雅'] }], commissionRate: 15, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-203', name: '鞋靴', parentId: 'CAT-002', level: 1, path: '服装鞋帽 > 鞋靴', status: 'active', productCount: 420, skuCount: 1500, description: '男鞋、女鞋、运动鞋、靴子', image: '👟', sortOrder: 3, attributes: [{ name: '鞋码范围', type: '文本', required: true }], commissionRate: 15, createdAt: '2023-01-15', updatedAt: '2025-02-28', createdBy: '系统管理员' },
  { id: 'CAT-204', name: '箱包配饰', parentId: 'CAT-002', level: 1, path: '服装鞋帽 > 箱包配饰', status: 'active', productCount: 360, skuCount: 1020, description: '背包、手提包、钱包、围巾、帽子', image: '👜', sortOrder: 4, attributes: [], commissionRate: 15, createdAt: '2023-02-01', updatedAt: '2025-02-20', createdBy: '王丽' },

  // Level 1 - 家居生活 sub-categories
  { id: 'CAT-301', name: '家具', parentId: 'CAT-003', level: 1, path: '家居生活 > 家具', status: 'active', productCount: 210, skuCount: 480, description: '沙发、床、桌椅、柜子', image: '🛋️', sortOrder: 1, attributes: [{ name: '组装方式', type: '单选', required: true, options: ['成品', '需组装', '定制'] }], commissionRate: 12, createdAt: '2023-01-15', updatedAt: '2025-02-10', createdBy: '系统管理员' },
  { id: 'CAT-302', name: '厨房用品', parentId: 'CAT-003', level: 1, path: '家居生活 > 厨房用品', status: 'active', productCount: 345, skuCount: 890, description: '锅具、餐具、厨房电器、收纳', image: '🍳', sortOrder: 2, attributes: [], commissionRate: 12, createdAt: '2023-01-15', updatedAt: '2025-02-15', createdBy: '系统管理员' },
  { id: 'CAT-303', name: '家居装饰', parentId: 'CAT-003', level: 1, path: '家居生活 > 家居装饰', status: 'active', productCount: 180, skuCount: 420, description: '灯具、壁画、花瓶、地毯', image: '🖼️', sortOrder: 3, attributes: [], commissionRate: 12, createdAt: '2023-02-01', updatedAt: '2025-01-30', createdBy: '王丽' },
  { id: 'CAT-304', name: '床上用品', parentId: 'CAT-003', level: 1, path: '家居生活 > 床上用品', status: 'active', productCount: 155, skuCount: 310, description: '被子、枕头、床单、床垫', image: '🛏️', sortOrder: 4, attributes: [{ name: '面料', type: '文本', required: true }], commissionRate: 12, createdAt: '2023-02-01', updatedAt: '2025-02-20', createdBy: '王丽' },

  // Level 2 - deeper sub-categories under 手机通讯
  { id: 'CAT-1011', name: '智能手机', parentId: 'CAT-101', level: 2, path: '电子产品 > 手机通讯 > 智能手机', status: 'active', productCount: 180, skuCount: 520, description: '全品牌智能手机', image: '📱', sortOrder: 1, attributes: [{ name: '5G支持', type: '布尔', required: true }], commissionRate: 5, createdAt: '2023-01-15', updatedAt: '2025-03-01', createdBy: '系统管理员' },
  { id: 'CAT-1012', name: '手机配件', parentId: 'CAT-101', level: 2, path: '电子产品 > 手机通讯 > 手机配件', status: 'active', productCount: 140, skuCount: 370, description: '手机壳、贴膜、支架等', image: '🔧', sortOrder: 2, attributes: [], commissionRate: 10, createdAt: '2023-01-15', updatedAt: '2025-02-28', createdBy: '系统管理员' },

  // Pending review category
  { id: 'CAT-010', name: '宠物用品', parentId: null, level: 0, path: '宠物用品', status: 'pending_review', productCount: 0, skuCount: 0, description: '宠物食品、玩具、用品及医疗', image: '🐾', sortOrder: 10, attributes: [{ name: '适用宠物', type: '多选', required: true, options: ['猫', '狗', '鸟', '鱼', '仓鼠', '其他'] }], commissionRate: 12, createdAt: '2025-02-28', updatedAt: '2025-02-28', createdBy: '孙文静' },
];

// ── SPU / SKU Types ──
export type SpuStatus = 'on_sale' | 'draft' | 'off_shelf' | 'sold_out' | 'pending_review' | 'archived';

export const spuStatusConfig: Record<SpuStatus, StatusConfig> = {
  on_sale:        { label: '在售',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  draft:          { label: '草稿',     color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  off_shelf:      { label: '已下架',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  sold_out:       { label: '售罄',     color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  pending_review: { label: '待审核',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  archived:       { label: '已归档',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
};

export interface SPU {
  id: string;
  name: string;
  categoryId: string;
  categoryPath: string;
  brand: string;
  status: SpuStatus;
  mainImage: string;
  skuCount: number;
  totalStock: number;
  minPrice: number;
  maxPrice: number;
  currency: string;
  salesVolume30d: number;
  revenue30d: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  categoryAttributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SKU {
  id: string;
  spuId: string;
  spuName: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  originalPrice: number;
  costPrice: number;
  currency: string;
  stock: number;
  safetyStock: number;
  salesVolume30d: number;
  barcode: string;
  weight: number;
  status: 'active' | 'inactive' | 'sold_out';
  warehouse: string;
}

export const skuStatusConfig: Record<SKU['status'], StatusConfig> = {
  active:   { label: '可售',   color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  inactive: { label: '停售',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  sold_out: { label: '缺货',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
};

// ── Mock SPU Data ──
export const spuList: SPU[] = [
  { id: 'SPU-10001', name: 'iPhone 15 Pro Max', categoryId: 'CAT-1011', categoryPath: '电子产品 > 手机通讯 > 智能手机', brand: 'Apple', status: 'on_sale', mainImage: '📱', skuCount: 4, totalStock: 328, minPrice: 1199, maxPrice: 1599, currency: 'USD', salesVolume30d: 89, revenue30d: 120560, rating: 4.8, reviewCount: 342, tags: ['热销', '新品'], description: 'Apple iPhone 15 Pro Max，A17 Pro 芯片，钛金属设计', categoryAttributes: { '操作系统': 'iOS 17', '屏幕尺寸': '6.7英寸', '网络制式': '5G', '防水等级': 'IP68' }, createdAt: '2024-09-22', updatedAt: '2025-03-01', createdBy: '王丽' },
  { id: 'SPU-10002', name: 'MacBook Pro 14" M3 Pro', categoryId: 'CAT-102', categoryPath: '电子产品 > 电脑办公', brand: 'Apple', status: 'on_sale', mainImage: '💻', skuCount: 3, totalStock: 156, minPrice: 1549, maxPrice: 2499, currency: 'USD', salesVolume30d: 42, revenue30d: 78400, rating: 4.9, reviewCount: 187, tags: ['热销'], description: 'Apple MacBook Pro 14 英寸，M3 Pro/M3 Max 芯片', categoryAttributes: { '屏幕尺寸': '14.2英寸', '分辨率': '3024×1964', '接口类型': 'Thunderbolt 4,HDMI,SD卡,MagSafe', '电池容量': '70Wh' }, createdAt: '2024-10-30', updatedAt: '2025-02-28', createdBy: '王丽' },
  { id: 'SPU-10003', name: 'Sony WH-1000XM5 降噪耳机', categoryId: 'CAT-103', categoryPath: '电子产品 > 影音设备', brand: 'Sony', status: 'on_sale', mainImage: '🎧', skuCount: 3, totalStock: 245, minPrice: 298, maxPrice: 348, currency: 'USD', salesVolume30d: 67, revenue30d: 21500, rating: 4.7, reviewCount: 523, tags: ['爆款'], description: 'Sony 旗舰降噪耳机，30小时续航，多点连接', categoryAttributes: { '佩戴方式': '头戴式', '降噪类型': '主动降噪', '蓝牙版本': '5.3', '续航时间': '30小时' }, createdAt: '2024-05-15', updatedAt: '2025-03-01', createdBy: '刘建' },
  { id: 'SPU-10004', name: '男士商务休闲夹克', categoryId: 'CAT-201', categoryPath: '服装鞋帽 > 男装', brand: 'MyShop Original', status: 'on_sale', mainImage: '🧥', skuCount: 8, totalStock: 520, minPrice: 89, maxPrice: 129, currency: 'USD', salesVolume30d: 156, revenue30d: 16800, rating: 4.3, reviewCount: 89, tags: ['自有品牌', '秋冬'], description: '商务休闲百搭夹克，防风防水面料', categoryAttributes: { '面料成分': '100%涤纶', '适用季节': '秋,冬', '洗涤方式': '机洗', '版型': '修身' }, createdAt: '2024-08-10', updatedAt: '2025-02-20', createdBy: '周明' },
  { id: 'SPU-10005', name: '女士真丝连衣裙', categoryId: 'CAT-202', categoryPath: '服装鞋帽 > 女装', brand: 'Elegance', status: 'on_sale', mainImage: '👗', skuCount: 6, totalStock: 180, minPrice: 159, maxPrice: 199, currency: 'USD', salesVolume30d: 78, revenue30d: 13400, rating: 4.5, reviewCount: 64, tags: ['春夏', '优雅'], description: '桑蚕丝面料，优雅A字裙，多色可选', categoryAttributes: { '面料成分': '100%桑蚕丝', '适用季节': '春,夏', '洗涤方式': '手洗', '版型': 'A字裙', '裙长': '中长裙' }, createdAt: '2025-01-05', updatedAt: '2025-03-01', createdBy: '周明' },
  { id: 'SPU-10006', name: 'Nike Air Zoom Pegasus 41', categoryId: 'CAT-203', categoryPath: '服装鞋帽 > 鞋靴', brand: 'Nike', status: 'on_sale', mainImage: '👟', skuCount: 10, totalStock: 680, minPrice: 120, maxPrice: 140, currency: 'USD', salesVolume30d: 210, revenue30d: 27300, rating: 4.6, reviewCount: 312, tags: ['热销', '跑步'], description: 'Nike Pegasus 41 跑鞋，React 泡棉中底', categoryAttributes: { '鞋面材质': '工程网面', '鞋底材质': 'React 泡棉+橡胶', '适用场景': '跑步,日常', '闭合方式': '系带' }, createdAt: '2024-07-01', updatedAt: '2025-03-01', createdBy: '刘建' },
  { id: 'SPU-10007', name: '北欧风格布艺沙发', categoryId: 'CAT-301', categoryPath: '家居生活 > 家具', brand: 'HomeStyle', status: 'on_sale', mainImage: '🛋️', skuCount: 4, totalStock: 42, minPrice: 599, maxPrice: 899, currency: 'USD', salesVolume30d: 12, revenue30d: 8900, rating: 4.4, reviewCount: 28, tags: ['大件'], description: '北欧简约风格三人布艺沙发，可拆洗', categoryAttributes: { '材质': '亚麻布面+实木框架', '座位数': '3人', '可拆洗': '是', '风格': '北欧简约' }, createdAt: '2024-04-15', updatedAt: '2025-02-15', createdBy: '王丽' },
  { id: 'SPU-10008', name: 'SK-II 神仙水精华液', categoryId: 'CAT-005', categoryPath: '美妆个护', brand: 'SK-II', status: 'on_sale', mainImage: '💄', skuCount: 3, totalStock: 890, minPrice: 99, maxPrice: 229, currency: 'USD', salesVolume30d: 340, revenue30d: 52600, rating: 4.8, reviewCount: 1203, tags: ['爆款', '护肤'], description: 'PITERA™ 精华，改善肌肤纹理', categoryAttributes: { '产品类型': '精华液', '肤质适用': '所有肤质', '核心成分': 'PITERA™', '产地': '日本' }, createdAt: '2023-06-01', updatedAt: '2025-03-01', createdBy: '孙文静' },
  { id: 'SPU-10009', name: '有机坚果混合礼盒', categoryId: 'CAT-006', categoryPath: '食品生鲜', brand: 'NatureFarm', status: 'on_sale', mainImage: '🥜', skuCount: 2, totalStock: 1200, minPrice: 29, maxPrice: 49, currency: 'USD', salesVolume30d: 420, revenue30d: 16380, rating: 4.6, reviewCount: 256, tags: ['礼盒', '有机'], description: '6种坚果混合，有机认证，精美礼盒包装', categoryAttributes: { '保质期': '12个月', '储存条件': '阴凉干燥处', '有机认证': '是', '过敏原': '坚果类' }, createdAt: '2024-11-01', updatedAt: '2025-02-28', createdBy: '孙文静' },
  { id: 'SPU-10010', name: 'Apple Watch Ultra 2', categoryId: 'CAT-104', categoryPath: '电子产品 > 智能穿戴', brand: 'Apple', status: 'on_sale', mainImage: '⌚', skuCount: 3, totalStock: 95, minPrice: 799, maxPrice: 899, currency: 'USD', salesVolume30d: 28, revenue30d: 23660, rating: 4.7, reviewCount: 98, tags: ['运动', '户外'], description: 'Apple Watch Ultra 2，双频GPS，100米防水', categoryAttributes: { '表盘尺寸': '49mm', '防水等级': '100米', 'GPS': '双频精密GPS', '续航': '36小时' }, createdAt: '2024-09-22', updatedAt: '2025-02-20', createdBy: '王丽' },
  { id: 'SPU-10011', name: 'USB-C 快充线三件套', categoryId: 'CAT-106', categoryPath: '电子产品 > 配件耗材', brand: 'MyShop Basics', status: 'on_sale', mainImage: '🔌', skuCount: 2, totalStock: 3200, minPrice: 12, maxPrice: 18, currency: 'USD', salesVolume30d: 890, revenue30d: 12460, rating: 4.2, reviewCount: 678, tags: ['自有品牌', '高销量'], description: '0.5m/1m/2m 三件套，支持 100W PD 快充', categoryAttributes: { '接口类型': 'USB-C to USB-C', '最大功率': '100W PD', '线材长度': '0.5m,1m,2m', '认证': 'MFi,USB-IF' }, createdAt: '2024-03-01', updatedAt: '2025-03-01', createdBy: '刘建' },
  { id: 'SPU-10012', name: 'DJI Mini 4 Pro 无人机', categoryId: 'CAT-105', categoryPath: '电子产品 > 摄影摄像', brand: 'DJI', status: 'on_sale', mainImage: '📷', skuCount: 2, totalStock: 68, minPrice: 759, maxPrice: 1099, currency: 'USD', salesVolume30d: 15, revenue30d: 13485, rating: 4.8, reviewCount: 76, tags: ['新品'], description: 'DJI Mini 4 Pro，4K HDR 视频，全向避障', categoryAttributes: { '视频分辨率': '4K HDR', '飞行时间': '34分钟', '重量': '249g', '避障': '全向避障' }, createdAt: '2024-11-15', updatedAt: '2025-02-28', createdBy: '刘建' },
  // Draft / pending
  { id: 'SPU-10013', name: '智能宠物喂食器', categoryId: 'CAT-010', categoryPath: '宠物用品', brand: 'PetTech', status: 'draft', mainImage: '🐾', skuCount: 0, totalStock: 0, minPrice: 0, maxPrice: 0, currency: 'USD', salesVolume30d: 0, revenue30d: 0, rating: 0, reviewCount: 0, tags: ['新品'], description: 'APP远程控制，定时定量喂食，语音呼唤', categoryAttributes: { '连接方式': 'WiFi', '容量': '4L', '供电': 'USB-C 适配器' }, createdAt: '2025-02-28', updatedAt: '2025-02-28', createdBy: '孙文静' },
  { id: 'SPU-10014', name: '电动牙刷套装', categoryId: 'CAT-005', categoryPath: '美妆个护', brand: 'OralCare', status: 'pending_review', mainImage: '🪥', skuCount: 3, totalStock: 500, minPrice: 39, maxPrice: 69, currency: 'USD', salesVolume30d: 0, revenue30d: 0, rating: 0, reviewCount: 0, tags: ['待上架'], description: '声波电动牙刷，5种模式，附赠8个刷头', categoryAttributes: { '产品类型': '声波电动牙刷', '模式数': '5', '刷头数量': '8个', '充电方式': 'USB-C' }, createdAt: '2025-02-25', updatedAt: '2025-03-01', createdBy: '周明' },
  { id: 'SPU-10015', name: '儿童益智积木套装', categoryId: 'CAT-008', categoryPath: '母婴玩具', brand: 'KidsBuild', status: 'on_sale', mainImage: '🧸', skuCount: 3, totalStock: 380, minPrice: 24, maxPrice: 59, currency: 'USD', salesVolume30d: 95, revenue30d: 3800, rating: 4.5, reviewCount: 42, tags: ['教育'], description: '环保ABS材质，120/240/500片装', categoryAttributes: { '适用年龄': '3岁以上', '材质': '环保ABS', '认证': 'CPC,ASTM F963', '是否含小零件': '是' }, createdAt: '2024-09-01', updatedAt: '2025-02-20', createdBy: '孙文静' },
  { id: 'SPU-10016', name: '304不锈钢炒锅', categoryId: 'CAT-302', categoryPath: '家居生活 > 厨房用品', brand: 'ChefPro', status: 'sold_out', mainImage: '🍳', skuCount: 2, totalStock: 0, minPrice: 45, maxPrice: 65, currency: 'USD', salesVolume30d: 180, revenue30d: 9900, rating: 4.4, reviewCount: 156, tags: ['缺货'], description: '304不锈钢，蜂窝不粘，电磁炉通用', categoryAttributes: { '材质': '304不锈钢', '不粘涂层': '蜂窝不粘', '适用灶具': '燃气灶,电磁炉,电陶炉', '是否含盖': '是' }, createdAt: '2024-06-01', updatedAt: '2025-03-01', createdBy: '王丽' },
];

// ── Mock SKU Data ──
export const skuList: SKU[] = [
  // iPhone 15 Pro Max SKUs
  { id: 'SKU-100011', spuId: 'SPU-10001', spuName: 'iPhone 15 Pro Max', name: '256GB 原色钛金属', attributes: { '存储': '256GB', '颜色': '原色钛金属' }, price: 1199, originalPrice: 1199, costPrice: 980, currency: 'USD', stock: 85, safetyStock: 20, salesVolume30d: 32, barcode: '1940001000111', weight: 221, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100012', spuId: 'SPU-10001', spuName: 'iPhone 15 Pro Max', name: '512GB 原色钛金属', attributes: { '存储': '512GB', '颜色': '原色钛金属' }, price: 1399, originalPrice: 1399, costPrice: 1120, currency: 'USD', stock: 62, safetyStock: 15, salesVolume30d: 24, barcode: '1940001000112', weight: 221, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100013', spuId: 'SPU-10001', spuName: 'iPhone 15 Pro Max', name: '1TB 蓝色钛金属', attributes: { '存储': '1TB', '颜色': '蓝色钛金属' }, price: 1599, originalPrice: 1599, costPrice: 1280, currency: 'USD', stock: 28, safetyStock: 10, salesVolume30d: 18, barcode: '1940001000113', weight: 221, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100014', spuId: 'SPU-10001', spuName: 'iPhone 15 Pro Max', name: '256GB 黑色钛金属', attributes: { '存储': '256GB', '颜色': '黑色钛金属' }, price: 1199, originalPrice: 1199, costPrice: 980, currency: 'USD', stock: 153, safetyStock: 20, salesVolume30d: 15, barcode: '1940001000114', weight: 221, status: 'active', warehouse: '华东仓' },
  // MacBook Pro SKUs
  { id: 'SKU-100021', spuId: 'SPU-10002', spuName: 'MacBook Pro 14" M3 Pro', name: 'M3 Pro 18GB/512GB 深空黑', attributes: { '芯片': 'M3 Pro', '内存': '18GB', '存储': '512GB', '颜色': '深空黑' }, price: 1549, originalPrice: 1549, costPrice: 1280, currency: 'USD', stock: 45, safetyStock: 10, salesVolume30d: 18, barcode: '1940001000211', weight: 1600, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100022', spuId: 'SPU-10002', spuName: 'MacBook Pro 14" M3 Pro', name: 'M3 Pro 36GB/1TB 银色', attributes: { '芯片': 'M3 Pro', '内存': '36GB', '存储': '1TB', '颜色': '银色' }, price: 1999, originalPrice: 1999, costPrice: 1650, currency: 'USD', stock: 38, safetyStock: 8, salesVolume30d: 14, barcode: '1940001000212', weight: 1600, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100023', spuId: 'SPU-10002', spuName: 'MacBook Pro 14" M3 Pro', name: 'M3 Max 48GB/1TB 深空黑', attributes: { '芯片': 'M3 Max', '内存': '48GB', '存储': '1TB', '颜色': '深空黑' }, price: 2499, originalPrice: 2499, costPrice: 2050, currency: 'USD', stock: 73, safetyStock: 5, salesVolume30d: 10, barcode: '1940001000213', weight: 1600, status: 'active', warehouse: '华东仓' },
  // Sony WH-1000XM5 SKUs
  { id: 'SKU-100031', spuId: 'SPU-10003', spuName: 'Sony WH-1000XM5', name: '黑色', attributes: { '颜色': '黑色' }, price: 348, originalPrice: 398, costPrice: 240, currency: 'USD', stock: 120, safetyStock: 30, salesVolume30d: 35, barcode: '1940001000311', weight: 250, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100032', spuId: 'SPU-10003', spuName: 'Sony WH-1000XM5', name: '银色', attributes: { '颜色': '银色' }, price: 348, originalPrice: 398, costPrice: 240, currency: 'USD', stock: 85, safetyStock: 20, salesVolume30d: 22, barcode: '1940001000312', weight: 250, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100033', spuId: 'SPU-10003', spuName: 'Sony WH-1000XM5', name: '午夜蓝色', attributes: { '颜色': '午夜蓝' }, price: 298, originalPrice: 398, costPrice: 240, currency: 'USD', stock: 40, safetyStock: 15, salesVolume30d: 10, barcode: '1940001000313', weight: 250, status: 'active', warehouse: '欧洲仓' },
  // Nike Pegasus SKUs (sample)
  { id: 'SKU-100061', spuId: 'SPU-10006', spuName: 'Nike Air Zoom Pegasus 41', name: '黑/白 US8', attributes: { '颜色': '黑/白', '尺码': 'US8' }, price: 120, originalPrice: 140, costPrice: 72, currency: 'USD', stock: 65, safetyStock: 10, salesVolume30d: 28, barcode: '1940001000611', weight: 280, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100062', spuId: 'SPU-10006', spuName: 'Nike Air Zoom Pegasus 41', name: '黑/白 US9', attributes: { '颜色': '黑/白', '尺码': 'US9' }, price: 120, originalPrice: 140, costPrice: 72, currency: 'USD', stock: 78, safetyStock: 10, salesVolume30d: 35, barcode: '1940001000612', weight: 290, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100063', spuId: 'SPU-10006', spuName: 'Nike Air Zoom Pegasus 41', name: '灰/绿 US9', attributes: { '颜色': '灰/绿', '尺码': 'US9' }, price: 130, originalPrice: 140, costPrice: 72, currency: 'USD', stock: 52, safetyStock: 10, salesVolume30d: 22, barcode: '1940001000613', weight: 290, status: 'active', warehouse: '华西仓' },
  { id: 'SKU-100064', spuId: 'SPU-10006', spuName: 'Nike Air Zoom Pegasus 41', name: '黑/白 US10', attributes: { '颜色': '黑/白', '尺码': 'US10' }, price: 120, originalPrice: 140, costPrice: 72, currency: 'USD', stock: 0, safetyStock: 10, salesVolume30d: 40, barcode: '1940001000614', weight: 300, status: 'sold_out', warehouse: '华东仓' },
  // SK-II SKUs
  { id: 'SKU-100081', spuId: 'SPU-10008', spuName: 'SK-II 神仙水精华液', name: '75ml', attributes: { '规格': '75ml' }, price: 99, originalPrice: 119, costPrice: 55, currency: 'USD', stock: 350, safetyStock: 50, salesVolume30d: 120, barcode: '1940001000811', weight: 150, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100082', spuId: 'SPU-10008', spuName: 'SK-II 神仙水精华液', name: '160ml', attributes: { '规格': '160ml' }, price: 179, originalPrice: 199, costPrice: 95, currency: 'USD', stock: 280, safetyStock: 40, salesVolume30d: 150, barcode: '1940001000812', weight: 250, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100083', spuId: 'SPU-10008', spuName: 'SK-II 神仙水精华液', name: '230ml', attributes: { '规格': '230ml' }, price: 229, originalPrice: 259, costPrice: 125, currency: 'USD', stock: 260, safetyStock: 30, salesVolume30d: 70, barcode: '1940001000813', weight: 340, status: 'active', warehouse: '华东仓' },
  // USB-C 线 SKUs
  { id: 'SKU-100111', spuId: 'SPU-10011', spuName: 'USB-C 快充线三件套', name: '黑色三件套', attributes: { '颜色': '黑色' }, price: 12, originalPrice: 15, costPrice: 4.5, currency: 'USD', stock: 1800, safetyStock: 200, salesVolume30d: 520, barcode: '1940001001111', weight: 85, status: 'active', warehouse: '华东仓' },
  { id: 'SKU-100112', spuId: 'SPU-10011', spuName: 'USB-C 快充线三件套', name: '白色三件套', attributes: { '颜色': '白色' }, price: 12, originalPrice: 15, costPrice: 4.5, currency: 'USD', stock: 1400, safetyStock: 200, salesVolume30d: 370, barcode: '1940001001112', weight: 85, status: 'active', warehouse: '华东仓' },
  // 不锈钢炒锅 (sold out)
  { id: 'SKU-100161', spuId: 'SPU-10016', spuName: '304不锈钢炒锅', name: '30cm', attributes: { '尺寸': '30cm' }, price: 45, originalPrice: 55, costPrice: 22, currency: 'USD', stock: 0, safetyStock: 20, salesVolume30d: 100, barcode: '1940001001611', weight: 1200, status: 'sold_out', warehouse: '华东仓' },
  { id: 'SKU-100162', spuId: 'SPU-10016', spuName: '304不锈钢炒锅', name: '34cm', attributes: { '尺寸': '34cm' }, price: 65, originalPrice: 75, costPrice: 30, currency: 'USD', stock: 0, safetyStock: 15, salesVolume30d: 80, barcode: '1940001001612', weight: 1500, status: 'sold_out', warehouse: '华东仓' },
];

// ── Promotion Types ──
export type PromotionType = 'flash_sale' | 'bundle' | 'buy_x_get_y' | 'percentage_off' | 'fixed_off' | 'free_shipping';
export type PromotionStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'ended' | 'archived';

export const promotionTypeConfig: Record<PromotionType, StatusConfig> = {
  flash_sale:      { label: '限时秒杀', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  bundle:          { label: '组合优惠', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  buy_x_get_y:     { label: '满赠活动', color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  percentage_off:  { label: '折扣', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  fixed_off:       { label: '满减', color: '#ce9178', bgColor: 'rgba(206,145,120,0.15)' },
  free_shipping:   { label: '包邮', color: '#9cdcfe', bgColor: 'rgba(156,220,254,0.15)' },
};

export const promotionStatusConfig: Record<PromotionStatus, StatusConfig> = {
  draft:     { label: '草稿',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  scheduled: { label: '待开始', color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  active:    { label: '进行中', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  paused:    { label: '已暂停', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  ended:     { label: '已结束', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  archived:  { label: '已归档', color: '#4e4e4e', bgColor: 'rgba(78,78,78,0.15)' },
};

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  status: PromotionStatus;
  description: string;
  startAt: string;
  endAt: string;
  scope: 'all' | 'category' | 'product' | 'sku';
  scopeIds: string[];
  scopeNames: string[];
  channels: string[];
  discountValue: number;
  discountUnit: '%' | 'fixed' | 'free';
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usedCount: number;
  budget: number;
  spent: number;
  orderCount: number;
  revenue: number;
  stackable: boolean;
  priority: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const promotions: Promotion[] = [
  { id: 'PROMO-001', name: '春季大促 - 全场8折', type: 'percentage_off', status: 'active', description: '春季限时折扣，全品类参与', startAt: '2025-03-01 00:00', endAt: '2025-03-15 23:59', scope: 'all', scopeIds: [], scopeNames: ['全部商品'], channels: ['全渠道'], discountValue: 20, discountUnit: '%', minOrderAmount: 50, maxDiscountAmount: 100, usageLimit: 0, usedCount: 1842, budget: 50000, spent: 32650, orderCount: 1842, revenue: 186400, stackable: false, priority: 10, createdBy: '王丽', createdAt: '2025-02-25', updatedAt: '2025-03-01' },
  { id: 'PROMO-002', name: '电子产品满300减50', type: 'fixed_off', status: 'active', description: '电子产品专区满减活动', startAt: '2025-03-01 00:00', endAt: '2025-03-31 23:59', scope: 'category', scopeIds: ['CAT-001'], scopeNames: ['电子产品'], channels: ['官网', '亚马逊'], discountValue: 50, discountUnit: 'fixed', minOrderAmount: 300, maxDiscountAmount: 50, usageLimit: 5000, usedCount: 678, budget: 25000, spent: 12400, orderCount: 678, revenue: 98500, stackable: false, priority: 20, createdBy: '刘建', createdAt: '2025-02-28', updatedAt: '2025-03-01' },
  { id: 'PROMO-003', name: 'iPhone 限时秒杀', type: 'flash_sale', status: 'scheduled', description: 'iPhone 15 系列限时优惠', startAt: '2025-03-10 10:00', endAt: '2025-03-10 22:00', scope: 'product', scopeIds: ['SPU-10001'], scopeNames: ['iPhone 15 Pro Max'], channels: ['官网'], discountValue: 15, discountUnit: '%', minOrderAmount: 0, maxDiscountAmount: 200, usageLimit: 100, usedCount: 0, budget: 20000, spent: 0, orderCount: 0, revenue: 0, stackable: false, priority: 5, createdBy: '王丽', createdAt: '2025-03-01', updatedAt: '2025-03-01' },
  { id: 'PROMO-004', name: '买2送1 — 快充线', type: 'buy_x_get_y', status: 'active', description: '买两组快充线送一组', startAt: '2025-02-15 00:00', endAt: '2025-04-15 23:59', scope: 'product', scopeIds: ['SPU-10011'], scopeNames: ['USB-C 快充线三件套'], channels: ['全渠道'], discountValue: 1, discountUnit: 'free', minOrderAmount: 0, maxDiscountAmount: 18, usageLimit: 0, usedCount: 420, budget: 8000, spent: 5040, orderCount: 420, revenue: 10080, stackable: true, priority: 30, createdBy: '刘建', createdAt: '2025-02-15', updatedAt: '2025-03-01' },
  { id: 'PROMO-005', name: '服装全场包邮', type: 'free_shipping', status: 'active', description: '服装鞋帽类目免运费', startAt: '2025-03-01 00:00', endAt: '2025-03-31 23:59', scope: 'category', scopeIds: ['CAT-002'], scopeNames: ['服装鞋帽'], channels: ['官网', 'Shopee'], discountValue: 0, discountUnit: 'free', minOrderAmount: 0, maxDiscountAmount: 0, usageLimit: 0, usedCount: 890, budget: 15000, spent: 6230, orderCount: 890, revenue: 45600, stackable: true, priority: 50, createdBy: '周明', createdAt: '2025-03-01', updatedAt: '2025-03-01' },
  { id: 'PROMO-006', name: '护肤品组合套装', type: 'bundle', status: 'paused', description: 'SK-II 神仙水+洗面奶组合优惠', startAt: '2025-02-20 00:00', endAt: '2025-03-20 23:59', scope: 'product', scopeIds: ['SPU-10008'], scopeNames: ['SK-II 神仙水精华液'], channels: ['官网'], discountValue: 25, discountUnit: '%', minOrderAmount: 0, maxDiscountAmount: 80, usageLimit: 500, usedCount: 156, budget: 12000, spent: 8900, orderCount: 156, revenue: 28400, stackable: false, priority: 15, createdBy: '孙文静', createdAt: '2025-02-20', updatedAt: '2025-03-01' },
  { id: 'PROMO-007', name: '新用户首单9折', type: 'percentage_off', status: 'active', description: '仅限新注册用户首单使用', startAt: '2025-01-01 00:00', endAt: '2025-06-30 23:59', scope: 'all', scopeIds: [], scopeNames: ['全部商品'], channels: ['官网', 'App'], discountValue: 10, discountUnit: '%', minOrderAmount: 30, maxDiscountAmount: 50, usageLimit: 0, usedCount: 2340, budget: 100000, spent: 45600, orderCount: 2340, revenue: 320000, stackable: false, priority: 100, createdBy: '王丽', createdAt: '2025-01-01', updatedAt: '2025-03-01' },
  { id: 'PROMO-008', name: '双11预热 - 全场7折', type: 'percentage_off', status: 'ended', description: '双11大促预热活动', startAt: '2024-11-01 00:00', endAt: '2024-11-11 23:59', scope: 'all', scopeIds: [], scopeNames: ['全部商品'], channels: ['全渠道'], discountValue: 30, discountUnit: '%', minOrderAmount: 100, maxDiscountAmount: 200, usageLimit: 0, usedCount: 8900, budget: 200000, spent: 178000, orderCount: 8900, revenue: 1450000, stackable: false, priority: 1, createdBy: '王丽', createdAt: '2024-10-20', updatedAt: '2024-11-12' },
];

// ── Coupon Types ──
export type CouponType = 'percentage' | 'fixed' | 'free_shipping';
export type CouponStatus = 'draft' | 'active' | 'paused' | 'expired' | 'depleted';

export const couponTypeConfig: Record<CouponType, StatusConfig> = {
  percentage:    { label: '折扣券', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  fixed:         { label: '满减券', color: '#ce9178', bgColor: 'rgba(206,145,120,0.15)' },
  free_shipping: { label: '包邮券', color: '#9cdcfe', bgColor: 'rgba(156,220,254,0.15)' },
};

export const couponStatusConfig: Record<CouponStatus, StatusConfig> = {
  draft:    { label: '草稿',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  active:   { label: '发放中', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  paused:   { label: '已暂停', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  expired:  { label: '已过期', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  depleted: { label: '已领完', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
};

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  status: CouponStatus;
  description: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  totalQty: number;
  issuedQty: number;
  usedQty: number;
  perUserLimit: number;
  scope: 'all' | 'category' | 'product';
  scopeNames: string[];
  channels: string[];
  startAt: string;
  endAt: string;
  validDays: number;
  stackable: boolean;
  newUserOnly: boolean;
  revenue: number;
  createdBy: string;
  createdAt: string;
}

// ── Customer Types ──
export type CustomerStatus = 'active' | 'inactive' | 'blocked' | 'pending_verification';
export type CustomerTier = 'regular' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type RFMSegment = 'champions' | 'loyal' | 'promising' | 'new' | 'need_attention' | 'about_to_sleep' | 'at_risk' | 'cant_lose' | 'hibernating' | 'lost';

export const customerStatusConfig: Record<CustomerStatus, StatusConfig> = {
  active:               { label: '活跃',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  inactive:             { label: '不活跃',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  blocked:              { label: '已封禁',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  pending_verification: { label: '待验证',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
};

export const customerTierConfig: Record<CustomerTier, StatusConfig> = {
  regular:  { label: '普通',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  silver:   { label: '白银',   color: '#9cdcfe', bgColor: 'rgba(156,220,254,0.15)' },
  gold:     { label: '黄金',   color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  platinum: { label: '铂金',   color: '#c586c0', bgColor: 'rgba(197,134,192,0.15)' },
  diamond:  { label: '钻石',   color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
};

export const rfmSegmentConfig: Record<RFMSegment, StatusConfig> = {
  champions:      { label: '冠军客户',   color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
  loyal:          { label: '忠实客户',   color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  promising:      { label: '潜力客户',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  new:            { label: '新客户',     color: '#007acc', bgColor: 'rgba(0,122,204,0.15)' },
  need_attention: { label: '需关注',     color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  about_to_sleep: { label: '即将沉睡',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  at_risk:        { label: '有流失风险', color: '#ce9178', bgColor: 'rgba(206,145,120,0.15)' },
  cant_lose:      { label: '不能失去',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  hibernating:    { label: '休眠客户',   color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  lost:           { label: '已流失',     color: '#4e4e4e', bgColor: 'rgba(78,78,78,0.15)' },
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  gender: '男' | '女' | '未知';
  birthday: string;
  status: CustomerStatus;
  tier: CustomerTier;
  registeredAt: string;
  lastLoginAt: string;
  lastOrderAt: string;
  registrationChannel: string;
  country: string;
  region: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  currency: string;
  avgOrderValue: number;
  returnRate: number;
  tags: string[];
  rfmRecency: number;
  rfmFrequency: number;
  rfmMonetary: number;
  rfmSegment: RFMSegment;
  loyaltyPoints: number;
  couponsHeld: number;
  addressCount: number;
  notes: string;
}

export const customers: Customer[] = [
  { id: 'CUS-10001', name: '张晓明', email: 'zhangxm@example.com', phone: '+86 138****1234', avatar: '👨‍💼', gender: '男', birthday: '1988-03-15', status: 'active', tier: 'diamond', registeredAt: '2022-06-10', lastLoginAt: '2025-03-01 14:30', lastOrderAt: '2025-03-01 09:15', registrationChannel: '官网', country: 'CN', region: '华东', city: '上海', totalOrders: 87, totalSpent: 34560, currency: 'USD', avgOrderValue: 397.24, returnRate: 2.3, tags: ['VIP', '高价值', '品牌忠实'], rfmRecency: 5, rfmFrequency: 5, rfmMonetary: 5, rfmSegment: 'champions', loyaltyPoints: 28900, couponsHeld: 3, addressCount: 4, notes: '公司高管，偏好电子产品和高端服装。VIP专属客服：王丽。' },
  { id: 'CUS-10002', name: '陈博', email: 'chenbo@example.com', phone: '+86 139****5678', avatar: '👨', gender: '男', birthday: '1995-07-22', status: 'active', tier: 'gold', registeredAt: '2023-08-15', lastLoginAt: '2025-03-01 10:22', lastOrderAt: '2025-03-01 10:22', registrationChannel: 'App', country: 'CN', region: '华北', city: '北京', totalOrders: 23, totalSpent: 12800, currency: 'USD', avgOrderValue: 556.52, returnRate: 8.7, tags: ['高价值', '需审核'], rfmRecency: 5, rfmFrequency: 3, rfmMonetary: 5, rfmSegment: 'loyal', loyaltyPoints: 9600, couponsHeld: 1, addressCount: 2, notes: '偏好高单价电子产品。最近订单触发风控审核。' },
  { id: 'CUS-10003', name: '李婷婷', email: 'litt@example.com', phone: '+86 136****9012', avatar: '👩', gender: '女', birthday: '1992-11-08', status: 'active', tier: 'platinum', registeredAt: '2023-01-20', lastLoginAt: '2025-03-01 08:45', lastOrderAt: '2025-03-01 08:45', registrationChannel: '平台', country: 'CN', region: '华南', city: '深圳', totalOrders: 56, totalSpent: 18920, currency: 'USD', avgOrderValue: 337.86, returnRate: 5.4, tags: ['美妆达人', '社交分享'], rfmRecency: 5, rfmFrequency: 4, rfmMonetary: 4, rfmSegment: 'loyal', loyaltyPoints: 15200, couponsHeld: 5, addressCount: 3, notes: '活跃社交媒体用户，经常分享购物体验。偏好美妆和服装。' },
  { id: 'CUS-10004', name: '赵德明', email: 'zhaodm@example.com', phone: '+49 170****3456', avatar: '👨‍🔬', gender: '男', birthday: '1985-05-30', status: 'active', tier: 'gold', registeredAt: '2023-09-01', lastLoginAt: '2025-03-01 07:30', lastOrderAt: '2025-03-01 07:30', registrationChannel: '官网', country: 'DE', region: '欧洲', city: '柏林', totalOrders: 31, totalSpent: 15670, currency: 'EUR', avgOrderValue: 505.48, returnRate: 3.2, tags: ['跨境', '运动爱好者'], rfmRecency: 5, rfmFrequency: 3, rfmMonetary: 4, rfmSegment: 'loyal', loyaltyPoints: 11800, couponsHeld: 2, addressCount: 2, notes: '德国客户，偏好运动户外和电子产品。' },
  { id: 'CUS-10005', name: '孙文静', email: 'sunwj@example.com', phone: '+86 158****7890', avatar: '👩‍🎨', gender: '女', birthday: '1998-01-12', status: 'active', tier: 'silver', registeredAt: '2024-06-15', lastLoginAt: '2025-03-01 11:00', lastOrderAt: '2025-03-01 11:00', registrationChannel: 'App', country: 'CN', region: '华东', city: '杭州', totalOrders: 12, totalSpent: 2340, currency: 'USD', avgOrderValue: 195.00, returnRate: 16.7, tags: ['新晋用户', '退货率高'], rfmRecency: 5, rfmFrequency: 2, rfmMonetary: 2, rfmSegment: 'promising', loyaltyPoints: 1800, couponsHeld: 4, addressCount: 1, notes: '年轻用户，退货率偏高，主要退货原因：尺码不合。建议推送尺码指南。' },
  { id: 'CUS-10006', name: '李帆', email: 'lifan@example.com', phone: '+86 131****2345', avatar: '👨‍💻', gender: '男', birthday: '1990-09-18', status: 'active', tier: 'silver', registeredAt: '2024-02-28', lastLoginAt: '2025-03-01 10:45', lastOrderAt: '2025-02-28 16:20', registrationChannel: '官网', country: 'CN', region: '华东', city: '南京', totalOrders: 8, totalSpent: 1890, currency: 'USD', avgOrderValue: 236.25, returnRate: 0, tags: ['SLA敏感'], rfmRecency: 4, rfmFrequency: 2, rfmMonetary: 2, rfmSegment: 'promising', loyaltyPoints: 1400, couponsHeld: 2, addressCount: 1, notes: '对物流时效敏感。最近一笔订单出现SLA超期，已安排客服跟进。' },
  { id: 'CUS-10007', name: '陈恩慧', email: 'chenh@example.sg', phone: '+65 9***4567', avatar: '👩‍💼', gender: '女', birthday: '1993-04-25', status: 'active', tier: 'gold', registeredAt: '2024-01-10', lastLoginAt: '2025-03-01 06:15', lastOrderAt: '2025-03-01 06:15', registrationChannel: '平台', country: 'SG', region: '东南亚', city: '新加坡', totalOrders: 42, totalSpent: 9870, currency: 'SGD', avgOrderValue: 235.00, returnRate: 4.8, tags: ['跨境', '复购高'], rfmRecency: 5, rfmFrequency: 4, rfmMonetary: 3, rfmSegment: 'loyal', loyaltyPoints: 7200, couponsHeld: 3, addressCount: 2, notes: '新加坡活跃客户，通过Shopee渠道购买频繁。' },
  { id: 'CUS-10008', name: '朴亨俊', email: 'park@example.com', phone: '+1 213****6789', avatar: '👨', gender: '男', birthday: '1991-12-03', status: 'active', tier: 'silver', registeredAt: '2024-05-20', lastLoginAt: '2025-03-01 09:45', lastOrderAt: '2025-03-01 09:45', registrationChannel: '官网', country: 'US', region: '北美', city: '洛杉矶', totalOrders: 15, totalSpent: 4560, currency: 'USD', avgOrderValue: 304.00, returnRate: 6.7, tags: ['跨境'], rfmRecency: 5, rfmFrequency: 2, rfmMonetary: 3, rfmSegment: 'promising', loyaltyPoints: 3400, couponsHeld: 1, addressCount: 1, notes: '美国韩裔客户，偏好电子产品和运动装备。' },
  { id: 'CUS-10009', name: '马可', email: 'marco@example.it', phone: '+39 333****0123', avatar: '👨‍🍳', gender: '男', birthday: '1987-06-14', status: 'inactive', tier: 'regular', registeredAt: '2024-08-10', lastLoginAt: '2025-02-15 22:00', lastOrderAt: '2025-02-28 22:00', registrationChannel: 'App', country: 'IT', region: '欧洲', city: '米兰', totalOrders: 3, totalSpent: 245, currency: 'EUR', avgOrderValue: 81.67, returnRate: 33.3, tags: ['跨境', '退货率高', '低活跃'], rfmRecency: 3, rfmFrequency: 1, rfmMonetary: 1, rfmSegment: 'about_to_sleep', loyaltyPoints: 180, couponsHeld: 0, addressCount: 1, notes: '意大利客户，近期活跃度下降。最后一笔订单已取消并退款。' },
  { id: 'CUS-10010', name: '杰克·汤普森', email: 'jack@example.com', phone: '+1 415****4321', avatar: '👨‍⚕️', gender: '男', birthday: '1983-08-22', status: 'active', tier: 'platinum', registeredAt: '2023-03-15', lastLoginAt: '2025-03-01 12:00', lastOrderAt: '2025-03-01 12:00', registrationChannel: '官网', country: 'US', region: '北美', city: '旧金山', totalOrders: 48, totalSpent: 28900, currency: 'USD', avgOrderValue: 602.08, returnRate: 2.1, tags: ['VIP', '高价值', '优先'], rfmRecency: 5, rfmFrequency: 4, rfmMonetary: 5, rfmSegment: 'champions', loyaltyPoints: 23400, couponsHeld: 2, addressCount: 3, notes: '高净值客户。多次购买高端电子产品。地址信息需要确认公寓号。' },
  { id: 'CUS-10011', name: '凯伦·怀特', email: 'karen@example.com', phone: '+1 312****8765', avatar: '👩‍🏫', gender: '女', birthday: '1996-02-28', status: 'active', tier: 'regular', registeredAt: '2025-02-20', lastLoginAt: '2025-03-01 13:10', lastOrderAt: '2025-03-01 13:10', registrationChannel: '官网', country: 'US', region: '北美', city: '芝加哥', totalOrders: 1, totalSpent: 42, currency: 'USD', avgOrderValue: 42.00, returnRate: 0, tags: ['新客户'], rfmRecency: 5, rfmFrequency: 1, rfmMonetary: 1, rfmSegment: 'new', loyaltyPoints: 42, couponsHeld: 1, addressCount: 1, notes: '新注册客户，首单草稿中。' },
  { id: 'CUS-10012', name: '雷奥·加西亚', email: 'leo@example.com', phone: '+1 786****5432', avatar: '👨‍🎓', gender: '男', birthday: '1994-10-05', status: 'active', tier: 'silver', registeredAt: '2024-01-08', lastLoginAt: '2025-03-01 08:00', lastOrderAt: '2025-02-27 08:00', registrationChannel: '平台', country: 'US', region: '北美', city: '迈阿密', totalOrders: 18, totalSpent: 3420, currency: 'USD', avgOrderValue: 190.00, returnRate: 5.6, tags: [], rfmRecency: 4, rfmFrequency: 2, rfmMonetary: 2, rfmSegment: 'need_attention', loyaltyPoints: 2560, couponsHeld: 2, addressCount: 1, notes: '购买频率稳定但客单价偏低，可推送升级套装。' },
  { id: 'CUS-10013', name: '王丽', email: 'wangli@myshop.com', phone: '+86 137****6543', avatar: '👩‍💻', gender: '女', birthday: '1989-07-19', status: 'active', tier: 'diamond', registeredAt: '2022-01-01', lastLoginAt: '2025-03-01 15:30', lastOrderAt: '2025-02-20 10:00', registrationChannel: '官网', country: 'CN', region: '华东', city: '上海', totalOrders: 120, totalSpent: 52300, currency: 'USD', avgOrderValue: 435.83, returnRate: 1.7, tags: ['内部员工', 'VIP', '品牌大使'], rfmRecency: 4, rfmFrequency: 5, rfmMonetary: 5, rfmSegment: 'champions', loyaltyPoints: 42600, couponsHeld: 6, addressCount: 5, notes: '内部员工账户，同时也是品牌大使。最高等级VIP。' },
  { id: 'CUS-10014', name: '刘建', email: 'liujian@myshop.com', phone: '+86 155****8901', avatar: '👨‍🔧', gender: '男', birthday: '1986-11-30', status: 'active', tier: 'gold', registeredAt: '2023-02-15', lastLoginAt: '2025-03-01 11:05', lastOrderAt: '2025-01-15 14:00', registrationChannel: '官网', country: 'CN', region: '华北', city: '北京', totalOrders: 35, totalSpent: 16780, currency: 'USD', avgOrderValue: 479.43, returnRate: 2.9, tags: ['内部员工', '电子达人'], rfmRecency: 3, rfmFrequency: 3, rfmMonetary: 4, rfmSegment: 'need_attention', loyaltyPoints: 12800, couponsHeld: 2, addressCount: 2, notes: '内部员工账户。最近购买频率下降，上次购买距今超过45天。' },
  { id: 'CUS-10015', name: '周明', email: 'zhouming@myshop.com', phone: '+86 189****2109', avatar: '👨‍🏭', gender: '男', birthday: '1992-04-10', status: 'active', tier: 'silver', registeredAt: '2023-09-01', lastLoginAt: '2025-02-28 13:00', lastOrderAt: '2024-12-20 09:00', registrationChannel: '官网', country: 'CN', region: '欧洲', city: '柏林', totalOrders: 14, totalSpent: 5230, currency: 'EUR', avgOrderValue: 373.57, returnRate: 7.1, tags: ['内部员工', '跨境'], rfmRecency: 2, rfmFrequency: 2, rfmMonetary: 3, rfmSegment: 'about_to_sleep', loyaltyPoints: 3900, couponsHeld: 1, addressCount: 2, notes: '常驻欧洲的内部员工。最近3个月无新订单。' },
  { id: 'CUS-10016', name: '林小雨', email: 'linxy@example.com', phone: '+86 150****3210', avatar: '👩‍🎤', gender: '女', birthday: '2000-08-08', status: 'active', tier: 'silver', registeredAt: '2024-09-01', lastLoginAt: '2025-02-28 20:00', lastOrderAt: '2025-02-25 18:30', registrationChannel: '微信小程序', country: 'CN', region: '华中', city: '武汉', totalOrders: 22, totalSpent: 3890, currency: 'CNY', avgOrderValue: 176.82, returnRate: 13.6, tags: ['Z世代', '抖音用户', '退货率高'], rfmRecency: 4, rfmFrequency: 3, rfmMonetary: 2, rfmSegment: 'promising', loyaltyPoints: 2900, couponsHeld: 7, addressCount: 2, notes: 'Z世代用户，主要通过微信小程序和抖音渠道购买。退货率偏高，偏好服装和美妆。' },
  { id: 'CUS-10017', name: '田中太郎', email: 'tanaka@example.jp', phone: '+81 90****4567', avatar: '👨‍💼', gender: '男', birthday: '1980-03-25', status: 'active', tier: 'gold', registeredAt: '2024-04-15', lastLoginAt: '2025-02-28 15:00', lastOrderAt: '2025-02-20 11:00', registrationChannel: '平台', country: 'JP', region: '亚太', city: '东京', totalOrders: 28, totalSpent: 8950, currency: 'JPY', avgOrderValue: 319.64, returnRate: 1.8, tags: ['跨境', '品质导向'], rfmRecency: 4, rfmFrequency: 3, rfmMonetary: 3, rfmSegment: 'loyal', loyaltyPoints: 6700, couponsHeld: 1, addressCount: 1, notes: '日本客户，对品质要求极高，退货率很低。偏好电子产品和家居。' },
  { id: 'CUS-10018', name: '艾莉丝·约翰逊', email: 'alice@example.com', phone: '+1 646****7890', avatar: '👩', gender: '女', birthday: '1975-12-01', status: 'blocked', tier: 'regular', registeredAt: '2024-10-05', lastLoginAt: '2025-01-10 09:00', lastOrderAt: '2025-01-08 14:00', registrationChannel: '官网', country: 'US', region: '北美', city: '纽约', totalOrders: 5, totalSpent: 890, currency: 'USD', avgOrderValue: 178.00, returnRate: 60.0, tags: ['异常退货', '已封禁'], rfmRecency: 2, rfmFrequency: 1, rfmMonetary: 1, rfmSegment: 'lost', loyaltyPoints: 0, couponsHeld: 0, addressCount: 1, notes: '因异常高退货率（60%）和疑似退货欺诈行为被封禁。2025-01-15封禁，待风控团队复审。' },
  { id: 'CUS-10019', name: '萨拉·李', email: 'sarah.lee@example.com', phone: '+82 10****2345', avatar: '👩‍🔬', gender: '女', birthday: '1997-05-17', status: 'pending_verification', tier: 'regular', registeredAt: '2025-03-01', lastLoginAt: '2025-03-01 16:00', lastOrderAt: '', registrationChannel: 'App', country: 'KR', region: '亚太', city: '首尔', totalOrders: 0, totalSpent: 0, currency: 'USD', avgOrderValue: 0, returnRate: 0, tags: ['新注册', '待验证'], rfmRecency: 1, rfmFrequency: 1, rfmMonetary: 1, rfmSegment: 'new', loyaltyPoints: 0, couponsHeld: 1, addressCount: 0, notes: '刚注册，尚未完成邮箱验证。' },
  { id: 'CUS-10020', name: '陈大伟', email: 'chendw@example.com', phone: '+86 186****6789', avatar: '👨‍🦳', gender: '男', birthday: '1970-01-20', status: 'active', tier: 'platinum', registeredAt: '2022-12-01', lastLoginAt: '2025-02-10 10:00', lastOrderAt: '2024-10-15 09:00', registrationChannel: '官网', country: 'CN', region: '华东', city: '上海', totalOrders: 62, totalSpent: 38700, currency: 'USD', avgOrderValue: 624.19, returnRate: 1.6, tags: ['VIP', '高价值', '流失风险'], rfmRecency: 1, rfmFrequency: 4, rfmMonetary: 5, rfmSegment: 'cant_lose', loyaltyPoints: 31200, couponsHeld: 0, addressCount: 3, notes: '高价值长期客户，但已超过4个月未下单。需要紧急召回营销。' },
];

// ── Loyalty Program Types ──
export type LoyaltyTransactionType = 'earn_order' | 'redeem_order' | 'manual_adjust' | 'expire' | 'campaign_bonus' | 'refund_reverse';
export type LoyaltyTransactionStatus = 'success' | 'pending' | 'reversed';
export type LoyaltyRuleType = 'earn' | 'redeem' | 'tier' | 'expiry' | 'bonus';

export interface LoyaltyRule {
  id: string;
  name: string;
  type: LoyaltyRuleType;
  enabled: boolean;
  description: string;
  expression: string;
  updatedBy: string;
  updatedAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: LoyaltyTransactionType;
  status: LoyaltyTransactionStatus;
  pointsChange: number;
  balanceAfter: number;
  sourceType: 'order' | 'campaign' | 'manual' | 'system';
  sourceId: string;
  operator: string;
  note: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  category: 'coupon' | 'gift' | 'shipping' | 'cash_deduction';
  pointsCost: number;
  stock: number;
  status: 'active' | 'inactive' | 'sold_out';
  description: string;
}

export interface LoyaltyAdjustment {
  id: string;
  customerId: string;
  customerName: string;
  beforePoints: number;
  deltaPoints: number;
  afterPoints: number;
  reason: string;
  approvedBy: string;
  createdBy: string;
  createdAt: string;
}

export const loyaltyTransactionTypeConfig: Record<LoyaltyTransactionType, StatusConfig> = {
  earn_order:     { label: '消费获积分', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  redeem_order:   { label: '下单抵扣',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  manual_adjust:  { label: '人工调账',   color: '#d19a66', bgColor: 'rgba(209,154,102,0.15)' },
  expire:         { label: '积分过期',   color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  campaign_bonus: { label: '活动赠送',   color: '#4ec9b0', bgColor: 'rgba(78,201,176,0.15)' },
  refund_reverse: { label: '退款回退',   color: '#ce9178', bgColor: 'rgba(206,145,120,0.15)' },
};

export const loyaltyTransactionStatusConfig: Record<LoyaltyTransactionStatus, StatusConfig> = {
  success:  { label: '成功', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  pending:  { label: '处理中', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  reversed: { label: '已冲正', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
};

export const loyaltyRules: LoyaltyRule[] = [
  { id: 'LR-001', name: '消费积分累积', type: 'earn', enabled: true, description: '每消费 1 美元积 1 分', expression: 'floor(order_paid_amount * 1)', updatedBy: '王丽', updatedAt: '2025-03-01 10:12' },
  { id: 'LR-002', name: '积分抵扣规则', type: 'redeem', enabled: true, description: '100 积分抵扣 1 美元，单笔最高抵扣 20%', expression: 'min(floor(points/100), floor(order_amount*0.2))', updatedBy: '刘建', updatedAt: '2025-03-01 11:22' },
  { id: 'LR-003', name: '等级加成系数', type: 'tier', enabled: true, description: '白银 1.1x / 黄金 1.2x / 铂金 1.3x / 钻石 1.5x', expression: 'base_points * tier_multiplier', updatedBy: '周明', updatedAt: '2025-03-02 09:40' },
  { id: 'LR-004', name: '积分有效期', type: 'expiry', enabled: true, description: '积分自发放起 365 天后过期', expression: 'expire_at = created_at + 365d', updatedBy: '系统', updatedAt: '2025-03-01 00:00' },
  { id: 'LR-005', name: '新客首单奖励', type: 'bonus', enabled: true, description: '新会员首单完成额外赠送 300 积分', expression: 'if first_paid_order then +300', updatedBy: '王丽', updatedAt: '2025-03-03 14:18' },
];

export const loyaltyRewards: LoyaltyReward[] = [
  { id: 'LRW-001', name: '10 美元无门槛券', category: 'coupon', pointsCost: 1200, stock: 3200, status: 'active', description: '兑换后 7 天有效，订单满 10 美元可用' },
  { id: 'LRW-002', name: '包邮券', category: 'shipping', pointsCost: 800, stock: 6800, status: 'active', description: '全场可用，单次免运费' },
  { id: 'LRW-003', name: '品牌马克杯', category: 'gift', pointsCost: 2500, stock: 460, status: 'active', description: '门店/仓库随机发货' },
  { id: 'LRW-004', name: '50 美元代金卡', category: 'cash_deduction', pointsCost: 5000, stock: 1200, status: 'active', description: '可拆分多笔使用' },
  { id: 'LRW-005', name: '限定帆布袋', category: 'gift', pointsCost: 1800, stock: 0, status: 'sold_out', description: '活动限定款，已兑完' },
];

export const loyaltyTransactions: LoyaltyTransaction[] = [
  { id: 'LTX-20250317-001', customerId: 'CUS-10001', customerName: '张晓明', type: 'earn_order', status: 'success', pointsChange: 320, balanceAfter: 29220, sourceType: 'order', sourceId: 'ORD-2025-1001', operator: '系统', note: '订单支付成功自动入账', createdAt: '2025-03-17 09:20' },
  { id: 'LTX-20250317-002', customerId: 'CUS-10001', customerName: '张晓明', type: 'redeem_order', status: 'success', pointsChange: -1200, balanceAfter: 28020, sourceType: 'order', sourceId: 'ORD-2025-1001', operator: '系统', note: '积分抵扣 12 美元', createdAt: '2025-03-17 09:20' },
  { id: 'LTX-20250317-003', customerId: 'CUS-10003', customerName: '李婷婷', type: 'campaign_bonus', status: 'success', pointsChange: 500, balanceAfter: 15700, sourceType: 'campaign', sourceId: 'CMP-NEWYEAR-2025', operator: '营销系统', note: '女神节活动奖励', createdAt: '2025-03-17 10:05' },
  { id: 'LTX-20250317-004', customerId: 'CUS-10005', customerName: '孙文静', type: 'manual_adjust', status: 'success', pointsChange: 200, balanceAfter: 2000, sourceType: 'manual', sourceId: 'ADJ-7781', operator: '客服-李敏', note: '客服补偿积分', createdAt: '2025-03-17 10:50' },
  { id: 'LTX-20250317-005', customerId: 'CUS-10010', customerName: '杰克·汤普森', type: 'earn_order', status: 'success', pointsChange: 1276, balanceAfter: 24676, sourceType: 'order', sourceId: 'ORD-2025-1015', operator: '系统', note: '高客单价订单积分', createdAt: '2025-03-17 11:10' },
  { id: 'LTX-20250317-006', customerId: 'CUS-10016', customerName: '林小雨', type: 'redeem_order', status: 'success', pointsChange: -500, balanceAfter: 2400, sourceType: 'order', sourceId: 'ORD-2025-0998', operator: '系统', note: '积分抵扣 5 美元', createdAt: '2025-03-17 12:30' },
  { id: 'LTX-20250317-007', customerId: 'CUS-10020', customerName: '陈大伟', type: 'expire', status: 'success', pointsChange: -800, balanceAfter: 30400, sourceType: 'system', sourceId: 'EXP-202503', operator: '系统任务', note: '年度过期积分结转', createdAt: '2025-03-17 01:00' },
  { id: 'LTX-20250316-001', customerId: 'CUS-10013', customerName: '王丽', type: 'earn_order', status: 'success', pointsChange: 2553, balanceAfter: 42600, sourceType: 'order', sourceId: 'ORD-2025-0980', operator: '系统', note: '', createdAt: '2025-03-16 16:02' },
  { id: 'LTX-20250316-002', customerId: 'CUS-10008', customerName: '朴亨俊', type: 'refund_reverse', status: 'success', pointsChange: -180, balanceAfter: 3220, sourceType: 'order', sourceId: 'RFD-2025-0881', operator: '系统', note: '退款冲减积分', createdAt: '2025-03-16 17:25' },
  { id: 'LTX-20250316-003', customerId: 'CUS-10011', customerName: '凯伦·怀特', type: 'campaign_bonus', status: 'pending', pointsChange: 300, balanceAfter: 342, sourceType: 'campaign', sourceId: 'CMP-FIRST-ORDER', operator: '营销系统', note: '首单奖励待审核', createdAt: '2025-03-16 20:10' },
];

export const loyaltyAdjustments: LoyaltyAdjustment[] = [
  { id: 'ADJ-7781', customerId: 'CUS-10005', customerName: '孙文静', beforePoints: 1800, deltaPoints: 200, afterPoints: 2000, reason: '物流延迟补偿', approvedBy: '客服主管-王蕾', createdBy: '客服-李敏', createdAt: '2025-03-17 10:50' },
  { id: 'ADJ-7782', customerId: 'CUS-10016', customerName: '林小雨', beforePoints: 3100, deltaPoints: -700, afterPoints: 2400, reason: '重复积分冲正', approvedBy: '风控-周涛', createdBy: '运营-张晨', createdAt: '2025-03-15 19:40' },
  { id: 'ADJ-7783', customerId: 'CUS-10001', customerName: '张晓明', beforePoints: 27620, deltaPoints: 400, afterPoints: 28020, reason: '线下门店活动加赠', approvedBy: '运营总监-王丽', createdBy: '门店店长-陈俊', createdAt: '2025-03-17 09:25' },
];

// ── POS System Types ──
export type POSPaymentMethod = 'cash' | 'card' | 'wechat_pay' | 'alipay' | 'union_pay' | 'member_points';
export type POSTransactionStatus = 'completed' | 'refunded' | 'voided' | 'pending';
export type PickupStatus = 'pending_pickup' | 'picked_up' | 'expired' | 'cancelled';

export const posPaymentMethodConfig: Record<POSPaymentMethod, StatusConfig> = {
  cash:          { label: '现金',     color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  card:          { label: '银行卡',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  wechat_pay:    { label: '微信支付', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  alipay:        { label: '支付宝',   color: '#569cd6', bgColor: 'rgba(86,156,214,0.15)' },
  union_pay:     { label: '银联',     color: '#ce9178', bgColor: 'rgba(206,145,120,0.15)' },
  member_points: { label: '积分抵扣', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
};

export const posTransactionStatusConfig: Record<POSTransactionStatus, StatusConfig> = {
  completed: { label: '已完成', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  refunded:  { label: '已退款', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  voided:    { label: '已作废', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
  pending:   { label: '待支付', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
};

export const pickupStatusConfig: Record<PickupStatus, StatusConfig> = {
  pending_pickup: { label: '待取货', color: '#dcdcaa', bgColor: 'rgba(220,220,170,0.15)' },
  picked_up:      { label: '已取货', color: '#6a9955', bgColor: 'rgba(106,153,85,0.15)' },
  expired:        { label: '已过期', color: '#f44747', bgColor: 'rgba(244,71,71,0.15)' },
  cancelled:      { label: '已取消', color: '#858585', bgColor: 'rgba(133,133,133,0.15)' },
};

export interface POSCartItem {
  skuId: string;
  spuId: string;
  name: string;
  skuName: string;
  image: string;
  price: number;
  originalPrice: number;
  qty: number;
  discount: number;
  barcode: string;
}

export interface POSTransaction {
  id: string;
  storeId: string;
  storeName: string;
  cashierId: string;
  cashierName: string;
  items: POSCartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: POSPaymentMethod;
  paymentRef: string;
  cashReceived: number;
  changeGiven: number;
  memberId: string;
  memberName: string;
  pointsEarned: number;
  pointsUsed: number;
  status: POSTransactionStatus;
  receiptNo: string;
  createdAt: string;
  note: string;
}

export interface PickupOrder {
  id: string;
  onlineOrderId: string;
  pickupCode: string;
  customerName: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  items: { name: string; skuName: string; image: string; qty: number; price: number }[];
  totalAmount: number;
  status: PickupStatus;
  onlinePayMethod: string;
  paidAt: string;
  expiresAt: string;
  pickedUpAt: string;
  pickedUpBy: string;
  note: string;
}

// ── Mock POS Transactions ──
export const posTransactions: POSTransaction[] = [
  { id: 'POS-20250317-001', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', cashierId: 'EMP-001', cashierName: '张晓', items: [{ skuId: 'SKU-100081', spuId: 'SPU-10008', name: 'SK-II 神仙水精华液', skuName: '75ml', image: '💄', price: 99, originalPrice: 119, qty: 2, discount: 0, barcode: '1940001000811' }, { skuId: 'SKU-100111', spuId: 'SPU-10011', name: 'USB-C 快充线三件套', skuName: '黑色三件套', image: '🔌', price: 12, originalPrice: 15, qty: 1, discount: 0, barcode: '1940001001111' }], subtotal: 210, discount: 20, tax: 12.16, total: 202.16, paymentMethod: 'wechat_pay', paymentRef: 'WX202503170001', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10001', memberName: '张伟', pointsEarned: 202, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-001', createdAt: '2025-03-17 09:15', note: '' },
  { id: 'POS-20250317-002', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', cashierId: 'EMP-001', cashierName: '张晓', items: [{ skuId: 'SKU-100061', spuId: 'SPU-10006', name: 'Nike Air Zoom Pegasus 41', skuName: '黑/白 US8', image: '👟', price: 120, originalPrice: 140, qty: 1, discount: 14, barcode: '1940001000611' }], subtotal: 120, discount: 14, tax: 6.78, total: 112.78, paymentMethod: 'alipay', paymentRef: 'ALI202503170002', cashReceived: 0, changeGiven: 0, memberId: '', memberName: '', pointsEarned: 0, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-002', createdAt: '2025-03-17 09:42', note: '使用FASHION10优惠券' },
  { id: 'POS-20250317-003', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', cashierId: 'EMP-002', cashierName: '李娜', items: [{ skuId: 'SKU-100011', spuId: 'SPU-10001', name: 'iPhone 15 Pro Max', skuName: '256GB 原色钛金属', image: '📱', price: 1199, originalPrice: 1199, qty: 1, discount: 0, barcode: '1940001000111' }, { skuId: 'SKU-100031', spuId: 'SPU-10003', name: 'Sony WH-1000XM5', skuName: '黑色', image: '🎧', price: 348, originalPrice: 398, qty: 1, discount: 0, barcode: '1940001000311' }], subtotal: 1547, discount: 50, tax: 95.81, total: 1592.81, paymentMethod: 'card', paymentRef: 'UPO202503170003', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10003', memberName: '王芳', pointsEarned: 1593, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-003', createdAt: '2025-03-17 10:20', note: 'ELEC50电子产品优惠券' },
  { id: 'POS-20250317-004', storeId: 'STORE-BJ01', storeName: '北京国贸店', cashierId: 'EMP-003', cashierName: '周涛', items: [{ skuId: 'SKU-100082', spuId: 'SPU-10008', name: 'SK-II 神仙水精华液', skuName: '160ml', image: '💄', price: 179, originalPrice: 199, qty: 3, discount: 0, barcode: '1940001000812' }], subtotal: 537, discount: 0, tax: 34.37, total: 571.37, paymentMethod: 'cash', paymentRef: '', cashReceived: 600, changeGiven: 28.63, memberId: 'CUS-10005', memberName: '刘洋', pointsEarned: 571, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-004', createdAt: '2025-03-17 11:05', note: '顾客现金支付' },
  { id: 'POS-20250317-005', storeId: 'STORE-BJ01', storeName: '北京国贸店', cashierId: 'EMP-003', cashierName: '周涛', items: [{ skuId: 'SKU-100021', spuId: 'SPU-10002', name: 'MacBook Pro 14" M3 Pro', skuName: 'M3 Pro 18GB/512GB 深空黑', image: '💻', price: 1549, originalPrice: 1549, qty: 1, discount: 100, barcode: '1940001000211' }], subtotal: 1549, discount: 100, tax: 92.74, total: 1541.74, paymentMethod: 'union_pay', paymentRef: 'UP202503170005', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10020', memberName: '陈大伟', pointsEarned: 1542, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-005', createdAt: '2025-03-17 13:30', note: 'VIP百元大券' },
  { id: 'POS-20250317-006', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', cashierId: 'EMP-001', cashierName: '张晓', items: [{ skuId: 'SKU-100031', spuId: 'SPU-10003', name: 'Sony WH-1000XM5', skuName: '黑色', image: '🎧', price: 348, originalPrice: 398, qty: 1, discount: 0, barcode: '1940001000311' }], subtotal: 348, discount: 0, tax: 22.27, total: 370.27, paymentMethod: 'wechat_pay', paymentRef: 'WX202503170006', cashReceived: 0, changeGiven: 0, memberId: '', memberName: '', pointsEarned: 0, pointsUsed: 0, status: 'refunded', receiptNo: 'RCP-20250317-006', createdAt: '2025-03-17 14:10', note: '顾客10分钟后退货，全额退款' },
  { id: 'POS-20250317-007', storeId: 'STORE-GZ01', storeName: '广州天河城店', cashierId: 'EMP-004', cashierName: '黄婷', items: [{ skuId: 'SKU-100081', spuId: 'SPU-10008', name: 'SK-II 神仙水精华液', skuName: '75ml', image: '💄', price: 99, originalPrice: 119, qty: 1, discount: 0, barcode: '1940001000811' }, { skuId: 'SKU-100082', spuId: 'SPU-10008', name: 'SK-II 神仙水精华液', skuName: '160ml', image: '💄', price: 179, originalPrice: 199, qty: 1, discount: 0, barcode: '1940001000812' }, { skuId: 'SKU-100083', spuId: 'SPU-10008', name: 'SK-II 神仙水精华液', skuName: '230ml', image: '💄', price: 229, originalPrice: 259, qty: 1, discount: 30, barcode: '1940001000813' }], subtotal: 507, discount: 30, tax: 30.53, total: 507.53, paymentMethod: 'alipay', paymentRef: 'ALI202503170007', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10008', memberName: '黄丽丽', pointsEarned: 508, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250317-007', createdAt: '2025-03-17 15:45', note: 'BEAUTY30美妆券' },
  { id: 'POS-20250316-001', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', cashierId: 'EMP-002', cashierName: '李娜', items: [{ skuId: 'SKU-100014', spuId: 'SPU-10001', name: 'iPhone 15 Pro Max', skuName: '256GB 黑色钛金属', image: '📱', price: 1199, originalPrice: 1199, qty: 1, discount: 0, barcode: '1940001000114' }], subtotal: 1199, discount: 0, tax: 76.74, total: 1275.74, paymentMethod: 'card', paymentRef: 'UPO202503160001', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10010', memberName: '吴磊', pointsEarned: 1276, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250316-001', createdAt: '2025-03-16 10:30', note: '' },
  { id: 'POS-20250316-002', storeId: 'STORE-BJ01', storeName: '北京国贸店', cashierId: 'EMP-003', cashierName: '周涛', items: [{ skuId: 'SKU-100062', spuId: 'SPU-10006', name: 'Nike Air Zoom Pegasus 41', skuName: '黑/白 US9', image: '👟', price: 120, originalPrice: 140, qty: 2, discount: 0, barcode: '1940001000612' }, { skuId: 'SKU-100111', spuId: 'SPU-10011', name: 'USB-C 快充线三件套', skuName: '黑色三件套', image: '🔌', price: 12, originalPrice: 15, qty: 3, discount: 0, barcode: '1940001001111' }], subtotal: 276, discount: 20, tax: 16.38, total: 272.38, paymentMethod: 'wechat_pay', paymentRef: 'WX202503160002', cashReceived: 0, changeGiven: 0, memberId: '', memberName: '', pointsEarned: 0, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250316-002', createdAt: '2025-03-16 14:20', note: 'SPRING20优惠券' },
  { id: 'POS-20250316-003', storeId: 'STORE-GZ01', storeName: '广州天河城店', cashierId: 'EMP-004', cashierName: '黄婷', items: [{ skuId: 'SKU-100023', spuId: 'SPU-10002', name: 'MacBook Pro 14" M3 Pro', skuName: 'M3 Max 48GB/1TB 深空黑', image: '💻', price: 2499, originalPrice: 2499, qty: 1, discount: 0, barcode: '1940001000213' }], subtotal: 2499, discount: 100, tax: 153.54, total: 2552.54, paymentMethod: 'card', paymentRef: 'UPO202503160003', cashReceived: 0, changeGiven: 0, memberId: 'CUS-10013', memberName: '赵明', pointsEarned: 2553, pointsUsed: 0, status: 'completed', receiptNo: 'RCP-20250316-003', createdAt: '2025-03-16 16:00', note: 'VIP百元大券' },
];

// ── Mock Pickup Orders (O2O) ──
export const pickupOrders: PickupOrder[] = [
  { id: 'PKP-001', onlineOrderId: 'ORD-2025-1001', pickupCode: '8823', customerName: '张伟', customerPhone: '+86 138****1234', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', items: [{ name: 'iPhone 15 Pro Max', skuName: '256GB 原色钛金属', image: '📱', qty: 1, price: 1199 }], totalAmount: 1199, status: 'pending_pickup', onlinePayMethod: '支付宝', paidAt: '2025-03-17 08:30', expiresAt: '2025-03-20 23:59', pickedUpAt: '', pickedUpBy: '', note: '在线下单，到店自提' },
  { id: 'PKP-002', onlineOrderId: 'ORD-2025-0987', pickupCode: '5567', customerName: '李芳', customerPhone: '+86 139****5678', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', items: [{ name: 'Sony WH-1000XM5', skuName: '黑色', image: '🎧', qty: 1, price: 348 }, { name: 'USB-C 快充线三件套', skuName: '白色三件套', image: '🔌', qty: 2, price: 12 }], totalAmount: 372, status: 'pending_pickup', onlinePayMethod: '微信支付', paidAt: '2025-03-16 20:15', expiresAt: '2025-03-19 23:59', pickedUpAt: '', pickedUpBy: '', note: '' },
  { id: 'PKP-003', onlineOrderId: 'ORD-2025-0956', pickupCode: '3341', customerName: '王芳', customerPhone: '+86 136****9012', storeId: 'STORE-BJ01', storeName: '北京国贸店', items: [{ name: 'SK-II 神仙水精华液', skuName: '230ml', image: '💄', qty: 2, price: 229 }], totalAmount: 458, status: 'pending_pickup', onlinePayMethod: '支付宝', paidAt: '2025-03-17 10:00', expiresAt: '2025-03-20 23:59', pickedUpAt: '', pickedUpBy: '', note: '请备好礼品包装' },
  { id: 'PKP-004', onlineOrderId: 'ORD-2025-0912', pickupCode: '7789', customerName: '刘洋', customerPhone: '+86 137****3456', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', items: [{ name: 'Nike Air Zoom Pegasus 41', skuName: '黑/白 US9', image: '👟', qty: 1, price: 120 }], totalAmount: 120, status: 'picked_up', onlinePayMethod: '微信支付', paidAt: '2025-03-15 14:30', expiresAt: '2025-03-18 23:59', pickedUpAt: '2025-03-16 11:20', pickedUpBy: '张晓', note: '' },
  { id: 'PKP-005', onlineOrderId: 'ORD-2025-0880', pickupCode: '2210', customerName: '陈大伟', customerPhone: '+86 186****6789', storeId: 'STORE-BJ01', storeName: '北京国贸店', items: [{ name: 'MacBook Pro 14" M3 Pro', skuName: 'M3 Pro 36GB/1TB 银色', image: '💻', qty: 1, price: 1999 }], totalAmount: 1999, status: 'picked_up', onlinePayMethod: '银联', paidAt: '2025-03-14 09:00', expiresAt: '2025-03-17 23:59', pickedUpAt: '2025-03-15 10:05', pickedUpBy: '周涛', note: 'VIP客户，已电话通知取货' },
  { id: 'PKP-006', onlineOrderId: 'ORD-2025-0845', pickupCode: '6654', customerName: '黄丽丽', customerPhone: '+86 150****7890', storeId: 'STORE-GZ01', storeName: '广州天河城店', items: [{ name: 'SK-II 神仙水精华液', skuName: '75ml', image: '💄', qty: 3, price: 99 }], totalAmount: 297, status: 'expired', onlinePayMethod: '微信支付', paidAt: '2025-03-10 18:00', expiresAt: '2025-03-13 23:59', pickedUpAt: '', pickedUpBy: '', note: '已过期，待退款处理' },
  { id: 'PKP-007', onlineOrderId: 'ORD-2025-0830', pickupCode: '9901', customerName: '赵明', customerPhone: '+86 133****2345', storeId: 'STORE-GZ01', storeName: '广州天河城店', items: [{ name: '有机坚果混合礼盒', skuName: '精装大礼盒', image: '🥜', qty: 5, price: 49 }], totalAmount: 245, status: 'cancelled', onlinePayMethod: '支付宝', paidAt: '2025-03-12 12:00', expiresAt: '2025-03-15 23:59', pickedUpAt: '', pickedUpBy: '', note: '客户申请取消，已退款' },
  { id: 'PKP-008', onlineOrderId: 'ORD-2025-1015', pickupCode: '4478', customerName: '孙丽', customerPhone: '+86 155****4567', storeId: 'STORE-SH01', storeName: '上海南京路旗舰店', items: [{ name: 'Apple Watch Ultra 2', skuName: '49mm 橙色Alpine表带', image: '⌚', qty: 1, price: 899 }], totalAmount: 899, status: 'pending_pickup', onlinePayMethod: '支付宝', paidAt: '2025-03-17 12:00', expiresAt: '2025-03-20 23:59', pickedUpAt: '', pickedUpBy: '', note: '生日礼物，请附赠贺卡' },
];

export type SidebarSelection =
  | { kind: 'order'; payload: Order }
  | { kind: 'exception'; payload: OMSException }
  | { kind: 'promotion'; payload: Promotion }
  | { kind: 'coupon'; payload: Coupon }
  | { kind: 'product'; payload: SPU }
  | { kind: 'customer'; payload: Customer }
  | { kind: 'pos_transaction'; payload: POSTransaction };

export const coupons: Coupon[] = [
  { id: 'CPN-001', code: 'SPRING20', name: '春季20元优惠券', type: 'fixed', status: 'active', description: '满100减20', discountValue: 20, minOrderAmount: 100, maxDiscountAmount: 20, totalQty: 10000, issuedQty: 6800, usedQty: 4200, perUserLimit: 1, scope: 'all', scopeNames: ['全部商品'], channels: ['全渠道'], startAt: '2025-03-01', endAt: '2025-03-31', validDays: 30, stackable: false, newUserOnly: false, revenue: 128000, createdBy: '王丽', createdAt: '2025-02-25' },
  { id: 'CPN-002', code: 'NEWUSER15', name: '新人85折券', type: 'percentage', status: 'active', description: '新用户专享85折', discountValue: 15, minOrderAmount: 50, maxDiscountAmount: 30, totalQty: 0, issuedQty: 3200, usedQty: 2100, perUserLimit: 1, scope: 'all', scopeNames: ['全部商品'], channels: ['官网', 'App'], startAt: '2025-01-01', endAt: '2025-12-31', validDays: 7, stackable: false, newUserOnly: true, revenue: 89000, createdBy: '王丽', createdAt: '2025-01-01' },
  { id: 'CPN-003', code: 'ELEC50', name: '电子产品50元券', type: 'fixed', status: 'active', description: '电子产品满300减50', discountValue: 50, minOrderAmount: 300, maxDiscountAmount: 50, totalQty: 5000, issuedQty: 3400, usedQty: 1890, perUserLimit: 2, scope: 'category', scopeNames: ['电子产品'], channels: ['全渠道'], startAt: '2025-03-01', endAt: '2025-03-31', validDays: 30, stackable: false, newUserOnly: false, revenue: 245000, createdBy: '刘建', createdAt: '2025-02-28' },
  { id: 'CPN-004', code: 'FREESHIP', name: '全场包邮券', type: 'free_shipping', status: 'active', description: '任意订单免运费', discountValue: 0, minOrderAmount: 0, maxDiscountAmount: 15, totalQty: 20000, issuedQty: 12000, usedQty: 8900, perUserLimit: 3, scope: 'all', scopeNames: ['全部商品'], channels: ['官网'], startAt: '2025-03-01', endAt: '2025-04-30', validDays: 60, stackable: true, newUserOnly: false, revenue: 0, createdBy: '周明', createdAt: '2025-03-01' },
  { id: 'CPN-005', code: 'VIP100', name: 'VIP百元大券', type: 'fixed', status: 'active', description: 'VIP会员专享满500减100', discountValue: 100, minOrderAmount: 500, maxDiscountAmount: 100, totalQty: 2000, issuedQty: 800, usedQty: 450, perUserLimit: 1, scope: 'all', scopeNames: ['全部商品'], channels: ['官网', 'App'], startAt: '2025-03-01', endAt: '2025-03-31', validDays: 30, stackable: false, newUserOnly: false, revenue: 156000, createdBy: '王丽', createdAt: '2025-03-01' },
  { id: 'CPN-006', code: 'FASHION10', name: '服装9折券', type: 'percentage', status: 'active', description: '服装鞋帽9折优惠', discountValue: 10, minOrderAmount: 80, maxDiscountAmount: 40, totalQty: 8000, issuedQty: 5600, usedQty: 3200, perUserLimit: 2, scope: 'category', scopeNames: ['服装鞋帽'], channels: ['全渠道'], startAt: '2025-03-01', endAt: '2025-03-31', validDays: 30, stackable: false, newUserOnly: false, revenue: 78000, createdBy: '周明', createdAt: '2025-03-01' },
  { id: 'CPN-007', code: 'BEAUTY30', name: '美妆满200减30', type: 'fixed', status: 'depleted', description: '美妆个护满减', discountValue: 30, minOrderAmount: 200, maxDiscountAmount: 30, totalQty: 3000, issuedQty: 3000, usedQty: 2800, perUserLimit: 1, scope: 'category', scopeNames: ['美妆个护'], channels: ['官网'], startAt: '2025-02-14', endAt: '2025-03-14', validDays: 28, stackable: false, newUserOnly: false, revenue: 192000, createdBy: '孙文静', createdAt: '2025-02-14' },
  { id: 'CPN-008', code: 'XMAS2024', name: '圣诞满减券', type: 'fixed', status: 'expired', description: '圣诞节活动满200减40', discountValue: 40, minOrderAmount: 200, maxDiscountAmount: 40, totalQty: 15000, issuedQty: 15000, usedQty: 11200, perUserLimit: 2, scope: 'all', scopeNames: ['全部商品'], channels: ['全渠道'], startAt: '2024-12-20', endAt: '2024-12-31', validDays: 11, stackable: false, newUserOnly: false, revenue: 890000, createdBy: '王丽', createdAt: '2024-12-15' },
];

// ── Navigation Sections (Section 8.1) ──
// icon field references key in omsSidebarIconMap
export const navigationSections = [
  {
    title: '订单管理',
    items: [
      { id: 'dashboard', label: '控制台', icon: 'BarChart3' },
      { id: 'orders', label: '订单列表', icon: 'ShoppingCart', badge: 142 },
      { id: 'fulfillment', label: '履约中心', icon: 'Truck' },
      { id: 'exceptions', label: '异常中心', icon: 'AlertTriangle', badge: 7 },
      { id: 'returns', label: '退货 / 退款', icon: 'RotateCcw' },
    ],
  },
  {
    title: '运营管理',
    items: [
      { id: 'customers', label: '客户管理', icon: 'Users' },
      { id: 'member-loyalty', label: '会员积分中心', icon: 'Star' },
      { id: 'channels', label: '渠道 / 店铺', icon: 'Store' },
      { id: 'categories', label: '商品分类', icon: 'FolderTree' },
      { id: 'products', label: '商品管理', icon: 'Package' },
      { id: 'promotions', label: '促销管理', icon: 'Zap' },
      { id: 'coupons', label: '优惠券管理', icon: 'Ticket' },
      { id: 'promo-simulator', label: '促销模拟器', icon: 'Calculator' },
      { id: 'rules', label: '规则策略', icon: 'BookOpen' },
      { id: 'reports', label: '报表分析', icon: 'FileBarChart' },
    ],
  },
  {
    title: '门店 POS',
    items: [
      { id: 'pos-terminal', label: 'POS 收银', icon: 'ScanLine' },
      { id: 'pos-pickup', label: 'O2O 核销', icon: 'Receipt' },
      { id: 'pos-history', label: '交易记录', icon: 'CreditCard' },
    ],
  },
  {
    title: '系统',
    items: [
      { id: 'settings', label: '系统设置', icon: 'Settings' },
      { id: 'audit', label: '审计日志', icon: 'FileText' },
    ],
  },
];
