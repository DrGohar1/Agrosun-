import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MediaUpload } from "./MediaUpload";

type Table = "certifications" | "partners" | "site_banners";
type F = { key: string; label: string; type?: "text" | "long" | "media" | "number" };
type Row = Record<string, unknown> & { id: string; visible: boolean };

const config: Record<Table, { title: string; fields: F[]; blank: () => Record<string, unknown> }> = {
  certifications: { title: "Certificates", fields: [{ key: "name", label: "Name" }, { key: "logo_url", label: "Logo / certificate image", type: "media" }, { key: "description_en", label: "Description (EN)", type: "long" }, { key: "description_ar", label: "Description (AR)", type: "long" }, { key: "sort_order", label: "Order", type: "number" }], blank: () => ({ name: "New certificate" }) },
  partners: { title: "Partners", fields: [{ key: "name", label: "Name" }, { key: "logo_url", label: "Logo", type: "media" }, { key: "country", label: "Country" }, { key: "kind", label: "Type (partner / client / brand)" }, { key: "sort_order", label: "Order", type: "number" }], blank: () => ({ name: "New partner" }) },
  site_banners: { title: "Page banners", fields: [{ key: "page", label: "Page (home, about, products, certifications, partners, export, contact)" }, { key: "image_url", label: "Banner image", type: "media" }, { key: "title_en", label: "Title (EN)" }, { key: "title_ar", label: "Title (AR)" }, { key: "subtitle_en", label: "Small heading (EN)" }, { key: "subtitle_ar", label: "Small heading (AR)" }], blank: () => ({ page: "about" }) },
};

export function ContentPanel() {
  const [tab, setTab] = useState<Table>("certifications");
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => { const { data } = await supabase.from(tab).select("*").order(tab === "site_banners" ? "page" : "sort_order"); setRows((data ?? []) as unknown as Row[]); };
  useEffect(() => { void load(); }, [tab]);
  const set = (id: string, k: string, v: unknown) => setRows((r) => r.map((x) => x.id === id ? { ...x, [k]: v } : x));
  const save = async (r: Row) => { const { created_at, updated_at, ...p } = r; const { error } = await supabase.from(tab).upsert(p as never); if (error) toast.error(error.message); else toast.success("Saved"); };
  const add = async () => { const { error } = await supabase.from(tab).insert(config[tab].blank() as never); if (error) toast.error(error.message); else await load(); };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from(tab).delete().eq("id", id); await load(); };
  const c = config[tab];
  return <div>
    <div className="mb-5 flex flex-wrap gap-2">{(Object.keys(config) as Table[]).map((t) => <Button key={t} variant={t === tab ? "default" : "outline"} onClick={() => setTab(t)}>{config[t].title}</Button>)}<Button className="ms-auto" onClick={add}><Plus />Add</Button></div>
    <div className="grid gap-4 xl:grid-cols-2">{rows.map((r) => <div key={r.id} className="space-y-3 rounded-lg border border-border bg-card p-4 animate-in fade-in">
      {c.fields.map((f) => <label key={f.key} className="block"><span className="mb-1 block text-xs font-bold text-muted-foreground">{f.label}</span>
        {f.type === "media" ? <MediaUpload value={String(r[f.key] ?? "")} onChange={(v) => set(r.id, f.key, v)} /> : f.type === "long" ? <Textarea value={String(r[f.key] ?? "")} onChange={(e) => set(r.id, f.key, e.target.value)} /> : <Input type={f.type === "number" ? "number" : "text"} value={String(r[f.key] ?? "")} onChange={(e) => set(r.id, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} />}
      </label>)}
      <div className="flex items-center gap-3"><Switch checked={r.visible} onCheckedChange={(v) => set(r.id, "visible", v)} /><span className="text-sm">Visible</span><Button size="sm" variant="ghost" className="ms-auto" onClick={() => del(r.id)}><Trash2 /></Button><Button size="sm" onClick={() => save(r)}>Save</Button></div>
    </div>)}</div>
  </div>;
}
