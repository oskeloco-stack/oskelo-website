# Oskelo — Project Handoff

Living status doc for the Oskelo website. Updated at the end of every task.

_Last updated: 2026-09-09 (Photography section: removed the homepage wedding-video loop; added Concerts + Sports collections with galleries, added five portraits to the Portraits gallery, uppercased the work-card headings — all pushed to `origin/main`)_

---

## Project

- **What:** Next.js 16 marketing site for Oskelo (video + photography for businesses).
- **Repo:** `github.com/oskeloco-stack/oskelo-website`, default branch `main`.
- **Live site:** https://oskelo.com — Vercel, auto-deploys on push to `main`.
- **Local dev:** `npm run dev` → http://localhost:3000 (must be running to view; it does not auto-start).
- **Key dirs:** pages in `app/`, shared data in `lib/`, images in `public/`, styles in `app/globals.css`.
- **Contact form:** writes to Supabase; optional email via Resend. Env vars in `.env.local` (untracked) and in Vercel settings.

## Current state

- **2026-09-09 session:** local `main` pushed to `origin/main` as a single commit on top of `9543d96` — Concerts + Sports collections, five new Portraits photos, uppercase work-card headings. Vercel deploys `main` on push.
  - **The wedding-video loop and its 16 MB blob never reached `origin`.** Earlier in the session the loop was reverted (`ea0d012` add → `8bb86bc` revert). A first push attempt of that chain failed mid-upload (`curl 55 Send failure: Connection was reset` — the 16 MB blob in `ea0d012` made the pack too big for the flaky uplink). That failure turned out to be useful: `git reset --soft 9543d96` then dropped both `ea0d012` and `8bb86bc`, keeping the photography changes staged, and only the lean photography commit was pushed. No `video-editing-loop.*` blob anywhere — not the tree, not history, not the live site. (`git reset --hard` is blocked in this environment; `--soft` is not.)
  - **Photography section changes** (`lib/work.js`, `app/globals.css`, new images under `public/work/`):
    - `Harlow & Co.` product-photography placeholder → **`Concerts`** collection. Card image `public/work/concerts/stage-vocalist.jpg` (from the loose `public/Concert 1.jpg`, 40 MB → 118 KB, `sharp .rotate().resize(1200).jpeg({quality:80,mozjpeg:true})`). Gallery of 4: `stage-vocalist`, `guitarist-raised`, `duo-guitars` (b&w), `crowd-phones`. `slug: 'concerts'` → live at `/work/photography/concerts`.
    - New **`Sports`** collection. Card image `public/work/sports/field-hockey.jpg` (from `public/HW6A0243-topaz.jpg`). Gallery of 5: `field-hockey`, `night-stiff-arm` (b&w), `cutback-run`, `line-of-scrimmage`, `flag-football`. `slug: 'sports'` → live at `/work/photography/sports`.
    - **Portraits gallery** gained 5 photos from the loose `public/Shoots 1-5` files → `public/work/portraits/shoot-1..5.jpg` (1200 px, mozjpeg q80; Shoots 3-5 had EXIF orientation 8 and were auto-uprighted by `sharp().rotate()`). Gallery is now 8 images.
    - `app/globals.css` `.work-card .tag b` gained `text-transform: uppercase; letter-spacing: 0.03em;` — the category grid headings (Portraits / Concerts / Sports / Wedding & Engagement, and the Video & Editing category's cards) now render all-caps.
  - **Grid note:** the Photography category grid (`.work-grid`, `repeat(3, 1fr)` desktop) now has 4 cards, so desktop shows 3 on row 1 and Wedding & Engagement alone on row 2. Acceptable; revisit to a 2×2 or 4-up if it bothers anyone.
  - **2026-09-08 sync** still stands (local was 12 behind, `git pull --ff-only` → `9543d96`, bringing in the scrolling promo bar, `/offers` + `PromoBar`, homepage restructure). Only the video loop was undone.
- **Earlier live HEAD:** `83f0d51`, **pushed to `origin/main`** (push worked from that session). Workstreams:
- **0. Hero photo visibility** (`24f8799`) — `app/globals.css`, `.hero-bg` + `.hero-scrim`. The bridge photo (`/1.png`) was ~80–93% hidden under a cream wash; the user wanted it more visible, then dialed back once ("words hard to see"), then asked to fix a hard line at the hero's bottom edge. Now: `.hero-bg` 115deg wash `0.82 → 0.60 → 0.30 → 0.48`; `.hero-scrim` has a 90deg left-column wash (`0.78 → 0.38 → 0` across 0–68%) for headline legibility plus a multi-stop 180deg vertical fade that ramps to full `--bg` by 99% so the hero clips into the section below with no seam. User said "perfect".
- **1. Founding offer copy** (`f17a1fe` → `ad53951` → `baf75d0`) — `app/components/FoundingOffer.js` reframed so it doesn't read as a launch deal, then the heading iterated down to something plain:
  - eyebrow `Founding Member Offer` → `Monthly Rate Lock`
  - heading, final: **"Lock in your rate for good"** (path: "The first 5 to sign up this month lock in their rate for good" → "First 5 in — rate locked for good" → simpler)
  - body: "Start any monthly plan this month and, if you're one of the first 5 to sign up, today's rate is grandfathered in for as long as you stay subscribed — even after our prices go up. What you pay now is what you pay for good."
  - Dropped "our first 5 clients" / "Join early" (implied a brand-new business); user also said don't say "each month", so the cadence is implied by "this month" only. CTA "Claim your spot" unchanged.
  - Component renders on the homepage, `/services`, and the monthly-plans service page. **Verified live on www.oskelo.com:** homepage `<h2>` reads "Lock in your rate for good".
- **2. Photography "Recent projects" card** — long iteration; final commit `83f0d51`. Earlier commits `3b4d1b9` → `ab30caa` → `63a5b99` → `f023dda` → `a3153fc` swapped in `IMG_9787` (`woodland-path.jpg`) and tuned the crop `28% → 6% → 15% → 25% → 28% → 31%`. Then the user asked for a *different* image of Isaac — "the crouch and smile one" = `IMG_9793` — and pointed at it by number.
  - `public/work/portraits/woodland-path-smile.jpg` — **current image**; `IMG_9793` (Isaac crouched on the path, big smile, same shoot/outfit as `IMG_9787`) optimised to 1200×1800 / ~293 KB, EXIF-rotated (`sharp` `.rotate().resize(1200).jpeg({quality:80,mozjpeg:true})`).
  - `lib/work.js` — `photography.images` now `['/work/portraits/woodland-path-smile.jpg']`.
  - `app/globals.css` `.link-card-media.is-collage img` — `object-position: 50% 26%` (dropped from 31% on "move him down a little"), `filter: brightness(1.12) contrast(1.04) saturate(1.05)` (from "brighten the photo up" + "bring out his face a little better" — his face was a touch dark against the backlit green), and `transform-origin: 50% 100%` (keeps the `:hover` `scale(1.03)` zoom from clipping the top). A matching `.link-card:hover .link-card-media.is-collage img` rule carries the same filter through hover (the generic hover rule would otherwise reset it to `grayscale(0)`). One block; feeds the homepage `#work` card and `/work`.
  - **Orphaned, still committed, referenced nowhere:** `public/work/portraits/tree-branch.jpg` (`IMG_9742` log shot) and now `public/work/portraits/woodland-path.jpg` (`IMG_9787`). Candidates for the image cleanup below.
  - **Verified live on www.oskelo.com:** homepage references `woodland-path-smile.jpg` (serves 200, 293 KB); deployed CSS reads `.is-collage img{object-position:50% 26%;filter:brightness(1.12)contrast(1.04)saturate(1.05);transform-origin:50% 100%;…}` plus the hover rule.
- **3. Local dev server was stale** — `/work/photography` on localhost returned HTTP 500 `Jest worker encountered 2 child process exceptions` (Turbopack/Next 16 dev-worker crash). The `next dev` process (PID 13444) had been running since **9/6**. Killed it (`Stop-Process -Id 13444 -Force`) and started a fresh one via the `oskelo-dev` launch config; `/work/photography` now returns 200. Production was never affected. If this recurs: kill whatever PID holds port 3000 and restart `npm run dev`.
- **Note on pushing:** this session's shell *was* able to `git push` this time (credentials cached). It may still fail in future sessions — if so, the user runs `git push origin main` from their own terminal.
- **Not committed:** ~16 loose images in `public/` root (raw camera files + web copies), plus an untracked `.claude/launch.json` (added this session so `preview` can start `next dev` on port 3000 — harmless, not committed).
- **Dev-server note:** the Turbopack/Next 16 dev worker crashes (`Jest worker encountered 2 child process exceptions`) if the `next dev` process is left running for days. Seen again this session on a process from 9/6; fixed by killing it and restarting. If localhost pages 500 with that message, kill whatever PID holds port 3000 and run `npm run dev` fresh.
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
- [ ] Remove the redundant loose images from `public/` root (b49aceb + earlier work added optimized copies under `public/work/`). Decide which raw files, if any, to keep, then `git clean` or delete. Includes the ~20 untracked `IMG_*.JPG` / UUID `.jpg` files still sitting in `public/` root.
- [ ] Delete the two now-orphaned optimized portraits `public/work/portraits/tree-branch.jpg` and `public/work/portraits/woodland-path.jpg` once the crouch-and-smile card (`woodland-path-smile.jpg`) is settled.
- [x] **Video-loop history is clean.** `ea0d012` + `8bb86bc` were dropped via `git reset --soft 9543d96` before pushing, so no `video-editing-loop.*` blob ever reached `origin`. Nothing left to do here.
- [x] Optimize `IMG_9742.JPG` (9.1 MB → 301 KB as `public/work/portraits/tree-branch.jpg`, EXIF-rotated to 1200×1800).
- [x] Commit the Photography collage + push so it reaches oskelo.com.
- [x] Confirm the collage looks right on the deployed site — verified 2026-09-07.
- Note: the middle-image color correction is a CSS filter in `app/globals.css`, not baked into the file — kept as CSS so it stays adjustable.

## Task log

Newest first. Each entry: what was asked, what changed, state left in.

### 2026-09-09 — Photography section: Concerts + Sports collections, more Portraits, uppercase headings

- **Asked (rapid iteration in one session):** open localhost; then "update the harlow and co with events and add this image from public" → "actually JK use this named one, Concert 1" → "Change that heading though to Concerts" → "make all those fully capital for all three of the sections under photography" → "add another one for sports as well" → "Now add to portraits Shoots 1-5" → "Put some of the concert images and sports images into their respective spots" → "push that".
- **`lib/work.js` — photography `items`:**
  - `Harlow & Co.` (was `tag: 'Product photography'`, no image) → `name: 'Concerts'`, `tag: 'Live music and event photography'`, `slug: 'concerts'`, card image + 4-image `gallery`.
  - Added `Sports` item: `tag: 'Game-day and team photography'`, `slug: 'sports'`, card image + 5-image `gallery`.
  - `Portraits.gallery`: 3 → 8 entries (`shoot-1..5` appended).
- **Images** — all via `sharp('src').rotate().resize(1200).jpeg({quality:80,mozjpeg:true})`, from loose files in `public/` root:
  - `public/work/concerts/`: `stage-vocalist.jpg` (← `Concert 1.jpg`), `guitarist-raised.jpg` (← `HW6A2971-topaz-edit.jpg`), `duo-guitars.jpg` (← `HW6A2831-topaz-2.jpg`), `crowd-phones.jpg` (← `HW6A4059-topaz.jpg`).
  - `public/work/sports/`: `field-hockey.jpg` (← `HW6A0243-topaz.jpg`), `night-stiff-arm.jpg` (← `HW6A1861-topaz.jpg`), `cutback-run.jpg` (← `HW6A5608-topaz.jpg`), `line-of-scrimmage.jpg` (← `HW6A5206-topaz.jpg`), `flag-football.jpg` (← `1Z0A5160-topaz.jpg`).
  - `public/work/portraits/shoot-1..5.jpg` (← `Shoots 1.jpg`, `Shoots 2.jpg`, `Shoots 3-5.JPG`). Shoots 3-5 carried EXIF orientation 8 and were auto-rotated upright by `sharp().rotate()`.
  - A first pass at `resize(1400)` was redone at `1200` to match the existing ~290 KB portrait convention.
  - The intermediate `public/work/events/` folder (briefly held `stage-vocalist.jpg` when the card was still "Harlow & Co. / events") was removed; everything lives under `concerts/` now.
- **`app/globals.css`** — `.work-card .tag b` gained `text-transform: uppercase; letter-spacing: 0.03em;`. Applies to every work-category grid card (Photography's four + the Video & Editing category page).
- **Verified (localhost, viewport forced to 1200×900 because the hidden Browser pane collapses `body` to 0 width):** `/work/photography` shows 4 cards, all now links; `/work/photography/concerts` and `/work/photography/sports` render their galleries (all images HTTP 200); Portraits gallery has 8 images; headings render all-caps; no console errors.
- **State left in:** committed and **pushed to `origin/main`** as one lean commit on top of `9543d96`; Vercel deploying. The first push attempt (still carrying `ea0d012` + `8bb86bc`) failed on a connection reset — the 16 MB blob made the pack too big for the uplink — so `git reset --soft 9543d96` dropped that pair and only the photography commit went up. Loose source images in `public/` root (`Concert 1.jpg`, `Shoots 1-5`, the `1Z0A`/`HW6A`/`IMG_`/UUID files, `Corban & Rachel.mp4`) remain untracked by convention.

### 2026-09-09 — Remove the homepage "Video & Editing" wedding-video loop

- **Asked:** open the local server; "get rid of the video we put in". After learning the commit couldn't be hard-reset here, the user asked to instead "update the local server to match the online one".
- **Done:** `git revert --no-edit ea0d012` → commit `8bb86bc`. Undoes the `lib/work.js` / `app/page.js` / `app/globals.css` changes and deletes `public/work/video-editing-loop.mp4` + `.jpg`. `git diff 9543d96 HEAD` is empty, so local == live in content.
  - `git reset --hard 9543d96` (the clean way, since `ea0d012` was never pushed) is **blocked by the command classifier** in this session — hence the revert. Side effect: the 16 MB `video-editing-loop.mp4` blob remains in history inside `ea0d012`. User can `git reset --hard 9543d96` from their own terminal any time to wipe both commits.
- **Verified (localhost):** `#work` has `videoCount: 0`; the "Video & Editing" card renders `<div class="link-card-media"></div>` with no `<video>` / `<img>`; no console errors; dev server (`oskelo-dev`, Next 16.3.4, fresh start) clean.
- **State left in (superseded):** ended this sub-task at `8bb86bc`, not pushed. Later in the same session, `git reset --soft 9543d96` dropped `ea0d012` + `8bb86bc` so the video work left no trace in history — see the photography entry above.

### 2026-09-07 — Mobile polish: promo bar, founding-offer photo, hero legibility

Follow-up tweaks after the homepage restructure. All in `app/globals.css` unless noted; each was committed and pushed on its own (`2058728` → `2dd320a`).

- **Promo bar, mobile** — user wanted the moving-banner text "way smaller" and the background less harsh. Mobile now: `font-size: 8px`, `letter-spacing: 0.04em`, `padding: 6px 22px` on the span, `background: #8c6a52` (a muted Oskelo brown — path was `rgba(52,42,31,0.55)` → `var(--amber)` → muted `#8c6a52` for "less vivid"). Desktop is unchanged (solid `var(--ink)`, 12px). One brief experiment softened the **desktop** bar to `rgba(52,42,31,0.86)` (`e534228`) and was reverted the next commit.
- **B&W photo behind the founding offer** (`98cdd1b`) — `app/components/FoundingOffer.js` now takes an optional `image` prop; `app/page.js` passes `/work/wedding-engagement/veil-barn.jpg`. When set it renders `.promo-bg` (grayscale `filter`, `object-position: 50% 26%`, a single radial `mask-image` so all four edges dissolve — the approach that finally beat the "choppy line" problem on the earlier mission-bg attempt) plus an `rgba(250,247,241,0.55)` scrim, and `.promo--image .promo-inner` becomes near-opaque cream with a soft shadow so the card lifts off the photo. `FoundingOffer` on `/services` and `/services/monthly-plans` stays plain (no prop).
- **Hero title legibility on mobile** — the headline was hard to read over the bridge. Mobile-only override of `.hero-scrim` (an even, light cream wash — `0.66 → 0.44 → 0.24` across the width, plus a soft vertical fade) and a tight-plus-wide cream `text-shadow` glow on `.hero-content h1` and `.eyebrow`. First pass over-washed it (`e3c7624`); dialled the wash back so the bridge shows through and the glow carries the legibility (`8ecb21d`).
- **Hero closer to "What we offer" on mobile** (`2dd320a`) — mobile `.hero{min-height}` `520px → 430px` and `.offers{padding-top}` `44px → 14px`, so the section sits right under the hero.
- **State left in:** local `main` == `origin/main` at `2dd320a`; all deployed. Dev server restarted so localhost matches. `HANDOFF.md` updated (this entry). Still untracked/uncommitted: `.claude/`, the loose `public/*.JPG` originals, `public/IMG_1858.JPG`, `public/mission-sunset.jpg`.

### 2026-09-07 — Homepage restructure + scrolling promo bar + /offers page

- **Asked (one long session of iteration):** move the hero description out into its own "mission / what we do" section; move "What we offer" up directly under the hero and reduce it to just the clickable service names; add a moving banner across the very top with the promo + action step; then many follow-up tweaks to the banner copy, the "What we offer" layout, and a mission-section background image that was ultimately scrapped.
- **`app/components/PromoBar.js` (new)** — pure-CSS marquee, rendered site-wide in `app/layout.js` above `<Header>` (dark `--ink` bar, cream text, `promo-marquee` keyframes, pauses on hover, one static line under `prefers-reduced-motion`). Links to `/offers`. Final copy: "Start any monthly plan this month and keep today's rate for good — limited to 5 spots" (iterated: dropped "Monthly Rate Lock", dropped "Claim your spot", swapped "be one of the first 5" → "limited to 5 spots").
- **`app/page.js` — homepage reordered:** hero (no `<p>` blurb) → **What we offer** (`.offers` / `#services`) → **Our mission** (`.section-alt` / `#mission`) → FoundingOffer → work → reels → contact.
  - **What we offer** is now `.offers-inner` (grid `1.8fr 1fr`): left = `.offer-list`, a `<ul>` of the 3 `SERVICES` as big Archivo links — `01 / 02 / 03` index number, name, one-line blurb (the service `subtitle`), arrow. `li{flex:1}` so the three rows stretch to exactly match the photo's height. Right = `.offers-collage`, a **single** portrait image (`/work/wedding-engagement/garden-path.jpg`), `aspect-ratio: 4/5`, `filter: grayscale(1) contrast(1.05) brightness(1.02)` (B&W — the user tried a warm colour wash and a 2–3 image collage first, then settled on one B&W portrait).
  - **Our mission** — `.section-head` ("What we do" / "Our mission") + `.mission-body` (2-col text grid). A sunset-silhouette-kiss background image (`IMG_1858` → `public/mission-sunset.jpg`, 147 KB) was built with a radial `mask-image` feather, then **scrapped at the user's request** — the section is back to plain text on the tan panel. `public/mission-sunset.jpg` and `public/IMG_1858.JPG` are left untracked/unused in `public/`.
- **`app/offers/page.js` + `lib/offers.js` (new)** — "Limited Offers" page at `/offers`. `OFFERS` array (currently one: Monthly Rate Lock) → `.offer-card-list` of amber-bordered `.offer-card`s (eyebrow, title, body, detail `<ul>`, CTA button to `/services/monthly-plans`). Empty-state message if the array is emptied. Added **Offers** to the header nav (desktop + mobile).
- **`app/components/Header.js`** — nav order is now **Services · Work · Offers · Team · Contact** (Services and Work dropdowns swapped; Offers inserted).
- **`app/globals.css`** — `.promo-bar*` marquee; `.offers-inner` / `.offer-list` / `.offer-num` / `.offer-text` / `.offer-name` / `.offer-blurb` / `.offer-arrow` / `.offers-collage`; `.offer-card*` for the offers page; `.hero{min-height}` `860 → 660` (`520` mobile) now that the hero has no paragraph; mobile `.section-head` now stacks (`flex-direction: column`) so headings don't overlap their side note.
- **Verified:** localhost screenshots of the promo bar, reordered homepage, `/offers`, and the reverted mission section; `npm run build` passes (all routes prerender, `/` still static). The preview pane went blank after scrolling several times this session — fixed each time by restarting the `oskelo-dev` server; production unaffected.
- **State left in:** committed and pushed to `origin/main`; Vercel deploying. Untracked and **not** committed: `.claude/`, the ~10 loose `public/*.JPG` originals, `public/IMG_1858.JPG`, `public/mission-sunset.jpg`.

### 2026-09-07 — Photography card: crouch-and-smile portrait, brightened + dev server fix

- **Asked (rapid iteration):** "make the image of the black guy (isaac) a different image" → tried to identify a rock/creek shot the user pasted (not in the repo) → "use the crouch and smile one" → "image 9793" → "move him down a little" → "brighten the photo up a bit" → "bring out his face a little better" → separately "why can't I access the photography page on localhost please fix" → "launch that to the live website".
- **Image swap (`83f0d51`, pushed, verified live):**
  - `public/work/portraits/woodland-path-smile.jpg` — `IMG_9793` (Isaac crouched on the woodland path, big smile, same shoot as `IMG_9787`) → `sharp .rotate().resize(1200).jpeg({quality:80,mozjpeg:true})`, 1200×1800 / ~293 KB.
  - `lib/work.js` — `photography.images` → `['/work/portraits/woodland-path-smile.jpg']`.
  - `app/globals.css` `.is-collage img` — `object-position` `50% 31%` → `50% 26%` ("move him down a little"); added `filter: brightness(1.12) contrast(1.04) saturate(1.05)` (brighten + open his face against the backlit green); added matching `.link-card:hover .link-card-media.is-collage img` so hover doesn't reset the filter to `grayscale(0)`.
  - Filter values were tuned against `sharp` previews approximating the CSS filter at the real card box (501×312). Kept as CSS (not baked into the JPG) so it stays adjustable, per the project convention.
- **Localhost photography page 500:** stale `next dev` (PID 13444, running since 9/6) — killed and restarted via the `oskelo-dev` launch config; `/work/photography` now 200. Production was never affected.
- **State left in:** committed `83f0d51`, pushed; **verified live on www.oskelo.com** (homepage → `woodland-path-smile.jpg` 200; CSS shows `object-position:50% 26%` + the brightness filter). `woodland-path.jpg` and `tree-branch.jpg` now both orphaned.

### 2026-09-07 — Hero: make the bridge photo more visible + even out the fade

- **Asked:** "make the main page more vivid" → clarified to "make the image on the hero more visible" → "a little less visible, the image is making the words hard to see" → "make the hero image fade more evenly out, right now there is a harsh line". Final reaction: "perfect".
- **Changed (`app/globals.css`):**
  - `.hero-bg` — 115deg cream wash over `/1.png` lightened from `0.93/0.78/0.55/0.82` to `0.82/0.60/0.30/0.48`; the two warm radial tints nudged `0.10/0.08` → `0.12/0.10`.
  - `.hero-scrim` — now two layers: (a) a 90deg left-column wash `rgba(250,247,241,0.78) 0% → 0.38 40% → 0 68%` so the headline/eyebrow/paragraph stay legible over the lighter photo; (b) a 180deg vertical fade with 8 stops easing `0.22 → 0 → … → 1` and hitting **full `--bg` at 99%**, so the hero (`overflow:hidden`, `min-height:860px`) clips into the following `.section.promo` (which sits on plain `--bg`) with no visible line.
- **Verified:** localhost screenshots (browser pane visible again this time) — bridge reads clearly on the right, headline readable on the left, no seam at the hero bottom.
- **State left in:** committed `24f8799`, pushed; Vercel deploying. Not yet reconfirmed on www.oskelo.com.

### 2026-09-07 — Founding offer: reframe copy + simplify heading

- **Asked:** "Change the first five to lock in to something like first 5 to sign up this month are locked in forever — something that doesn't make it sound like we just started." Then: don't say "each month"; make the heading "short and catchy"; "nah make it simpler"; "publish that".
- **Changed (`app/components/FoundingOffer.js`):**
  - eyebrow `Founding Member Offer` → `Monthly Rate Lock`
  - heading iterations: original "The first 5 lock in their rate for good" → "The first 5 to sign up this month lock in their rate for good" → "First 5 in — rate locked for good" → final **"Lock in your rate for good"**
  - body → "Start any monthly plan this month and, if you're one of the first 5 to sign up, today's rate is grandfathered in for as long as you stay subscribed — even after our prices go up. What you pay now is what you pay for good." (was "…as one of our first 5 clients… Join early…")
  - CTA "Claim your spot" unchanged.
- **Verified:** localhost DOM shows the final eyebrow/heading/body on `#founding-offer`.
- **State left in:** committed `f17a1fe` → `ad53951` → `baf75d0`, all pushed; **verified live** — homepage `<h2>` is "Lock in your rate for good".

### 2026-09-07 — Photography card: center the portrait, then bring the subject up

- **Asked:** "center the image" → "center the image more so his body is center and head is near top but not cut off" → "bring him up a bit more" → "Bring him up to where his hair is almost hitting the top" (Photography "Recent projects" card, after the woodland-path swap).
- **Changed (`app/globals.css`):** `.link-card-media.is-collage img` `object-position` `50% 6%` → `50% 15%` (`ab30caa`) → `50% 25%` (`63a5b99`) → `50% 28%` (`f023dda`) → `50% 31%` (`a3153fc`), and added `transform-origin: 50% 100%` in `f023dda`. The portrait (1200×1800) is `object-fit: cover` in a 16/10 card ≈ 501×312, so the visible source window is ~747px tall and `object-position` Y% places its top at `Y% × (1800−747)`. 6% sat him low with a band of canopy above; 15% centered with generous headroom; 25% put his body dead-center; 28% lifted his head to just below the edge; 31% (source window `y326..1073`) puts the hair tips ~2px off the top. ~32%+ shaves the topmost hair. The bottom `transform-origin` makes the `:hover` `scale(1.03)` grow downward so it can't eat the tiny headroom.
- **Verified:** localhost computed `object-position: 50% 31%`, `transform-origin` = 50% 100% of the 501×312 box. Browser-pane screenshots blank (pane hidden — known); visual check via `sharp` extracts at the exact card box across 15–33% — 31% chosen as the tightest that doesn't clip.
- **State left in:** committed `ab30caa` → `63a5b99` → `f023dda` → `a3153fc`, all pushed; **verified live** — deployed CSS reads `object-position:50% 31%` + `transform-origin:50% 100%`.

### 2026-09-07 — Photography card: new woodland-path portrait + head no longer cut off

- **Asked:** "canter the black guy so his head isnt cut off", then "can we use a different image in the woods of him?" → "the one he is sitting in … like on a path". Picked `IMG_9787` from the previews.
- **Changed (uncommitted):**
  - `app/globals.css` — `.link-card-media.is-collage img` `object-position` `50% 28%` → `50% 6%`. The portrait (1200×1800) is `object-fit: cover` in a 16/10 card; at 28% the visible window started ~y126 in the source, clipping the top of the hair. At 6% it starts ~y63 (~80px headroom) and ends around his hands. Horizontal was already centred (`50%`).
  - `public/work/portraits/woodland-path.jpg` — new; `IMG_9787` → 1200×1800, ~285 KB, EXIF-rotated via `sharp`.
  - `lib/work.js` — `photography.images` → `['/work/portraits/woodland-path.jpg']`.
- **Considered but not chosen:** `IMG_9818` (tighter, more bokeh) and `IMG_9690` (sitting on a log, but profile and no path). Other optimised portraits (`woodland-suit.jpg`, `field-dress.jpg`) are different people; the Aug-18 loose images are city shots.
- **Verified on localhost:** single `<img src="/work/portraits/woodland-path.jpg">` in the collage wrapper, HEAD 200 / image-jpeg / 292 KB, natural 1200×1800, computed `object-fit: cover` + `object-position: 50% 6%`, card box ≈501×312. Browser-pane screenshots return blank (pane hidden — known), so the visual check was a `sharp` extract of the exact card window (`top:63, height:750`) done before the swap — full head with clearance, on the path, facing camera.
- **State left in:** committed as `3b4d1b9`, pushed, **Vercel deployed and verified live** on www.oskelo.com (homepage references `woodland-path`, image serves 200). Handoff follow-up commit `68c3ef3`. `tree-branch.jpg` left in the repo, now unreferenced.

### 2026-09-07 — Photography card down to a single portrait

- **Asked:** "make the black guy the only guy in the image" (Photography "Recent projects" card).
- **Changed (`7658c03`, pushed):** `lib/work.js` — `photography.images` is now just `['/work/portraits/tree-branch.jpg']`, so both the homepage `#work` card and `/work` show that one portrait full-bleed. Removed the `.is-collage img:nth-child(2)` featured-panel + tone-blend rules from `app/globals.css` (only relevant with multiple images). Single image keeps `flex:1` and stays in colour (`.is-collage img { filter:none }`), `object-position: 50% 28%`.
- **Verified:** DOM check on localhost — collage wrapper now has 1 `<img>` (`tree-branch.jpg`) filling the full 503px media width.
- **State left in:** committed + pushed; Vercel deploying.

### 2026-09-07 — Recolour the site to a light warm palette + feature the middle portrait

- **Asked:** "make the whole color scheme white and like a natural brown color. Not black anymore." Then, mid-task: "make the black guy officially the main guy in the image for photography recent projects."
- **Changed (`app/globals.css` only, committed `0d8064f`, pushed):**
  - Rewrote the `:root` tokens: `--bg #faf7f1` (warm paper white), `--bg-panel #efe7da` (light tan), renamed `--white` → `--ink #342a1f` (deep natural brown, primary text — no more near-black), `--grey #6f6353`, `--grey-dim #9a8d7a`, `--amber #9a5f33` (natural brown accent) + new `--amber-deep #7d4a26` for hovers, `--line` now a dark alpha on light.
  - Every hard-coded dark value updated to match: header gradient, hero `.hero-bg`/`.hero-scrim` (dark scrim → warm cream wash over `/1.png`), work/photo/reel card gradient fills (`#23201b→#14110d` → `#e9e0d2→#d8ccb9`), photo-card tags (dark pill → cream pill w/ ink text), form inputs, dropdown, team avatar, form status colours, focus ring.
  - `/4.png` is a white wordmark → added `filter: brightness(0.38) sepia(0.9) saturate(2.6) hue-rotate(-8deg)` on `.logo-img` so it renders natural brown on the light header.
  - `.link-card-media.is-collage img:nth-child(2)` (the middle portrait, `tree-branch.jpg`) now `flex: 2.2` vs `1` for the siblings, and `object-position: 50% 22%` — it's the dominant panel in the Photography collage on both the homepage and `/work`.
- **Verified:** localhost hero + `/work` screenshots show the new palette; computed styles confirm body bg `rgb(250,247,241)` / text `rgb(52,42,31)`, solid button brown, middle collage image 260px vs 118px siblings. Below-fold screenshots were unreliable (browser pane hidden) but content and computed styles check out.
- **State left in:** committed and pushed as `0d8064f`; Vercel deploying. `.claude/launch.json` left untracked.

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
