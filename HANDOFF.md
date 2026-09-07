# Oskelo — Project Handoff

Living status doc for the Oskelo website. Updated at the end of every task.

_Last updated: 2026-09-07 (contact@oskelo.com fully live — forwarding in, form notifications, and Gmail send-as out)_

---

## Project

- **What:** Next.js 16 marketing site for Oskelo (video + photography for businesses).
- **Repo:** `github.com/oskeloco-stack/oskelo-website`, default branch `main`.
- **Live site:** https://oskelo.com — Vercel, auto-deploys on push to `main`.
- **Local dev:** `npm run dev` → http://localhost:3000 (must be running to view; it does not auto-start).
- **Key dirs:** pages in `app/`, shared data in `lib/`, images in `public/`, styles in `app/globals.css`.
- **Contact form:** writes to Supabase; optional email via Resend. Env vars in `.env.local` (untracked) and in Vercel settings.

## Current state

- **Local HEAD:** `99aca01`, **pushed to `origin/main`**. Vercel auto-deploying. Change: homepage + Terms page now show `contact@oskelo.com`. (Hero copy change from earlier also live.)
- **Note on pushing:** this session's shell *was* able to `git push` this time (credentials cached). It may still fail in future sessions — if so, the user runs `git push origin main` from their own terminal.
- **Not committed:** ~16 loose images in `public/` root (raw camera files + web copies). Untracked, unreferenced, left in place for now.
- `HANDOFF.md` is committed and pushed to `main`, so it syncs across machines via `git pull`.

## Outstanding / next steps

