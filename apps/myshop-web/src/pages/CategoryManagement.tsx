import { useState, useMemo, useCallback } from 'react';
import {
  IconSearch,
  IconPlus,
  IconDownload,
  IconUpload,
  IconMoreH,
  IconChevronRight,
  IconChevronDown,
  IconFolderTree,
  IconFolder,
  IconFolderOpen,
  IconPackage,
  IconTag,
  IconEdit,
  IconTrash,
  IconCopy,
  IconArrowUpDown,
  IconEye,
  IconEyeOff,
  IconArchive,
  IconCheckCircle,
  IconClock,
  IconUser,
  IconHash,
  IconPercent,
  IconList,
  IconGrid3X3,
  IconMoveUp,
  IconMoveDown,
} from '@idpxyz/ui-icons';
import { Button } from '@idpxyz/ui-primitives';
import {
  type ProductCategory,
  type CategoryStatus,
  productCategories,
  categoryStatusConfig,
} from '../data/oms';

interface CategoryManagementProps {
  onOpenTab?: (tabId: string, tabName: string) => void;
}

function StatusBadge({ label, color, bgColor }: { label: string; color: string; bgColor: string }) {
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium" style={{ color, backgroundColor: bgColor }}>{label}</span>;
}

// Build tree structure from flat array
interface TreeNode {
  category: ProductCategory;
  children: TreeNode[];
}

