import { useState, useMemo } from 'react';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconMoreH,
  IconRefresh,
  IconExternalLink,
  IconSettings,
  IconPause,
  IconPlay,
  IconTrash,
  IconGlobal,
  IconStore,
  IconTrending,
  IconOrder,
  IconCheckCircle,
  IconWarning,
  IconError,
  IconChevronRight,
  IconChevronDown,
  IconMail,
  IconUser,
  IconLink,
  IconClock,
  IconAutomation,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type Channel,
  type ChannelStore as ChannelStoreType,
  type ChannelType,
  type StoreStatus,
  channels as allChannels,
  channelStores as allStores,
  channelTypeConfig,
  storeStatusConfig,
} from '../data/oms';

interface ChannelStoreProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

const syncStatusIcon: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  ok: { icon: IconCheckCircle, color: 'text-green-400', label: '正常' },
  warning: { icon: IconWarning, color: 'text-yellow-400', label: '警告' },
  error: { icon: IconError, color: 'text-red-400', label: '错误' },
};

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

export default function ChannelStorePage({ onOpenTab }: ChannelStoreProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set(allChannels.map(c => c.id)));
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(allStores[0]?.id || null);
  const [activeView, setActiveView] = useState<'tree' | 'grid'>('tree');

  const savedViews = [
    { id: 'all', label: '全部' },
    { id: 'active', label: '运营中' },
    { id: 'issues', label: '异常' },
    { id: 'paused', label: '已暂停' },
  ];

  const [activeQuickView, setActiveQuickView] = useState('all');

  const filteredStores = useMemo(() => {
    let result = [...allStores];
    if (activeQuickView === 'active') result = result.filter(s => s.status === 'active');
    else if (activeQuickView === 'issues') result = result.filter(s => s.syncStatus !== 'ok' || s.status === 'disconnected');
    else if (activeQuickView === 'paused') result = result.filter(s => s.status === 'paused');
    if (typeFilter !== 'all') {
      const channelIds = allChannels.filter(c => c.type === typeFilter).map(c => c.id);
      result = result.filter(s => channelIds.includes(s.channelId));
    }
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchTerm, typeFilter, statusFilter, activeQuickView]);

  const toggleChannel = (id: string) => {
    setExpandedChannels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectedStore = allStores.find(s => s.id === selectedStoreId) || null;
  const selectedChannel = selectedStore ? allChannels.find(c => c.id === selectedStore.channelId) : null;

  // Group stores by channel for tree view
  const channelTree = useMemo(() => {
    return allChannels
      .filter(ch => {
        if (typeFilter !== 'all' && ch.type !== typeFilter) return false;
        return true;
      })
      .map(ch => ({
        channel: ch,
        stores: filteredStores.filter(s => s.channelId === ch.id),
      }))
      .filter(g => g.stores.length > 0 || typeFilter === 'all');
  }, [filteredStores, typeFilter]);

  // Summary stats
  const totalStores = allStores.length;
  const activeStores = allStores.filter(s => s.status === 'active').length;
  const issueStores = allStores.filter(s => s.syncStatus !== 'ok').length;
  const totalOrdersToday = allStores.reduce((sum, s) => sum + s.ordersToday, 0);

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor">
      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-3">
            <IconStore size={16} className="text-idpxyz-accent" />
            <h1 className="text-[14px] font-semibold text-idpxyz-textBright">渠道 / 店铺管理</h1>
            <span className="text-[11px] text-idpxyz-textMuted">{allChannels.length} 个渠道 · {totalStores} 个店铺</span>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedStore && selectedChannel && (
              <>
                <span className="text-[10px] text-idpxyz-textMuted mr-1 border-r border-idpxyz-border pr-2">{selectedStore.name}</span>
                <Button variant="ghost" size="sm"><IconRefresh size={12} /> 同步</Button>
                <Button variant="ghost" size="sm"><IconSettings size={12} /> 设置</Button>
                <Button variant="ghost" size="sm"><IconExternalLink size={12} /> 打开</Button>
                <Button variant="ghost" size="sm"><IconAutomation size={12} /> API 日志</Button>
                {selectedStore.status === 'active' ? (
                  <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300"><IconPause size={12} /> 暂停</Button>
                ) : selectedStore.status === 'paused' ? (
                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300"><IconPlay size={12} /> 恢复</Button>
                ) : null}
                {(selectedStore.status === 'disconnected' || selectedStore.status === 'archived') && (
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><IconTrash size={12} /> 删除</Button>
                )}
                <div className="w-px h-4 bg-idpxyz-border mx-1" />
              </>
            )}
            <Button variant="ghost" size="sm"><IconRefresh size={13} /> 同步全部</Button>
            <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
            <Button variant="default" size="sm"><IconPlus size={13} /> 接入店铺</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconGlobal size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]">
              <span className="text-idpxyz-textMuted">渠道</span>
              <span className="ml-1.5 text-idpxyz-textBright font-medium">{allChannels.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconStore size={13} className="text-green-400" />
            <div className="text-[11px]">
              <span className="text-idpxyz-textMuted">运营中</span>
              <span className="ml-1.5 text-idpxyz-textBright font-medium">{activeStores}/{totalStores}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconWarning size={13} className="text-yellow-400" />
            <div className="text-[11px]">
              <span className="text-idpxyz-textMuted">异常</span>
              <span className="ml-1.5 text-idpxyz-textBright font-medium">{issueStores}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconOrder size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]">
              <span className="text-idpxyz-textMuted">今日订单</span>
              <span className="ml-1.5 text-idpxyz-textBright font-medium">{totalOrdersToday}</span>
            </div>
          </div>
        </div>

        {/* Quick Views */}
        <div className="flex items-center gap-1 px-5 py-1.5 border-b border-idpxyz-border shrink-0 overflow-x-auto tab-scroll-hidden">
          {savedViews.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveQuickView(v.id)}
              className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
                activeQuickView === v.id
                  ? 'bg-idpxyz-accent/15 text-idpxyz-accent font-medium'
                  : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center bg-idpxyz-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[280px]">
            <IconSearch size={13} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="搜索店铺名称、ID、区域..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="all">全部类型</option>
            {Object.entries(channelTypeConfig).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="all">全部状态</option>
            {Object.entries(storeStatusConfig).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Channel → IconStore Tree */}
        <div className="flex-1 overflow-auto">
          {channelTree.map(({ channel, stores }) => (
            <div key={channel.id} className="border-b border-idpxyz-border">
              {/* Channel Header */}
              <div
                className="flex items-center gap-2 px-5 py-2 cursor-pointer hover:bg-idpxyz-hover select-none"
                onClick={() => toggleChannel(channel.id)}
              >
                {expandedChannels.has(channel.id) ? <IconChevronDown size={14} className="text-idpxyz-textMuted" /> : <IconChevronRight size={14} className="text-idpxyz-textMuted" />}
                <IconGlobal size={14} className="text-idpxyz-accent" />
                <span className="text-[12px] font-semibold text-idpxyz-textBright">{channel.name}</span>
                <StatusBadge {...channelTypeConfig[channel.type]} />
                <span className="text-[11px] text-idpxyz-textMuted ml-2">{stores.length} 个店铺</span>
                <span className="ml-auto text-[11px] text-idpxyz-textMuted">
                  30天订单 <span className="text-idpxyz-text font-medium">{channel.totalOrders30d.toLocaleString()}</span>
                </span>
                <span className="text-[11px] text-idpxyz-textMuted ml-4">
                  收入 <span className="text-idpxyz-textBright font-medium">{channel.currency} {channel.revenue30d.toLocaleString()}</span>
                </span>
              </div>

              {/* IconStore Rows */}
              {expandedChannels.has(channel.id) && (
                <div>
                  {stores.map(store => {
                    const ss = storeStatusConfig[store.status];
                    const sync = syncStatusIcon[store.syncStatus];
                    const SyncIcon = sync.icon;
                    return (
                      <div
                        key={store.id}
                        onClick={() => setSelectedStoreId(store.id)}
                        className={`flex items-center gap-3 pl-12 pr-5 py-2 cursor-pointer transition-colors border-t border-idpxyz-border/50 ${
                          selectedStoreId === store.id ? 'bg-idpxyz-activeItem' : 'hover:bg-idpxyz-hover'
                        }`}
                      >
                        <IconStore size={13} className="text-idpxyz-textMuted shrink-0" />
                        <div className="min-w-[180px]">
                          <div className="text-[12px] text-idpxyz-text font-medium">{store.name}</div>
                          <div className="text-[10px] text-idpxyz-textMuted">{store.id} · {store.region}</div>
                        </div>
                        <StatusBadge {...ss} />
                        <div className="flex items-center gap-1 ml-2">
                          <SyncIcon size={11} className={sync.color} />
                          <span className={`text-[10px] ${sync.color}`}>{sync.label}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-6 text-[11px]">
                          <div className="text-center min-w-[50px]">
                            <div className="text-idpxyz-textMuted">今日</div>
                            <div className="text-idpxyz-textBright font-medium">{store.ordersToday}</div>
                          </div>
                          <div className="text-center min-w-[50px]">
                            <div className="text-idpxyz-textMuted">30天</div>
                            <div className="text-idpxyz-textBright font-medium">{store.orders30d}</div>
                          </div>
                          <div className="text-right min-w-[100px]">
                            <div className="text-idpxyz-textMuted">30天收入</div>
                            <div className="text-idpxyz-textBright font-medium">{store.currency} {store.revenue30d.toLocaleString()}</div>
                          </div>
                          <div className="text-right min-w-[120px]">
                            <div className="text-idpxyz-textMuted">最近同步</div>
                            <div className="text-idpxyz-text text-[10px]">{store.lastSyncAt}</div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-5 w-5"><IconMoreH size={12} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {stores.length === 0 && (
                    <div className="pl-12 pr-5 py-3 text-[11px] text-idpxyz-textMuted border-t border-idpxyz-border/50">
                      此渠道下无匹配店铺
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {channelTree.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-idpxyz-textMuted">
              没有匹配当前筛选条件的渠道或店铺
            </div>
          )}
        </div>
      </div>

      {/* Right Inspector Panel */}
      <div className="w-[300px] border-l border-idpxyz-border bg-idpxyz-sidebar flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-center justify-between px-4 h-[35px] text-[11px] uppercase tracking-wider text-idpxyz-breadcrumb shrink-0 border-b border-idpxyz-border">
          <span>店铺详情</span>
          <IconMoreH size={14} className="text-idpxyz-textMuted cursor-pointer" />
        </div>

        {selectedStore && selectedChannel ? (
          <>
            {/* IconStore Identity */}
            <div className="px-4 py-3 border-b border-idpxyz-border">
              <div className="flex items-center gap-2 mb-2">
                <IconStore size={14} className="text-idpxyz-accent" />
                <span className="text-[13px] text-idpxyz-textBright font-semibold">{selectedStore.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge {...storeStatusConfig[selectedStore.status]} />
                <StatusBadge {...channelTypeConfig[selectedChannel.type]} />
              </div>
              <div className="text-[10px] text-idpxyz-textMuted mt-1">{selectedStore.id} · {selectedChannel.name}</div>
            </div>

            {/* IconStore Details */}
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-1.5 text-[11px]">
              <div className="text-[11px] uppercase font-bold tracking-wide text-idpxyz-breadcrumb mb-2">基本信息</div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">区域</span><span className="text-idpxyz-text">{selectedStore.region}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-idpxyz-textMuted">链接</span>
                <span className="text-idpxyz-accent text-[10px] flex items-center gap-1 cursor-pointer hover:underline"><IconLink size={10} />{selectedStore.url}</span>
              </div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">API 版本</span><span className="text-idpxyz-text font-mono">{selectedStore.apiVersion}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">创建时间</span><span className="text-idpxyz-text">{selectedStore.createdAt}</span></div>
            </div>

            {/* Sync Status */}
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-1.5 text-[11px]">
              <div className="text-[11px] uppercase font-bold tracking-wide text-idpxyz-breadcrumb mb-2">同步状态</div>
              <div className="flex justify-between items-center">
                <span className="text-idpxyz-textMuted">状态</span>
                <div className="flex items-center gap-1">
                  {(() => { const s = syncStatusIcon[selectedStore.syncStatus]; const I = s.icon; return <><I size={11} className={s.color} /><span className={s.color}>{s.label}</span></>; })()}
                </div>
              </div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">最近同步</span><span className="text-idpxyz-text">{selectedStore.lastSyncAt}</span></div>
            </div>

            {/* Performance */}
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-1.5 text-[11px]">
              <div className="text-[11px] uppercase font-bold tracking-wide text-idpxyz-breadcrumb mb-2">业绩概览</div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">今日订单</span><span className="text-idpxyz-textBright font-medium">{selectedStore.ordersToday}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">30天订单</span><span className="text-idpxyz-textBright font-medium">{selectedStore.orders30d}</span></div>
              <div className="flex justify-between"><span className="text-idpxyz-textMuted">30天收入</span><span className="text-idpxyz-textBright font-medium">{selectedStore.currency} {selectedStore.revenue30d.toLocaleString()}</span></div>
            </div>

            {/* Contact */}
            <div className="px-4 py-3 border-b border-idpxyz-border space-y-1.5 text-[11px]">
              <div className="text-[11px] uppercase font-bold tracking-wide text-idpxyz-breadcrumb mb-2">负责人</div>
              <div className="flex items-center gap-2">
                <IconUser size={11} className="text-idpxyz-textMuted" />
                <span className="text-idpxyz-text">{selectedStore.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconMail size={11} className="text-idpxyz-textMuted" />
                <span className="text-idpxyz-accent text-[10px]">{selectedStore.contactEmail}</span>
              </div>
            </div>

            {/* Spacer */}
            <div className="px-4 py-3" />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-idpxyz-textMuted text-[12px] px-4 text-center">
            选择一个店铺以查看详情
          </div>
        )}
      </div>
    </div>
  );
}
