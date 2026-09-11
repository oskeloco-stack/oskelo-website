# Oskelo Admin Area

A private, logged-in control panel at **`/admin`** — traffic analytics, the
contact-form inbox, image uploads, and site content editing, all without
touching code or waiting for a deploy.

- **Login:** `/admin/login` — a real Supabase Auth account (email + password).
- **Who can get in:** only the email in `ADMIN_EMAIL` (default
  `oskelo.co@gmail.com`). Any other Supabase auth user is rejected.
- **How content edits go live:** saving writes to the Supabase `site_content`
  table; the public pages re-read it at most once a minute
  (`export const revalidate = 60`), so no redeploy is needed.
- **Setup status:** the Supabase side (auth user, `media` bucket,
  `site_content` and `analytics_events` tables) is already provisioned on the
  `oskeloco-stack's Project` project. The steps below are here for reference —
  e.g. if this is ever pointed at a fresh Supabase project.

---

## Pages

| Page | What it does |
| --- | --- |
| **Dashboard** (`/admin`) | 14-day traffic snapshot, unread-message count, stored-image count, recent inquiries, and which content sections have edits saved. |
| **Analytics** (`/admin/analytics`) | Page views, unique visitors, top pages, referrers, devices, browsers, OS and country over 7/30/90 days. |
| **Messages** (`/admin/messages`) | Every contact-form submission. Mark read/unread, archive, reply (opens your mail client), or delete. |
| **Images** (`/admin/images`) | Drag in or pick image files (JPG/PNG/WebP/GIF/AVIF, ≤25 MB). Each has **Copy URL** and **Delete**. |
| **Content** (`/admin/content`) | Edit Work / Services / Offers. **Form** tab has structured fields (image fields get a **Pick** button from your uploads); **Raw JSON** tab edits the section directly. **Reset to built-in default** deletes your override so the site falls back to the values in `lib/work.js` / `lib/services.js` / `lib/offers.js`. |

## Known limits (v1)

- The header/footer **navigation** is still defined in code (`app/components/
  Header.js` / `Footer.js`), not editable here.
- Adding a brand-new category or service **slug** still needs a deploy before its
  own detail page pre-builds. Editing existing entries updates live.
- No edit history / undo on Content — use **Reset to built-in default** to get
  back to the code values, or re-edit. Messages you **Delete** are gone for
  good; **Archive** is the reversible way to clear the inbox.
- Extra admin users / password resets are done in the Supabase dashboard.

## Analytics — how it works

There's no third-party analytics service (no Google Analytics, no cookies
banner needed). `app/components/Analytics.js` posts a tiny beacon to
`/api/track` on every page view; that route classifies the request (device,
browser, OS, bot-or-not) and inserts one row into `analytics_events` using the
service-role key. The table has Row Level Security enabled with **no**
policies, so the anon/public API key can't read or write it — only server
routes using the service-role key can, which is by design (Supabase's linter
flags this as `rls_enabled_no_policy`; that's expected here, not a bug to fix).

Privacy: no IP address or user-agent string is stored. Each row's
`visitor_hash` is `sha256(salt + day + ip + user-agent)`, truncated — it lets
"unique visitors" be counted within a single day but can't be reversed to an
IP or linked across days. The beacon also honors Do Not Track / Global Privacy
Control and skips `/admin` entirely.

## Messages — how it works

The public contact form (`app/api/contact/route.js`) already wrote to a
`messages` table. The admin adds `read_at` and `archived` columns on top of
that so the same table doubles as an inbox — no new table, no data migration
for existing submissions (they all start unread, in the inbox).

## One-time setup in the Supabase dashboard (reference)

1. **Create the admin user**
   Authentication → Users → **Add user** → enter your email + a password
   ("Auto Confirm User" on). Use the same email you put in `ADMIN_EMAIL`.

2. **Lock down sign-ups** (so the login page can't be used to self-register)
   Authentication → Sign In / Providers → Email → turn **off**
   "Allow new users to sign up". Save.

3. **Turn on leaked-password protection** (recommended, not yet enabled)
   Authentication → Policies (or Auth settings) → enable "Leaked password
   protection" — rejects passwords found in public breach databases. Not
   exposed through the tooling used to provision everything else, so it's a
   manual toggle.

4. **Create the image bucket** — `media`, public, already done via migration
   `create_media_storage_bucket` (25 MB limit, JPEG/PNG/WebP/GIF/AVIF only).

5. **Create the content + analytics tables** — `site_content` and
   `analytics_events`, already done via migrations `create_site_content` /
   `create_analytics_events` (see `supabase migrations` in the dashboard for
   the exact SQL).

6. **Environment variables** — in `.env.local` (local) **and** the Vercel
   project (Settings → Environment Variables), then redeploy:

   | Variable | Where to find it |
   | --- | --- |
   | `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` secret. **Server-only — never `NEXT_PUBLIC`.** Used by every `/api/admin/*` route and by `/api/track`. |
   | `ADMIN_EMAIL` | The email from step 1 (optional; defaults to `oskelo.co@gmail.com`). |
   | `ANALYTICS_SALT` | Optional — see `.env.local.example`. Falls back to a value derived from the service-role key if unset. |

   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already
   set and are reused.

---

## How it fits together (for developers)

| Piece | File |
| --- | --- |
| Session refresh + optimistic redirect | `proxy.js` (Next 16 "Proxy", formerly Middleware) |
| Auth gate (authoritative) | `app/admin/(dash)/layout.js` via `lib/adminAuth.js` |
| Supabase clients | `lib/supabase/{browser,server,admin}.js` |
| Public pages read overrides | `lib/siteContent.js` → `getContent(key, fallback)` |
| Page-view beacon (public site) | `app/components/Analytics.js` → `app/api/track/route.js` |
| Analytics helpers | `lib/analytics.js` (classify + aggregate), `lib/analyticsQuery.js` (fetch) |
| Admin APIs | `app/api/admin/{media,content,stats,analytics,messages}/route.js` |
| Admin UI shell | `app/admin/(dash)/{layout.js,AdminNav.js}`, `app/admin/admin.css` |
| Dashboard / Analytics / Messages screens | `app/admin/(dash)/_components/{Dashboard,AnalyticsView,MessagesView,TrafficChart,ui}.js` |
