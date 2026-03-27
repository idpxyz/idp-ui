import { IconLayers } from '@idpxyz/ui-icons';
import { orders, orderStatusConfig, type SidebarSelection } from './data/oms';
import { omsTabIconMap, omsTabNameMap } from './navigation';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import OrderDetail from './pages/OrderDetail';
import ExceptionCenter from './pages/ExceptionCenter';
import ChannelStorePage from './pages/ChannelStore';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';
import ProductCreate from './pages/ProductCreate';
import PromotionManagement from './pages/PromotionManagement';
import CouponManagement from './pages/CouponManagement';
import PromotionCreate from './pages/PromotionCreate';
import CouponCreate from './pages/CouponCreate';
import PromotionSimulator from './pages/PromotionSimulator';
import RulesManagement from './pages/RulesManagement';
import FulfillmentCenter from './pages/FulfillmentCenter';
import ReturnsRefunds from './pages/ReturnsRefunds';
import CustomerManagement from './pages/CustomerManagement';
import CustomerDetail from './pages/CustomerDetail';
import MemberLoyalty from './pages/MemberLoyalty';
import POSTerminal from './pages/POSTerminal';
import PickupVerification from './pages/PickupVerification';
import POSHistory from './pages/POSHistory';

interface PageRouterProps {
  tabId: string;
  onSelectObject: (obj: SidebarSelection | null) => void;
  onOpenTab: (tabId: string, tabName: string, subtitle?: string) => void;
  isPOSFocusMode?: boolean;
  onTogglePOSFocusMode?: (next: boolean) => void;
}

export default function PageRouter({ tabId, onSelectObject, onOpenTab, isPOSFocusMode = false, onTogglePOSFocusMode }: PageRouterProps) {
  // Route customer detail pages
  if (tabId.startsWith('customer-detail-')) {
    const customerId = tabId.replace('customer-detail-', '');
    return (
      <CustomerDetail
        customerId={customerId}
        onBack={() => onOpenTab('customers', '客户管理')}
      />
    );
  }

  // Route order detail pages
  if (tabId.startsWith('order-detail-')) {
    const orderId = tabId.replace('order-detail-', '');
    return (
      <OrderDetail
        orderId={orderId}
        onBack={() => onOpenTab('orders', '订单列表')}
      />
    );
  }

  switch (tabId) {
    case 'dashboard':
      return (
        <Dashboard
          onOpenTab={(navId) => {
            const name = omsTabNameMap[navId] || navId;
            onOpenTab(navId, name);
          }}
        />
      );
    case 'orders':
      return (
        <OrdersList
          onSelectOrder={(o) => onSelectObject({ kind: 'order', payload: o })}
          onOpenOrderDetail={(orderId) => {
            const o = orders.find((od) => od.id === orderId);
            const subtitle = o ? `${orderStatusConfig[o.status].label} · ${o.customerName}` : '';
            onOpenTab(`order-detail-${orderId}`, `订单 ${orderId}`, subtitle);
          }}
        />
      );
    case 'exceptions':
      return (
        <ExceptionCenter
          onOpenOrder={(orderId) => {
            const o = orders.find((od) => od.id === orderId);
            const subtitle = o ? `${orderStatusConfig[o.status].label} · ${o.customerName}` : '';
            onOpenTab(`order-detail-${orderId}`, `订单 ${orderId}`, subtitle);
          }}
        />
      );
    case 'fulfillment':
      return (
        <FulfillmentCenter
          onSelectOrder={(o) => onSelectObject({ kind: 'order', payload: o })}
          onOpenOrderDetail={(orderId) => {
            const o = orders.find((od) => od.id === orderId);
            const subtitle = o ? `${orderStatusConfig[o.status].label} · ${o.customerName}` : '';
            onOpenTab(`order-detail-${orderId}`, `订单 ${orderId}`, subtitle);
          }}
        />
      );
    case 'returns':
      return (
        <ReturnsRefunds
          onSelectOrder={(o) => onSelectObject({ kind: 'order', payload: o })}
          onOpenOrderDetail={(orderId) => {
            const o = orders.find((od) => od.id === orderId);
            const subtitle = o ? `${orderStatusConfig[o.status].label} · ${o.customerName}` : '';
            onOpenTab(`order-detail-${orderId}`, `订单 ${orderId}`, subtitle);
          }}
        />
      );
    case 'customers':
      return (
        <CustomerManagement
          onOpenTab={(tabId, tabName, subtitle) => onOpenTab(tabId, tabName, subtitle)}
          onSelectObject={onSelectObject}
        />
      );
    case 'member-loyalty':
      return <MemberLoyalty />;
    case 'channels':
      return (
        <ChannelStorePage
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
        />
      );
    case 'categories':
      return (
        <CategoryManagement
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
        />
      );
    case 'products':
      return (
        <ProductManagement
          onOpenTab={(tabId, tabName, subtitle) => onOpenTab(tabId, tabName, subtitle)}
          onSelectObject={onSelectObject}
        />
      );
    case 'product-create':
      return (
        <ProductCreate
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
          onBack={() => onOpenTab('products', '商品管理')}
        />
      );
    case 'promotions':
      return (
        <PromotionManagement
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
          onSelectObject={onSelectObject}
        />
      );
    case 'coupons':
      return (
        <CouponManagement
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
          onSelectObject={onSelectObject}
        />
      );
    case 'promotion-create':
      return (
        <PromotionCreate
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
          onBack={() => onOpenTab('promotions', '促销管理')}
        />
      );
    case 'coupon-create':
      return (
        <CouponCreate
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
          onBack={() => onOpenTab('coupons', '优惠券管理')}
        />
      );
    case 'promo-simulator':
      return (
        <PromotionSimulator
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
        />
      );
    case 'rules':
      return <RulesManagement />;
    case 'pos-terminal':
      return (
        <POSTerminal
          onOpenTab={(tabId, tabName, subtitle) => onOpenTab(tabId, tabName, subtitle)}
          onSelectObject={onSelectObject}
          isFocusMode={isPOSFocusMode}
          onToggleFocusMode={onTogglePOSFocusMode}
        />
      );
    case 'pos-pickup':
      return (
        <PickupVerification
          onOpenTab={(tabId, tabName) => onOpenTab(tabId, tabName)}
        />
      );
    case 'pos-history':
      return (
        <POSHistory
          onSelectObject={onSelectObject}
        />
      );
    default:
      return (
        <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted">
          <div className="text-center">
            <div className="text-[32px] mb-3 opacity-20">
              {(() => { const Icon = omsTabIconMap[tabId] || IconLayers; return <Icon size={48} className="mx-auto" />; })()}
            </div>
            <p className="text-[16px] mb-1 text-idpxyz-text">{omsTabNameMap[tabId] || tabId}</p>
            <p className="text-[12px]">此模块正在开发中</p>
          </div>
        </div>
      );
  }
}
