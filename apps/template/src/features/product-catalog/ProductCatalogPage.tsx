import { useMemo, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ExternalLink, Loader2 } from 'lucide-react';
import {
  DataGrid,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@idpxyz/ui-primitives';
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  FilterBar,
  FilterSearch,
  FilterGroup,
  FilterChip,
  StatusBadge,
} from '@idpxyz/ui-patterns';
import type { ProductCatalogEntry } from '../../mocks/types';
import { productDetailTabId, productDetailTabTitle } from '../routing/navigation';
import { dataLocaleKey } from '../../i18n/dataLocale';
import { isApiError } from '../../shared/api/errors';
import { useProductCatalogQuery } from '../../shared/api/hooks/useProducts';

interface ProductCatalogPageProps {
  onOpenTab: (tabId: string, tabName: string, subtitle?: string) => void;
}

type ProductKind = ProductCatalogEntry['product']['kind'];
type ProductStatus = ProductCatalogEntry['product']['status'];

function statusToBadge(status: ProductStatus): ComponentProps<typeof StatusBadge>['status'] {
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

export default function ProductCatalogPage({ onOpenTab }: ProductCatalogPageProps) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | ProductKind>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');

  const lng = dataLocaleKey(i18n);
  const { data: catalog = [], isPending, isError, error, refetch } = useProductCatalogQuery();

  const rows = useMemo(() => {
    return catalog.map((e) => ({
      id: e.product.id,
      code: e.product.code,
      kind: e.product.kind,
      status: e.product.status,
      name: e.commercial.display_name[lng],
      version: String(e.version.version_seq),
      effective: e.version.effective_from,
    })) as Record<string, unknown>[];
  }, [lng, catalog]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const kind = r.kind as ProductKind;
      const status = r.status as ProductStatus;
      if (kindFilter !== 'all' && kind !== kindFilter) return false;
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (!q) return true;
      return [r.code, r.name, r.id].some((x) => String(x).toLowerCase().includes(q));
    });
  }, [rows, search, kindFilter, statusFilter]);

  const columns = useMemo(
    () => [
      { key: 'code', header: t('catalog.colCode'), sortable: true, width: '140px' },
      { key: 'name', header: t('catalog.colName'), sortable: true },
      {
        key: 'kind',
        header: t('catalog.colKind'),
        sortable: true,
        width: '100px',
        render: (v: unknown) => (
          <Badge variant="outline" className="text-[10px] font-normal">
            {String(v)}
          </Badge>
        ),
      },
      {
        key: 'status',
        header: t('catalog.colStatus'),
        sortable: true,
        width: '110px',
        render: (v: unknown) => {
          const st = v as ProductStatus;
          return (
            <StatusBadge status={statusToBadge(st)}>
              {t(`productStatus.${st}`, { defaultValue: String(st) })}
            </StatusBadge>
          );
        },
      },
      { key: 'version', header: t('catalog.colVer'), sortable: true, width: '56px' },
      { key: 'effective', header: t('catalog.colEffective'), sortable: true, width: '110px' },
    ],
    [t],
  );

  const openDetail = (entry: ProductCatalogEntry) => {
    onOpenTab(productDetailTabId(entry.product.id), productDetailTabTitle(entry, lng), entry.product.code);
  };

  if (isPending && catalog.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-2 min-h-0">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" aria-hidden />
        <p className="text-[12px]">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError && catalog.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-idpxyz-editor text-idpxyz-textMuted gap-3 p-6 min-h-0">
        <p className="text-[13px] text-center max-w-md">
          {isApiError(error) ? error.message : t('api.loadError')}
        </p>
        <Button type="button" variant="secondary" size="sm" onClick={() => void refetch()}>
          {t('common.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor min-h-0">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-idpxyz-breadcrumb bg-idpxyz-editor border-b border-idpxyz-border shrink-0 select-none">
        <span className="text-idpxyz-textMuted">{t('breadcrumb.parcel')}</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-text">{t('breadcrumb.products')}</span>
      </div>

      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>{t('catalog.title')}</PageHeaderTitle>
          <PageHeaderDescription>{t('catalog.subtitle')}</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <span className="text-[11px] text-idpxyz-textMuted">{t('catalog.lineCount', { count: filtered.length })}</span>
        </PageHeaderActions>
      </PageHeader>

      <FilterBar>
        <FilterSearch
          placeholder={t('catalog.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
        <FilterGroup className="shrink-0">
          <span className="text-[10px] text-idpxyz-textMuted">{t('catalog.kind')}</span>
          <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
            <SelectTrigger className="h-6 w-[120px] text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('catalog.kindAll')}</SelectItem>
              <SelectItem value="POSTAL">POSTAL</SelectItem>
              <SelectItem value="COURIER">COURIER</SelectItem>
              <SelectItem value="DEFERRED">DEFERRED</SelectItem>
              <SelectItem value="LINE_HAUL">LINE_HAUL</SelectItem>
            </SelectContent>
          </Select>
        </FilterGroup>
        <FilterGroup className="flex flex-wrap gap-1">
          {(['all', 'active', 'draft', 'sunset', 'deprecated'] as const).map((s) => (
            <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {s === 'all' ? t('catalog.statusAll') : t(`productStatus.${s}`)}
            </FilterChip>
          ))}
        </FilterGroup>
      </FilterBar>

      <div className="flex-1 overflow-auto p-3 min-h-0">
        <DataGrid
          columns={columns}
          data={filtered}
          searchable={false}
          pageSize={12}
          onRowClick={(row) => {
            const entry = catalog.find((e) => e.product.id === row.id);
            if (entry) openDetail(entry);
          }}
          emptyMessage={t('catalog.empty')}
        />
        <div className="mt-2 flex justify-end">
          <Button type="button" variant="ghost" size="sm" className="text-[11px] gap-1" onClick={() => {}}>
            <ExternalLink size={12} />
            {t('catalog.exportMock')}
          </Button>
        </div>
      </div>
    </div>
  );
}
