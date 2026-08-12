export { default as ActivityBar, type ActivityBarItem } from './ActivityBar';
export {
  default as TitleBar,
  type RecentObject,
  type ScopeFilter,
  type ScopeFilterOption,
  type TitleBarMenuItem,
  type TitleBarUserMenuItem,
} from './TitleBar';
export { default as StatusBar } from './StatusBar';
export { default as Sidebar, type NavItem, type NavigationSection } from './Sidebar';
export { default as CommandPalette, type CommandPaletteAction } from './CommandPalette';
export {
  default as EditorGroup,
  type Tab,
  type EditorGroupData,
  type EditorGroupProps,
  WORKSPACE_TAB_DRAG_MIME,
  parseWorkspaceTabDragPayload,
} from './EditorGroup';
export {
  WorkspaceTabPanelProvider,
  useWorkspaceTabPanel,
  type WorkspaceTabPanelValue,
} from './WorkspaceTabPanelContext';
export {
  runWorkspaceNavigationGuard,
  type WorkspaceNavigationGuard,
  type WorkspaceNavigationIntent,
} from './navigationGuard';
export { useResize } from './hooks/useResize';
export { useSplitResize } from './hooks/useSplitResize';
export { useEditorGroupTabState } from './hooks/useEditorGroupTabState';
