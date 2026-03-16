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
import { useTheme } from '../ThemeContext';
import { Button } from './ui/button';

interface ActivityBarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const topItems = [
  { id: 'explorer', icon: LayoutDashboard, label: 'Operations' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'shipments', icon: Truck, label: 'Shipments' },
  { id: 'exceptions', icon: AlertTriangle, label: 'Exceptions' },
  { id: 'carrier', icon: Radio, label: 'Carrier Ops' },
];

const bottomItems = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function ActivityBar({ activeItem, onItemClick }: ActivityBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-12 bg-vscode-activityBar border-r border-vscode-border flex flex-col justify-between items-center py-1 select-none shrink-0">
      <div className="flex flex-col items-center w-full">
        {topItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            variant="ghost"
            size="icon"
            className={`w-full h-12 rounded-none relative group
              ${activeItem === item.id
                ? 'text-white border-l-2 border-white'
                : 'text-vscode-textMuted hover:text-white border-l-2 border-transparent'
              }`}
            title={item.label}
          >
            <item.icon size={24} strokeWidth={1.5} />
          </Button>
        ))}
      </div>
      <div className="flex flex-col items-center w-full">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="w-full h-12 rounded-none text-vscode-textMuted hover:text-white"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? <Sun size={24} strokeWidth={1.5} /> : <Moon size={24} strokeWidth={1.5} />}
        </Button>
        {bottomItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            variant="ghost"
            size="icon"
            className="w-full h-12 rounded-none text-vscode-textMuted hover:text-white"
            title={item.label}
          >
            <item.icon size={24} strokeWidth={1.5} />
          </Button>
        ))}
      </div>
    </div>
  );
}



