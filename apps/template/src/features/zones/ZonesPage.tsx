import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@idpxyz/ui-primitives';
import { PageHeader, PageHeaderContent, PageHeaderTitle, PageHeaderDescription } from '@idpxyz/ui-patterns';
import { ZONE_SCHEMA_RETAIL_2025, ZONES, ZONE_COUNTRY_DEFAULTS, getZoneById } from '../../mocks/zones';

export default function ZonesPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-idpxyz-editor min-h-0">
      <div className="flex items-center h-[22px] px-3 text-[12px] text-idpxyz-breadcrumb bg-idpxyz-editor border-b border-idpxyz-border shrink-0 select-none">
        <span className="text-idpxyz-textMuted">{t('breadcrumb.parcel')}</span>
        <ChevronRight size={14} className="mx-0.5 text-idpxyz-textMuted" />
        <span className="text-idpxyz-text">{t('breadcrumb.zones')}</span>
      </div>

      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>{t('zones.title')}</PageHeaderTitle>
          <PageHeaderDescription>
            {t('zones.subtitle', { code: ZONE_SCHEMA_RETAIL_2025.code })}
          </PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>

      <div className="flex-1 overflow-auto p-3 min-h-0 space-y-4">
        <div className="rounded border border-idpxyz-border bg-idpxyz-panelBg px-3 py-2 text-[12px]">
          <div className="text-idpxyz-textBright font-medium">{ZONE_SCHEMA_RETAIL_2025.name}</div>
          <div className="text-[11px] text-idpxyz-textMuted mt-1">
            {t('zones.schemaStatus', { id: ZONE_SCHEMA_RETAIL_2025.id, status: ZONE_SCHEMA_RETAIL_2025.status })}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-idpxyz-textMuted uppercase tracking-wider mb-2">
            {t('zones.zonesHeading')}
          </h3>
          <div className="rounded border border-idpxyz-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">{t('zones.colCode')}</TableHead>
                  <TableHead className="text-[11px]">{t('zones.colName')}</TableHead>
                  <TableHead className="text-[11px]">{t('zones.colId')}</TableHead>
                  <TableHead className="text-[11px]">{t('zones.colStatus')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ZONES.map((z) => (
                  <TableRow key={z.id}>
                    <TableCell className="font-mono text-[11px]">{z.code}</TableCell>
                    <TableCell>{z.name}</TableCell>
                    <TableCell className="text-[11px] text-idpxyz-textMuted font-mono">{z.id}</TableCell>
                    <TableCell>
                      <Badge variant={z.status === 'active' ? 'success' : 'default'}>{z.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-idpxyz-textMuted uppercase tracking-wider mb-2">
            {t('zones.countryMapHeading')}
          </h3>
          <div className="rounded border border-idpxyz-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[11px]">{t('zones.colCountry')}</TableHead>
                  <TableHead className="text-[11px]">{t('zones.colZoneId')}</TableHead>
                  <TableHead className="text-[11px]">{t('zones.colZoneCode')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ZONE_COUNTRY_DEFAULTS.map((m) => {
                  const z = getZoneById(m.zone_id);
                  return (
                    <TableRow key={`${m.country_code}-${m.zone_id}`}>
                      <TableCell className="font-mono">{m.country_code}</TableCell>
                      <TableCell className="text-[11px] font-mono text-idpxyz-textMuted">{m.zone_id}</TableCell>
                      <TableCell>{z?.code ?? '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