- [x] Push the hero copy change to `origin/main` — done 2026-09-07.
- [x] Confirmed live: www.oskelo.com serves the new eyebrow, blurb, and `<title>` (checked via curl 2026-09-07). Note oskelo.com 308-redirects to www.oskelo.com.
- [x] Rewrote the hero body paragraph to match the "we do it all" positioning.
- [x] **Branded contact email — forwarding is live.** `contact@oskelo.com` forwards to `oskelo.co@gmail.com` via **ImprovMX** (not Cloudflare — Cloudflare's dashboard hid the Email Routing nav on this account). DNS records added in Cloudflare and verified resolving publicly: MX `mx1.improvmx.com` (10), MX `mx2.improvmx.com` (20), TXT SPF `v=spf1 include:spf.improvmx.com ~all`. Alias `contact` set up at improvmx.com. ImprovMX free plan: unlimited aliases, 25 total recipients — can route e.g. `weddings@` to a photographer's email. Replies from Gmail still come from the personal address unless "Send mail as" (SMTP) is configured per person.
- [x] Site public-facing email updated to `contact@oskelo.com` in [Contact.js:44](app/components/Contact.js) and [terms/page.js:200](app/terms/page.js).
- [x] **Contact form emails on submit.** `RESEND_API_KEY` is set in Vercel; a test submission arrived at `oskelo.co@gmail.com`. `NOTIFY_EMAIL` in [api/contact/route.js:9](app/api/contact/route.js) stays `oskelo.co@gmail.com` (Resend `from:` is still `onboarding@resend.dev`; the visitor's address is set as `replyTo`).
- [x] **`oskelo.com` verified in Resend for sending.** DKIM (`resend._domainkey`) + SPF on the `send.oskelo.com` subdomain (MX `feedback-smtp…amazonses.com`, TXT `v=spf1 include:amazonses.com ~all`) added in Cloudflare DNS — all show **Verified**. No conflict with the root ImprovMX SPF because Resend uses a subdomain. "Enable Receiving" left OFF (ImprovMX handles inbound).
- [x] **Gmail "Send mail as" `contact@oskelo.com`.** Configured via Resend SMTP (`smtp.resend.com:465`, user `resend`, password = a Resend API key named `gmail-smtp`). Set as the **default** send address; "when replying, use the same address the message was sent to". Confirmed working — replies now go out from `contact@oskelo.com`.
- [ ] **Optional polish:** flip the Resend `from:` in [api/contact/route.js:38](app/api/contact/route.js) from `onboarding@resend.dev` to something like `Oskelo Website <noreply@oskelo.com>` now that the domain is verified — makes the notification email itself come from the domain. Low priority; current setup works.
- [ ] **Later:** Google Workspace / Zoho mailboxes if the team grows (real per-person inboxes instead of forwards + send-as).
- [ ] Remove the redundant loose images from `public/` root (b49aceb + earlier work added optimized copies under `public/work/`). Decide which raw files, if any, to keep, then `git clean` or delete.
- [x] Optimize `IMG_9742.JPG` (9.1 MB → 301 KB as `public/work/portraits/tree-branch.jpg`, EXIF-rotated to 1200×1800).
- [x] Commit the Photography collage + push so it reaches oskelo.com.
- [x] Confirm the collage looks right on the deployed site — verified 2026-09-07.
- Note: the middle-image color correction is a CSS filter in `app/globals.css`, not baked into the file — kept as CSS so it stays adjustable.

## Task log

Newest first. Each entry: what was asked, what changed, state left in.

### 2026-09-07 — Finish the email setup: Resend notifications + Gmail send-as

- **Asked:** connect the contact form's "Send message" to Gmail; then set up replies so they come *from* `contact@oskelo.com` without paying.
- **Done (all external config, no repo changes):**
  - Created Resend account (signed up as `oskelo.co@gmail.com`), made an API key, added `RESEND_API_KEY` in Vercel env vars, redeployed. Test form submission arrived in Gmail — **working**.
  - Added `oskelo.com` in Resend, chose **Manual setup**, added DKIM + `send`-subdomain SPF (MX + TXT) records in Cloudflare DNS. All **Verified**. No SPF conflict — Resend uses `send.oskelo.com`, ImprovMX uses the root.
  - Made a second Resend API key `gmail-smtp`; used it as the password for Gmail → Settings → Accounts and Import → "Send mail as" → `contact@oskelo.com` via `smtp.resend.com:465` (user `resend`). Gmail's confirmation code came through the ImprovMX forward. **Replies now send from `contact@oskelo.com`.**
- **State left in:** email is fully functional end to end — inbound forward (ImprovMX), form notifications (Resend → Gmail), outbound replies (Gmail send-as via Resend SMTP). No code committed this phase; only HANDOFF.md updated.

### 2026-09-07 — Stand up contact@oskelo.com + point the site at it

- **Asked:** set up a branded contact email as a forward for now; then update the website to use it; then "make the send message button send it to my gmail".
- **Done (outside the repo):** Cloudflare's Email Routing nav was missing, so used **ImprovMX**. Added MX + SPF records in Cloudflare's DNS page; confirmed all three resolve via `8.8.8.8`. Alias `contact@oskelo.com` → `oskelo.co@gmail.com` created at improvmx.com.
- **Changed in the repo (uncommitted):**
  - [app/components/Contact.js](app/components/Contact.js) + [app/terms/page.js](app/terms/page.js) — visible email + `mailto:` now `contact@oskelo.com`.
  - [app/api/contact/route.js](app/api/contact/route.js) — `NOTIFY_EMAIL` left as `oskelo.co@gmail.com` with a comment explaining why (Resend sandbox sender limitation).
  - `.env.local.example`, `README.md` — comments unchanged in net (briefly flipped, then reverted).
- **Contact form status:** it already emails on submit *if* `RESEND_API_KEY` is configured. It is not yet (no `.env.local` here; unknown whether Vercel has it). User still needs to connect Resend — see Outstanding.
- **Build:** `npm run build` fails locally with `supabaseUrl is required` — pre-existing, this checkout has no `.env.local`; Vercel has the vars. Not caused by these edits (text-only).
- **State left in:** committed as `99aca01` and pushed to `origin/main`. Vercel deploying. Once live, homepage + Terms show `contact@oskelo.com`. Contact form still needs Resend connected (Outstanding) before submissions email anywhere.

### 2026-09-07 — Plan a branded contact email

- **Asked:** whether the user can have a business email for people to contact them; then to "just connect it to forward it for now", with a real mailbox purchase deferred until the business grows.
- **Findings:** `oskelo.com` DNS is already on Cloudflare (`harley/dana.ns.cloudflare.com`); no MX records exist. Site currently exposes `oskelo.co@gmail.com` in `app/components/Contact.js`, `app/terms/page.js`, and as `NOTIFY_EMAIL` in `app/api/contact/route.js`.
- **Plan handed to the user (no code changed, nothing done in Cloudflare — Claude can't touch their DNS/accounts):** enable Cloudflare Email Routing on the oskelo.com zone, create `contact@oskelo.com` forwarding to `oskelo.co@gmail.com`, verify via the Gmail link. Later: swap the forward for Google Workspace / Zoho if volume grows.
- **State left in:** nothing committed. Added as an Outstanding item with full steps. Site email refs unchanged until forwarding is confirmed live.

### 2026-09-07 — Rewrite the hero blurb to "we do it all" (+ push)

- **Asked:** change the paragraph under the big title so it matches the idea that Oskelo does everything, then "push it".
- **Changed (committed locally, not pushed):** `app/page.js` hero `<p>` is now:
  "Video and photography for businesses, individuals, and events — brand films, portraits, product shoots, and event coverage. Hand us your footage to edit, or have us on-site to shoot and produce the whole piece."
  (was: "Oskelo turns your raw footage into polished business videos — or comes on-site to film and create them for you. Three packages, one simple process.")
- **Verified:** localhost — four lines, sits cleanly above the CTAs.
- **State left in:** committed as `7c82a9a`, **pushed to `origin/main`** (push worked from this session this time), **deployed and verified live** on www.oskelo.com.

### 2026-09-07 — Broaden the hero tagline

- **Asked:** change the "Video creation for businesses" line so it covers both video and photo, and audiences of businesses, individuals, and events.
- **Changed (committed locally, not pushed):**
  - `app/page.js` — hero eyebrow is now "Video & photo for businesses, individuals & events".
  - `app/layout.js` — `<title>` → "Oskelo — Video & Photo for Businesses, Individuals & Events"; meta description reworded to mention video + photography and all three audiences.
  - `app/about/page.js` — meta description reworded to match.
  - Left alone: `app/terms/page.js` legal copy; the hero body paragraph (still video/business only — see Outstanding).
- **Verified:** localhost desktop (one line) and mobile (wraps to two lines) both read cleanly.
- **State left in:** committed locally, not pushed.

### 2026-09-07 — Hero photo-wall collage: built, then reverted

- **Asked:** replace the homepage hero background (`/1.png`, the bridge) with a big collage of many photos. After seeing it and a follow-up tweak request, the user changed their mind: "make it back to the bridge like it was before".
- **What was built (commit `ad9b0bc`, never pushed):** `public/hero/` with 29 ~520px webp tiles cropped via `sharp` from the loose `public/` images and `public/work/`; `lib/hero.js` tile list; `.hero-collage` masonry in `app/page.js` + `app/globals.css` (7-col CSS `columns`, rotate/scale, drift animation, stronger scrim); `.claude/launch.json`.
- **Revert:** `git reset --hard 40f291a` — dropped `ad9b0bc` entirely. Hero is back to `.hero-bg { url('/1.png') }`, verified on localhost (bridge renders as before). `public/hero/`, `lib/hero.js`, and `.claude/launch.json` are gone. `public/1.png` untouched.
- **State left in:** working tree matches the pre-task state plus this handoff entry. Nothing to push except the handoff commit.

### 2026-09-07 — Push landed, collage verified live

- **Asked:** get the work onto the live site.
- **What happened:** the user ran `git push origin main` from their own terminal (this session's shell can't auth to GitHub). `origin/main` now at `06a6c34`. Vercel deployed; checked oskelo.com/work — the 3-up colour collage renders and `tree-branch.jpg` serves 200.
- **State left in:** live and correct. One trivial HANDOFF.md update still to be pushed. Loose `public/` images still to clean up.

### 2026-09-07 — Ship the Photography collage to production

- **Asked:** push the collage work to the live site.
- **Changed & committed to `main`, pushed to `origin`:**
  - Optimized the middle image: `IMG_9742.JPG` (9.1 MB) → `public/work/portraits/tree-branch.jpg` (301 KB, 1200×1800, EXIF-rotated) via `sharp`.
  - `lib/work.js` — `photography.images` now points at `tree-branch.jpg` instead of the raw `/IMG_9742.JPG`.
  - `app/work/page.js`, `app/page.js` — collage rendering in `.link-card-media`.
  - `app/globals.css` — `.is-collage` flex layout, middle-image warm filter, and removal of grayscale from `.work-card--photo img`.
- **State left in:** committed locally (`1354669`), **not pushed** — this session's shell can't auth to GitHub. User needs to run `git push origin main` from their own terminal; Vercel then builds and deploys. Loose raw images still sit untracked in `public/` root (cleanup pending).

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
