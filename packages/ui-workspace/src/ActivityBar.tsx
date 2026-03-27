import {
  LayoutDashboard,
  Search,
  Truck,
  AlertTriangle,
  Radio,
  Settings,
  User,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@idpxyz/ui-theme-runtime';
import { Button } from '@idpxyz/ui-primitives';
import { ShellColumnEdgeFlex } from './ShellColumnEdge';

interface ActivityBarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const topItems = [
  { id: 'explorer', icon: LayoutDashboard, label: 'Operations' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'shipments', icon: Truck, label: 'Logistics' },
  { id: 'exceptions', icon: AlertTriangle, label: 'Alerts' },
  { id: 'carrier', icon: Radio, label: 'Status' },
];

const bottomItems = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function ActivityBar({ activeItem, onItemClick }: ActivityBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-[52px] bg-idpxyz-activityBar flex flex-row shrink-0 select-none self-stretch py-1.5">
      <div className="flex flex-1 flex-col min-w-0 justify-between items-center">
        <div className="flex flex-col items-center w-full gap-0.5">
          {topItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              variant="ghost"
              size="icon"
              className={`w-full h-11 rounded-none relative group
              ${activeItem === item.id
                ? 'text-idpxyz-textBright border-l-[3px] border-idpxyz-accent bg-black/15'
                : 'text-idpxyz-textMuted hover:text-idpxyz-textBright border-l-[3px] border-transparent'
              }`}
              title={item.label}
            >
              <item.icon size={22} strokeWidth={1.6} />
            </Button>
          ))}
        </div>
        <div className="flex flex-col items-center w-full gap-0.5 mt-2">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="w-full h-11 rounded-none text-idpxyz-textMuted hover:text-idpxyz-textBright border-l-[3px] border-transparent"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun size={22} strokeWidth={1.6} /> : <Moon size={22} strokeWidth={1.6} />}
          </Button>
          {bottomItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              variant="ghost"
              size="icon"
              className="w-full h-11 rounded-none text-idpxyz-textMuted hover:text-idpxyz-textBright border-l-[3px] border-transparent"
              title={item.label}
            >
              <item.icon size={22} strokeWidth={1.6} />
            </Button>
          ))}
        </div>
      </div>
      <ShellColumnEdgeFlex />
    </div>
  );
}
