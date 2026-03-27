import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { parseProductDetailTab, parcelTabIconMap, PARCEL_NAV_TAB_KEYS } from './navigation';
import WelcomePage from '../welcome/WelcomePage';
import ProductCatalogPage from '../product-catalog/ProductCatalogPage';
import ProductDetailPage from '../product-detail/ProductDetailPage';
import ZonesPage from '../zones/ZonesPage';

interface PageRouterProps {
  tabId: string;
  onOpenTab: (tabId: string, tabName: string, subtitle?: string) => void;
}

export default function PageRouter({ tabId, onOpenTab }: PageRouterProps) {
  const { t } = useTranslation();

  const detailId = parseProductDetailTab(tabId);
  if (detailId) {
    return <ProductDetailPage productId={detailId} />;
  }

  switch (tabId) {
    case 'welcome':
      return <WelcomePage onOpenTab={onOpenTab} />;
    case 'product-catalog':
      return <ProductCatalogPage onOpenTab={onOpenTab} />;
    case 'zones':
      return <ZonesPage />;
    default: {
      const Icon = parcelTabIconMap[tabId] ?? Package;
      const key = PARCEL_NAV_TAB_KEYS[tabId];
      const title = key ? t(key) : tabId;
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-2 p-6">
          <Icon size={48} className="opacity-20" />
          <p className="text-[15px] text-idpxyz-text">{title}</p>
          <p className="text-[12px]">{t('tabs.unknownPage')}</p>
        </div>
      );
    }
  }
}
