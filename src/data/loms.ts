// 鈹€鈹€ Status configs with semantic colors 鈹€鈹€
export const shipmentStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  created:     { label: 'Created',     color: '#6b7280', bgColor: '#6b728020' },
  booked:      { label: 'Booked',      color: '#3b82f6', bgColor: '#3b82f620' },
  in_transit:  { label: 'In Transit',  color: '#3b82f6', bgColor: '#3b82f620' },
  out_for_delivery: { label: 'Out for Delivery', color: '#f59e0b', bgColor: '#f59e0b20' },
  delivered:   { label: 'Delivered',    color: '#22c55e', bgColor: '#22c55e20' },
  exception:   { label: 'Exception',    color: '#ef4444', bgColor: '#ef444420' },
  cancelled:   { label: 'Cancelled',    color: '#6b7280', bgColor: '#6b728020' },
  on_hold:     { label: 'On Hold',      color: '#f59e0b', bgColor: '#f59e0b20' },
};

export const exceptionSeverityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  critical: { label: 'Critical', color: '#ef4444', bgColor: '#ef444420' },
  high:     { label: 'High',     color: '#f97316', bgColor: '#f9731620' },
  medium:   { label: 'Medium',   color: '#f59e0b', bgColor: '#f59e0b20' },
  low:      { label: 'Low',      color: '#6b7280', bgColor: '#6b728020' },
};

export const slaStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  on_track:  { label: 'On Track',  color: '#22c55e', bgColor: '#22c55e20' },
  at_risk:   { label: 'At Risk',   color: '#f59e0b', bgColor: '#f59e0b20' },
  breached:  { label: 'Breached',  color: '#ef4444', bgColor: '#ef444420' },
};

// 鈹€鈹€ Interfaces 鈹€鈹€
export interface Shipment {
  id: string;
  orderId: string;
  origin: string;
  destination: string;
  carrier: string;
  service: string;
  status: string;
  slaStatus: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  slaRemainingMinutes: number | null;
  owner: string;
  promisedDate: string;
  currentLeg: string;
  legs: number;
  completedLegs: number;
  weight: string;
  lastEvent: string;
  lastEventTime: string;
  createdAt: string;
}

export interface LOMSOrder {
  id: string;
  customer: string;
  items: number;
  shipments: number;
  status: string;
  total: string;
  createdAt: string;
}

export interface Exception {
  id: string;
  severity: string;
  objectType: string;
  objectId: string;
  reason: string;
  slaDue: string;
  owner: string;
  age: string;
  status: string;
  description: string;
  recommendedAction: string;
}

export interface Leg {
  id: string;
  shipmentId: string;
  sequence: number;
  carrier: string;
  origin: string;
  destination: string;
  status: string;
  departure: string;
  arrival: string;
}

export interface TrackingEvent {
  time: string;
  event: string;
  location: string;
  source: string;
  isAnomaly?: boolean;
}

// 鈹€鈹€ Navigation structure 鈹€鈹€
export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'ops-dashboard', label: 'Operations Dashboard', icon: 'LayoutDashboard' },
      { id: 'sla-overview', label: 'SLA Overview', icon: 'Clock' },
      { id: 'network-health', label: 'Network Health', icon: 'Activity' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { id: 'order-list', label: 'Orders', icon: 'ShoppingCart' },
      { id: 'fulfillment', label: 'Fulfillment', icon: 'Package' },
      { id: 'shipment-monitor', label: 'Shipment Monitor', icon: 'Truck', badge: 142 },
      { id: 'leg-monitor', label: 'Legs', icon: 'ArrowRightLeft' },
      { id: 'tracking-center', label: 'Tracking Center', icon: 'MapPin' },
      { id: 'exception-queue', label: 'Exceptions', icon: 'AlertTriangle', badge: 12 },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { id: 'carrier-ops', label: 'Carrier Ops', icon: 'Radio' },
      { id: 'routing', label: 'Routing', icon: 'GitBranch' },
      { id: 'billing', label: 'Billing', icon: 'CreditCard' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3' },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { id: 'config', label: 'Configuration', icon: 'Settings' },
      { id: 'audit', label: 'Audit Log', icon: 'FileText' },
    ],
  },
];

