import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText, Send, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { brand, certifications } from "@/data/site";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

const colors = ["var(--primary)", "var(--accent)", "var(--gold)", "var(--leaf)", "var(--muted-foreground)"];

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]!);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "\uFEFF" + [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}
function download(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) { toast.error("No data to export"); return; }
  const url = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a"); a.href = url; a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  toast.success(`${name} exported`);
}

export function AnalyticsPanel({ products, messages }: { products: Product[]; messages: Message[] }) {
  const [range, setRange] = useState<"all" | "30" | "90">("all");
  const list = useMemo(() => range === "all" ? messages : messages.filter((m) => Date.now() - new Date(m.created_at).getTime() < Number(range) * 864e5), [messages, range]);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); map.set(d.toLocaleString("en", { month: "short" }), 0); }
    list.forEach((m) => { const k = new Date(m.created_at).toLocaleString("en", { month: "short" }); if (map.has(k)) map.set(k, map.get(k)! + 1); });
    return [...map].map(([month, count]) => ({ month, count }));
  }, [list]);
  const countries = useMemo(() => { const c: Record<string, number> = {}; list.forEach((m) => { const k = m.country || "Unknown"; c[k] = (c[k] ?? 0) + 1; }); return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value })); }, [list]);
  const status = useMemo(() => { const c: Record<string, number> = {}; list.forEach((m) => { c[m.status] = (c[m.status] ?? 0) + 1; }); return Object.entries(c).map(([name, value]) => ({ name, value })); }, [list]);
  const cats = useMemo(() => { const c: Record<string, number> = {}; products.forEach((p) => { c[p.category] = (c[p.category] ?? 0) + 1; }); return Object.entries(c).map(([name, value]) => ({ name, value })); }, [products]);

  const reports = {
    enquiries: () => download("RFQ-Enquiries", list.map((m) => ({ Date: m.created_at.slice(0, 10), Name: m.name, Company: m.company, Email: m.email, Phone: m.phone, Country: m.country, Product: m.product, Source: m.source, Status: m.status, Message: m.message }))),
    stock: () => download("Product-Manifest", products.map((p) => ({ Product: p.name_en, Arabic: p.name_ar, Category: p.category, Packaging: p.packaging, Specs: Array.isArray(p.specs) ? p.specs.join(" | ") : "", Visible: p.visible ? "Yes" : "No" }))),
    compliance: () => download("Compliance-Log", certifications.map((c) => ({ Certificate: c.name, Status: "Active" }))),
  };

  const printPdf = () => {
    const w = window.open("", "_blank"); if (!w) return;
    const rows = list.map((m) => `<tr><td>${m.created_at.slice(0, 10)}</td><td>${m.name}</td><td>${m.company ?? ""}</td><td>${m.country ?? ""}</td><td>${m.product ?? ""}</td><td>${m.status}</td></tr>`).join("");
    w.document.write(`<html><head><title>Agrosun Export Report</title><style>body{font-family:sans-serif;padding:32px;color:#0F3E2E}table{width:100%;border-collapse:collapse;font-size:12px}td,th{border:1px solid #ddd;padding:6px;text-align:start}th{background:#0F3E2E;color:#fff}.b{display:inline-block;border:1px solid #c9a24a;padding:3px 8px;margin:2px;font-size:11px;border-radius:20px}</style></head><body><img src="${location.origin}${brand.logo}" style="height:60px"/><h1>Export Enquiries Report</h1><p>Generated ${new Date().toLocaleString()} — ${list.length} enquiries</p><div>${certifications.map((c) => `<span class="b">${c.name}</span>`).join("")}</div><br/><table><tr><th>Date</th><th>Name</th><th>Company</th><th>Country</th><th>Product</th><th>Status</th></tr>${rows}</table><script>onload=()=>print()</script></body></html>`);
    w.document.close();
  };

  const brief = () => {
    const subject = encodeURIComponent("Agrosun weekly export brief");
    const body = encodeURIComponent(`Enquiries: ${list.length}\nNew: ${list.filter((m) => m.status === "new").length}\nTop markets: ${countries.map((c) => `${c.name} (${c.value})`).join(", ") || "—"}\nProducts listed: ${products.length}`);
    toast.success("Weekly brief prepared — opening your email app");
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const kpis = [
    { label: "Enquiries", value: list.length },
    { label: "New", value: list.filter((m) => m.status === "new").length },
    { label: "Markets", value: countries.filter((c) => c.name !== "Unknown").length },
    { label: "Products", value: products.length },
  ];
  const card = "rounded-lg border border-border bg-card p-5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center gap-2">
      {(["all", "30", "90"] as const).map((r) => <Button key={r} size="sm" variant={range === r ? "default" : "outline"} onClick={() => setRange(r)}>{r === "all" ? "All time" : `Last ${r} days`}</Button>)}
      <Button size="sm" variant="outline" className="ms-auto" onClick={brief}><Send />Send weekly brief</Button>
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{kpis.map((k, i) => <div key={k.label} className={card} style={{ animationDelay: `${i * 80}ms` }}><TrendingUp className="h-5 w-5 text-leaf" /><div className="tabular mt-3 text-4xl font-bold text-accent">{k.value}</div><p className="text-sm text-muted-foreground">{k.label}</p></div>)}</div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className={card}><h3 className="mb-3 font-bold text-primary">Enquiries per month</h3><div className="h-60" dir="ltr"><ResponsiveContainer><BarChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      <div className={card}><h3 className="mb-3 font-bold text-primary">Top destination markets</h3><div className="h-60" dir="ltr">{countries.length ? <ResponsiveContainer><BarChart data={countries} layout="vertical"><XAxis type="number" allowDecimals={false} fontSize={12} /><YAxis type="category" dataKey="name" width={90} fontSize={12} /><Tooltip /><Bar dataKey="value" fill="var(--accent)" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer> : <p className="grid h-full place-items-center text-sm text-muted-foreground">No enquiries yet</p>}</div></div>
      <div className={card}><h3 className="mb-3 font-bold text-primary">Enquiry pipeline</h3><Donut data={status} /></div>
      <div className={card}><h3 className="mb-3 font-bold text-primary">Catalogue by line</h3><Donut data={cats} /></div>
    </div>
    <div className={card}><h3 className="font-bold text-primary">Export reports</h3><p className="text-sm text-muted-foreground">Download Excel-ready CSV files or a branded PDF.</p>
      <div className="mt-4 flex flex-wrap gap-2"><Button onClick={reports.enquiries}><Download />Enquiries (Excel)</Button><Button variant="outline" onClick={reports.stock}><Download />Product manifest</Button><Button variant="outline" onClick={reports.compliance}><Download />Compliance log</Button><Button variant="outline" onClick={printPdf}><FileText />PDF report</Button></div>
    </div>
  </div>;
}

function Donut({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <p className="grid h-60 place-items-center text-sm text-muted-foreground">No data yet</p>;
  return <div className="flex h-60 items-center gap-4" dir="ltr"><ResponsiveContainer width="60%"><PieChart><Pie data={data} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><ul className="space-y-1 text-sm">{data.map((d, i) => <li key={d.name} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors[i % colors.length] }} />{d.name} <b className="tabular">{d.value}</b></li>)}</ul></div>;
}
