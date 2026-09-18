# shrutinani.com

Shruti Nanivadekar's academic portfolio — the single, always-current place a residency
program director, collaborator, or conference peer lands to get the fuller picture that a
750-character ERAS entry or a one-page CV can't give.

Live at **[shrutinani.com](https://shrutinani.com)**.

## Pages

| Route | What's there |
|---|---|
| `/` | Name, one-line identity, a headshot slot, and a stylized deep brain stimulation trace — grounded in Shruti's own research subject, not generic decoration |
| `/purpose` | The Statement of Purpose, set as justified reading-width prose with a drop cap; a testimonials section that stays invisible until quotes exist |
| `/timeline` | The CV as one chronological timeline — education, research, leadership, honors, publications, and presentations merged from their own content collections. Color-coded by category with a legend/filter bar; a "Download as PDF" button for the CV itself |
| `/publications` | The peer-reviewed papers and doctoral thesis as an actual bibliography (hanging year column, not cards), each linking to its journal/DOI. Author-position pills (Sole/First/Second/Co-Author) with a matching filter; the thesis opens in a popup viewer instead of an inline embed |
| `/experiences` | Not yet built (M4) — the 10 ERAS experiences, expanded past the 750-character limit |
| `/presentations` | Not yet built (M6) — conference talks and posters |

Every page renders sensibly with zero content — a scaffolded page shows a plain "not built
yet" note rather than a blank or broken one, so nothing here has to be finished before it's
safe to deploy.

Site-wide: a light/dark theme toggle (remembers your choice, otherwise follows your OS),
responsive down to phone width, and a design system ("Signal & Circuit") grounded in
Shruti's actual research — a deep brain stimulation motif, a categorical color palette
checked for colorblind-safe contrast — rather than a generic academic template.

## Tech stack

- **[Astro](https://astro.build)** — static site generation, zero JS shipped by default
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility classes, config lives in
  `src/styles/global.css` (Tailwind v4 is CSS-native; there's no `tailwind.config.mjs`)
- **Astro Content Collections + Zod** — every piece of content (a publication, a timeline
  entry, a presentation) is a markdown file validated against a schema in
  `src/content.config.ts`; a malformed entry fails the build instead of shipping broken
- **[Vercel](https://vercel.com)** — hosting, connected to this repo's GitHub integration

Chosen for a low-traffic, content-driven personal site: Astro's island architecture ships
zero JS by default, content collections give Shruti a no-code editing story without a
headless CMS's extra moving parts, and Vercel's GitHub integration makes every content
commit self-deploying.

## Running it

```bash
npm install
npm run dev      # local site at http://localhost:4321
npm run test     # type check + production build — run before every push
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

`npm run test` is the whole test suite: `astro check` (types, unused props, broken component
contracts) followed by `astro build` (which also validates every content file against its
schema).

## Project structure

```
src/
  content.config.ts    Zod schemas — the contract for every markdown file below
  site.config.ts       Name, tagline, nav, profile links (the only non-markdown content)
  content/
    resume/             Education, research, leadership, and honors entries
    publications/       4 peer-reviewed papers + the doctoral thesis
    presentations/      Conference talks and posters
    experiences/        The 10 ERAS experiences (not yet populated)
    testimonials/       Quotes and letter excerpts; safe to leave empty
    bio/                The Statement of Purpose
    quote/              The Home page's Sanskrit shloka
    skills/              Technical strengths
  layouts/              BaseLayout — <head>, nav, footer, skip link
  components/           Shared pieces (Timeline, FilterPills, ThemeToggle, …)
  lib/                  Small pure-function helpers (date formatting, sort order, …)
  pages/                One file per route
  styles/global.css     Design tokens (light + dark palette, type scale)
public/
  documents/            Self-hosted PDFs (CV, thesis, posters)
  images/               Headshots and photos
```

**Content and layout stay separate.** A new paper, poster, or timeline entry is a new
markdown file — no template changes. That's the point of the content collections, and it's
what lets Shruti update the site from GitHub's web editor without a dev environment.

## Adding content

Add a file to the right folder under `src/content/` and copy the frontmatter shape from a
neighboring file. `src/content.config.ts` documents every field; anything not marked
optional is required.

Two rules that matter more than they look:

1. **Never guess an identifier.** If a DOI, date, or institution isn't confirmed, leave it as
   `doi: null # TODO: confirm` rather than writing something plausible. A wrong DOI on a
   residency-facing site is worse than a visible gap.
2. **Don't self-host the journal PDFs.** The four peer-reviewed papers get a `link` to the
   DOI; the publisher owns distribution. The thesis and Shruti's own posters get a hosted
   `pdf`, because those are hers to share outright.

## Deploying

Hosted on Vercel via its GitHub integration: every push to `main` triggers a production
deploy automatically, and every other branch or PR gets its own preview URL. This is also
what lets Shruti edit a markdown file straight on GitHub — that commit deploys itself, no one
needs to run anything locally.

`npm run build` outputs a plain static site to `dist/`, so any static host works if the
choice of Vercel ever changes.

## Outstanding content needed

This is the live checklist for what's still missing; tick items as they land. Nothing here
blocks the site working — every page renders sensibly whether its content exists yet or not.

**Blocking real pages:**

- [x] Statement of Purpose text — transcribed verbatim from the source PDF, rendered as the
      Purpose page body
- [ ] The 10 finalized ERAS experience entries (→ Experiences page, not yet built)
- [x] `CV_SN.pdf` — hosted at `/documents/CV_SN.pdf`, mirrored as a chronological timeline on
      the Timeline page, with a "Download as PDF" button
- [x] Citation details for the 4 papers, page built and live at `/publications` — each links
      out to its journal/DOI, her name bolded in the byline
- [x] DOI links for the 4 papers — not listed on the CV, so each was looked up and verified
      two ways (title/volume/pages match, and the DOI itself resolves via doi.org to that
      exact publisher page) before Vishrut reviewed and confirmed all 4
- [x] Doctoral thesis PDF — hosted at `/documents/nanivadekar-thesis-2025.pdf`, opens in a
      popup viewer from the Publications page
- [x] The 5 conference presentations from the CV — entered under
      `src/content/presentations/` (the dedicated Presentations page isn't built yet)
- [ ] Poster vs. talk for each of the 5 presentations — the CV lists title/venue/year but not
      the format; each entry's `type` is `null # TODO` rather than guessed

**Non-blocking — pages render fine without these:**

- [ ] Confirmed one-line tagline for Home (current string in `src/site.config.ts` is an
      example, not signed off)
- [ ] Current headshot
- [x] Home page shloka — Bhagavad Gita 2.47 (the same verse in her thesis), Devanagari +
      transliteration + translation, live in `src/content/quote/`
- [ ] Poster PDFs or high-res images (5 total)
- [x] LinkedIn and email — both live in the footer as icon links
- [ ] Google Scholar and ORCID profile links
- [ ] Photos, pull-quotes, and testimonial excerpts — these arrive incrementally
- [ ] `www.shrutinani.com` added as a domain in Vercel (currently resolves but the SSL cert
      doesn't cover it — apex domain works fine as the canonical URL in the meantime)

**Known open questions:** the confirmed institution and dates for the neurology
sub-internship experience, and the content for the "Neurology AI" experience.
