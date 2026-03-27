import { useEffect, useState, useMemo } from 'react';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconUpload,
  IconMoreH,
  IconPackage,
  IconTag,
  IconStar,
  IconTrending,
  IconChart,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconCopy,
  IconTrash,
  IconWarning,
  IconChevronRight,
  IconArrowUpDown,
  IconFilter,
  IconBox,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type SPU,
  type SpuStatus,
  type SidebarSelection,
  spuList,
  spuStatusConfig,
} from '../data/oms';

interface ProductManagementProps {
  onOpenTab?: (tabId: string, tabName: string, subtitle?: string) => void;
  onSelectObject?: (obj: SidebarSelection | null) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

function RatingStars({ rating }: { rating: number }) {
  if (rating === 0) return <span className="text-[10px] text-idpxyz-textMuted">暂无评价</span>;
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar key={i} size={10} className={i < full ? 'text-yellow-400 fill-yellow-400' : 'text-idpxyz-border'} />
      ))}
      <span className="text-[10px] text-idpxyz-textMuted ml-0.5">{rating}</span>
    </div>
  );
}

export default function ProductManagement({ onOpenTab, onSelectObject }: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'salesVolume30d' | 'revenue30d' | 'totalStock' | 'updatedAt'>('salesVolume30d');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedSpuId, setSelectedSpuId] = useState<string | null>(spuList[0]?.id || null);

  const quickViews = [
    { id: 'all', label: '全部商品' },
    { id: 'on_sale', label: '在售' },
    { id: 'sold_out', label: '售罄' },
    { id: 'draft', label: '草稿' },
    { id: 'pending_review', label: '待审核' },
  ];
  const [activeView, setActiveView] = useState('all');

  const filteredSpus = useMemo(() => {
    let result = [...spuList];
    if (activeView !== 'all') result = result.filter(s => s.status === activeView);
    if (statusFilter !== 'all') result = result.filter(s => s.status === statusFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.categoryPath.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return result;
  }, [searchTerm, statusFilter, sortField, sortDir, activeView]);

  const selectedSpu = spuList.find(s => s.id === selectedSpuId) || null;

  useEffect(() => {
    onSelectObject?.(selectedSpu ? { kind: 'product', payload: selectedSpu } : null);
  }, [selectedSpu, onSelectObject]);

  // Stats
  const totalSpus = spuList.length;
  const onSaleCount = spuList.filter(s => s.status === 'on_sale').length;
  const totalSkus = spuList.reduce((s, p) => s + p.skuCount, 0);
  const totalRevenue = spuList.reduce((s, p) => s + p.revenue30d, 0);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-idpxyz-editor min-w-0">
      {/* Main IconList */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-3">
            <IconPackage size={16} className="text-idpxyz-accent" />
            <h1 className="text-[14px] font-semibold text-idpxyz-textBright">商品管理</h1>
            <span className="text-[11px] text-idpxyz-textMuted">{totalSpus} SPU · {totalSkus} SKU</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end min-w-0">
            {selectedSpu && (
              <>
                <span className="text-[10px] text-idpxyz-textMuted mr-1 border-r border-idpxyz-border pr-2">{selectedSpu.name}</span>
                <Button variant="ghost" size="sm"><IconEdit size={12} /> 编辑</Button>
                <Button variant="ghost" size="sm"><IconPlus size={12} /> 添加 SKU</Button>
                <Button variant="ghost" size="sm"><IconCopy size={12} /> 复制</Button>
                <Button variant="ghost" size="sm"><IconChart size={12} /> 报表</Button>
                {selectedSpu.status === 'on_sale' ? (
                  <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300"><IconEyeOff size={12} /> 下架</Button>
                ) : selectedSpu.status === 'draft' || selectedSpu.status === 'off_shelf' ? (
                  <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300"><IconEye size={12} /> 上架</Button>
                ) : null}
                {selectedSpu.totalStock === 0 && selectedSpu.salesVolume30d === 0 && (
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300"><IconTrash size={12} /> 删除</Button>
                )}
                <div className="w-px h-4 bg-idpxyz-border mx-1" />
              </>
            )}
            <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
            <Button variant="ghost" size="sm"><IconUpload size={13} /> 批量导入</Button>
            <Button variant="default" size="sm" onClick={() => onOpenTab?.('product-create', '新建商品')}><IconPlus size={13} /> 新建商品</Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex items-center gap-3 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconPackage size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">SPU</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{totalSpus}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconBox size={13} className="text-green-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">在售</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{onSaleCount}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconTag size={13} className="text-idpxyz-accent" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">SKU</span><span className="ml-1.5 text-idpxyz-textBright font-medium">{totalSkus}</span></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-idpxyz-sidebar border border-idpxyz-border">
            <IconTrending size={13} className="text-green-400" />
            <div className="text-[11px]"><span className="text-idpxyz-textMuted">30天收入</span><span className="ml-1.5 text-idpxyz-textBright font-medium">${totalRevenue.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Quick Views */}
        <div className="flex items-center gap-1 px-5 py-1.5 border-b border-idpxyz-border shrink-0">
          {quickViews.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-2.5 py-1 text-[11px] rounded-md whitespace-nowrap transition-colors ${
                activeView === v.id
                  ? 'bg-idpxyz-accent/15 text-idpxyz-accent font-medium'
                  : 'text-idpxyz-textMuted hover:text-idpxyz-text hover:bg-idpxyz-hover'
              }`}
            >
              {v.label}
              {v.id !== 'all' && <span className="ml-1 text-[10px] opacity-60">{spuList.filter(s => s.status === v.id).length}</span>}
            </button>
          ))}
        </div>

        {/* IconSearch & Filters */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-idpxyz-border shrink-0">
          <div className="flex items-center bg-idpxyz-inputBg rounded px-2.5 h-[28px] flex-1 max-w-[300px]">
            <IconSearch size={13} className="text-idpxyz-textMuted mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="搜索商品名称、ID、品牌、分类、标签..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[12px] text-idpxyz-text w-full placeholder:text-idpxyz-textMuted"
            />
          </div>
          <span className="text-[11px] text-idpxyz-textMuted ml-auto">排序:</span>
          <select
            value={`${sortField}-${sortDir}`}
            onChange={e => { const [f, d] = e.target.value.split('-'); setSortField(f as any); setSortDir(d as any); }}
            className="bg-idpxyz-inputBg text-idpxyz-text text-[11px] h-[28px] px-2 rounded border border-idpxyz-border outline-none"
          >
            <option value="salesVolume30d-desc">销量 ↓</option>
            <option value="salesVolume30d-asc">销量 ↑</option>
            <option value="revenue30d-desc">收入 ↓</option>
            <option value="revenue30d-asc">收入 ↑</option>
            <option value="totalStock-desc">库存 ↓</option>
            <option value="totalStock-asc">库存 ↑</option>
            <option value="name-asc">名称 A→Z</option>
            <option value="name-desc">名称 Z→A</option>
            <option value="updatedAt-desc">最近更新</option>
          </select>
          <span className="text-[11px] text-idpxyz-textMuted">{filteredSpus.length} 件商品</span>
        </div>

        {/* Product Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-idpxyz-sidebar text-idpxyz-textMuted text-left">
                <th className="px-4 py-2 font-medium border-b border-idpxyz-border w-[60px]">图片</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border">商品信息</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[80px]">状态</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[100px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('totalStock')}>
                  库存 {sortField === 'totalStock' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[110px]">价格区间</th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[80px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('salesVolume30d')}>
                  30天销量 {sortField === 'salesVolume30d' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border text-right w-[100px] cursor-pointer hover:text-idpxyz-text" onClick={() => toggleSort('revenue30d')}>
                  30天收入 {sortField === 'revenue30d' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-3 py-2 font-medium border-b border-idpxyz-border w-[90px]">评分</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpus.map(spu => {
                const ss = spuStatusConfig[spu.status];
                const isSelected = selectedSpuId === spu.id;
                return (
                  <tr
                    key={spu.id}
                    onClick={() => setSelectedSpuId(spu.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-idpxyz-activeItem' : 'hover:bg-idpxyz-hover'}`}
                  >
                    <td className="px-4 py-2.5 border-b border-idpxyz-border">
                      <span className="text-[22px]">{spu.mainImage}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <div className="text-[12px] text-idpxyz-text font-medium">{spu.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-idpxyz-textMuted">
                        <span>{spu.id}</span>
                        <span>·</span>
                        <span>{spu.brand}</span>
                        <span>·</span>
                        <span>{spu.categoryPath}</span>
                      </div>
                      {spu.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {spu.tags.map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-idpxyz-hover text-[9px] text-idpxyz-textMuted">{t}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <StatusBadge {...ss} />
                      <div className="text-[10px] text-idpxyz-textMuted mt-0.5">{spu.skuCount} SKU</div>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className={`font-medium ${spu.totalStock === 0 ? 'text-red-400' : spu.totalStock < 50 ? 'text-yellow-400' : 'text-idpxyz-text'}`}>
                        {spu.totalStock.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right text-idpxyz-text">
                      {spu.minPrice > 0 ? (
                        spu.minPrice === spu.maxPrice
                          ? `$${spu.minPrice}`
                          : `$${spu.minPrice} - $${spu.maxPrice}`
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className="text-idpxyz-textBright font-medium">{spu.salesVolume30d > 0 ? spu.salesVolume30d.toLocaleString() : '-'}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border text-right">
                      <span className="text-idpxyz-textBright font-medium">{spu.revenue30d > 0 ? `$${spu.revenue30d.toLocaleString()}` : '-'}</span>
                    </td>
                    <td className="px-3 py-2.5 border-b border-idpxyz-border">
                      <RatingStars rating={spu.rating} />
                      {spu.reviewCount > 0 && <div className="text-[9px] text-idpxyz-textMuted mt-0.5">{spu.reviewCount} 评价</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSpus.length === 0 && (
            <div className="flex items-center justify-center py-12 text-[12px] text-idpxyz-textMuted">
              没有匹配的商品
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
