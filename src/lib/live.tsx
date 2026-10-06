import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { products as fallbackProducts, type Product, type Category } from "@/data/site";

type T = Database["public"]["Tables"];
export type Settings = T["site_settings"]["Row"] & { slogan_en?: string; slogan_ar?: string; hq_address?: string; packhouse_address?: string; iqf_address?: string; stats?: unknown };
export type TeamMember = T["team_members"]["Row"] & { linkedin_url?: string; group_name?: string };
type DbProduct = T["products"]["Row"] & { in_season?: boolean };

type Live = { settings: Settings | null; team: TeamMember[]; products: Product[]; version: number; refresh: () => void };
const C = createContext<Live | null>(null);
const CACHE = "agrosun-live-v1";
const tables = ["site_settings", "products", "team_members", "facilities", "certifications", "partners", "site_banners"] as const;

/** Theme variables the admin can override (Appearance panel). */
export const themeKeys = ["primary", "accent", "background", "topbar-bg", "topbar-fg", "bottombar-bg", "bottombar-fg", "footer-bg"] as const;

function toProduct(r: DbProduct): Product {
  const base = fallbackProducts.find((p) => p.id === r.slug);
  const rawSpecs = r.specs as unknown;
  const specs = Array.isArray(rawSpecs)
    ? { en: rawSpecs.map(String).filter(Boolean), ar: rawSpecs.map(String).filter(Boolean) }
    : rawSpecs && typeof rawSpecs === "object"
      ? Object.fromEntries(Object.entries(rawSpecs).map(([key, value]) => [key, Array.isArray(value) ? value.map(String).filter(Boolean) : []]))
      : null;
  const seasonMonths = Array.isArray(r.season_months) ? r.season_months.map(Number).filter((month) => month >= 1 && month <= 12) : [];
  return {
    id: r.slug,
    category: (["fresh", "iqf", "processed"].includes(r.category) ? r.category : "fresh") as Category,
    featured: r.featured,
    image: r.image_url || base?.image || "",
    name: { en: r.name_en, ar: r.name_ar || r.name_en, it: r.name_it, fr: r.name_fr, de: r.name_de },
    text: { en: r.description_en || base?.text.en || "", ar: r.description_ar || base?.text.ar || r.description_en || "", it: r.description_it, fr: r.description_fr, de: r.description_de },
    ...(specs && Array.isArray(specs['en']) && specs['en'].length ? { specs: specs as NonNullable<Product["specs"]> } : base?.specs ? { specs: base.specs } : {}),
    ...(r.packaging ? { packaging: { en: r.packaging, ar: r.packaging, it: r.packaging_it, fr: r.packaging_fr, de: r.packaging_de } } : base?.packaging ? { packaging: base.packaging } : {}),
    inSeason: r.in_season,
    seasonMonths,
    views: Number((r as unknown as Record<string, unknown>)['views'] ?? 0),
    tons: Number((r as unknown as Record<string, unknown>)['tons'] ?? 0),
    gallery: (() => { const g = (r as unknown as Record<string, unknown>)['gallery']; return Array.isArray(g) ? g.map(String).filter(Boolean) : []; })(),
  };
}

/** One live data layer: cached in localStorage for instant paint, refreshed from Supabase and on every realtime change. */
export function LiveProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [rows, setRows] = useState<DbProduct[] | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => {
    void Promise.all([
      supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
      supabase.from("team_members").select("*").eq("visible", true).order("sort_order"),
      supabase.from("products").select("*").eq("visible", true).order("sort_order"),
    ]).then(([s, t, p]) => {
      if (s.data) setSettings(s.data as Settings);
      if (t.data) setTeam(t.data as TeamMember[]);
      if (p.data) setRows(p.data as DbProduct[]);
      try { localStorage.setItem(CACHE, JSON.stringify({ s: s.data, t: t.data, p: p.data })); } catch { /* storage full */ }
    });
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    try { const c = JSON.parse(localStorage.getItem(CACHE) ?? "null"); if (c) { if (c.s) setSettings(c.s); if (c.t) setTeam(c.t); if (c.p) setRows(c.p); } } catch { /* ignore */ }
    refresh();
    let ch = supabase.channel("site-live");
    for (const t of tables) ch = ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => refresh());
    ch.subscribe();
    // Admin tabs on the same browser broadcast saves instantly.
    const bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("agrosun-live") : null;
    if (bc) bc.onmessage = () => refresh();
    return () => { void supabase.removeChannel(ch); bc?.close(); };
  }, [refresh]);

  const products = useMemo(() => (rows && rows.length ? rows.map(toProduct) : fallbackProducts), [rows]);
  // Admin-controlled appearance: each theme key becomes a CSS variable on <html>.
  useEffect(() => {
    const theme = (settings as unknown as { theme?: Record<string, string> } | null)?.theme ?? {};
    const root = document.documentElement;
    for (const key of themeKeys) { const v = theme[key]; if (v) root.style.setProperty(`--${key}`, v); else root.style.removeProperty(`--${key}`); }
  }, [settings]);
  return <C.Provider value={{ settings, team, products, version, refresh }}>{children}</C.Provider>;
}

export function useLive() {
  const c = useContext(C);
  if (!c) throw new Error("useLive outside LiveProvider");
  return c;
}

/** Call after any admin save so other open tabs update immediately. */
export function notifyLive() {
  if (typeof BroadcastChannel === "undefined") return;
  const bc = new BroadcastChannel("agrosun-live"); bc.postMessage("changed"); bc.close();
}
