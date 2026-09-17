/**
 * The shape Timeline.astro renders. Defined here (not inside the component)
 * so pages that build a merged, cross-collection list — Resume merges its own
 * entries with publications and presentations — can import the type without
 * relying on named exports from a .astro file.
 */
export interface TimelineItem {
  id: string;
  /** Section label shown above the title, e.g. "Education", "Publication". */
  category: string;
  title: string;
  /** Organization, journal, or venue. */
  subtitle?: string;
  location?: string;
  /** Already-formatted, e.g. "Jun 2020 – Present" — see src/lib/dates.ts. */
  dateLabel: string;
  /** One-line entries (an award, a degree) — omit when `highlights` is used. */
  summary?: string;
  /** Bullet points — how a CV actually presents a position or a role. */
  highlights?: string[];
  /** Makes the title a link out — journal/DOI for a publication. */
  href?: string;
  /** Self-hosted PDF (thesis, a poster) — never a journal's own PDF. */
  pdf?: string | null;
}

/**
 * Preferred left-to-right order for the timeline's filter pills — roughly the
 * order a CV's own sections run in. Not an enum: categories are free-form
 * (see content.config.ts), so anything not listed here — a new resume
 * category, "Talk"/"Poster" once presentation type is confirmed — just falls
 * in afterward, in first-appearance order, rather than being dropped.
 */
const CATEGORY_ORDER = [
  'Education',
  'Research Experience',
  'Leadership Experience',
  'Honors & Awards',
  'Publication',
  'Doctoral Thesis',
  'Presentation',
  'Talk',
  'Poster',
];

/** Distinct categories present in `items`, in CATEGORY_ORDER (then first-seen). */
export function orderCategories(items: { category: string }[]): string[] {
  const present = new Set(items.map((item) => item.category));
  const ordered = CATEGORY_ORDER.filter((category) => present.has(category));
  const remaining = [...present].filter((category) => !ordered.includes(category));
  return [...ordered, ...remaining];
}
