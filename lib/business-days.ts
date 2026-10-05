export function addBusinessDays(startISO: string, days: number) {
  const date = new Date(`${startISO}T12:00:00Z`);
  let remaining = Math.max(0, days);
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) remaining--;
  }
  return date.toISOString().slice(0, 10);
}

export function businessDaysBetween(from: string, to: string): number {
  if (from > to) return -businessDaysBetween(to, from);
  const date = new Date(`${from}T12:00:00Z`);
  const end = Date.parse(`${to}T12:00:00Z`);
  let count = 0;
  while (date.getTime() < end) {
    date.setUTCDate(date.getUTCDate() + 1);
    const day = date.getUTCDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}
