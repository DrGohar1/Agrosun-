import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useLive } from "./live";

type T = Database["public"]["Tables"];
export type Cert = T["certifications"]["Row"];
export type Partner = T["partners"]["Row"];
export type Banner = T["site_banners"]["Row"];

/** Reads visible rows of a content table; null until loaded. Re-reads whenever content changes live. */
export function useRows<K extends "certifications" | "partners" | "facilities">(table: K) {
  const { version } = useLive();
  const [rows, setRows] = useState<T[K]["Row"][] | null>(null);
  useEffect(() => { void (supabase.from(table) as any).select("*").eq("visible", true).order("sort_order").then(({ data }: { data: unknown }) => setRows(((data ?? []) as unknown) as T[K]["Row"][])); }, [table, version]);
  return rows;
}

export function useBanner(page: string) {
  const { version } = useLive();
  const [b, setB] = useState<Banner | null>(null);
  useEffect(() => { void supabase.from("site_banners").select("*").eq("page", page).eq("visible", true).limit(1).maybeSingle().then(({ data }) => setB(data)); }, [page, version]);
  return b;
}
