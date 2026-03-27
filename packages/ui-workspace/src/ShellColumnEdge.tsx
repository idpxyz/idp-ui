/**
 * Vertical separator for the 52px title/activity column (right edge).
 * Implemented as a 1px bar + opacity — reliable with CSS variables; `color-mix` / Tailwind opacity on `var(--idpxyz-border)` often fails in apps.
 */
const edgeStyle = { backgroundColor: 'var(--idpxyz-border)', opacity: 0.42 } as const;

/** Trailing edge in a horizontal flex row (e.g. ActivityBar). */
export function ShellColumnEdgeFlex() {
  return (
    <div
      className="w-px shrink-0 self-stretch pointer-events-none"
      style={edgeStyle}
      aria-hidden
    />
  );
}

/** Right edge of the 52px title-bar cell (overlays the strip). */
export function ShellColumnEdgeTitle() {
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 bottom-0 w-px"
      style={edgeStyle}
      aria-hidden
    />
  );
}
