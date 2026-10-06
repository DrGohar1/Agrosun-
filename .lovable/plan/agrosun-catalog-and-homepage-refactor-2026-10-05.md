# Agrosun catalog and homepage refactor

## Outcome
Streamline the existing application without replacing its working Supabase, language, authentication, or utility layers. The public catalog will use the requested two-tier product structure, while the homepage becomes cleaner, more immersive, and focused on buyer trust.

## Implementation
1. **Rebuild the catalog hierarchy**
   - Remove the “All” option and default to **Fresh Produce**.
   - Present **Processed Agro-Foods** as the second main category, with only **IQF Frozen** and **Pickled & Brined** beneath it.
   - Keep existing CMS category values (`fresh`, `iqf`, `processed`) and map them to this hierarchy, avoiding a risky database migration.

2. **Strengthen CMS-driven product cards**
   - Add dependable image fallbacks and consistent export-grade card layouts.
   - Surface localized description, packaging, export specification cues, season status, and harvest months from Supabase.
   - Preserve EN/AR/IT/FR/DE fallback behavior and the existing inquiry flow.
   - Extend the product editor so packaging, specifications, and harvest months remain editable.

3. **Consolidate the homepage**
   - Remove the Leadership / Board section from the homepage only; retain its admin data and management area.
   - Replace separate certification and partner clutter with one elegant horizontal trust band above the footer, populated from the CMS with sensible fallbacks.
   - Remove the floating mobile bottom navigation and strengthen footer navigation/contact anchors.

4. **Modernize motion and hero treatment**
   - Refine the hero with an emerald-to-burgundy semantic overlay while keeping image/video, multilingual headline, and supporting copy under live admin control.
   - Add lightweight perspective and scroll-entry depth between sections, with reduced-motion support and no heavy animation dependency.

5. **Validate the complete flow**
   - Check category switching, product details, image fallback, multilingual content, CMS-backed facilities/settings, and responsive layouts.
   - Confirm the latest build and runtime diagnostics are clean.

## Technical notes
- No schema rewrite: `fresh` maps to Fresh Produce, `iqf` to IQF Frozen, and `processed` to Pickled & Brined under Processed Agro-Foods.
- Reuse the existing Supabase live provider, CMS hooks, translation provider, dialog, buttons, and media controls.
- Visual changes remain token-based in the global design system and use logical spacing for Arabic RTL.