import { useEffect, useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from "react";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Eye, Package, Send, Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { brand, categories, type Product } from "@/data/site";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({ name: z.string().trim().min(1).max(100), company: z.string().trim().max(120), email: z.string().trim().email().max(255), phone: z.string().trim().max(30), country: z.string().trim().max(60), message: z.string().trim().min(1).max(2000) });
const empty = { name: "", company: "", email: "", phone: "", country: "", message: "" };

/** Centred 50% product window: photo gallery, export specs, harvest calendar and an inline enquiry form. Used on the homepage and product page. */
export function ProductWindow({ list, index, onIndex }: { list: Product[]; index: number | null; onIndex: (i: number | null) => void }) {
  const { t, tr, lang } = useLang();
  const p = index !== null ? list[index] : null;
  const [photo, setPhoto] = useState(0);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { setPhoto(0); setDone(false); }, [index]);
  const count = index !== null ? 1 + (list[index]?.gallery?.length ?? 0) : 0;
  useEffect(() => { if (count < 2) return; const id = setInterval(() => setPhoto((x) => (x + 1) % count), 3500); return () => clearInterval(id); }, [count, index]);
  if (!p) return null;
  const photos = [p.image || brand.mark, ...(p.gallery ?? [])];
  const go = (d: number) => onIndex(((index ?? 0) + d + list.length) % list.length);
  const fallback = (e: SyntheticEvent<HTMLImageElement>) => { const img = e.currentTarget; if (img.dataset['fallback']) return; img.dataset['fallback'] = "1"; img.src = brand.mark; img.classList.add("object-contain", "p-8"); };
  const months = new Intl.DateTimeFormat(lang, { month: "short" });
  const calendar = p.seasonMonths?.length ? p.seasonMonths.map((m) => months.format(new Date(2026, m - 1, 1))).join(" · ") : t("yearRound");
  const update = (k: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((v) => ({ ...v, [k]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(tr({ en: "Check the required fields and email", ar: "راجع البيانات المطلوبة والبريد الإلكتروني", it: "Controlla i campi obbligatori", fr: "Vérifiez les champs obligatoires", de: "Pflichtfelder prüfen" })); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, product: p.name.en, source: "product" });
    setBusy(false);
    if (error) { toast.error(tr({ en: "Could not send. Please try again.", ar: "تعذر الإرسال، حاول مرة أخرى", it: "Invio non riuscito", fr: "Envoi impossible", de: "Senden fehlgeschlagen" })); return; }
    setDone(true); setForm(empty);
  };
  const cat = categories.find((c) => c.id === p.category);

  return (
    <Dialog open onOpenChange={(o) => !o && onIndex(null)}>
      <DialogContent className="max-h-[92svh] w-[96vw] max-w-[96vw] overflow-y-auto p-0 sm:w-[90vw] sm:max-w-[90vw] lg:w-[50vw] lg:max-w-[50vw]">
        <div key={p.id} className="grid animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-secondary p-3 sm:p-5">
            <div className="relative overflow-hidden rounded-2xl bg-muted">
              <img key={photos[photo]} src={photos[photo]} onError={fallback} alt={tr(p.name)} className="aspect-[4/3] w-full object-cover animate-in fade-in duration-500" />
              {cat && <span className="absolute start-3 top-3 rounded-full bg-primary-deep/85 px-3 py-1 text-[11px] font-bold text-primary-foreground backdrop-blur">{tr(cat.label)}</span>}
              {list.length > 1 && <>
                <Button size="icon" variant="secondary" onClick={() => go(-1)} aria-label={t("previous")} className="absolute start-3 top-1/2 -translate-y-1/2 rounded-full"><ChevronLeft className="rtl:rotate-180" /></Button>
                <Button size="icon" variant="secondary" onClick={() => go(1)} aria-label={t("next")} className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full"><ChevronRight className="rtl:rotate-180" /></Button>
              </>}
            </div>
            {photos.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{photos.map((src, i) => <button key={src + i} onClick={() => setPhoto(i)} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === photo ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}><img src={src} onError={fallback} alt="" className="h-full w-full object-cover" /></button>)}</div>}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {!!p.views && <div className="rounded-xl bg-card p-3"><Eye className="h-4 w-4 text-accent" /><div className="tabular mt-1 text-xl font-bold text-primary">{p.views.toLocaleString()}</div><div className="text-xs text-muted-foreground">{tr({ en: "Importer views", ar: "مشاهدة من المستوردين", it: "Visualizzazioni", fr: "Vues importateurs", de: "Aufrufe" })}</div></div>}
              {!!p.tons && <div className="rounded-xl bg-card p-3"><Truck className="h-4 w-4 text-accent" /><div className="tabular mt-1 text-xl font-bold text-primary">{p.tons.toLocaleString()}</div><div className="text-xs text-muted-foreground">{tr({ en: "Tons / season", ar: "طن / موسم", it: "Tonnellate / stagione", fr: "Tonnes / saison", de: "Tonnen / Saison" })}</div></div>}
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <p className="text-[11px] font-bold uppercase text-accent">{t("exportReady")}</p>
            <DialogTitle className="mt-1 font-display text-3xl text-primary">{tr(p.name)}</DialogTitle>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tr(p.text)}</p>
            {p.specs && <ul className="mt-4 space-y-1.5 text-sm">{(p.specs[lang] ?? p.specs.en).map((s) => <li key={s} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-leaf" />{s}</li>)}</ul>}
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {p.packaging && <div className="flex gap-2 rounded-xl bg-muted p-3"><Package className="h-4 w-4 shrink-0 text-accent" /><span>{tr(p.packaging)}</span></div>}
              <div className="flex gap-2 rounded-xl border border-border p-3"><CalendarDays className="h-4 w-4 shrink-0 text-leaf" /><span>{calendar}</span></div>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-secondary/60 p-4">
              <h3 className="font-bold text-primary">{t("enquire")}</h3>
              {done ? <div className="py-8 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-leaf" /><p className="mt-3 font-bold text-primary">{t("enquiryReceived")}</p><p className="text-sm text-muted-foreground">{t("replySoon")}</p></div> :
                <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Input required maxLength={100} placeholder={t("fullName")} value={form.name} onChange={update("name")} />
                  <Input maxLength={120} placeholder={t("company")} value={form.company} onChange={update("company")} />
                  <Input required type="email" maxLength={255} placeholder={t("email")} value={form.email} onChange={update("email")} />
                  <Input type="tel" maxLength={30} placeholder={t("phone")} value={form.phone} onChange={update("phone")} />
                  <Input maxLength={60} placeholder={t("country")} value={form.country} onChange={update("country")} className="sm:col-span-2" />
                  <Textarea required maxLength={2000} rows={3} placeholder={tr({ en: "Volume, destination and timing *", ar: "الكميات والوجهة والتوقيت المطلوب *", it: "Volume, destinazione e tempistiche *", fr: "Volume, destination et calendrier *", de: "Menge, Ziel und Zeitplan *" })} value={form.message} onChange={update("message")} className="sm:col-span-2" />
                  <Button disabled={busy} className="rounded-full sm:col-span-2">{busy ? t("sending") : <><Send />{t("sendMessage")}</>}</Button>
                </form>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
