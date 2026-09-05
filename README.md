# Oskelo Website

A Next.js site for Oskelo with a working contact form that saves
submissions to Supabase.

## 1. Install dependencies

```powershell
npm install
```

## 2. Set up Supabase

1. Go to your Supabase project → **SQL Editor** → New query, and run:

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

alter table messages enable row level security;

create policy "Allow public inserts"
on messages
for insert
to anon
with check (true);
```

This creates the table the contact form writes to, turns on row-level
security, and allows anonymous (public website) inserts only — nobody
can read the messages except you, from the Supabase dashboard.

2. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public key**.

## 3. Add your environment variables

Copy the example file:

```powershell
copy .env.local.example .env.local
```

Open `.env.local` and paste in your real Supabase URL and anon key.
This file is already in `.gitignore` — it will never be committed.

## 4. Run it locally

```powershell
npm run dev
```

Open `http://localhost:3000`. Submit the contact form, then check
**Table Editor → messages** in Supabase to confirm it saved.

## 5. Push to GitHub

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourname/oskelo-website.git
git push -u origin main
```

## 6. Deploy to Vercel

1. Go to vercel.com/new and import this GitHub repo.
2. Before deploying, add the same two environment variables from
   step 3 under **Environment Variables**.
3. Click **Deploy**.

## 7. Point your domain at it

In Vercel: **Settings → Domains** → add your domain, then add the
DNS records it gives you inside Cloudflare (set them to "DNS only",
not proxied, so SSL issues correctly).

## Editing the site

- Page content and layout: `app/page.js`
- Styling: `app/globals.css`
- Contact form backend: `app/api/contact/route.js`

You can hand this whole folder to Claude Code and describe changes
in plain English — e.g. "add a testimonials section between Work and
Services."
