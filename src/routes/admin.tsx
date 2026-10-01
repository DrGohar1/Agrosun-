import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Building2, Eye, Home, Inbox, LogOut, Menu, Plus, Save, Settings, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ensureInitialAdmin } from "@/lib/admin.functions";
import { brand } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Message = Database["public"]["Tables"]["contact_messages"]["Row"];
type Team = Database["public"]["Tables"]["team_members"]["Row"];
type SettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
type Panel = "overview" | "products" | "messages" | "team" | "settings";

const pageTitle = "Agrosun Control Room";
const pageDescription = "Secure Agrosun website administration for products, enquiries, team and company settings.";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: pageTitle }, { name: "description", content: pageDescription }, { property: "og:title", content: pageTitle }, { property: "og:description", content: pageDescription }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [signup, setSignup] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => { setSignedIn(Boolean(data.user)); setSessionReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session?.user)));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!signedIn) { setAdmin(false); return; }
    void (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      let role = await supabase.from("user_roles").select("role").eq("user_id", user.user.id).eq("role", "admin").maybeSingle();
      if (!role.data) {
        try { await ensureInitialAdmin(); } catch { /* An admin already exists. */ }
        role = await supabase.from("user_roles").select("role").eq("user_id", user.user.id).eq("role", "admin").maybeSingle();
      }
      setAdmin(Boolean(role.data));
    })();
  }, [signedIn]);

  const authenticate = async (e: FormEvent) => {
    e.preventDefault(); setAuthBusy(true);
    const raw = email.trim();
    // Plain usernames (e.g. "Gohar") map to an internal login address.
    const login = raw.includes("@") ? raw : `${raw.toLowerCase()}@agrosun.admin`;
    const result = signup
      ? await supabase.auth.signUp({ email: login, password, options: { emailRedirectTo: `${window.location.origin}/admin` } })
      : await supabase.auth.signInWithPassword({ email: login, password });
    setAuthBusy(false);
    if (result.error) { toast.error(result.error.message); return; }
    if (signup && !result.data.session) toast.success("Check your email to confirm your account.");
  };

  if (!sessionReady) return <AdminSplash label="Checking secure access…" />;
  if (!signedIn) return <AdminAuth email={email} password={password} signup={signup} busy={authBusy} setEmail={setEmail} setPassword={setPassword} setSignup={setSignup} onSubmit={authenticate} />;
  if (!admin) return <AdminSplash label="This account does not have administrator access." action={<Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>} />;
  return <Dashboard />;
}

function AdminSplash({ label, action }: { label: string; action?: ReactNode }) {
  return <div className="admin-only grid min-h-svh place-items-center bg-secondary px-5"><div className="text-center"><img src={brand.logo} alt="Agro Sun" className="mx-auto h-24 w-auto" /><p className="mt-6 text-muted-foreground">{label}</p><div className="mt-4">{action}</div></div></div>;
}

function AdminAuth({ email, password, signup, busy, setEmail, setPassword, setSignup, onSubmit }: { email: string; password: string; signup: boolean; busy: boolean; setEmail: (v: string) => void; setPassword: (v: string) => void; setSignup: (v: boolean) => void; onSubmit: (e: FormEvent) => void }) {
  return <div className="admin-only grid min-h-svh bg-secondary lg:grid-cols-[1.1fr_1fr]">
    <div className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 bg-hero" /><img src={brand.logo} alt="Agro Sun" className="relative h-24 w-fit rounded-md bg-background p-3" /><div className="relative"><p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Agrosun Control Room</p><h1 className="mt-4 max-w-xl font-display text-5xl">Your website, products and export enquiries in one place.</h1></div></div>
    <div className="flex items-center justify-center p-6"><form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-border bg-card p-7 shadow-lift"><img src={brand.logo} alt="Agro Sun" className="h-20 w-auto lg:hidden" /><h2 className="mt-5 font-display text-3xl text-primary">{signup ? "Create owner account" : "Admin sign in"}</h2><p className="mt-2 text-sm text-muted-foreground">Use your private company account. The first confirmed account becomes the site owner.</p><div className="mt-7 space-y-4"><Input required type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><Input required minLength={8} type="password" autoComplete={signup ? "new-password" : "current-password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><Button disabled={busy} className="w-full">{busy ? "Please wait…" : signup ? "Create owner account" : "Sign in"}</Button></div><button type="button" onClick={() => setSignup(!signup)} className="mt-5 w-full text-center text-sm font-semibold text-primary hover:text-accent">{signup ? "Already have an account? Sign in" : "First time? Create owner account"}</button><Link to="/" className="mt-5 block text-center text-xs text-muted-foreground hover:text-primary">Return to website</Link></form></div>
  </div>;
}

