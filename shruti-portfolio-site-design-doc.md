# Shruti Nanivadekar — Academic Portfolio Site
### Mini Technical Design Doc
*Prepared September 13, 2026 · Updated same day with decisions from Vishrut · Ready for Claude Code implementation*

---

## 1. Goal

A single public URL that acts as the canonical, always-current showcase of Shruti's work — the place a residency program director, a collaborator, or a conference peer lands to get the fuller picture that a 750-character ERAS entry or a one-page CV can't give. It should feel like a clean academic personal site (think: a junior faculty page), not a flashy portfolio site.

**Non-goals for v1:** no blog/CMS, no login/auth, no contact form backend, no analytics dashboard. Keep v1 to a static, content-driven site that's cheap to host and trivial to update.

**Decided:**
- Domain: **shrutinani.com**
- Site is **fully public**, no gating
- Shruti will update content herself via markdown on an ongoing basis; Claude Code will be used for anything structural — infra changes, new features, layout work — rather than for routine content updates
- Add a **Bio** page hosting the Statement of Purpose
- Photos, pull-quotes, and recommendation/testimonial excerpts will arrive incrementally from Vishrut over time — the content model needs a home for these from the start even though the first version may ship with few or none

---

## 2. Who uses it, and how

| Persona | Journey |
|---|---|
| **Residency PD / selection committee member** | Arrives from a link in ERAS or the personal statement → skims Home for a one-line identity + photo → clicks **Publications** to verify a cited paper is real → clicks **Experiences** to read the fuller version of an ERAS entry that got cut down to 750 characters. |
| **Collaborator / letter writer / PI** | Goes straight to **Publications**, follows through to the journal for the full paper, maybe checks **Presentations** to see a poster they remember. |
| **Conference peer** | Scans a QR code on a physical poster → lands directly on that poster's entry in **Presentations**. |
| **Shruti (owner)** | Periodically adds a new paper, poster, or award by editing a markdown file directly — no code, no dev environment needed for routine updates. |
| **Vishrut (content contributor)** | Drops in photos, quotes, and testimonials as they're received — small, incremental additions that shouldn't require touching layout code either. |

This last row drives the architecture decision below: **content and layout must be separable**, because Shruti (not a developer) will be doing routine updates herself, with Claude Code brought in only for bigger changes.

---

## 3. Site map

```
/                    Home — name, one-line identity, headshot, 3–4 highlight stats, nav, a rotating pull-quote/testimonial if any exist
/bio                 Bio — the Statement of Purpose, plus room for pull-quotes and testimonials as they arrive
/resume              Resume/CV — embedded PDF + an HTML-rendered mirror (for SEO/copy-paste + ATS-style readability)
/experiences         The 10 ERAS experiences, expanded past the 750-char limit, grouped by theme
/publications        Peer-reviewed papers + thesis — citation + abstract for each, thesis PDF hosted directly, papers link out to the journal (see §7)
/presentations       Conference talks & posters, chronological, with poster PDFs/images where available
```

Each of these already has a source document from the residency-application work:
- **Bio** → the Statement of Purpose (already drafted)
- **Experiences** → the ERAS Experiences Draft (already has clean 700–750-char copy for all 10 entries — this becomes the *summary* card; the site can carry a longer version per entry if she wants more depth than ERAS allows)
- **Resume** → CV_SN.pdf
- **Publications** → the 4 peer-reviewed papers + thesis listed on the CV (Science 2021, Neuroscience Letters 2021, Movement Disorders 2024, J Neuroscience 2026, PhD thesis) — thesis hosted, papers link to the journal/DOI
- **Presentations** → the 5 conference presentations listed on the CV
- **Photos / testimonials** → no source document yet; arriving incrementally from Vishrut. Modeled as its own small content collection (see §5) so a photo or quote can be dropped in as a file, referenced from Home/Bio, with no page needing to change shape whether zero, one, or a dozen exist.

---

