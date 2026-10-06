# Agents

- `src/data/site.ts` is the public site's five-language fallback; editable products, team, banners, settings, and enquiries are persisted in Supabase and managed through the authenticated admin area.
- UI language comes from `useLang()` in `src/lib/lang.tsx` (EN default, AR sets RTL) — one place for language state.
- Shared layout (loader, top bar, bottom nav, footer) is mounted once in `src/routes/__root.tsx`; each section is its own route — keeps pages independent.
- Use logical CSS props (`ms-`, `me-`, `start-`, `end-`) instead of left/right — required for Arabic RTL.
- Contact form writes to Supabase `contact_messages` (anon insert only); content tables (products, certifications, partners, site_banners) exist for the upcoming admin panel, admin access via `user_roles` + `has_role`.
- Every editable public content record uses EN/AR/IT/FR/DE fields, with the phrase dictionary falling back from untranslated database values to English.
- Enquiries are managed as a customer-service pipeline and exported client-side as branded Excel workbooks.
- Keep the database product categories `fresh`, `iqf`, and `processed`; the public catalog maps them to Fresh Produce and Processed Agro-Foods (IQF Frozen / Pickled & Brined) to preserve CMS compatibility.
