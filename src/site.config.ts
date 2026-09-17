/**
 * Site-wide identity and navigation.
 *
 * Everything else *about Shruti* lives in `src/content/` as markdown. This file
 * is the one exception: these are singletons (one name, one tagline, one nav)
 * that would be more awkward as a one-entry content collection than as a short,
 * obvious config file. Edit here, and nowhere else, to change them.
 */

export const site = {
  name: 'Shruti Nanivadekar',
  // TODO(vishrut): confirm final wording — design doc §9 lists the tagline as
  // an outstanding item and this is the doc's *example*, not signed off.
  // Two lines, not one string of fields chained with middle dots: `role` is
  // the credential (also used as the <title> fallback — see BaseLayout),
  // `focus` is an actual sentence about the research, not another fragment
  // stitched on with a "·".
  tagline: {
    role: 'MD-PhD Candidate in Neurology',
    focus: 'Physician-scientist studying deep brain stimulation and motor circuits.',
  },
  description:
    'Academic portfolio of Shruti Nanivadekar — clinical experience, publications, and conference presentations.',
  url: 'https://shrutinani.com',
} as const;

/**
 * Profile links rendered in the footer. A link with a `null` href is skipped
 * entirely rather than rendered dead — so an unconfirmed profile costs nothing.
 */
export const profileLinks: ReadonlyArray<{ label: string; href: string | null }> = [
  { label: 'Google Scholar', href: null }, // TODO(vishrut): profile URL
  { label: 'ORCID', href: null }, // TODO(vishrut): ORCID iD
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shruti-nanivadekar-ba9788ab/' },
  { label: 'Email', href: 'mailto:shruti.1294@gmail.com' },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Purpose', href: '/purpose' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Publications', href: '/publications' },
  { label: 'Presentations', href: '/presentations' },
] as const;
