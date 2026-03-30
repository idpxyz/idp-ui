import { createContext, useContext, type ReactNode } from 'react';

export interface WorkspaceTabPanelValue {
  /** Editor group (`EditorGroupData.id`) this tab panel belongs to. */
  editorGroupId: string;
  /** Tab route id for this panel (`Tab.id`). */
  tabId: string;
  /**
   * `true` when this tab is the active tab in its group (its content is the one shown;
   * when `preserveInactiveTabContent` is on, inactive tabs stay mounted but hidden).
   */
  isActiveTab: boolean;
}

const WorkspaceTabPanelContext = createContext<WorkspaceTabPanelValue | null>(null);

export function WorkspaceTabPanelProvider({
  value,
  children,
}: {
  value: WorkspaceTabPanelValue;
  children: ReactNode;
}) {
  return <WorkspaceTabPanelContext.Provider value={value}>{children}</WorkspaceTabPanelContext.Provider>;
}

/** `null` when rendered outside `EditorGroup` (e.g. tests). */
export function useWorkspaceTabPanel(): WorkspaceTabPanelValue | null {
  return useContext(WorkspaceTabPanelContext);
}
