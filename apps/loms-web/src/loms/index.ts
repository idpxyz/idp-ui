// Data
export {
  type Shipment,
  type Exception,
  type LOMSOrder,
  type TrackingEvent,
  type NavItem,
  shipments,
  exceptions,
  trackingEvents,
  shipmentStatusConfig,
  slaStatusConfig,
  exceptionSeverityConfig,
  navigationSections,
} from './data/loms';

export { orders, statusConfig, type Order } from './data/orders';

// Navigation config
export {
  lomsTabIconMap,
  lomsTabNameMap,
  lomsSidebarIconMap,
} from './navigation';

// Page router
export { default as PageRouter } from './PageRouter';

// Command actions builder
export { buildDefaultCommandActions } from './commandActions';

// Shell components (domain-specific)
export { default as BottomPanel } from './shell/BottomPanel';
export { default as RightSidebar } from './shell/RightSidebar';
