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

function toProduct(r: DbProduct): Product {
  const base = fallbackProducts.find((p) => p.id === r.slug);
  const specs = Array.isArray(r.specs) ? (r.specs as unknown[]).map(String).filter(Boolean) : [];
  return {
    id: r.slug,
    category: (["fresh", "iqf", "processed"].includes(r.category) ? r.category : "fresh") as Category,
    featured: r.featured,
    image: r.image_url || base?.image || "",
    name: { en: r.name_en, ar: r.name_ar || r.name_en },
    text: { en: r.description_en || base?.text.en || "", ar: r.description_ar || base?.text.ar || r.description_en || "" },
    ...(specs.length ? { specs: { en: specs, ar: specs } } : base?.specs ? { specs: base.specs } : {}),
    ...(r.packaging ? { packaging: { en: r.packaging, ar: r.packaging } } : base?.packaging ? { packaging: base.packaging } : {}),
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
