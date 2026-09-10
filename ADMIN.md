# Oskelo Admin Area

A private, logged-in section at **`/admin`** for uploading images and editing
site content (Work galleries, Services, Offers) without touching code or waiting
for a deploy.

- **Login:** `/admin/login` — a real Supabase Auth account (email + password).
- **Who can get in:** only the email in `ADMIN_EMAIL` (default
  `oskelo.co@gmail.com`). Any other Supabase auth user is rejected.
- **How edits go live:** saving writes to the Supabase `site_content` table; the
  public pages re-read it at most once a minute (`export const revalidate = 60`),
  so no redeploy is needed.

---

## One-time setup in the Supabase dashboard

1. **Create the admin user**
   Authentication → Users → **Add user** → enter your email + a password
   ("Auto Confirm User" on). Use the same email you put in `ADMIN_EMAIL`.

2. **Lock down sign-ups** (so the login page can't be used to self-register)
   Authentication → Sign In / Providers → Email → turn **off**
   "Allow new users to sign up". Save.

3. **Create the image bucket**
   Storage → **New bucket** → name it `media`, tick **Public bucket**, create.

4. **Create the content table**
   SQL Editor → run:

   ```sql
   create table if not exists site_content (
     key text primary key,
     value jsonb not null,
     updated_at timestamptz not null default now()
   );
   alter table site_content enable row level security;
   create policy "public read" on site_content for select using (true);
   ```

   (Writes only ever happen through the admin API using the service-role key,
   which bypasses RLS, so no write policy is needed.)

5. **Environment variables** — add to `.env.local` (local) **and** the Vercel
   project (Settings → Environment Variables), then redeploy:

   | Variable | Where to find it |
   | --- | --- |
   | `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` secret. **Server-only — never `NEXT_PUBLIC`.** |
   | `ADMIN_EMAIL` | The email from step 1 (optional; defaults to `oskelo.co@gmail.com`). |

   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already set
   and are reused.

---

## Using it

- **Images** (`/admin/images`) — drag in or pick image files (JPG/PNG/WebP/GIF/
  AVIF, ≤25 MB). Each uploaded image has **Copy URL** and **Delete**. Deleting an
  image that a page still references will show a broken image there.

- **Content** (`/admin/content`) — pick a section (Work / Services / Offers).
  - **Form** tab: structured fields. Image fields (`src`, `image`, `cover`, …)
    have a **Pick** button that opens your uploaded images. Arrays have
    add / remove / move up / move down.
  - **Raw JSON** tab: the whole section as JSON. Save is blocked while the JSON
    is invalid.
  - **Save changes** stores your version. **Reset to built-in default** deletes
    your version so the site falls back to the values hardcoded in
    `lib/work.js` / `lib/services.js` / `lib/offers.js`.

## Known limits (v1)

- The header/footer **navigation** is still defined in code (`app/components/
  Header.js` / `Footer.js`), not editable here.
- Adding a brand-new category or service **slug** still needs a deploy before its
  own detail page pre-builds. Editing existing entries updates live.
- No edit history / undo — use **Reset to built-in default** to get back to the
  code values, or re-edit.
- Extra admin users / password resets are done in the Supabase dashboard.

## How it fits together (for developers)

| Piece | File |
| --- | --- |
| Session refresh + optimistic redirect | `proxy.js` (Next 16 "Proxy", formerly Middleware) |
| Auth gate (authoritative) | `app/admin/(dash)/layout.js` via `lib/adminAuth.js` |
| Supabase clients | `lib/supabase/{browser,server,admin}.js` |
| Public pages read overrides | `lib/siteContent.js` → `getContent(key, fallback)` |
| Admin APIs | `app/api/admin/media/route.js`, `app/api/admin/content/route.js` |
