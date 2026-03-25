export interface Order {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
  paymentMethod: string;
}

export const orders: Order[] = [
  { id: 'ORD-2024001', customerName: '\u5f20\u4e09', product: 'MacBook Pro 14"', quantity: 1, price: 14999, total: 14999, status: 'delivered', date: '2024-12-01', address: '\u5317\u4eac\u5e02\u671d\u9633\u533a\u5efa\u56fd\u8def88\u53f7', paymentMethod: '\u652f\u4ed8\u5b9d' },
  { id: 'ORD-2024002', customerName: '\u674e\u56db', product: 'iPhone 15 Pro Max', quantity: 2, price: 9999, total: 19998, status: 'shipped', date: '2024-12-03', address: '\u4e0a\u6d77\u5e02\u6d66\u4e1c\u65b0\u533a\u9646\u5bb5\u5634\u73af\u8def100\u53f7', paymentMethod: '\u5fae\u4fe1\u652f\u4ed8' },
  { id: 'ORD-2024003', customerName: '\u738b\u4e94', product: 'AirPods Pro 2', quantity: 3, price: 1899, total: 5697, status: 'processing', date: '2024-12-05', address: '\u5e7f\u5dde\u5e02\u5929\u6cb3\u533a\u4f53\u80b2\u897f\u8def50\u53f7', paymentMethod: '\u4fe1\u7528\u5361' },
  { id: 'ORD-2024004', customerName: '\u8d75\u516d', product: 'iPad Air M2', quantity: 1, price: 4799, total: 4799, status: 'pending', date: '2024-12-07', address: '\u6df1\u5733\u5e02\u5357\u5c71\u533a\u79d1\u6280\u56ed\u8def1\u53f7', paymentMethod: '\u652f\u4ed8\u5b9d' },
  { id: 'ORD-2024005', customerName: '\u5b59\u4e03', product: 'Apple Watch Ultra 2', quantity: 1, price: 6499, total: 6499, status: 'cancelled', date: '2024-12-08', address: '\u676d\u5dde\u5e02\u897f\u6e56\u533a\u6587\u4e09\u8def200\u53f7', paymentMethod: '\u5fae\u4fe1\u652f\u4ed8' },
  { id: 'ORD-2024006', customerName: '\u5468\u516b', product: 'Mac Mini M4', quantity: 2, price: 4499, total: 8998, status: 'delivered', date: '2024-12-10', address: '\u6210\u90fd\u5e02\u6b66\u4faf\u533a\u5929\u5e9c\u5927\u9053666\u53f7', paymentMethod: '\u94f6\u884c\u8f6c\u8d26' },
  { id: 'ORD-2024007', customerName: '\u5434\u4e5d', product: 'Studio Display', quantity: 1, price: 11499, total: 11499, status: 'shipped', date: '2024-12-12', address: '\u5357\u4eac\u5e02\u9f13\u697c\u533a\u4e2d\u5c71\u8def121\u53f7', paymentMethod: '\u4fe1\u7528\u5361' },
  { id: 'ORD-2024008', customerName: '\u90d1\u5341', product: 'Magic Keyboard', quantity: 5, price: 999, total: 4995, status: 'processing', date: '2024-12-13', address: '\u6b66\u6c49\u5e02\u6c5f\u6c49\u533a\u89e3\u653e\u5927\u9053100\u53f7', paymentMethod: '\u652f\u4ed8\u5b9d' },
  { id: 'ORD-2024009', customerName: '\u94b1\u5341\u4e00', product: 'HomePod mini', quantity: 4, price: 749, total: 2996, status: 'pending', date: '2024-12-14', address: '\u897f\u5b89\u5e02\u96c1\u5854\u533a\u957f\u5b89\u5357\u8def88\u53f7', paymentMethod: '\u5fae\u4fe1\u652f\u4ed8' },
  { id: 'ORD-2024010', customerName: '\u51af\u5341\u4e8c', product: 'MacBook Air M3', quantity: 1, price: 8999, total: 8999, status: 'delivered', date: '2024-12-15', address: '\u91cd\u5e86\u5e02\u6e1d\u4e2d\u533a\u89e3\u653e\u7891\u6b65\u884c\u885710\u53f7', paymentMethod: '\u4fe1\u7528\u5361' },
  { id: 'ORD-2024011', customerName: '\u9648\u5341\u4e09', product: 'AirTag 4\u4ef6\u5957', quantity: 2, price: 799, total: 1598, status: 'shipped', date: '2024-12-16', address: '\u5929\u6d25\u5e02\u548c\u5e73\u533a\u5357\u4eac\u8def150\u53f7', paymentMethod: '\u652f\u4ed8\u5b9d' },
  { id: 'ORD-2024012', customerName: '\u8912\u5341\u56db', product: 'iPhone 15', quantity: 1, price: 5999, total: 5999, status: 'processing', date: '2024-12-17', address: '\u82cf\u5dde\u5e02\u5de5\u4e1a\u56ed\u533a\u661f\u6e56\u8857328\u53f7', paymentMethod: '\u94f6\u884c\u8f6c\u8d26' },
];

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: '\u4eea\u8868\u76d8', icon: 'layout-dashboard' },
  {
    id: 'orders', label: '\u8ba2\u5355\u7ba1\u7406', icon: 'shopping-cart', badge: 12,
    children: [
      { id: 'all-orders', label: '\u5168\u90e8\u8ba2\u5355', icon: 'list' },
      { id: 'pending-orders', label: '\u5f85\u5904\u7406', icon: 'clock', badge: 2 },
      { id: 'processing-orders', label: '\u5904\u7406\u4e2d', icon: 'loader', badge: 3 },
      { id: 'shipped-orders', label: '\u5df2\u53d1\u8d27', icon: 'truck', badge: 3 },
      { id: 'delivered-orders', label: '\u5df2\u5b8c\u6210', icon: 'check-circle', badge: 3 },
      { id: 'cancelled-orders', label: '\u5df2\u53d6\u6d88', icon: 'x-circle', badge: 1 },
    ],
  },
  { id: 'customers', label: '\u5ba2\u6237\u7ba1\u7406', icon: 'users' },
  { id: 'products', label: '\u5546\u54c1\u7ba1\u7406', icon: 'package' },
  { id: 'reports', label: '\u62a5\u8868\u7edf\u8ba1', icon: 'bar-chart-3' },
  { id: 'settings', label: '\u7cfb\u7edf\u8bbe\u7f6e', icon: 'settings' },
];

export const statusConfig: Record<Order['status'], { label: string; color: string; bgColor: string }> = {
  pending: { label: '\u5f85\u5904\u7406', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)' },
  processing: { label: '\u5904\u7406\u4e2d', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)' },
  shipped: { label: '\u5df2\u53d1\u8d27', color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.15)' },
  delivered: { label: '\u5df2\u5b8c\u6210', color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' },
  cancelled: { label: '\u5df2\u53d6\u6d88', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)' },
};
