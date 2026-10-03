# Agrosun Portal — Documentation (v1.0.0)

## 1. Overview
The portal has two parts:
- **Public website** — pages: Home, About, Products, Export, Certifications, Partners, Contact.
- **Admin dashboard** at `/admin` — manages all content stored in Supabase.

All content is read from Supabase. If the database is unreachable, the site falls back to the bundled content in `src/data/site.ts`, so it never shows an empty page.

## 2. Admin guide

### Signing in
Open `/admin` and enter your **username or email** and password. A plain username (e.g. `Gohar`) is mapped to `gohar@agrosun.admin`. Change the default password from Supabase → Authentication → Users before handing over.

### Roles
| Role | Can do |
|---|---|
| admin | Everything, including users and settings |
| editor | Edit products, content, team, enquiries |
| viewer | Read-only dashboard |

### Products
Products → **Add product**: name (EN/AR), category, description, specs (one per line), packaging, photo upload, featured, visible, sort order. Hidden products disappear from the site instantly.

### Content
- **Certifications** — name, description, logo/certificate image.
- **Partners** — name, logo, link.
- **Facilities** — name, address, highlights, cover photo and gallery (shown when a visitor clicks the facility card).
- **Banners** — the header image of each page.

### Team
Name, title, phone, email, LinkedIn, photo, group (Board / Directors / QA), visibility and order.

### Enquiries
All product enquiries and contact-form messages, with status (new / in progress / closed).

### Analytics
Filter by date, view monthly and market charts, export CSV, print a PDF summary.

### Settings
Logo, hero headline and background video, company email/phone/WhatsApp, addresses, social links, Google Maps link, developer credit.

## 3. Data & security
- Supabase project tables: `products`, `certifications`, `partners`, `facilities`, `site_banners`, `site_settings`, `team_members`, `contact_messages`, `profiles`, `user_roles`.
- RLS enabled everywhere; role checks via `has_role()` security-definer function.
- Media is stored in the `site-media` storage bucket (admin-only uploads, signed links) and company photos in `public/images/`.
- The service-role key is only used server-side for user management.

## 4. Environment
See the table in `README.md`. Locally put values in `.env`; on Vercel add them in **Project → Settings → Environment Variables** and redeploy.

## 5. Operations
| Task | How |
|---|---|
| Update content | `/admin` — live, no deploy |
| Update code | push to `main` → Vercel redeploys |
| Backup data | Supabase → Database → Backups, or export tables as CSV |
| Add admin | Admin → Users → invite, or insert into `user_roles` |
| Domain | Vercel → Settings → Domains, point DNS records as shown |

## 6. Troubleshooting
| Symptom | Fix |
|---|---|
| Site shows old content | Check Supabase env variables on Vercel, redeploy |
| Images missing | Ensure `public/images/` is committed; re-upload in admin |
| Cannot sign in | Confirm user exists and is confirmed in Supabase Auth, and has a role row |
| Enquiry form fails | Check `contact_messages` insert policy for `anon` |

## 7. Changelog
- **v1.0.0** — Production release: live CMS with Realtime sync, RBAC, multi-language (EN/AR/IT/DE/FR), team showcase, facilities galleries, analytics, export page, client address & certification updates (ISO 45001, SMETA).
