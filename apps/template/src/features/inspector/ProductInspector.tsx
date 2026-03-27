import { Trans, useTranslation } from 'react-i18next';
import { Loader2, Package } from 'lucide-react';
import { Badge } from '@idpxyz/ui-primitives';
import { parseProductDetailTab } from '../routing/navigation';
import { useProductDetailQuery } from '../../shared/api/hooks/useProducts';

interface ProductInspectorProps {
  activeTabId: string;
}

/** Right sidebar: quick summary when a product detail tab is active */
export default function ProductInspector({ activeTabId }: ProductInspectorProps) {
  const { t } = useTranslation();
  const productId = parseProductDetailTab(activeTabId);
  const { data: entry, isPending } = useProductDetailQuery(productId ?? undefined);

  if (!productId) {
    return (
      <div className="text-[12px] text-idpxyz-textMuted leading-relaxed">
        <Trans
          i18nKey="inspector.empty"
          components={{ strong: <strong className="text-idpxyz-text" /> }}
        />
      </div>
    );
  }

  if (isPending && !entry) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-idpxyz-textMuted">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-50" aria-hidden />
        <span>{t('common.loading')}</span>
      </div>
    );
  }

  if (!entry) {
    return <p className="text-[12px] text-idpxyz-textMuted leading-relaxed">{t('detail.notFound')}</p>;
  }

  const { product, version, physical_limit, fulfillments } = entry;

  return (
    <div className="space-y-3 text-[12px]">
      <div className="flex items-start gap-2">
        <Package size={14} className="text-idpxyz-accent shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="font-medium text-idpxyz-text truncate">{product.code}</div>
          <div className="text-[11px] text-idpxyz-textMuted">v{version.version_seq} · {version.status}</div>
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-idpxyz-textMuted mb-1">{t('inspector.weight')}</div>
        <div className="text-idpxyz-text">
          {physical_limit.min_weight_g} – {physical_limit.max_weight_g}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-idpxyz-textMuted mb-1">{t('inspector.lanes')}</div>
        <ul className="space-y-1">
          {fulfillments.slice(0, 3).map((f) => (
            <li key={f.id} className="flex items-center gap-1.5 text-[11px]">
              <Badge variant="outline" className="shrink-0">
                P{f.priority}
              </Badge>
              <span className="truncate text-idpxyz-text">{f.network_carrier_code ?? '—'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