// 鈹€鈹€ Sample data 鈹€鈹€
export const shipments: Shipment[] = [
  { id: 'SHP-20240301', orderId: 'ORD-1001', origin: 'Shanghai, CN', destination: 'Los Angeles, US', carrier: 'Maersk', service: 'Express', status: 'in_transit', slaStatus: 'on_track', riskLevel: 'high', slaRemainingMinutes: 45, owner: 'Amy Zhang', promisedDate: '2024-03-15', currentLeg: 'Leg 2/3', legs: 3, completedLegs: 1, weight: '450 kg', lastEvent: 'Vessel departed Busan', lastEventTime: '2h ago', createdAt: '2024-03-01' },
  { id: 'SHP-20240302', orderId: 'ORD-1002', origin: 'Shenzhen, CN', destination: 'London, UK', carrier: 'DHL', service: 'Standard', status: 'exception', slaStatus: 'breached', riskLevel: 'critical', slaRemainingMinutes: -120, owner: 'Ken Li', promisedDate: '2024-03-10', currentLeg: 'Leg 1/2', legs: 2, completedLegs: 0, weight: '120 kg', lastEvent: 'Customs hold', lastEventTime: '5h ago', createdAt: '2024-03-02' },
  { id: 'SHP-20240303', orderId: 'ORD-1003', origin: 'Guangzhou, CN', destination: 'Tokyo, JP', carrier: 'FedEx', service: 'Priority', status: 'delivered', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: null, owner: 'Amy Zhang', promisedDate: '2024-03-08', currentLeg: 'Leg 2/2', legs: 2, completedLegs: 2, weight: '80 kg', lastEvent: 'Delivered to consignee', lastEventTime: '1d ago', createdAt: '2024-03-03' },
  { id: 'SHP-20240304', orderId: 'ORD-1004', origin: 'Ningbo, CN', destination: 'Hamburg, DE', carrier: 'COSCO', service: 'Economy', status: 'in_transit', slaStatus: 'at_risk', riskLevel: 'high', slaRemainingMinutes: 180, owner: 'Mike Liu', promisedDate: '2024-03-20', currentLeg: 'Leg 1/4', legs: 4, completedLegs: 0, weight: '2,100 kg', lastEvent: 'Vessel departed Shanghai', lastEventTime: '12h ago', createdAt: '2024-03-04' },
  { id: 'SHP-20240305', orderId: 'ORD-1005', origin: 'Beijing, CN', destination: 'New York, US', carrier: 'UPS', service: 'Express', status: 'out_for_delivery', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: 360, owner: 'Lisa Wang', promisedDate: '2024-03-07', currentLeg: 'Leg 3/3', legs: 3, completedLegs: 2, weight: '35 kg', lastEvent: 'Out for delivery', lastEventTime: '30m ago', createdAt: '2024-03-05' },
  { id: 'SHP-20240306', orderId: 'ORD-1006', origin: 'Qingdao, CN', destination: 'Sydney, AU', carrier: 'Maersk', service: 'Standard', status: 'booked', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: 4320, owner: 'James Chen', promisedDate: '2024-03-25', currentLeg: '-', legs: 3, completedLegs: 0, weight: '780 kg', lastEvent: 'Booking confirmed', lastEventTime: '3h ago', createdAt: '2024-03-06' },
  { id: 'SHP-20240307', orderId: 'ORD-1007', origin: 'Xiamen, CN', destination: 'Rotterdam, NL', carrier: 'Evergreen', service: 'Economy', status: 'on_hold', slaStatus: 'at_risk', riskLevel: 'medium', slaRemainingMinutes: 720, owner: 'Unassigned', promisedDate: '2024-03-18', currentLeg: 'Leg 1/3', legs: 3, completedLegs: 0, weight: '1,500 kg', lastEvent: 'Documentation pending', lastEventTime: '1d ago', createdAt: '2024-03-07' },
  { id: 'SHP-20240308', orderId: 'ORD-1008', origin: 'Tianjin, CN', destination: 'Dubai, AE', carrier: 'MSC', service: 'Priority', status: 'in_transit', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: 1440, owner: 'Mike Liu', promisedDate: '2024-03-12', currentLeg: 'Leg 2/2', legs: 2, completedLegs: 1, weight: '300 kg', lastEvent: 'Arrived at destination port', lastEventTime: '6h ago', createdAt: '2024-03-08' },
  { id: 'SHP-20240309', orderId: 'ORD-1009', origin: 'Dalian, CN', destination: 'Busan, KR', carrier: 'KMTC', service: 'Express', status: 'delivered', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: null, owner: 'Lisa Wang', promisedDate: '2024-03-06', currentLeg: 'Leg 1/1', legs: 1, completedLegs: 1, weight: '50 kg', lastEvent: 'Delivered', lastEventTime: '2d ago', createdAt: '2024-03-09' },
  { id: 'SHP-20240310', orderId: 'ORD-1010', origin: 'Shanghai, CN', destination: 'Singapore, SG', carrier: 'PIL', service: 'Standard', status: 'exception', slaStatus: 'breached', riskLevel: 'critical', slaRemainingMinutes: -480, owner: 'James Chen', promisedDate: '2024-03-09', currentLeg: 'Leg 1/2', legs: 2, completedLegs: 0, weight: '650 kg', lastEvent: 'Container damaged', lastEventTime: '8h ago', createdAt: '2024-03-10' },
  { id: 'SHP-20240311', orderId: 'ORD-1011', origin: 'Wuhan, CN', destination: 'Mumbai, IN', carrier: 'ZIM', service: 'Economy', status: 'created', slaStatus: 'on_track', riskLevel: 'low', slaRemainingMinutes: 8640, owner: 'Unassigned', promisedDate: '2024-03-28', currentLeg: '-', legs: 2, completedLegs: 0, weight: '200 kg', lastEvent: 'Order received', lastEventTime: '1h ago', createdAt: '2024-03-11' },
  { id: 'SHP-20240312', orderId: 'ORD-1012', origin: 'Chongqing, CN', destination: 'Vancouver, CA', carrier: 'Hapag-Lloyd', service: 'Standard', status: 'in_transit', slaStatus: 'on_track', riskLevel: 'medium', slaRemainingMinutes: 2880, owner: 'Amy Zhang', promisedDate: '2024-03-22', currentLeg: 'Leg 2/3', legs: 3, completedLegs: 1, weight: '900 kg', lastEvent: 'Transshipment at Busan', lastEventTime: '4h ago', createdAt: '2024-03-12' },
];

