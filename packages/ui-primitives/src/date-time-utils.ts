/** Parse "HH:mm" (24h) into hours and minutes. Invalid → null. */
export function parseTimeParts(value: string | undefined): { h: number; m: number } | null {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value.trim())) return null;
  const [hs, ms] = value.trim().split(':');
  const h = Number(hs);
  const m = Number(ms);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

/** Format hours/minutes as "HH:mm". */
export function formatTimeParts(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Apply time (local) to a date; returns a new Date. */
export function setTimeOnDate(date: Date, timeHHmm: string): Date {
  const p = parseTimeParts(timeHHmm);
  const d = new Date(date);
  if (!p) {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  d.setHours(p.h, p.m, 0, 0);
  return d;
}

/** Read local HH:mm from a Date. */
export function getTimeHHmmFromDate(date: Date): string {
  return formatTimeParts(date.getHours(), date.getMinutes());
}
