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
    type: z.enum(['Poster', 'Talk']),
    // Shruti's own posters are hers to host outright.
    pdf: z.string().nullable().default(null),
    image: z.string().nullable().default(null),
    tags: z.array(z.string()).default([]),
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

export const collections = { experiences, publications, presentations, testimonials };
