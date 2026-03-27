import { Layers } from 'lucide-react';
import { type Shipment, type Exception, shipments, shipmentStatusConfig } from './data/loms';
import { lomsTabIconMap, lomsTabNameMap } from './navigation';
import ShipmentMonitor from './pages/ShipmentMonitor';
import ExceptionWorkbench from './pages/ExceptionWorkbench';
import ShipmentDetail from './pages/ShipmentDetail';
import OpsDashboard from './pages/OpsDashboard';
import SlaOverview from './pages/SlaOverview';
import NetworkHealth from './pages/NetworkHealth';
import OrderList from './pages/OrderList';
import TrackingCenter from './pages/TrackingCenter';
import CarrierOps from './pages/CarrierOps';
import RoutingPage from './pages/RoutingPage';
import BillingPage from './pages/BillingPage';
import ConfigPage from './pages/ConfigPage';
import FulfillmentPage from './pages/FulfillmentPage';
import LegMonitor from './pages/LegMonitor';
import ReportsPage from './pages/ReportsPage';
import SavedViews from './pages/SavedViews';
import RecentObjectsPage from './pages/RecentObjectsPage';
import Watchlists from './pages/Watchlists';
import MyQueues from './pages/MyQueues';

interface PageRouterProps {
  tabId: string;
  onSelectObject: (obj: Shipment | Exception | null) => void;
  onOpenTab: (tabId: string, tabName: string, subtitle?: string) => void;
}

export default function PageRouter({ tabId, onSelectObject, onOpenTab }: PageRouterProps) {
  // Route shipment detail pages
  if (tabId.startsWith('shipment-detail-')) {
    const shipmentId = tabId.replace('shipment-detail-', '');
    return <ShipmentDetail shipmentId={shipmentId} onOpenTab={onOpenTab} onSelectShipment={(s) => onSelectObject(s)} />;
  }

  switch (tabId) {
    case 'ops-dashboard':
      return <OpsDashboard onOpenTab={onOpenTab} />;
    case 'sla-overview':
      return <SlaOverview onOpenTab={onOpenTab} />;
    case 'network-health':
      return <NetworkHealth onOpenTab={onOpenTab} />;
    case 'shipment-monitor':
      return (
        <ShipmentMonitor
          onSelectShipment={(s) => onSelectObject(s)}
          onOpenDetail={(id) => {
            const s = shipments.find((sh) => sh.id === id);
            const subtitle = s ? `${(shipmentStatusConfig[s.status]?.label || s.status)} \u00b7 ${s.riskLevel}` : '';
            onOpenTab(`shipment-detail-${id}`, `Shipment ${id}`, subtitle);
          }}
        />
      );
    case 'order-list':
      return <OrderList onOpenTab={onOpenTab} />;
    case 'exception-queue':
      return (
        <ExceptionWorkbench
          onSelectException={(e) => onSelectObject(e)}
          onOpenObject={(id) => onOpenTab(`shipment-detail-${id}`, `Shipment ${id}`)}
        />
      );
    case 'tracking-center':
      return <TrackingCenter onOpenTab={onOpenTab} />;
    case 'carrier-ops':
      return <CarrierOps onOpenTab={onOpenTab} />;
    case 'routing':
      return <RoutingPage onOpenTab={onOpenTab} />;
    case 'billing':
      return <BillingPage onOpenTab={onOpenTab} />;
    case 'fulfillment':
      return <FulfillmentPage onOpenTab={onOpenTab} />;
    case 'leg-monitor':
      return <LegMonitor onOpenTab={onOpenTab} />;
    case 'reports':
      return <ReportsPage onOpenTab={onOpenTab} />;
    case 'saved-views':
      return <SavedViews onOpenTab={onOpenTab} />;
    case 'recent-objects':
      return <RecentObjectsPage onOpenTab={onOpenTab} />;
    case 'watchlists':
      return <Watchlists onOpenTab={onOpenTab} />;
    case 'my-queues':
      return <MyQueues onOpenTab={onOpenTab} />;
    case 'config':
    case 'audit':
      return <ConfigPage onOpenTab={onOpenTab} />;
    default:
      return (
        <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
          <div className="text-center">
            <div className="text-[32px] mb-3 opacity-20">
              {(() => { const Icon = lomsTabIconMap[tabId] || Layers; return <Icon size={48} className="mx-auto" />; })()}
            </div>
            <p className="text-[16px] mb-1 text-idpxyz-text">{lomsTabNameMap[tabId] || tabId}</p>
            <p className="text-[12px]">This module is under development</p>
          </div>
        </div>
      );
  }
}
