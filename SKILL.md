# SKILL.md — Build & Operating Guide for shrutinani.com

This file is what Claude Code should read first in every session on this repo. It's the
*how* — the *why* lives in [`shruti-portfolio-site-design-doc.md`](./shruti-portfolio-site-design-doc.md)
at the repo root (read that too, at least once, before making structural changes). Vishrut
drives this repo from PyCharm with Claude Code; Shruti edits content directly on GitHub. Keep
both workflows in mind.

## Engineering philosophy

Work this repo the way a Staff Engineer at Google would — not by adding process, but by
bringing judgment. Concretely, that means:

- **Simplicity is a deliverable, not a fallback.** The right solution is the smallest one
  that correctly and durably solves the actual problem — never the cleverest one available.
  If a Staff Engineer would ask "why does this need to be this complicated?", ask it first.
  Prefer boring, well-understood technology over novel technology, even when the novel
  option is more interesting to build.
- **Taste shows up in what you leave out.** A good engineer's diffs are often smaller than
  a mediocre one's, not bigger. Resist the urge to refactor, generalize, or add
  configurability that nothing in this repo currently needs. YAGNI is a design principle
  here, not a slogan.
- **Design for the reader, not just the compiler.** Code, commit messages, and content
  schemas should be legible to someone with no context six months from now — including
  Shruti, who is not a developer, when she's looking at a content file. Prefer a slightly
  more verbose but obvious name over a terse but ambiguous one.
- **Think in systems, not files.** Before changing something, understand what depends on
  it — a schema change in `src/content/config.ts` ripples into every page that queries that
  collection. A Staff Engineer traces the blast radius before making the edit, not after
  the build breaks.
- **Have an opinion, and be able to defend it.** When there are two reasonable ways to build
  something, pick one, and say why in the commit message or a code comment — don't leave it
  ambiguous for a future reader to reverse-engineer. But hold that opinion loosely: if
  Vishrut pushes back with a reason, that reason wins.
- **Visual and UX taste matters as much as code quality.** This is a portfolio site — its
  job is to look considered. Spacing, type hierarchy, color contrast, and responsive
  behavior are not "polish to add later"; treat visual regressions with the same seriousness
  as a broken build. When unsure whether something looks right, say so explicitly rather than
  shipping something that "should be fine."
- **Say what you're unsure about.** A Staff Engineer flags risk instead of hiding it behind
  confident-sounding code. If a change is a guess, a workaround, or has a known rough edge,
  say so in the PR/commit description rather than let it be discovered later.
- **Optimize for the site's actual scale.** This is a low-traffic, mostly-static personal
  site, not a system that needs to survive a launch-day spike. Don't add caching layers,
  build pipelines, or abstractions sized for a problem this repo doesn't have.

## Current state (as of hand-off)

**Nothing is built yet.** The repo has the design doc and this file — that's it. There is no
`package.json`, no Astro scaffold, no content collections, no pages. Building the project from
scratch, per the design doc, is the actual first task, not a step to verify.

Source material Claude Code will need in order to populate real content (not to invent it —
ask Vishrut for whichever of these aren't already in the repo/conversation before fabricating
anything):
- The 10 ERAS Experience entries (finalized draft)
- Shruti's CV, for the Resume page and the Presentations list
- The 4 journal publications' citation details, and the doctoral thesis PDF
- The Statement of Purpose, for the Bio page
- Photos, testimonials, posters — expected to arrive incrementally, not blocking a first
  build

Do not assume any of the above already exists as files in this repo just because it's
described in the design doc — check first.

## Ground rules

1. **Content vs. code stay separated.** Anything that's *data about Shruti* (a title, a date,
   a citation, a quote) belongs in a `src/content/*` markdown file, never hardcoded into a
   `.astro` page. If you catch yourself writing prose into a page component, stop and ask
   whether it should be a content collection entry instead.
2. **Never fabricate identifiers.** No invented DOIs, dates, institution names, or citation
   details. Where a real value isn't known, leave the existing `TODO` convention in place
   (see `doi: null # TODO: confirm DOI` in the publications files) rather than guessing
   something plausible-looking. A wrong DOI on a residency-facing site is worse than a
   visible gap.
