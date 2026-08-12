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

type IconComponent = React.ComponentType<{ size?: number | string; strokeWidth?: number | string; className?: string }>;

export interface ActivityBarItem {
  id: string;
  icon: IconComponent;
  label: string;
}

interface ActivityBarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  /** Top icon stack; defaults to the legacy five demo entries. Pass your own
   *  list (e.g. a single Operations entry) to converge the rail. */
  topItems?: ActivityBarItem[];
  /** Bottom icon stack; defaults to the legacy Account/Settings pair. Pass []
   *  to drop it. */
  bottomItems?: ActivityBarItem[];
  /** The theme toggle is real behavior and stays on by default. */
  showThemeToggle?: boolean;
}

const DEFAULT_TOP_ITEMS: ActivityBarItem[] = [
  { id: 'explorer', icon: LayoutDashboard, label: 'Operations' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'shipments', icon: Truck, label: 'Logistics' },
  { id: 'exceptions', icon: AlertTriangle, label: 'Alerts' },
  { id: 'carrier', icon: Radio, label: 'Status' },
];

const DEFAULT_BOTTOM_ITEMS: ActivityBarItem[] = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function ActivityBar({
  activeItem,
  onItemClick,
  topItems = DEFAULT_TOP_ITEMS,
  bottomItems = DEFAULT_BOTTOM_ITEMS,
  showThemeToggle = true,
}: ActivityBarProps) {
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
          {showThemeToggle && (
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="w-full h-11 rounded-none text-idpxyz-textMuted hover:text-idpxyz-textBright border-l-[3px] border-transparent"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? <Sun size={22} strokeWidth={1.6} /> : <Moon size={22} strokeWidth={1.6} />}
            </Button>
          )}
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
