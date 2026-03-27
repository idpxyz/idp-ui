import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@idpxyz/ui-primitives';

const OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
] as const;

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[11px] text-idpxyz-textMuted whitespace-nowrap">{t('app.language')}</span>
      <Select
        value={i18n.language.startsWith('zh') ? 'zh' : 'en'}
        onValueChange={(v) => void i18n.changeLanguage(v)}
      >
        <SelectTrigger className="h-7 w-[120px] text-[11px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
