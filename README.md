# shrutinani.com

Shruti Nanivadekar's academic portfolio — resume, experiences, publications, and
presentations, at one public URL.

Two documents govern this repo:

- **[`shruti-portfolio-site-design-doc.md`](./shruti-portfolio-site-design-doc.md)** — *why*:
  goals, personas, site map, stack rationale, and the M0–M9 milestone table.
- **[`SKILL.md`](./SKILL.md)** — *how*: engineering philosophy and ground rules. Read it
  before making structural changes.

## Running it

```bash
npm install
npm run dev      # local site at http://localhost:4321
npm run test     # type check + production build — run before every push
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

`npm run test` is the whole test suite: `astro check` (types, unused props, broken
component contracts) followed by `astro build` (which also validates every content file
against its schema). A malformed frontmatter field fails the build rather than shipping a
broken page — that's deliberate, see ground rule 4 in `SKILL.md`.

## How the site is put together

```
src/
  content.config.ts    Zod schemas — the contract for every markdown file below
  site.config.ts       Name, tagline, nav, profile links (the only non-markdown content)
  content/
    experiences/       The 10 ERAS experiences, expanded past the 750-char limit
    publications/      4 peer-reviewed papers + the doctoral thesis
    presentations/     Conference talks and posters
    testimonials/      Quotes and letter excerpts; safe to leave empty
  layouts/             BaseLayout — <head>, nav, footer, skip link
  components/          Small shared pieces
  pages/               One file per route
  styles/global.css    Design tokens (light + dark palette, type scale)
public/
  documents/           Self-hosted PDFs (thesis, posters)
  images/              Headshots and photos
```

**Content and layout stay separate.** A new paper, poster, or experience is a new markdown
file — no template changes. That's the point of the content collections, and it's what lets
Shruti update the site from GitHub's web editor without a dev environment.

## Adding content

Add a file to the right folder under `src/content/` and copy the frontmatter shape from a
neighbouring file. `src/content.config.ts` documents every field; anything not marked
optional is required.

Two rules that matter more than they look:

1. **Never guess an identifier.** If a DOI, date, or institution isn't confirmed, leave it
   as `doi: null # TODO: confirm` rather than writing something plausible. A wrong DOI on a
   residency-facing site is worse than a visible gap.
2. **Don't self-host the journal PDFs.** The four peer-reviewed papers get a `link` to the
   DOI; the publisher owns distribution. The thesis and Shruti's own posters get a hosted
   `pdf`, because those are hers to share outright.

## Outstanding content needed

This checklist is the single source of truth for what's still missing. Tick items as they
land.

**Blocking real pages:**

- [x] Statement of Purpose text — transcribed verbatim from the source PDF, rendered as the
      Purpose page body (M3)
- [ ] The 10 finalized ERAS experience entries (→ Experiences, M4)
- [x] `CV_SN.pdf` — hosted at `/documents/CV_SN.pdf`, mirrored as a chronological timeline on
      the Timeline page, with a "Download as PDF" button (M2)
- [x] Citation details for the 4 papers — sourced from the CV, entered under
      `src/content/publications/` (M5's content; the page template itself is still M5)
- [x] DOI links for the 4 papers — not listed on the CV, so each was looked up and verified
      two ways (title/volume/pages match, and the DOI itself resolves via doi.org to that
      exact publisher page) before Vishrut reviewed and confirmed all 4
- [ ] Doctoral thesis PDF, for direct hosting (→ Publications, M5)
- [x] The 5 conference presentations from the CV — entered under
      `src/content/presentations/` (M6's content; the page template is still M6)
- [ ] Poster vs. talk for each of the 5 presentations — the CV lists title/venue/year but
      not the format; each entry's `type` is `null # TODO` rather than guessed

**Non-blocking — pages render fine without these:**

- [ ] Confirmed one-line tagline for Home (current string in `src/site.config.ts` is the
      design doc's *example*, not signed off)
- [ ] Current headshot
- [ ] Poster PDFs or high-res images (5 total)
- [ ] Profile links: Google Scholar, ORCID, LinkedIn, and whether to publish an email
- [ ] Photos, pull-quotes, and testimonial excerpts — these arrive incrementally
- [ ] `www.shrutinani.com` added as a domain in Vercel (currently resolves but the SSL cert
      doesn't cover it — apex domain works fine as the canonical URL in the meantime)

**Known open questions** (from `SKILL.md`): the confirmed institution and dates for the
neurology sub-internship experience, and the content for the "Neurology AI" experience.

## Deploying

Live at [shrutinani.com](https://shrutinani.com), hosted on Vercel via its GitHub
integration: every push to `main` triggers a production deploy automatically, and every
other branch or PR gets its own preview URL. This is also what lets Shruti edit a markdown
file straight on GitHub — that commit deploys itself, no one needs to run anything locally.

DNS is pointed at Vercel from Squarespace (the domain registrar). `www.shrutinani.com`
resolves but its SSL cert doesn't cover it yet — not blocking, since the apex domain is the
canonical URL everywhere in this repo, but worth adding as a domain in Vercel's dashboard
(or redirecting to apex) at some point.

Analytics and a final content proofread (the rest of M8) are on hold until the real content
in M2–M6 lands.

`npm run build` outputs a plain static site to `dist/`, so any static host works if the
choice of Vercel ever changes.
