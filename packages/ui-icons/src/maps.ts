/**
 * Icon mapping utilities — lookup icons by semantic key.
 * Useful for dynamic icon resolution in tables, badges, navigation, etc.
 */
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  MinusCircle,
  Clock,
  Loader2,
  Ban,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

/** Status → icon mapping */
export const statusIconMap: Record<string, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  danger: XCircle,
  info: Info,
  neutral: MinusCircle,
  pending: Clock,
  loading: Loader2,
  blocked: Ban,
  paused: PauseCircle,
  active: PlayCircle,
};

/**
 * Resolve a status key to a Lucide icon component.
 * Returns `MinusCircle` (neutral) as fallback.
 */
export function resolveStatusIcon(status: string): LucideIcon {
  return statusIconMap[status] ?? MinusCircle;
}
