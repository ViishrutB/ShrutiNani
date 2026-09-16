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
  // TODO(vishrut): confirm the final tagline — design doc §9 lists this as an
  // outstanding item and the string below is the doc's *example*, not a
  // signed-off line.
  tagline: 'MD-PhD Candidate · Neurology · Physician-Scientist',
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
  { label: 'LinkedIn', href: null }, // TODO(vishrut): profile URL
  { label: 'Email', href: null }, // TODO(vishrut): confirm whether to publish an address
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Bio', href: '/bio' },
  { label: 'Resume', href: '/resume' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Publications', href: '/publications' },
  { label: 'Presentations', href: '/presentations' },
] as const;
