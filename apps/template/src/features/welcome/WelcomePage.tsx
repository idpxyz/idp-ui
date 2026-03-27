import { useTranslation } from 'react-i18next';
import { Package, MapPinned, BookOpen } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@idpxyz/ui-primitives';

interface WelcomePageProps {
  onOpenTab: (tabId: string, tabName: string, subtitle?: string) => void;
}

export default function WelcomePage({ onOpenTab }: WelcomePageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-idpxyz-editor">
      <div className="px-6 py-4 border-b border-idpxyz-border text-[12px] text-idpxyz-breadcrumb shrink-0">
        <span className="text-idpxyz-text">{t('breadcrumb.parcel')}</span>
        <span className="text-idpxyz-textMuted mx-1">/</span>
        <span className="text-idpxyz-textBright">{t('breadcrumb.welcome')}</span>
      </div>
      <div className="flex-1 p-6 max-w-3xl">
        <h1 className="text-[18px] font-semibold text-idpxyz-textBright mb-1">{t('welcome.title')}</h1>
        <p className="text-[12px] text-idpxyz-textMuted mb-6">{t('welcome.intro')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="border-idpxyz-border bg-idpxyz-panelBg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-idpxyz-accent" />
                <CardTitle className="text-[13px]">{t('welcome.cardProductsTitle')}</CardTitle>
              </div>
              <CardDescription className="text-[11px]">{t('welcome.cardProductsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onOpenTab('product-catalog', t('tabs.productCatalog'))}
              >
                {t('welcome.cardProductsCta')}
              </Button>
            </CardContent>
          </Card>
          <Card className="border-idpxyz-border bg-idpxyz-panelBg">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <MapPinned size={16} className="text-idpxyz-accent" />
                <CardTitle className="text-[13px]">{t('welcome.cardZonesTitle')}</CardTitle>
              </div>
              <CardDescription className="text-[11px]">{t('welcome.cardZonesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" size="sm" onClick={() => onOpenTab('zones', t('tabs.zones'))}>
                {t('welcome.cardZonesCta')}
              </Button>
            </CardContent>
          </Card>
        </div>
        <p className="mt-8 text-[11px] text-idpxyz-textMuted flex items-start gap-2">
          <BookOpen size={14} className="shrink-0 mt-0.5" />
          <span>{t('welcome.hint')}</span>
        </p>
      </div>
    </div>
  );
}