3. **Respect the copyright boundary.** The 4 peer-reviewed papers link out to the
   journal/DOI — never self-host their PDFs. Only the doctoral thesis and Shruti's own
   conference posters are self-hosted, because those are hers to share outright. If this
   ever needs to change, that's a decision for Vishrut/Shruti, not a default to fall back to
   when a DOI is missing.
4. **Schema-first content changes.** Adding a new field to any content type starts in
   `src/content/config.ts` (the Zod schema), so a malformed entry fails the build loudly
   instead of shipping a silently broken page.
5. **Every collection must render sensibly at zero entries.** This already holds for
   testimonials. Keep it true for anything new that might start empty — a new site section
   shouldn't require content to exist before it's safe to deploy.
6. **Don't change the stack without being asked.** Astro + Tailwind + content collections is
   a deliberate choice for a low-traffic, content-driven site (see
   `shruti-portfolio-site-design-doc.md` §4 for the reasoning). If a feature seems to need
   client-side interactivity, reach for an Astro island before reaching for a new framework or
   a backend service.
7. **Commit messages: concise summary line, then a short paragraph of *why*.** Match the
   existing history — e.g. "Write a holistic project README" followed by a couple of
   sentences on what it covers and why. Never bundle unrelated changes into one commit; a
   content fix and a layout change are two commits.
8. **Don't leave `main` broken.** Run `npm run build` before ending a work session or
   opening a PR. If something can't be fixed in the same session, say so explicitly rather
   than pushing a red build silently.

## What's left, roughly in order

Follow the milestone table in `shruti-portfolio-site-design-doc.md` §8 (M0 through M9) from
the start — none of it is done yet:

1. **M0–M1: Scaffold.** Astro + Tailwind project, `src/content/config.ts` with the Zod
   schemas for experiences, publications, presentations, and testimonials (per the design
   doc's data model in §6). Get `npm install && npm run dev` running on an empty/placeholder
   site before writing a single page of real content — that's the "does the toolchain work"
   milestone, and it should be its own commit.
2. **M2–M5: Pages + real content.** Build the 6 pages (Home, Bio, Resume, Experiences,
   Publications, Presentations) and populate them with real content collection entries,
   sourced from what Vishrut/Shruti provide — not invented. Each content type can land as its
   own commit as the source material becomes available; the site doesn't need every
   collection filled to be buildable (see ground rule 5).
3. **M6: Verify the build.** `npm run build` clean, `npm run preview` looks right locally.
4. **M7: Polish.** Responsive check across phone/tablet/desktop, dark/light mode, SEO
   metadata, an OG image, a sitemap.
5. **M8: Launch.** Connect the repo to Vercel, point `shrutinani.com`'s DNS at it, confirm
   the production build matches local.
6. **M9 (stretch): Update ergonomics.** Once live and Shruti's added a piece of content
   herself, revisit whether the README's "adding content" guide held up in practice.

Track outstanding content gaps (CV PDF, thesis PDF, real DOIs, posters, headshot, etc.) in the
README as they're identified — that checklist is the single source of truth for what's still
needed, so don't duplicate it here. Don't invent content to fill a gap; flag that a task is
blocked on missing material instead.

## Visual design

Not finalized. The current Tailwind theme (`tailwind.config.mjs`: an ink/paper/accent/muted
palette, serif headings over sans body text) is a reasonable placeholder, not a signed-off
direction. Small, incremental CSS improvements are fine; don't do a full visual redesign
until Vishrut shares direction (a UI design doc is coming separately). When making even small
visual calls in the meantime, default to restraint and consistency over decoration.

## When to ask rather than guess

- The confirmed institution and dates for Experience #8 (the neurology sub-internship) —
  there's a note in that file explaining why "Emory"/"MD-SEE" is deliberately not used there
- Content for Experience #4 ("Neurology AI") — currently a placeholder
- Anything in the README's outstanding-content checklist
- Any change to the tech stack, hosting, or domain decisions recorded in
  `shruti-portfolio-site-design-doc.md` §1 and §7
- Any tradeoff where the "clever" and the "simple" answers diverge and the right call isn't
  obvious from the ground rules above
