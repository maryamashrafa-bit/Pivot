# Pivot — your thinking partner

Pivot is a calm, conversational decision-coaching app. It walks someone through
a hard choice one question at a time, has them score two options separately
("blind" scoring, to keep answers honest), and reflects back what the scores
reveal.

Anyone can start and finish a decision without an account — sign-up is only
offered at the results screen, as a way to save that decision and come back
to it later, not a gate to get in. If someone signs up (or logs in) right
after finishing as a guest, that decision is saved automatically rather than
lost.

Stack: **Next.js (App Router)** + **Supabase** (Postgres + auth) + a
server-side proxy to the **Anthropic API** for generating personalised
decision factors.

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `decisions` table with row-level security, so each user
   can only see and manage their own saved decisions.
3. In **Project Settings → API**, copy the **Project URL** and **anon public**
   key.
4. In **Authentication → Providers**, email/password sign-up is enabled by
   default. If you'd rather skip email confirmation while testing, turn off
   "Confirm email" under **Authentication → Sign In / Providers → Email**.
5. **Required for email confirmation links to work**: in
   **Authentication → URL Configuration**, add your deployed URL to
   **Redirect URLs** — e.g. `https://pivot-khaki.vercel.app/**`. Supabase
   only allows redirecting confirmation links to URLs on this allow-list; if
   your live URL isn't listed, it silently falls back to the default
   `Site URL` (usually `http://localhost:3000`), which is why confirming an
   account from the live site can land on a blank/unreachable page. Add
   `http://localhost:3000/**` too if you also test locally.
6. **Required for account deletion to work**: `supabase/schema.sql` now also
   defines a `delete_own_account()` function. If you already ran an earlier
   version of this file, re-run it (or just the new function block at the
   bottom) in the SQL editor — the "Delete my account and all data" button
   in account settings depends on it existing. It's a `SECURITY DEFINER`
   function scoped to `auth.uid()`, which is how a signed-in user can delete
   their own `auth.users` row using only the anon key (no service-role key
   is used anywhere in this app).

## 2. Get an Anthropic API key

Create a key at [console.anthropic.com](https://console.anthropic.com). This
key is read server-side only (`ANTHROPIC_API_KEY`) inside
`src/app/api/suggestions/route.ts` — it is never sent to the browser. If the
key is missing, Pivot silently falls back to a generic set of decision
factors instead of failing.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the three values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
```

## 4. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start a decision right
away — no account needed. Sign up from the results screen if you want to
save it.

## 5. Deploy to Vercel (to get a real URL)

1. Push this repository to GitHub (already done if you're reading this from
   the repo).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no build config changes needed.
4. Add the same three environment variables from step 3 under
   **Project Settings → Environment Variables**.
5. Deploy. Vercel gives you a `*.vercel.app` URL immediately; you can attach a
   custom domain afterwards under **Project Settings → Domains**.

## Project structure

```
src/
  app/
    page.tsx                landing page
    login/, signup/         auth pages (email + password via Supabase)
    dashboard/               list of saved decisions
    decision/new/            the conversational decision flow
    decision/[id]/           read-only view of a saved decision
    api/suggestions/         server-side Anthropic proxy
    auth/confirm/            handles email confirmation links, redirects into the app
    actions/                 server actions (auth, save/delete decisions)
  components/decision/       the step-by-step conversation UI
  lib/supabase/              browser + server Supabase clients, session refresh
  lib/scoring.ts             weighted-score + insight calculation
  lib/pending-decision.ts    stashes a guest's finished decision in
                              localStorage so signing up afterward saves it
proxy.ts                     session refresh + route protection — only
                              /dashboard and /decision/[id] require a
                              signed-in user; /decision/new is public
                              (Next.js 16 renamed "middleware" to "proxy")
supabase/schema.sql          decisions table + row-level security policies
```

## Notes on Next.js 16

This project was scaffolded with Next.js 16, which renamed `middleware.ts` to
`proxy.ts` (same purpose — it refreshes the Supabase session cookie and
protects `/dashboard` and `/decision` routes). If you're used to older
Next.js docs, that's the one naming change worth knowing about.
