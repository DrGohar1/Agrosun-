import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
export type Cert = T["certifications"]["Row"];
export type Partner = T["partners"]["Row"];
export type Banner = T["site_banners"]["Row"];

/** Reads visible rows of a content table; null until loaded so pages can show the built-in fallback. */
export function useRows<K extends "certifications" | "partners">(table: K) {
  const [rows, setRows] = useState<T[K]["Row"][] | null>(null);
  useEffect(() => { void (supabase.from(table) as any).select("*").eq("visible", true).order("sort_order").then(({ data }: { data: unknown }) => setRows(((data ?? []) as unknown) as T[K]["Row"][])); }, [table]);
  return rows;
}

export function useBanner(page: string) {
  const [b, setB] = useState<Banner | null>(null);
  useEffect(() => { void supabase.from("site_banners").select("*").eq("page", page).eq("visible", true).limit(1).maybeSingle().then(({ data }) => setB(data)); }, [page]);
  return b;
}