## 4. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** | Content-heavy, mostly-static site with a handful of interactive widgets (PDF viewer, maybe a filter). Astro ships zero JS by default and only hydrates the components that need it ("islands"), which keeps a CV/publications site fast and cheap to run. Also very easy for Claude Code to scaffold and reason about — plain `.astro` files, no framework-specific data-fetching magic. |
| Styling | **Tailwind CSS** | Fast to iterate, easy for an LLM to generate consistent utility classes without inventing a design system from scratch. |
| Content | **Markdown/MDX + JSON, via Astro Content Collections** | Each experience/publication/presentation is a small structured file with frontmatter (title, dates, tags, PDF path) — this *is* the "no-code content editing" story: Shruti edits a `.md` file, not a component. Schema is validated (Zod, built into Astro) so a malformed entry fails the build instead of shipping a broken page. |
| PDF viewing | **Native `<iframe>`/`<object>` embed** for the thesis (and posters, if hosted as PDF) | Every modern browser renders PDFs natively in an iframe — zero dependencies, works on mobile Safari, degrades to a download link automatically. Only used for content Shruti actually hosts (thesis, posters); journal papers just link out. |
| Hosting | **Vercel** (or Netlify/GitHub Pages, all free tier for this traffic) | Git-push-to-deploy, free SSL, trivial custom domain setup, generous free tier for a low-traffic personal site. |
| Domain | **shrutinani.com** | Already owned — point DNS at Vercel. |
| Analytics (optional, later) | Vercel Analytics or Plausible | Privacy-friendly, no cookie banner needed. |
| Version control | GitHub (private or public repo) | Needed regardless of host; also gives Shruti a durable, portable copy of everything. |

**Why not Next.js/React from scratch, or a headless CMS (Sanity/Contentful)?** Both are reasonable, but overbuilt for ~20 pieces of content that change a few times a year. Next.js adds routing/data-fetching complexity this site doesn't need; a headless CMS adds an external service and API keys for content Shruti can perfectly well edit as a markdown file. Astro + content collections gets the "structured content, no-code edits" benefit of a CMS without the extra moving part. This can migrate to Next.js later with no content loss if the site grows a dynamic feature (comments, search, a members area) that actually needs it.

---

## 5. Content data model (sketch)

Each collection is a folder of small files; here's the shape Claude Code would scaffold:

```yaml
# src/content/publications/2024-movement-disorders.md
---
title: "Pilot study of acute behavioral effects of pallidal burst stimulation in Parkinson's disease"
authors: "Kariv S, Choi JW, ... Gittis AH, Pouratian N"
journal: "Movement Disorders"
year: 2024
volume: "39(10)"
pages: "1873-1877"
doi: "10.xxxx/xxxxx"
link: "https://doi.org/10.xxxx/xxxxx"   # routes to the journal — no PDF hosted, see §7
role: "co-author"
tags: ["DBS", "clinical trial", "Parkinson's"]
---
Short abstract or one-paragraph plain-language summary.
```

```yaml
# src/content/publications/thesis.md
---
title: "Characterizing network-specific pathophysiology to guide targeted therapeutic interventions for motor recovery in parkinsonian motor syndromes"
type: "Doctoral Thesis"
institution: "Carnegie Mellon University"
year: 2025
pdf: "/documents/nanivadekar-thesis-2025.pdf"   # self-hosted, hers to share freely
---
Short summary.
```

```yaml
# src/content/experiences/01-thesis-dbs.md
---
title: "Doctoral Thesis Research — Circuit Mechanisms and Clinical Translation of DBS"
org: "Gittis Lab, Carnegie Mellon University"
dates: "June 2020 – June 2025"
type: "Research"
mostMeaningful: true
---
Full-length narrative (can be longer than the 750-char ERAS version).
```

```yaml
# src/content/testimonials/gittis-recommendation.md
---
quote: "The excerpt itself."
author: "Dr. Aryn Gittis"
role: "PhD advisor, Carnegie Mellon University"
context: "Recommendation letter"   # or "conference feedback", "peer review", etc.
photo: "/images/headshot-2026.jpg"   # optional, only for photos tied to Shruti herself
featured: true                        # true = eligible to rotate on Home
---
```

Publications and presentations pages are then just a `.map()` over the collection, sorted by year — new content never touches a template. The publications template renders either a `link` (→ journal/DOI, opens in new tab, small external-link icon) or a `pdf` (→ embedded viewer), whichever the entry provides — so thesis and papers use the same component with different data.