export const exceptions: Exception[] = [
  { id: 'EXC-001', severity: 'critical', objectType: 'Shipment', objectId: 'SHP-20240302', reason: 'Customs hold - missing documentation', slaDue: '2h overdue', owner: 'Lisa Wang', age: '5h', status: 'open', description: 'Shipment held at Shenzhen customs due to incomplete HS code documentation.', recommendedAction: 'Upload corrected commercial invoice with HS codes.' },
  { id: 'EXC-002', severity: 'high', objectType: 'Shipment', objectId: 'SHP-20240310', reason: 'Container damaged during handling', slaDue: '4h remaining', owner: 'James Chen', age: '8h', status: 'open', description: 'Container MSKU-4421 reported damaged at Shanghai terminal.', recommendedAction: 'Arrange container inspection and assess cargo damage.' },
  { id: 'EXC-003', severity: 'medium', objectType: 'Shipment', objectId: 'SHP-20240307', reason: 'Documentation pending from shipper', slaDue: '12h remaining', owner: 'Unassigned', age: '1d', status: 'open', description: 'Missing packing list and certificate of origin.', recommendedAction: 'Contact shipper to provide missing documents.' },
  { id: 'EXC-004', severity: 'critical', objectType: 'Leg', objectId: 'SHP-20240304-L1', reason: 'Vessel delay - weather', slaDue: '1d overdue', owner: 'Mike Liu', age: '12h', status: 'investigating', description: 'Vessel CMA CGM Marco Polo delayed due to typhoon warning in East China Sea.', recommendedAction: 'Monitor weather updates and notify customer of revised ETA.' },
  { id: 'EXC-005', severity: 'low', objectType: 'Shipment', objectId: 'SHP-20240306', reason: 'Carrier rate discrepancy', slaDue: '3d remaining', owner: 'Finance Team', age: '3h', status: 'open', description: 'Quoted rate 楼12,500 differs from carrier invoice 楼13,200.', recommendedAction: 'Review contract terms and dispute if applicable.' },
  { id: 'EXC-006', severity: 'high', objectType: 'Shipment', objectId: 'SHP-20240301', reason: 'Address validation failure', slaDue: '6h remaining', owner: 'Lisa Wang', age: '2h', status: 'open', description: 'Destination address could not be validated by carrier system.', recommendedAction: 'Verify address with consignee and update shipment.' },
  { id: 'EXC-007', severity: 'medium', objectType: 'Order', objectId: 'ORD-1004', reason: 'Partial fulfillment risk', slaDue: '1d remaining', owner: 'Ops Team', age: '6h', status: 'open', description: 'Only 2 of 4 items available in warehouse for immediate dispatch.', recommendedAction: 'Split order or wait for inventory replenishment.' },
];

export const trackingEvents: TrackingEvent[] = [
  { time: '2024-03-08 14:30', event: 'Vessel departed Busan', location: 'Busan, KR', source: 'Carrier AIS' },
  { time: '2024-03-07 08:15', event: 'Container loaded onto vessel', location: 'Busan, KR', source: 'Terminal OS' },
  { time: '2024-03-06 22:00', event: 'Arrived at transshipment port', location: 'Busan, KR', source: 'Carrier EDI' },
  { time: '2024-03-05 06:30', event: 'Vessel departed Shanghai', location: 'Shanghai, CN', source: 'Carrier AIS' },
  { time: '2024-03-04 18:00', event: 'Customs cleared', location: 'Shanghai, CN', source: 'Customs API' },
  { time: '2024-03-04 09:00', event: 'Container gate-in', location: 'Shanghai, CN', source: 'Terminal OS' },
  { time: '2024-03-03 14:00', event: 'Pickup completed', location: 'Shanghai, CN', source: 'Driver App' },
  { time: '2024-03-01 10:00', event: 'Shipment created', location: '-', source: 'System' },
];


