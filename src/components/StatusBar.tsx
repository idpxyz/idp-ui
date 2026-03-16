import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle,
  Truck,
  Wifi,
  Shield,
  Rows3,
  Rows4,
} from 'lucide-react';
import { useDensity } from '../contexts/DensityContext';
import { Button } from './ui/button';

interface StatusBarProps {
  commandFeedback?: string | null;
}

export default function StatusBar({ commandFeedback }: StatusBarProps) {
  const { density, toggleDensity } = useDensity();
  return (
    <div className="h-[22px] bg-vscode-statusBar flex items-center justify-between px-2 text-white text-[12px] select-none shrink-0">
      <div className="flex items-center gap-3">
        {commandFeedback && (
          <div className="flex items-center gap-1 rounded-sm bg-vscode-statusHover px-1.5 py-0.5">
            <CheckCircle size={12} />
            <span className="max-w-[320px] truncate">{commandFeedback}</span>
          </div>
        )}
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <Truck size={12} />
          <span>142 Active</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <AlertCircle size={12} className="text-red-400" />
          <span>2 Breached</span>
          <AlertTriangle size={12} className="ml-0.5 text-yellow-400" />
          <span>2 At Risk</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <AlertTriangle size={12} className="text-orange-400" />
          <span>7 Open Cases</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={toggleDensity}
          variant="ghost"
          size="sm"
          className="h-[18px] px-1.5 hover:bg-vscode-statusHover"
          title={`List density: ${density === 'compact' ? 'Compact' : 'Comfortable'}`}
        >
          {density === 'compact' ? <Rows4 size={12} /> : <Rows3 size={12} />}
          <span className="capitalize">{density}</span>
        </Button>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <Wifi size={12} className="text-green-400" />
          <span>All Carriers Online</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <CheckCircle size={12} className="text-green-400" />
          <span>Sync OK</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:bg-vscode-statusHover px-1 rounded-sm">
          <Shield size={12} />
          <span>Ops Controller</span>
        </div>
        <Bell size={12} className="cursor-pointer hover:bg-vscode-statusHover rounded-sm" />
      </div>
    </div>
  );
}