function buildTree(cats: ProductCategory[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  cats.forEach(c => map.set(c.id, { category: c, children: [] }));
  cats.forEach(c => {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.children.push(node);
    } else if (!c.parentId) {
      roots.push(node);
    }
  });
  // Sort children by sortOrder
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.category.sortOrder - b.category.sortOrder);
    nodes.forEach(n => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

function countDescendants(node: TreeNode): number {
  let count = node.children.length;
  node.children.forEach(c => { count += countDescendants(c); });
  return count;
}

export default function CategoryManagement({ onOpenTab }: CategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCatId, setSelectedCatId] = useState<string | null>('CAT-001');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Expand root categories by default
    return new Set(productCategories.filter(c => c.level === 0).map(c => c.id));
  });
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [breadcrumb, setBreadcrumb] = useState<ProductCategory[]>([]);

  const filteredCategories = useMemo(() => {
    let result = [...productCategories];
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.path.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchTerm, statusFilter]);

  const tree = useMemo(() => buildTree(filteredCategories), [filteredCategories]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const selectCategory = useCallback((cat: ProductCategory) => {
    setSelectedCatId(cat.id);
    // Build breadcrumb trail
    const trail: ProductCategory[] = [];
    let current: ProductCategory | undefined = cat;
    while (current) {
      trail.unshift(current);
      current = current.parentId ? productCategories.find(c => c.id === current!.parentId) : undefined;
    }
    setBreadcrumb(trail);
  }, []);

  const selectedCat = productCategories.find(c => c.id === selectedCatId) || null;
  const childCategories = selectedCat ? productCategories.filter(c => c.parentId === selectedCat.id) : [];

  // Stats
  const totalCats = productCategories.length;
  const activeCats = productCategories.filter(c => c.status === 'active').length;
  const rootCats = productCategories.filter(c => c.level === 0).length;
  const totalProducts = productCategories.filter(c => c.level === 0).reduce((s, c) => s + c.productCount, 0);

  // Render tree node recursively
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const cat = node.category;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedIds.has(cat.id);
    const isSelected = selectedCatId === cat.id;
    const ss = categoryStatusConfig[cat.status];

    return (
      <div key={cat.id}>
        <div
          className={`flex items-center gap-1.5 pr-4 py-[5px] cursor-pointer transition-colors text-[12px] ${
            isSelected ? 'bg-vscode-activeItem' : 'hover:bg-vscode-hover'
          }`}
          style={{ paddingLeft: `${16 + depth * 20}px` }}
          onClick={() => selectCategory(cat)}
        >
          {/* Expand/Collapse Toggle */}
          <div
            className="w-4 h-4 flex items-center justify-center shrink-0"
            onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpand(cat.id); }}
          >
            {hasChildren ? (
              isExpanded ? <IconChevronDown size={13} className="text-vscode-textMuted" /> : <IconChevronRight size={13} className="text-vscode-textMuted" />
            ) : (
              <span className="w-3" />
            )}
          </div>

          {/* Icon */}
          <span className="text-[14px] shrink-0">{cat.image}</span>

          {/* Name */}
          <span className={`truncate ${isSelected ? 'text-vscode-textBright font-medium' : 'text-vscode-text'}`}>
            {cat.name}
          </span>

          {/* Status badge for non-active */}
          {cat.status !== 'active' && <StatusBadge {...ss} />}

          {/* Product count */}
          <span className="ml-auto text-[10px] text-vscode-textMuted tabular-nums shrink-0">
            {cat.productCount > 0 ? `${cat.productCount} 商品` : ''}
          </span>

          {/* Children count */}
          {hasChildren && (
            <span className="text-[10px] text-vscode-textMuted shrink-0">
              {node.children.length} 子类
            </span>
          )}
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-vscode-editor">
      {/* Left: Tree Panel */}
      <div className="w-[340px] border-r border-vscode-border bg-vscode-sidebar flex flex-col shrink-0">
        {/* Tree Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-vscode-border shrink-0">
          <div className="flex items-center gap-2">
            <IconFolderTree size={14} className="text-vscode-accent" />
            <span className="text-[12px] font-semibold text-vscode-textBright">分类目录</span>
            <span className="text-[10px] text-vscode-textMuted">{totalCats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-5 w-5" title="新建分类"><IconPlus size={13} /></Button>
            <Button variant="ghost" size="icon" className="h-5 w-5" title="全部展开/收起">
              <IconArrowUpDown size={12} />
            </Button>
          </div>
        </div>

        {/* Tree IconSearch */}
        <div className="px-3 py-1.5 border-b border-vscode-border shrink-0">
          <div className="flex items-center bg-vscode-inputBg rounded px-2 h-[26px]">
            <IconSearch size={12} className="text-vscode-textMuted mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="搜索分类..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] text-vscode-text w-full placeholder:text-vscode-textMuted"
            />
          </div>
        </div>

        {/* Status IconFilter Pills */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-vscode-border shrink-0 overflow-x-auto">
          {[{ key: 'all', label: '全部' }, ...Object.entries(categoryStatusConfig).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-2 py-0.5 text-[10px] rounded whitespace-nowrap transition-colors ${
                statusFilter === f.key
                  ? 'bg-vscode-accent/15 text-vscode-accent font-medium'
                  : 'text-vscode-textMuted hover:text-vscode-text hover:bg-vscode-hover'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-auto">
          {tree.map(node => renderTreeNode(node))}
          {tree.length === 0 && (
            <div className="flex items-center justify-center py-8 text-[11px] text-vscode-textMuted">
              没有匹配的分类
            </div>
          )}
        </div>
      </div>

      {/* Center: Category Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedCat ? (
          <>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-vscode-border shrink-0 text-[11px]">
              <button
                onClick={() => { setSelectedCatId(null); setBreadcrumb([]); }}
                className="text-vscode-accent hover:underline"
              >
                全部分类
              </button>
              {breadcrumb.map((bc, i) => (
                <span key={bc.id} className="flex items-center gap-1">
                  <IconChevronRight size={11} className="text-vscode-textMuted" />
                  {i < breadcrumb.length - 1 ? (
                    <button onClick={() => selectCategory(bc)} className="text-vscode-accent hover:underline">{bc.name}</button>
                  ) : (
                    <span className="text-vscode-textBright font-medium">{bc.name}</span>
                  )}
                </span>
              ))}
            </div>

            {/* Category Header */}
            <div className="px-5 py-3 border-b border-vscode-border shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[24px]">{selectedCat.image}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-[15px] font-semibold text-vscode-textBright">{selectedCat.name}</h1>
                      <StatusBadge {...categoryStatusConfig[selectedCat.status]} />
                    </div>
                    <p className="text-[11px] text-vscode-textMuted mt-0.5">{selectedCat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm"><IconEdit size={12} /> 编辑</Button>
                  <Button variant="ghost" size="sm"><IconCopy size={12} /> 复制</Button>
                  {selectedCat.status === 'active' ? (
                    <Button variant="ghost" size="sm"><IconEyeOff size={12} /> 下线</Button>
                  ) : selectedCat.status === 'draft' ? (
                    <Button variant="default" size="sm"><IconEye size={12} /> 上线</Button>
                  ) : null}
                  <Button variant="ghost" size="icon"><IconMoreH size={14} /></Button>
                </div>
              </div>

              {/* Summary metrics row */}
              <div className="flex items-center gap-5 mt-3 pt-2 border-t border-vscode-border/50">
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">商品数</span>
                  <span className="ml-1.5 text-vscode-textBright font-semibold">{selectedCat.productCount.toLocaleString()}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">SKU 数</span>
                  <span className="ml-1.5 text-vscode-textBright font-semibold">{selectedCat.skuCount.toLocaleString()}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">佣金率</span>
                  <span className="ml-1.5 text-vscode-accent font-semibold">{selectedCat.commissionRate}%</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">层级</span>
                  <span className="ml-1.5 text-vscode-text">{selectedCat.level === 0 ? '一级' : selectedCat.level === 1 ? '二级' : '三级'}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">子分类</span>
                  <span className="ml-1.5 text-vscode-text">{childCategories.length}</span>
                </div>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto p-5">
              <div className="grid grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Child categories */}
                  {childCategories.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">子分类 ({childCategories.length})</h3>
                      <div className="space-y-1">
                        {childCategories.map(child => {
                          const cs = categoryStatusConfig[child.status];
                          const subChildren = productCategories.filter(c => c.parentId === child.id);
                          return (
                            <div
                              key={child.id}
                              onClick={() => selectCategory(child)}
                              className="flex items-center gap-2 p-2.5 rounded border border-vscode-border cursor-pointer hover:bg-vscode-hover transition-colors"
                            >
                              <span className="text-[16px]">{child.image}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[12px] text-vscode-text font-medium">{child.name}</span>
                                  {child.status !== 'active' && <StatusBadge {...cs} />}
                                </div>
                                <div className="text-[10px] text-vscode-textMuted mt-0.5">{child.description}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-[11px] text-vscode-textBright font-medium">{child.productCount}</div>
                                <div className="text-[10px] text-vscode-textMuted">商品</div>
                              </div>
                              {subChildren.length > 0 && (
                                <IconChevronRight size={13} className="text-vscode-textMuted shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Category Attributes */}
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">分类属性 ({selectedCat.attributes.length})</h3>
                    {selectedCat.attributes.length > 0 ? (
                      <div className="border border-vscode-border rounded-md overflow-hidden">
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr className="bg-vscode-sidebar text-vscode-textMuted">
                              <th className="px-3 py-1.5 text-left font-medium border-b border-vscode-border">属性名</th>
                              <th className="px-3 py-1.5 text-left font-medium border-b border-vscode-border">类型</th>
                              <th className="px-3 py-1.5 text-center font-medium border-b border-vscode-border">必填</th>
                              <th className="px-3 py-1.5 text-left font-medium border-b border-vscode-border">可选值</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCat.attributes.map((attr, i) => (
                              <tr key={i} className="hover:bg-vscode-hover">
                                <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-text font-medium">{attr.name}</td>
                                <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-textMuted">{attr.type}</td>
                                <td className="px-3 py-1.5 border-b border-vscode-border text-center">
                                  {attr.required ? <IconCheckCircle size={11} className="text-green-400 inline" /> : <span className="text-vscode-textMuted">-</span>}
                                </td>
                                <td className="px-3 py-1.5 border-b border-vscode-border text-vscode-textMuted">
                                  {attr.options ? (
                                    <div className="flex flex-wrap gap-1">
                                      {attr.options.map(o => (
                                        <span key={o} className="px-1.5 py-0.5 rounded bg-vscode-hover text-[10px]">{o}</span>
                                      ))}
                                    </div>
                                  ) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-[11px] text-vscode-textMuted border border-vscode-border rounded-md p-3">
                        此分类暂无自定义属性
                      </div>
                    )}
                    <div className="mt-2">
                      <Button variant="ghost" size="sm"><IconPlus size={12} /> 添加属性</Button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Category Path */}
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">分类路径</h3>
                    <div className="border border-vscode-border rounded-md p-3">
                      <div className="flex items-center gap-1.5 text-[12px] text-vscode-text">
                        <IconFolderTree size={13} className="text-vscode-accent shrink-0" />
                        <span className="font-mono">{selectedCat.path}</span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-vscode-textMuted">
                        ID: <span className="font-mono text-vscode-text">{selectedCat.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Category IconInfo */}
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">基本信息</h3>
                    <div className="border border-vscode-border rounded-md p-3 space-y-1.5 text-[11px]">
                      <div className="flex justify-between"><span className="text-vscode-textMuted">状态</span><StatusBadge {...categoryStatusConfig[selectedCat.status]} /></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">排序</span><span className="text-vscode-text">{selectedCat.sortOrder}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">佣金率</span><span className="text-vscode-accent font-medium">{selectedCat.commissionRate}%</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">创建时间</span><span className="text-vscode-text">{selectedCat.createdAt}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">更新时间</span><span className="text-vscode-text">{selectedCat.updatedAt}</span></div>
                      <div className="flex justify-between"><span className="text-vscode-textMuted">创建人</span><span className="text-vscode-text">{selectedCat.createdBy}</span></div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">统计数据</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="border border-vscode-border rounded-md p-3 text-center">
                        <div className="text-[18px] font-bold text-vscode-textBright">{selectedCat.productCount.toLocaleString()}</div>
                        <div className="text-[10px] text-vscode-textMuted mt-0.5">商品数</div>
                      </div>
                      <div className="border border-vscode-border rounded-md p-3 text-center">
                        <div className="text-[18px] font-bold text-vscode-textBright">{selectedCat.skuCount.toLocaleString()}</div>
                        <div className="text-[10px] text-vscode-textMuted mt-0.5">SKU 数</div>
                      </div>
                      <div className="border border-vscode-border rounded-md p-3 text-center">
                        <div className="text-[18px] font-bold text-vscode-accent">{childCategories.length}</div>
                        <div className="text-[10px] text-vscode-textMuted mt-0.5">子分类</div>
                      </div>
                      <div className="border border-vscode-border rounded-md p-3 text-center">
                        <div className="text-[18px] font-bold text-vscode-textBright">{selectedCat.attributes.length}</div>
                        <div className="text-[10px] text-vscode-textMuted mt-0.5">属性</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-2">操作</h3>
                    <div className="space-y-1">
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconPlus size={12} /> 新建子分类</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconUpload size={12} /> 批量导入商品</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconDownload size={12} /> 导出分类数据</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconMoveUp size={12} /> 上移排序</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconMoveDown size={12} /> 下移排序</Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start"><IconArchive size={12} /> 归档分类</Button>
                      {selectedCat.productCount === 0 && (
                        <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:text-red-300"><IconTrash size={12} /> 删除分类</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No category selected — show overview grid */
          <>
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-vscode-border shrink-0">
              <div className="flex items-center gap-3">
                <IconFolderTree size={16} className="text-vscode-accent" />
                <h1 className="text-[14px] font-semibold text-vscode-textBright">商品分类管理</h1>
                <span className="text-[11px] text-vscode-textMuted">{rootCats} 个一级分类 · {totalCats} 个分类 · {totalProducts.toLocaleString()} 商品</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><IconDownload size={13} /> 导出</Button>
                <Button variant="ghost" size="sm"><IconUpload size={13} /> 导入</Button>
                <Button variant="default" size="sm"><IconPlus size={13} /> 新建分类</Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-vscode-border shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
                <IconFolder size={13} className="text-vscode-accent" />
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">总分类</span>
                  <span className="ml-1.5 text-vscode-textBright font-medium">{totalCats}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
                <IconCheckCircle size={13} className="text-green-400" />
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">已上线</span>
                  <span className="ml-1.5 text-vscode-textBright font-medium">{activeCats}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-vscode-sidebar border border-vscode-border">
                <IconPackage size={13} className="text-vscode-accent" />
                <div className="text-[11px]">
                  <span className="text-vscode-textMuted">总商品</span>
                  <span className="ml-1.5 text-vscode-textBright font-medium">{totalProducts.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Root category grid */}
            <div className="flex-1 overflow-auto p-5">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-vscode-breadcrumb mb-3">一级分类</h3>
              <div className="grid grid-cols-3 gap-3">
                {productCategories.filter(c => c.level === 0).sort((a, b) => a.sortOrder - b.sortOrder).map(cat => {
                  const ss = categoryStatusConfig[cat.status];
                  const children = productCategories.filter(c => c.parentId === cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => selectCategory(cat)}
                      className="border border-vscode-border rounded-lg p-4 cursor-pointer hover:bg-vscode-hover transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[28px]">{cat.image}</span>
                        <StatusBadge {...ss} />
                      </div>
                      <h4 className="text-[13px] font-semibold text-vscode-textBright">{cat.name}</h4>
                      <p className="text-[10px] text-vscode-textMuted mt-1 line-clamp-2">{cat.description}</p>
                      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-vscode-border/50 text-[10px]">
                        <div>
                          <span className="text-vscode-textMuted">商品 </span>
                          <span className="text-vscode-textBright font-medium">{cat.productCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-vscode-textMuted">SKU </span>
                          <span className="text-vscode-textBright font-medium">{cat.skuCount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-vscode-textMuted">子类 </span>
                          <span className="text-vscode-textBright font-medium">{children.length}</span>
                        </div>
                        <div className="ml-auto">
                          <span className="text-vscode-textMuted">佣金 </span>
                          <span className="text-vscode-accent font-medium">{cat.commissionRate}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
