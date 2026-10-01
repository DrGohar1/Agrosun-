# Agrosun Group — B2B Export Portal

Bilingual (English / Arabic, full RTL) corporate website and content management dashboard for **Agrosun Group**, an Egyptian exporter of fresh, IQF frozen and processed fruit & vegetables since 1995.

![stack](https://img.shields.io/badge/React-19-149eca) ![stack](https://img.shields.io/badge/TanStack_Start-v1-ff4154) ![stack](https://img.shields.io/badge/Supabase-Postgres_+_Auth-3ecf8e) ![stack](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![stack](https://img.shields.io/badge/TypeScript-strict-3178c6)

---

## Features

**Public website**
- Animated brand loader, hero with image or video background, bottom mobile navigation
- Product gallery (Fresh / IQF / Processed) with lightbox and per-product enquiry form
- About, Certifications, Partners & Markets, Contact pages
- EN / AR language switch with right-to-left layout
- Social media and Google Maps shortcuts in the top bar
- SEO metadata per page

**Admin dashboard (`/admin`)**
- Secure email/password sign-in; the first account created becomes the administrator
- Products: add, edit, hide, feature, reorder, change photos
- Manual English & Arabic product descriptions
- Enquiries inbox with status pipeline (new → contacted → qualified → closed)
- Team / management cards (name, title, photo, phone, WhatsApp)
- Site settings: company identity, logo, hero banner (image or video), contact channels, social links, developer credit

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 + TanStack Start v1 (SSR, server functions) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4, shadcn/ui, design tokens in `src/styles.css` |
| Database & Auth | Supabase (Postgres, Row-Level Security, Auth) |
| Validation | Zod |

---

## Project structure

```text
src/
  routes/            one file per page (index, about, products, certifications, partners, contact, admin)
  components/site/   shared layout: loader, header, bottom nav, footer, product enquiry dialog
  components/ui/     shadcn/ui primitives
  data/site.ts       bilingual fallback content
  lib/lang.tsx       language + RTL state
  lib/*.functions.ts server functions (admin bootstrap)
  integrations/supabase/  database clients, auth middleware, generated types
supabase/migrations/ database schema & security policies
```

---

## Database

| Table | Purpose | Access |
| --- | --- | --- |
| `products` | catalogue | public reads visible rows, admin writes |
| `contact_messages` | enquiries from contact & product forms | anyone can submit, admin reads |
| `team_members` | management cards | public reads visible, admin writes |
| `site_settings` | company, hero, social, developer credit | public reads, admin writes |
| `certifications`, `partners`, `site_banners` | content | public reads visible, admin writes |
| `profiles` | user profile | owner / admin |
| `user_roles` | roles (`admin`, `editor`) | read own; granted server-side only |

Roles are stored in a dedicated table and checked through the `has_role()` security-definer function.

---

## Environment variables

Create a `.env` file in the project root (never commit it):

```bash
# Browser-safe
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon / publishable key>
VITE_SUPABASE_PROJECT_ID=<project-ref>

# Server-only
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<anon / publishable key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # never expose to the browser
```

---

## Local development

```bash
bun install        # or npm install
bun run dev        # http://localhost:8080
bun run build      # production build
```

## Supabase setup (own project)

1. Create a project at supabase.com → copy URL, anon key and service role key into `.env`.
2. Install the CLI and apply the schema:
   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```
3. Authentication → Providers → enable Email.
4. Open `/admin`, create your account — the first account is promoted to admin automatically.

## GitHub

```bash
git init && git add . && git commit -m "Agrosun portal"
git branch -M main
git remote add origin https://github.com/<user>/agrosun-portal.git
git push -u origin main
```

## Deploy to Vercel

1. vercel.com → **Add New Project** → import the GitHub repository.
2. Framework preset: **Other** · Build command `bun run build` (or `npm run build`).
3. Add every variable from the *Environment variables* section under **Settings → Environment Variables**.
4. Deploy, then add your domain under **Settings → Domains**.

---

## Security notes
- Row-Level Security is enabled on every table.
- The service role key is used only inside server functions.
- Admin status is verified server-side; never trust client storage.

## License
Proprietary — © Agrosun Group. All rights reserved.
