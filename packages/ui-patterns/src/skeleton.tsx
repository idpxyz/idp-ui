interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-idpxyz-hover rounded ${className}`} />
  );
}

export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  const widths = ['w-[80px]', 'w-[120px]', 'w-[100px]', 'w-[90px]', 'w-[110px]', 'w-[70px]', 'w-[130px]', 'w-[95px]'];
  return (
    <tr className="border-b border-idpxyz-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2.5">
          <Skeleton className={`h-[13px] ${widths[i % widths.length]}`} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </tbody>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-idpxyz-sidebar rounded p-4 border border-idpxyz-border space-y-2.5">
      <Skeleton className="h-[11px] w-[100px]" />
      <Skeleton className="h-[13px] w-full" />
      <Skeleton className="h-[13px] w-[85%]" />
      <Skeleton className="h-[13px] w-[70%]" />
      <Skeleton className="h-[13px] w-[90%]" />
    </div>
  );
}

export function SkeletonEventList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-0.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1.5">
          <Skeleton className="h-[11px] w-[110px] shrink-0" />
          <Skeleton className="h-[11px] w-[60px] shrink-0" />
          <Skeleton className={`h-[11px] flex-1 ${i % 3 === 0 ? 'max-w-[55%]' : 'max-w-[75%]'}`} />
          <Skeleton className="h-[11px] w-[80px] ml-auto shrink-0" />
        </div>
      ))}
    </div>
  );
}
