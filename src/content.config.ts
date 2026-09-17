import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content schemas for shrutinani.com.
 *
 * This file is the contract between Shruti's markdown files and the page
 * templates. Adding a field to a content type starts HERE — a malformed entry
 * then fails `npm run build` loudly instead of shipping a broken page.
 *
 * Two conventions worth knowing before you edit anything:
 *
 *  1. Anything we don't yet know is `null`, never a plausible-looking guess.
 *     A wrong DOI on a residency-facing site is worse than a visible gap, so
 *     unknown identifiers stay `null` with a `# TODO:` comment next to them.
 *
 *  2. `link` vs. `pdf` encodes the copyright boundary. Published papers are the
 *     journal's to distribute, so they get a `link` out to the DOI. The thesis
 *     and Shruti's own posters are hers outright, so they get a hosted `pdf`.
 *     One template renders either — see design doc §7.
 */

const markdownIn = (folder: string) =>
  glob({ base: `./src/content/${folder}`, pattern: '**/*.{md,mdx}' });

/**
 * The 10 ERAS experiences, expanded past the 750-character ERAS limit.
 * File order drives display order, so name files `01-...`, `02-...`.
 */
const experiences = defineCollection({
  loader: markdownIn('experiences'),
  schema: z.object({
    title: z.string(),
    org: z.string(),
    location: z.string().optional(),
    // Free text rather than real dates: these are displayed verbatim
    // ("June 2020 – June 2025") and never sorted or compared on.
    dates: z.string(),
    // Drives the grouping on /experiences.
    type: z.enum(['Research', 'Clinical', 'Leadership', 'Teaching', 'Service']),
    // ERAS lets an applicant flag up to three experiences as most meaningful.
    mostMeaningful: z.boolean().default(false),
    // The 750-character ERAS version. The markdown body below the frontmatter
    // is the longer narrative that ERAS had no room for.
    summary: z.string(),
  }),
});

const publications = defineCollection({
  loader: markdownIn('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.string().optional(),
    type: z.enum(['Journal Article', 'Doctoral Thesis']).default('Journal Article'),
    journal: z.string().optional(),
    institution: z.string().optional(),
    year: z.number(),
    volume: z.string().optional(),
    pages: z.string().optional(),
    doi: z.string().nullable().default(null),
    link: z.url().nullable().default(null),
    // Self-hosted PDF under /public/documents. Thesis only — see note above.
    pdf: z.string().nullable().default(null),
    role: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const presentations = defineCollection({
  loader: markdownIn('presentations'),
  schema: z.object({
    title: z.string(),
    authors: z.string().optional(),
    // Conference or meeting name, e.g. "Society for Neuroscience".
    venue: z.string(),
    location: z.string().optional(),
    year: z.number(),
    // Displayed verbatim under the year, e.g. "November 2023".
    date: z.string().optional(),
    // Nullable, not required: the source CV lists title/venue/year for each
    // presentation but doesn't say poster vs. talk, and that's a real fact to
    // confirm, not guess. Renders as a generic "Presentation" until set.
    type: z.enum(['Poster', 'Talk']).nullable().default(null), // TODO: confirm poster vs. talk
    // Shruti's own posters are hers to host outright.
    pdf: z.string().nullable().default(null),
    image: z.string().nullable().default(null),
    tags: z.array(z.string()).default([]),
  }),
});

/**
 * CV line items that don't already have a dedicated collection: education,
 * positions, honors/awards, certifications and licensure. Publications and
 * presentations already exist as their own collections (§3 of the design doc:
 * both are sourced from the CV), so the Resume page pulls those in directly
 * rather than duplicating them here — one source of truth per fact.
 *
 * `category` is a free-form string, not an enum, because we don't yet know the
 * exact section headings on Shruti's real CV and guessing one wrong would fail
 * the build on real content rather than catching an actual mistake.
 */
const resume = defineCollection({
  loader: markdownIn('resume'),
  schema: z.object({
    title: z.string(),
    org: z.string().optional(),
    location: z.string().optional(),
    category: z.string(),
    // "YYYY" or "YYYY-MM" — permissive because not every CV line needs month
    // precision (a degree year doesn't; a certification date might), but both
    // forms sort correctly on the timeline. See src/lib/dates.ts.
    startDate: z.string().regex(/^\d{4}(-\d{2})?$/, 'use YYYY or YYYY-MM'),
    endDate: z
      .string()
      .regex(/^\d{4}(-\d{2})?$/, 'use YYYY or YYYY-MM')
      .nullable()
      .default(null),
    // true renders "Present" instead of an end date, and sorts to the top.
    ongoing: z.boolean().default(false),
    // One line shown under the title — a role description, a thesis title.
    summary: z.string().optional(),
    // A CV entry is usually a bullet list, not a paragraph — this is what
    // actually renders under the title on the timeline. `summary` alone is
    // enough for a one-line entry (an award, a degree); use `highlights` for
    // anything with real bullets (a position, a role).
    highlights: z.array(z.string()).default([]),
  }),
});

/**
 * A short, non-chronological block below the timeline — the CV's "Technical
 * Strengths" section (languages, software, tools). Doesn't fit the resume
 * collection's dated-entry shape, and isn't worth a dedicated schema for three
 * rows that rarely change, so it's a singleton markdown body like `bio`,
 * reusing the same prose-content rendering.
 */
const skills = defineCollection({
  loader: markdownIn('skills'),
  schema: z.object({
    title: z.string().default('Technical Strengths'),
  }),
});

/**
 * Deliberately schema-loose: this collection fills in a few items at a time as
 * Vishrut receives them, and every page that reads it must render fine at zero
 * entries. `quote` and `author` are the only things we insist on.
 */
const testimonials = defineCollection({
  loader: markdownIn('testimonials'),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    role: z.string().optional(),
    context: z.string().optional(),
    photo: z.string().optional(),
    // `true` makes it eligible to appear on the Home page.
    featured: z.boolean().default(false),
  }),
});

/**
 * The Statement of Purpose. Modeled as a one-entry collection (rather than a
 * field in a single config file) so its text lives as a markdown file like
 * everything else Shruti edits — ground rule 1 in SKILL.md: data about her
 * never gets hardcoded into a .astro page. If a second entry ever appears,
 * the Bio page uses whichever one it finds first, so keep it to one file.
 */
const bio = defineCollection({
  loader: markdownIn('bio'),
  schema: z.object({
    title: z.string().default('Statement of Purpose'),
  }),
});

/**
 * The Home page's pull-quote — a Sanskrit shloka, in Devanagari, with its
 * translation. One-entry singleton, same pattern as `bio`. Deliberately not
 * folded into `testimonials`: a testimonial is someone else's words about
 * Shruti; this is a verse *she* identifies with, which needs its own source
 * attribution (a text/chapter/verse, not a person's name and role) — a
 * different shape, not a stricter version of the same one.
 *
 * `devanagari` is required; `transliteration` (IAST/roman) is optional since
 * the script itself is the primary presentation and a transliteration is a
 * reading aid, not a substitute.
 */
const quote = defineCollection({
  loader: markdownIn('quote'),
  schema: z.object({
    devanagari: z.string(),
    transliteration: z.string().optional(),
    translation: z.string(),
    // e.g. "Bhagavad Gita 2.47" — never guessed; leave unset rather than
    // attribute a verse to the wrong source.
    source: z.string().optional(),
  }),
});

export const collections = {
  experiences,
  publications,
  presentations,
  testimonials,
  resume,
  bio,
  quote,
  skills,
};