The **testimonials** collection is deliberately schema-loose (every field but `quote` and `author` optional) since it will be populated a few items at a time over an unknown period — the Home and Bio pages should render gracefully with zero entries (section just doesn't appear), one entry, or many. Photos (headshots, event photos) live as plain files under `src/assets/` or `public/images/`, referenced by path from wherever they're used (Home hero, Bio page, a testimonial) — no separate "photos" content type needed unless a full gallery is wanted later.

---

## 6. Pathway to the solution (how we get there)

1. **Content audit** (mostly done already via the residency-application work): confirm final text for all 10 experiences, gather DOI links for each of the 4 papers, get the thesis PDF file, gather poster PDFs or images for each presentation, get a current headshot.
2. **Scaffold repo**: Astro + Tailwind + content collections, deployed to Vercel from an empty state, so the deploy pipeline and `shrutinani.com` DNS are proven before content is added.
3. **Build page by page** in the milestone order below, deploying after each milestone so there's always a working preview URL to react to.
4. **Populate content** from the source files already gathered (ERAS draft, CV, papers, thesis).
5. **Polish & launch**: responsive check, SEO metadata, final review pass.
6. **Hand off content ownership**: short runbook so Shruti can add a paper/poster herself without pinging Claude Code for routine updates.

---

## 7. Open questions — resolved

- ~~Publisher copyright on the papers~~ → **Resolved**: don't self-host publisher PDFs. Publications page links out to the journal/DOI for the 4 peer-reviewed papers; only the **thesis** is hosted directly (hers to share freely). Posters follow the same logic — host as PDF/image since she owns them outright.
- ~~Domain name~~ → **Resolved**: `shrutinani.com`.
- ~~Public vs. semi-private~~ → **Resolved**: fully public.
- ~~Update cadence / ownership~~ → **Resolved**: Shruti edits markdown directly on an ongoing basis; Claude Code is used for infra/feature work, not routine content edits.

No open questions remain before build starts — see §9 for the remaining content assets needed.

---

## 8. Dev milestones

*Status legend: ✅ done · 🟡 in progress · ☐ not started*

| # | Milestone | Output | Status |
|---|---|---|---|
| M0 | Content finalized (assets in §9 collected) | Source-of-truth content files ready to drop in | ☐ — checklist tracked in `README.md` |
| M1 | Repo scaffolded, deployed empty shell | Live placeholder on Vercel at `shrutinani.com`, nav shell, design tokens (type, color, spacing) | ✅ Astro 7 + Tailwind 4 + content collections, 6 routes, `npm run test` clean, deployed via Vercel's GitHub integration (auto-deploys `main` on push), DNS pointed from Squarespace, `shrutinani.com` live over HTTPS |
| M2 | Home + Resume pages | Landing page with identity/highlights; Resume page with embedded CV PDF + HTML mirror | 🟡 Resume done — embedded CV PDF, HTML timeline mirror sourced from the real CV; Home still a placeholder |
| M3 | Bio page | Statement of Purpose rendered as the page body, testimonials collection wired up (renders empty gracefully) | ☐ |
| M4 | Experiences page | All 10 entries rendered from content collection, grouped/filterable by theme (research/clinical/leadership) | ☐ |
| M5 | Publications page | All 4 papers linking to journal/DOI + thesis with embedded PDF viewer, formatted citations | 🟡 All 4 papers' citations entered and surfaced on the Resume timeline; DOIs unconfirmed (not on the CV) and the dedicated `/publications` page/thesis PDF are still open |
| M6 | Presentations page | All 5 conference presentations, poster PDFs/images where available | 🟡 All 5 entered and surfaced on the Resume timeline; poster vs. talk unconfirmed, poster files and the dedicated `/presentations` page are still open |
| M7 | Polish pass | Responsive QA (phone/tablet/desktop), dark/light mode, SEO metadata + OG image, sitemap | ☐ |
| M8 | Launch | `shrutinani.com` live, analytics wired up, final content proofread | 🟡 `shrutinani.com` live and auto-deploying; analytics and final proofread still open, and both wait on real content (M2–M6) |
| M9 (stretch) | Update ergonomics | Short README/runbook for how Shruti adds a new paper/poster herself, and how Vishrut drops in a new photo/testimonial | ☐ |

Each milestone is a natural handoff point for Claude Code — small enough to review in one sitting, and each ends with something visibly deployed rather than code sitting unreviewed.

---

## 9. What's needed from Shruti/Vishrut before/during build

- A one-line identity/tagline for the Home page (e.g. "MD-PhD candidate · Neurology · Physician-Scientist")
- PDF or high-res image for each conference poster (5 total, per CV)
- The thesis PDF file (for direct hosting)
- DOI links for the 4 peer-reviewed papers (Science 2021, Neuroscience Letters 2021, Movement Disorders 2024, J Neuroscience 2026)
- Any accounts to link (Google Scholar, ORCID, LinkedIn, GitHub)
- Headshots, event photos, quotes, and testimonials — no need to gather these all upfront; they're modeled to drop in incrementally as Vishrut supplies them (see §5)

None of the above blocks starting the build — the site scaffolds and deploys with placeholder content first, per the milestones in §8.
