import { AlertTriangle, FileSearch, Lock, DatabaseZap, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface BaseStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function StateShell({ icon, title, description, actionLabel, onAction }: BaseStateProps & { icon: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-idpxyz-editor">
      <div className="max-w-[420px] rounded-md border border-idpxyz-border bg-idpxyz-sidebar px-6 py-5 text-center">
        <div className="mb-3 flex justify-center text-idpxyz-textMuted">{icon}</div>
        <h3 className="text-[14px] font-semibold text-idpxyz-textBright">{title}</h3>
        <p className="mt-1 text-[12px] leading-5 text-idpxyz-textMuted">{description}</p>
        {actionLabel && onAction && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingState({ title = 'Loading workspace...', description = 'Preparing data and layout.' }: Partial<BaseStateProps>) {
  return (
    <StateShell
      icon={<RefreshCw size={18} className="animate-spin" />}
      title={title}
      description={description}
    />
  );
}

export function FilteredEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <StateShell
      icon={<FileSearch size={18} />}
      title="No matching results"
      description="No records match current filters. Adjust filters or clear them to continue."
      actionLabel={onReset ? 'Clear Filters' : undefined}
      onAction={onReset}
    />
  );
}

export function TrulyEmptyState({ title, description, onCreate }: { title?: string; description?: string; onCreate?: () => void }) {
  return (
    <StateShell
      icon={<DatabaseZap size={18} />}
      title={title ?? 'No records yet'}
      description={description ?? 'There is no data available in this workspace yet.'}
      actionLabel={onCreate ? 'Create First Record' : undefined}
      onAction={onCreate}
    />
  );
}

export function NoPermissionState() {
  return (
    <StateShell
      icon={<Lock size={18} />}
      title="Permission required"
      description="You do not have permission to view this data scope. Contact an administrator if needed."
    />
  );
}

export function UnavailableState({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateShell
      icon={<AlertTriangle size={18} className="text-yellow-400" />}
      title="Data temporarily unavailable"
      description="The data source is currently unavailable. Retry in a moment."
      actionLabel={onRetry ? 'Retry' : undefined}
      onAction={onRetry}
    />
  );
}

export function SectionErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded border border-red-500/30 bg-red-500/5 px-3 py-2 text-[12px] text-idpxyz-text">
      <div className="flex items-center gap-2 text-red-400">
        <AlertTriangle size={13} />
        <span className="font-medium">Section failed to load</span>
      </div>
      <p className="mt-1 text-idpxyz-textMuted">{message}</p>
      {onRetry && (
        <Button className="mt-2" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
