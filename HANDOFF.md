# Oskelo — Project Handoff

Living status doc for the Oskelo website. Updated at the end of every task.

_Last updated: 2026-09-07_

---

## Project

- **What:** Next.js 16 marketing site for Oskelo (video + photography for businesses).
- **Repo:** `github.com/oskeloco-stack/oskelo-website`, default branch `main`.
- **Live site:** https://oskelo.com — Vercel, auto-deploys on push to `main`.
- **Local dev:** `npm run dev` → http://localhost:3000 (must be running to view; it does not auto-start).
- **Key dirs:** pages in `app/`, shared data in `lib/`, images in `public/`, styles in `app/globals.css`.
- **Contact form:** writes to Supabase; optional email via Resend. Env vars in `.env.local` (untracked) and in Vercel settings.

## Current state

- **Local HEAD:** `b49aceb` "Add photo galleries to Work section" — **in sync with `origin/main` and with what is live.**
- **Uncommitted work** (not committed, not pushed, not live):
  - `lib/work.js`, `app/work/page.js`, `app/page.js`, `app/globals.css` — the Photography collage (see log 2026-09-07).
  - ~16 loose images added to `public/` root (raw camera files + web copies). Untracked.
- `HANDOFF.md` is committed and pushed to `main`, so it syncs across machines via `git pull`.

## Outstanding / next steps

- [ ] Optimize `public/IMG_9742.JPG` (~9 MB) and move it into `public/work/portraits/`; point `lib/work.js` at the optimized path.
- [ ] Remove the redundant loose images from `public/` root (b49aceb already added optimized copies under `public/work/`). Decide which raw files, if any, to keep.
- [ ] Decide whether the middle-image color correction stays as a CSS filter or gets baked into the optimized file.
- [ ] Commit the Photography collage + push so it reaches oskelo.com.

## Task log

Newest first. Each entry: what was asked, what changed, state left in.

### 2026-09-07 — Commit the handoff doc

- **Asked:** commit `HANDOFF.md` so it's available on both the user's PC and laptop.
- **Changed:** committed `HANDOFF.md` directly to `main` and pushed to `origin`. Docs-only; no effect on the live site. The Photography collage work stays uncommitted.
- **State left in:** pull on the other machine to get the file. Collage work still pending (see Outstanding).

### 2026-09-07 — Photography collage on the Work section

- **Asked:** put a photo in the Photography card; evolved into a 3-up collage of different people with a portrait of the male subject in the middle, color (not grayscale), tonally matched.
- **Also:** synced this local checkout, which was 1 commit behind `origin/main` (it was missing the already-live wedding/portrait galleries from `b49aceb`). Discarded an earlier exploratory version of the collage that had been built on the stale base, then `git pull`.
- **Changed (uncommitted):**
  - `lib/work.js` — added `images: [...]` to the `photography` category: `woodland-suit.jpg`, `/IMG_9742.JPG` (him, on a tree branch in the woods), `autumn-blanket.jpg`.
  - `app/work/page.js` + `app/page.js` — `.link-card-media` renders the `images` collage when present, else falls back to the `cover` image.
  - `app/globals.css` —
    - `.link-card-media.is-collage` flex row, equal thirds, images stay color (`filter: none`).
    - `.link-card-media.is-collage img:nth-child(2)` tone filter on the middle image: `brightness(0.96) contrast(1.04) saturate(1.16) sepia(0.16) hue-rotate(-6deg)` — warm but greens retained, to sit between the cooler left and warm-autumn right.
    - removed `filter: grayscale(100%)` from `.work-card--photo img` so the Portraits and Wedding & Engagement thumbnails on `/work/photography` show in color.
- **State left in:** working on localhost, looks right on `/work` and homepage `#work`. Nothing committed. See Outstanding for cleanup before pushing.
