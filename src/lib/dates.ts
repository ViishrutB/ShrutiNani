/**
 * Date-range helpers for anything rendered on a chronological timeline
 * (currently just the Resume page). Content files store dates as "YYYY" or
 * "YYYY-MM" strings — permissive, because a CV line doesn't always need month
 * precision — normalized here into a sortable integer and a display label.
 */

/** "YYYY" or "YYYY-MM" -> a YYYYMM integer, months as 01 when absent. */
export function toSortableMonth(date: string): number {
  const [year, month] = date.split('-');
  return Number(year) * 12 + Number(month ?? '1');
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "2020-06" -> "Jun 2020"; "2020" -> "2020" (no month given). */
function formatDate(date: string): string {
  const [year, month] = date.split('-');
  return month ? `${MONTH_NAMES[Number(month) - 1]} ${year}` : year;
}

export interface DateRange {
  startDate: string;
  endDate?: string | null;
  ongoing?: boolean;
}

/**
 * Sort key for a list mixing ongoing and finished entries: higher sorts first
 * (most recent). Ongoing entries always lead, standard CV convention — ties
 * among them (more than one current role) break on `startDate` via the
 * caller, since a single number can't carry two comparisons.
 */
export function sortKey({ startDate, endDate, ongoing }: DateRange): number {
  if (ongoing) return Infinity;
  return toSortableMonth(endDate ?? startDate);
}

/** "Jun 2020 – Present" / "2019 – 2022" / "2019" (start === end). */
export function formatDateRange({ startDate, endDate, ongoing }: DateRange): string {
  const start = formatDate(startDate);
  if (ongoing) return `${start} – Present`;
  if (!endDate || endDate === startDate) return start;
  return `${start} – ${formatDate(endDate)}`;
}