const nav: { id: Panel; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "Overview", icon: Home }, { id: "products", label: "Products", icon: Boxes }, { id: "messages", label: "Enquiries", icon: Inbox }, { id: "team", label: "Team", icon: Users }, { id: "settings", label: "Site settings", icon: Settings },
];

function Dashboard() {
  const [panel, setPanel] = useState<Panel>("overview");
  const [mobile, setMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [team, setTeam] = useState<Team[]>([]);
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const load = async () => {
    const [p, m, t, s] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"), supabase.from("contact_messages").select("*").order("created_at", { ascending: false }), supabase.from("team_members").select("*").order("sort_order"), supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
    ]);
    if (p.data) setProducts(p.data); if (m.data) setMessages(m.data); if (t.data) setTeam(t.data); if (s.data) setSettings(s.data);
  };
  useEffect(() => { void load(); }, []);
  const stats = useMemo(() => ({ products: products.length, visible: products.filter((p) => p.visible).length, newMessages: messages.filter((m) => m.status === "new").length, team: team.filter((t) => t.visible).length }), [products, messages, team]);
  return <div className="admin-only min-h-svh bg-secondary">
    <aside className={`fixed inset-y-0 start-0 z-50 w-64 border-e border-sidebar-border bg-primary-deep text-primary-foreground transition-transform lg:translate-x-0 ${mobile ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}>
      <div className="flex h-full flex-col p-4"><div className="rounded-md bg-background p-3"><img src={brand.logo} alt="Agro Sun" className="h-14 w-auto" /></div><p className="mt-5 px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-leaf">Control Room</p><nav className="mt-3 space-y-1">{nav.map(({ id, label, icon: Icon }) => <Button key={id} variant="ghost" onClick={() => { setPanel(id); setMobile(false); }} className={`w-full justify-start ${panel === id ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"}`}><Icon />{label}{id === "messages" && stats.newMessages > 0 && <span className="ms-auto rounded-full bg-accent px-2 py-0.5 text-[10px]">{stats.newMessages}</span>}</Button>)}</nav><div className="mt-auto space-y-2"><Button variant="ghost" asChild className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground"><Link to="/"><Eye />View website</Link></Button><Button variant="ghost" onClick={() => supabase.auth.signOut()} className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground"><LogOut />Sign out</Button></div></div>
    </aside>
    {mobile && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-primary-deep/50 lg:hidden" onClick={() => setMobile(false)} />}
    <main className="min-h-svh lg:ms-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-7"><div className="flex items-center gap-3"><Button size="icon" variant="outline" className="lg:hidden" onClick={() => setMobile(true)}><Menu /></Button><div><h1 className="font-display text-xl text-primary">{nav.find((n) => n.id === panel)?.label}</h1><p className="text-xs text-muted-foreground">Agrosun website management</p></div></div><div className="flex items-center gap-2 text-xs font-semibold text-primary"><ShieldCheck className="h-4 w-4 text-leaf" />Secure admin</div></header>
      <div className="p-4 sm:p-7">{panel === "overview" && <Overview stats={stats} setPanel={setPanel} />}{panel === "products" && <ProductsPanel rows={products} reload={load} />}{panel === "messages" && <MessagesPanel rows={messages} reload={load} />}{panel === "team" && <TeamPanel rows={team} reload={load} />}{panel === "settings" && <SettingsPanel row={settings} reload={load} />}</div>
    </main>
  </div>;
}

function Overview({ stats, setPanel }: { stats: { products: number; visible: number; newMessages: number; team: number }; setPanel: (p: Panel) => void }) {
  const cards = [{ label: "Products", value: stats.products, sub: `${stats.visible} visible`, icon: Boxes, panel: "products" as Panel }, { label: "New enquiries", value: stats.newMessages, sub: "Waiting for follow-up", icon: Inbox, panel: "messages" as Panel }, { label: "Visible team", value: stats.team, sub: "Public profiles", icon: Users, panel: "team" as Panel }];
  return <><div className="grid gap-4 md:grid-cols-3">{cards.map(({ label, value, sub, icon: Icon, panel }) => <button key={label} onClick={() => setPanel(panel)} className="rounded-lg border border-border bg-card p-5 text-start transition hover:border-accent hover:shadow-lift"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground"><Icon className="h-5 w-5" /></span><span className="tabular text-4xl font-bold text-accent">{value}</span></div><h2 className="mt-5 font-bold text-primary">{label}</h2><p className="text-sm text-muted-foreground">{sub}</p></button>)}</div><div className="mt-7 border-s-4 border-leaf bg-card p-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Quick start</p><h2 className="mt-2 font-display text-3xl text-primary">Keep the catalogue current.</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Update product details, mark featured items, track buyer enquiries and manage the people shown on the public website.</p></div></>;
}

function ProductsPanel({ rows, reload }: { rows: Product[]; reload: () => Promise<void> }) {
  const blank = (): Product => ({ id: crypto.randomUUID(), slug: `new-product-${Date.now()}`, category: "fresh", name_en: "New product", name_ar: "منتج جديد", description_en: "", description_ar: "", packaging: "", image_url: "", image_alt_en: "", image_alt_ar: "", specs: [], sort_order: rows.length + 1, visible: false, featured: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  const [editing, setEditing] = useState<Product | null>(null);
  const save = async () => { if (!editing) return; const { created_at, updated_at, ...payload } = editing; const { error } = await supabase.from("products").upsert(payload); if (error) { toast.error(error.message); return; } toast.success("Product saved"); setEditing(null); await reload(); };
  const remove = async (id: string) => { if (!confirm("Delete this product?")) return; const { error } = await supabase.from("products").delete().eq("id", id); if (error) { toast.error(error.message); return; } await reload(); };
  return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Edit copy, photos, category, display order and visibility.</p><Button onClick={() => setEditing(blank())}><Plus />Add product</Button></div><div className="grid gap-4 xl:grid-cols-2">{rows.map((p) => <div key={p.id} className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-lg border border-border bg-card p-4"><img src={p.image_url || brand.mark} alt="" className="h-24 w-24 rounded-md object-cover" /><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-primary">{p.category}</span>{p.featured && <span className="rounded bg-gold px-2 py-1 text-[10px] font-bold text-gold-foreground">Featured</span>}</div><h3 className="mt-2 truncate font-bold text-primary">{p.name_en}</h3><p className="truncate text-sm text-muted-foreground">{p.name_ar}</p></div><div className="flex flex-col gap-2"><Switch checked={p.visible} onCheckedChange={async (visible) => { await supabase.from("products").update({ visible }).eq("id", p.id); await reload(); }} aria-label="Visible" /><Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button><Button size="icon" variant="ghost" onClick={() => remove(p.id)} aria-label="Delete"><Trash2 className="text-destructive" /></Button></div></div>)}</div>{editing && <EditorModal title="Product editor" onClose={() => setEditing(null)} onSave={save}><div className="grid gap-4 sm:grid-cols-2"><Field label="English name"><Input value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field><Field label="Arabic name"><Input dir="rtl" value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field><Field label="Slug"><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field><Field label="Category"><Select value={editing.category} onValueChange={(category) => setEditing({ ...editing, category })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fresh">Fresh</SelectItem><SelectItem value="iqf">IQF frozen</SelectItem><SelectItem value="processed">Processed</SelectItem></SelectContent></Select></Field><Field label="English description" wide><Textarea value={editing.description_en ?? ""} onChange={(e) => setEditing({ ...editing, description_en: e.target.value })} /></Field><Field label="Arabic description" wide><Textarea dir="rtl" value={editing.description_ar ?? ""} onChange={(e) => setEditing({ ...editing, description_ar: e.target.value })} /></Field><Field label="Photo URL" wide><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://…" /></Field><Field label="Packaging"><Input value={editing.packaging ?? ""} onChange={(e) => setEditing({ ...editing, packaging: e.target.value })} /></Field><Field label="Display order"><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field><Toggle label="Visible" checked={editing.visible} onChange={(visible) => setEditing({ ...editing, visible })} /><Toggle label="Featured on homepage" checked={editing.featured} onChange={(featured) => setEditing({ ...editing, featured })} /></div></EditorModal>}</>;
}

function MessagesPanel({ rows, reload }: { rows: Message[]; reload: () => Promise<void> }) {
  const update = async (id: string, status: string) => { const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id); if (error) toast.error(error.message); else await reload(); };
  return <div className="space-y-4">{rows.length === 0 && <Empty label="No enquiries yet." />}{rows.map((m) => <div key={m.id} className="rounded-lg border border-border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-primary">{m.name}</h3><span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold uppercase">{m.source}</span>{m.product && <span className="rounded bg-gold px-2 py-1 text-[10px] font-bold text-gold-foreground">{m.product}</span>}</div><p className="mt-1 text-sm text-muted-foreground">{m.company || "No company"} · {m.country || "Country not provided"}</p></div><Select value={m.status} onValueChange={(status) => update(m.id, status)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select></div><p className="mt-4 whitespace-pre-wrap text-sm">{m.message}</p><div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-4 text-sm"><a className="font-semibold text-accent" href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <a className="font-semibold text-primary" href={`tel:${m.phone}`}>{m.phone}</a>}<span className="ms-auto text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span></div></div>)}</div>;
}

function TeamPanel({ rows, reload }: { rows: Team[]; reload: () => Promise<void> }) {
  const blank = (): Team => ({ id: crypto.randomUUID(), name_en: "", name_ar: "", title_en: "", title_ar: "", photo_url: "", phone: "", email: "", whatsapp: "", badges: [], sort_order: rows.length + 1, visible: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  const [editing, setEditing] = useState<Team | null>(null);
  const save = async () => { if (!editing) return; const { created_at, updated_at, ...payload } = editing; const { error } = await supabase.from("team_members").upsert(payload); if (error) { toast.error(error.message); return; } toast.success("Team member saved"); setEditing(null); await reload(); };
  return <><div className="mb-5 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Manage the leadership strip shown on the website.</p><Button onClick={() => setEditing(blank())}><Plus />Add person</Button></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map((m) => <button onClick={() => setEditing(m)} key={m.id} className="overflow-hidden rounded-lg border border-border bg-card text-start transition hover:border-accent"><div className="aspect-[4/3] bg-muted"><img src={m.photo_url || brand.mark} alt="" className="h-full w-full object-cover" /></div><div className="p-4"><div className="flex justify-between gap-2"><h3 className="font-bold text-primary">{m.name_en}</h3><span className={`h-2 w-2 rounded-full ${m.visible ? "bg-leaf" : "bg-border"}`} /></div><p className="text-sm text-muted-foreground">{m.title_en}</p></div></button>)}</div>{rows.length === 0 && <Empty label="Add the CEO and company directors here." />}{editing && <EditorModal title="Team profile" onClose={() => setEditing(null)} onSave={save}><div className="grid gap-4 sm:grid-cols-2"><Field label="English name"><Input value={editing.name_en} onChange={(e) => setEditing({ ...editing, name_en: e.target.value })} /></Field><Field label="Arabic name"><Input dir="rtl" value={editing.name_ar} onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })} /></Field><Field label="English role"><Input value={editing.title_en} onChange={(e) => setEditing({ ...editing, title_en: e.target.value })} placeholder="CEO" /></Field><Field label="Arabic role"><Input dir="rtl" value={editing.title_ar} onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })} /></Field><Field label="Photo URL" wide><Input value={editing.photo_url} onChange={(e) => setEditing({ ...editing, photo_url: e.target.value })} /></Field><Field label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field><Field label="WhatsApp"><Input value={editing.whatsapp} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} /></Field><Field label="Email"><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field><Field label="Display order"><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field><Toggle label="Visible on website" checked={editing.visible} onChange={(visible) => setEditing({ ...editing, visible })} /></div></EditorModal>}</>;
}

function SettingsPanel({ row, reload }: { row: SettingsRow | null; reload: () => Promise<void> }) {
  const [draft, setDraft] = useState<SettingsRow | null>(row);
  useEffect(() => setDraft(row), [row]);
  if (!draft) return <Empty label="Site settings are being prepared." />;
  const set = <K extends keyof SettingsRow>(key: K, value: SettingsRow[K]) => setDraft({ ...draft, [key]: value });
  const save = async () => { const { created_at, updated_at, ...payload } = draft; const { error } = await supabase.from("site_settings").upsert(payload); if (error) { toast.error(error.message); return; } toast.success("Site settings saved"); await reload(); };
  return <div className="max-w-4xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Company identity, main banner, contact channels and social links.</p><Button onClick={save}><Save />Save all settings</Button></div><div className="space-y-7"><SettingsGroup title="Company identity"><div className="grid gap-4 sm:grid-cols-2"><Field label="Company name"><Input value={draft.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field><Field label="Legal name"><Input value={draft.legal_name} onChange={(e) => set("legal_name", e.target.value)} /></Field><Field label="Logo URL" wide><Input value={draft.logo_url} onChange={(e) => set("logo_url", e.target.value)} /></Field></div></SettingsGroup><SettingsGroup title="Main banner"><div className="grid gap-4 sm:grid-cols-2"><Field label="English headline"><Input value={draft.hero_title_en} onChange={(e) => set("hero_title_en", e.target.value)} /></Field><Field label="Arabic headline"><Input dir="rtl" value={draft.hero_title_ar} onChange={(e) => set("hero_title_ar", e.target.value)} /></Field><Field label="English supporting text"><Textarea value={draft.hero_subtitle_en} onChange={(e) => set("hero_subtitle_en", e.target.value)} /></Field><Field label="Arabic supporting text"><Textarea dir="rtl" value={draft.hero_subtitle_ar} onChange={(e) => set("hero_subtitle_ar", e.target.value)} /></Field><Field label="Banner image or video URL" wide><Input value={draft.hero_media_url} onChange={(e) => set("hero_media_url", e.target.value)} /></Field><Field label="Media type"><Select value={draft.hero_media_type} onValueChange={(v) => set("hero_media_type", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select></Field><Toggle label="Website published" checked={draft.published} onChange={(v) => set("published", v)} /></div></SettingsGroup><SettingsGroup title="Website developer credit"><div className="grid gap-4 sm:grid-cols-2"><Field label="Developer name"><Input value={draft.developer_name} onChange={(e) => set("developer_name", e.target.value)} /></Field><Field label="Developer link"><Input value={draft.developer_url} onChange={(e) => set("developer_url", e.target.value)} placeholder="https://…" /></Field><Field label="Developer icon / photo URL" wide><Input value={draft.developer_avatar_url} onChange={(e) => set("developer_avatar_url", e.target.value)} placeholder="https://…" /></Field></div></SettingsGroup><SettingsGroup title="Contact and social"><div className="grid gap-4 sm:grid-cols-2"><Field label="Email"><Input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} /></Field><Field label="Phone"><Input value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></Field><Field label="WhatsApp"><Input value={draft.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field><Field label="Google Maps URL"><Input value={draft.maps_url} onChange={(e) => set("maps_url", e.target.value)} /></Field><Field label="Facebook"><Input value={draft.facebook_url} onChange={(e) => set("facebook_url", e.target.value)} /></Field><Field label="Instagram"><Input value={draft.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} /></Field><Field label="LinkedIn"><Input value={draft.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} /></Field><Field label="YouTube"><Input value={draft.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} /></Field></div></SettingsGroup></div></div>;
}

function EditorModal({ title, children, onClose, onSave }: { title: string; children: ReactNode; onClose: () => void; onSave: () => void }) { return <div className="fixed inset-0 z-[100] grid place-items-center bg-primary-deep/70 p-3"><div className="max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background shadow-lift"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4"><h2 className="font-display text-2xl text-primary">{title}</h2><Button variant="ghost" onClick={onClose}>Close</Button></div><div className="p-5">{children}</div><div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background px-5 py-4"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onSave}><Save />Save changes</Button></div></div></div>; }
function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-xs font-bold text-muted-foreground">{label}</span>{children}</label>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) { return <div className="flex items-center justify-between rounded-md border border-border px-3 py-2"><span className="text-sm font-semibold">{label}</span><Switch checked={checked} onCheckedChange={onChange} /></div>; }
function SettingsGroup({ title, children }: { title: string; children: ReactNode }) { return <section><div className="mb-4 flex items-center gap-2 border-b border-border pb-3"><Building2 className="h-5 w-5 text-accent" /><h2 className="font-display text-2xl text-primary">{title}</h2></div>{children}</section>; }
function Empty({ label }: { label: string }) { return <div className="border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">{label}</div>; }