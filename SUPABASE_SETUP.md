# Supabase Setup

## Prerequisites

- Supabase account (free tier is fine): https://supabase.com
- Git repo on GitHub (needed for Google OAuth redirect)
- Optional: [Supabase CLI](https://supabase.com/docs/guides/cli) for running migrations locally

---

## 1. Create the project

1. Go to https://app.supabase.com → **New project**
2. Choose a name (e.g. `nihongo-quiz`) and a strong database password
3. Select the region closest to you
4. Wait for provisioning (~2 min)

---

## 2. Configure the site

1. Copy `config.example.js` → `config.js`
2. Fill in your credentials from **Dashboard → Project Settings → API**:
   - **Project URL** → `SUPABASE_CONFIG.url`
   - **anon / public** key → `SUPABASE_CONFIG.anonKey`
3. `config.js` is already in `.gitignore` — never commit it

---

## 3. Run the migrations

### Option A — SQL Editor (no CLI needed)

Open each file in `supabase/migrations/` in order and paste it into
**Dashboard → SQL Editor → New query → Run**:

```
20260611000001_profiles.sql
20260611000002_progress.sql
20260611000003_sessions.sql
20260611000004_answers.sql
20260611000005_question_stats.sql
20260611000006_question_versions.sql
```

### Option B — Supabase CLI

```bash
# Install CLI
brew install supabase/tap/supabase   # macOS
# or: https://supabase.com/docs/guides/cli/getting-started

# Link to your remote project
supabase login
supabase link --project-ref your-project-id

# Push all migrations
supabase db push
```

---

## 4. Enable Google Auth

1. **Dashboard → Authentication → Providers → Google** → toggle on
2. Create a Google OAuth client at https://console.cloud.google.com:
   - APIs & Services → Credentials → Create OAuth 2.0 Client ID
   - Application type: **Web application**
   - Authorised redirect URIs: `https://your-project-id.supabase.co/auth/v1/callback`
3. Copy **Client ID** and **Client secret** back into the Supabase Google provider form
4. Save

---

## 5. Set the site URL

**Dashboard → Authentication → URL Configuration**:

- **Site URL**: your GitHub Pages URL, e.g. `https://yourusername.github.io/nihongo`
- **Redirect URLs**: same URL (Supabase will redirect back here after Google login)

For local development add `http://localhost:8000` to **Additional Redirect URLs**.

---

## 6. Set up GitHub Actions secrets (keep-alive)

The workflow at `.github/workflows/keep-alive.yml` pings Supabase every 3 days
to prevent free-tier projects from pausing.

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add two repository secrets:

| Secret name        | Value                                       |
|--------------------|---------------------------------------------|
| `SUPABASE_URL`     | `https://your-project-id.supabase.co`       |
| `SUPABASE_ANON_KEY`| your anon/public key (safe to expose; RLS enforces security) |

---

## 7. Test the setup

```bash
# Start a local server
python3 -m http.server 8000
# Open: http://localhost:8000
```

1. Open quiz.html → click **Iniciar sesión con Google** in the sidebar
2. Complete the OAuth flow — you should see your name in the sidebar
3. Answer a few questions and finish the quiz
4. Check **Dashboard → Table Editor → answers** — your rows should appear
5. Check **progress**, **sessions**, and **question_versions** tables

---

## 8. Local development with two projects

Recommended: one project for production, one for development/testing.

```bash
# Create a second Supabase project for dev (e.g. "nihongo-dev")
# Then use two config files:

cp config.js config.prod.js   # save production credentials
# Edit config.js with dev project credentials for local work
```

When switching between envs, swap `config.js` content.
The `.gitignore` already excludes `config.js` and `config.prod.js`.

---

## Troubleshooting

**"No credentials configured" in console** — check that `config.js` exists and is
loaded before `supabase-client.js` in the HTML.

**CORS errors** — make sure your site URL is listed in the Supabase redirect URLs.

**CSP errors** — quiz.html and index.html allow `https://esm.sh` (script-src) and
`https://*.supabase.co` (connect-src). Other pages run in offline mode (no errors shown).

**Sessions left open** — `ended_at` may be null if the user closed the tab mid-quiz.
This is expected; session duration can be inferred from the last `answered_at` timestamp.
