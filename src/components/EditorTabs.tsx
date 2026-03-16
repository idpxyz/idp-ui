import {
  X,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  List,
} from 'lucide-react';
import { Button } from './ui/button';

export interface Tab {
  id: string;
  name: string;
  modified?: boolean;
}

interface EditorTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
}

const tabIconMap: Record<string, React.ElementType> = {
  '\u4eea\u8868\u76d8': LayoutDashboard,
  '\u8ba2\u5355\u7ba1\u7406': ShoppingCart,
  '\u5168\u90e8\u8ba2\u5355': List,
  '\u5f85\u5904\u7406': ShoppingCart,
  '\u5904\u7406\u4e2d': ShoppingCart,
  '\u5df2\u53d1\u8d27': ShoppingCart,
  '\u5df2\u5b8c\u6210': ShoppingCart,
  '\u5df2\u53d6\u6d88': ShoppingCart,
  '\u5ba2\u6237\u7ba1\u7406': Users,
  '\u5546\u54c1\u7ba1\u7406': Package,
  '\u62a5\u8868\u7edf\u8ba1': BarChart3,
  '\u7cfb\u7edf\u8bbe\u7f6e': Settings,
};

const getTabIcon = (name: string) => {
  const Icon = tabIconMap[name];
  if (Icon) return <Icon size={13} className="mr-1.5 shrink-0 text-vscode-textMuted" />;
  return <List size={13} className="mr-1.5 shrink-0 text-vscode-textMuted" />;
};

export default function EditorTabs({ tabs, activeTab, onTabClick, onTabClose }: EditorTabsProps) {
  return (
    <div className="flex items-end bg-vscode-tab h-[35px] overflow-x-auto shrink-0 select-none border-b border-vscode-border">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center h-[35px] px-3 cursor-pointer text-[13px] border-r border-vscode-tabBorder min-w-0 shrink-0 relative
            ${activeTab === tab.id
              ? 'bg-vscode-tabActive text-vscode-textBright border-t border-t-vscode-accent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-vscode-accent'
              : 'bg-vscode-tab text-vscode-textMuted hover:bg-vscode-hover border-t border-t-transparent'
            }`}
          onClick={() => onTabClick(tab.id)}
        >
          {getTabIcon(tab.name)}
          <span className="truncate mr-2">{tab.name}</span>
          {tab.modified && (
            <span className="w-2 h-2 rounded-full bg-white mr-1 shrink-0" />
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            variant="ghost"
            size="icon"
            className={`h-5 w-5 shrink-0 transition-opacity ${
              activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <X size={14} />
          </Button>
        </div>
      ))}
    </div>
  );
}



