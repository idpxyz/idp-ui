import { useTranslation } from 'react-i18next';
import { ChevronRight, Loader2 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '@idpxyz/ui-primitives';
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription, StatusBadge } from '@idpxyz/ui-patterns';
import { getZoneById } from '../../mocks/zones';
import { dataLocaleKey, pickLocalizedDescription, pickLocalizedName } from '../../i18n/dataLocale';
import type { ComponentProps } from 'react';
import { isApiError } from '../../shared/api/errors';
import { useProductDetailQuery } from '../../shared/api/hooks/useProducts';

interface ProductDetailPageProps {
  productId: string;
}

function productStatusBadge(status: string): ComponentProps<typeof StatusBadge>['status'] {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'pending';
    case 'sunset':
      return 'warning';
    case 'deprecated':
      return 'danger';
    default:
      return 'neutral';
  }
}

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const { t, i18n } = useTranslation();
  const lng = dataLocaleKey(i18n);
  const otherLng = lng === 'en-US' ? 'zh-CN' : 'en-US';

  const { data: entry, isPending, isError, error, refetch } = useProductDetailQuery(productId);

  if (isPending && !entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-2">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" aria-hidden />
        <p className="text-[12px]">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError && !entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-3 p-6">
        <p className="text-[13px] text-center max-w-md">
          {isApiError(error) ? error.message : t('api.loadError')}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted text-[13px]">
        {t('detail.notFound')}
      </div>
    );
  }

  const { product, commercial, version, physical_limit, origins, zone_destinations, destinations, fulfillments } = entry;

  const title = pickLocalizedName(entry, lng);
  const desc = pickLocalizedDescription(entry, lng);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor min-h-0">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-idpxyz-breadcrumb bg-idpxyz-editor border-b border-idpxyz-border shrink-0 select-none">
        <span className="text-idpxyz-textMuted hover:text-idpxyz-text cursor-pointer">{t('breadcrumb.parcel')}</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-textMuted">{t('breadcrumb.products')}</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-text truncate">{product.code}</span>
      </div>

      <PageHeader>
        <PageHeaderContent>
          <div className="flex items-center gap-2 min-w-0">
            <PageHeaderTitle className="truncate">{title}</PageHeaderTitle>
            <Badge variant="outline">{product.kind}</Badge>
            <StatusBadge status={productStatusBadge(product.status)}>
              {t(`productStatus.${product.status}`, { defaultValue: product.status })}
            </StatusBadge>
          </div>
          <PageHeaderDescription className="mt-0.5">
            {desc} · v{version.version_seq} · {t('detail.effective')} {version.effective_from}
            {version.effective_to ? ` → ${version.effective_to}` : ''}
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <div className="flex-1 overflow-auto min-h-0 px-3 pb-3">
        <Tabs defaultValue="overview" className="flex flex-col gap-3">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">{t('detail.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="physical">{t('detail.tabs.physical')}</TabsTrigger>
            <TabsTrigger value="reach">{t('detail.tabs.reach')}</TabsTrigger>
            <TabsTrigger value="fulfillment">{t('detail.tabs.fulfillment')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <Card className="border-idpxyz-border bg-idpxyz-panelBg">
              <CardHeader className="py-3">
                <CardTitle className="text-[12px]">{t('detail.commercial')}</CardTitle>
              </CardHeader>
              <CardContent className="text-[12px] space-y-2 text-idpxyz-text">
                <div>
                  <span className="text-idpxyz-textMuted">{t('detail.otherLocaleLabel')}</span>{' '}
                  <span>{pickLocalizedName(entry, otherLng)}</span>
                </div>
                <div>
                  <span className="text-idpxyz-textMuted">{t('detail.channels')}</span>{' '}
                  {commercial.sales_channels.join(', ')}
                </div>
                <div>
                  <span className="text-idpxyz-textMuted">{t('detail.versionStatus')}</span>{' '}
                  <Badge variant="accent">{version.status}</Badge>
                  {version.changelog ? (
                    <span className="block mt-2 text-idpxyz-textMuted">{version.changelog}</span>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="physical" className="mt-0">
            <Card className="border-idpxyz-border bg-idpxyz-panelBg">
              <CardHeader className="py-3">
                <CardTitle className="text-[12px]">{t('detail.physicalTableTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-idpxyz-textMuted w-[200px]">{t('detail.weightG')}</TableCell>
                      <TableCell>
                        {physical_limit.min_weight_g} – {physical_limit.max_weight_g}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-idpxyz-textMuted">{t('detail.lwhMm')}</TableCell>
                      <TableCell>
                        {[physical_limit.max_length_mm, physical_limit.max_width_mm, physical_limit.max_height_mm]
                          .map((x) => (x == null ? '—' : String(x)))
                          .join(' × ')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-idpxyz-textMuted">{t('detail.maxDimSum')}</TableCell>
                      <TableCell>{physical_limit.max_dim_sum_mm ?? '—'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-idpxyz-textMuted">{t('detail.pieceMax')}</TableCell>
                      <TableCell>{physical_limit.piece_count_max ?? '—'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-idpxyz-textMuted">{t('detail.dimensionsRequired')}</TableCell>
                      <TableCell>{physical_limit.dimensions_required ? t('detail.yes') : t('detail.no')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reach" className="mt-0 space-y-3">
            <Card className="border-idpxyz-border bg-idpxyz-panelBg">
              <CardHeader className="py-3">
                <CardTitle className="text-[12px]">{t('detail.origins')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px]">{t('detail.colCountry')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colWarehouse')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colNote')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {origins.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.country_code ?? '—'}</TableCell>
                        <TableCell>{o.warehouse_id ?? '—'}</TableCell>
                        <TableCell className="text-idpxyz-textMuted">{o.remark_internal ?? ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-idpxyz-border bg-idpxyz-panelBg">
              <CardHeader className="py-3">
                <CardTitle className="text-[12px]">{t('detail.zoneDest')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px]">{t('detail.colZoneId')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colCode')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colPolicy')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zone_destinations.map((z) => {
                      const zone = getZoneById(z.zone_id);
                      return (
                        <TableRow key={z.id}>
                          <TableCell className="font-mono text-[11px]">{z.zone_id}</TableCell>
                          <TableCell>{zone?.code ?? '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{z.policy}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {destinations.length > 0 ? (
              <Card className="border-idpxyz-border bg-idpxyz-panelBg">
                <CardHeader className="py-3">
                  <CardTitle className="text-[12px]">{t('detail.destExceptions')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px]">{t('detail.colCountry')}</TableHead>
                        <TableHead className="text-[11px]">{t('detail.colMatch')}</TableHead>
                        <TableHead className="text-[11px]">{t('detail.colPolicy')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinations.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>{d.country_code}</TableCell>
                          <TableCell className="text-[11px]">{d.match_kind}</TableCell>
                          <TableCell>
                            <StatusBadge status={d.policy === 'DENY' ? 'danger' : 'success'}>{d.policy}</StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="fulfillment" className="mt-0">
            <Card className="border-idpxyz-border bg-idpxyz-panelBg">
              <CardHeader className="py-3">
                <CardTitle className="text-[12px]">{t('detail.fulfillmentTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[11px]">{t('detail.colPri')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colNetwork')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colCarrierProduct')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colAdapter')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colBooking')}</TableHead>
                      <TableHead className="text-[11px]">{t('detail.colOn')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fulfillments.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>{f.priority}</TableCell>
                        <TableCell>{f.network_carrier_code ?? '—'}</TableCell>
                        <TableCell className="font-mono text-[11px] max-w-[180px] truncate" title={f.carrier_product_code}>
                          {f.carrier_product_code}
                        </TableCell>
                        <TableCell className="text-[11px]">{f.tracking_adapter}</TableCell>
                        <TableCell>{f.booking_mode}</TableCell>
                        <TableCell>{f.enabled ? t('detail.yes') : t('detail.no')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
