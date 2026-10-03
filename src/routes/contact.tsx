import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { banners, contact, products } from "@/data/site";
import { useLang } from "@/lib/lang";
import { Button } from "@/components/ui/button";
import { PageBanner, Section } from "@/components/site/Shell";
import { supabase } from "@/integrations/supabase/client";

const title = "Contact Agrosun Export Team — Egyptian Produce Supplier";
const description = "Send an enquiry to Agrosun Group's export team: exportagrosun@agrosunegypt.com — Sheikh Zayed head office, Badr Center packhouse, Sadat City factory.";

export const Route = createFileRoute("/contact")({
  validateSearch: z.object({ product: z.string().max(100).optional() }),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30),
  country: z.string().trim().max(60),
  product: z.string().trim().max(100),
  message: z.string().trim().min(1).max(2000),
});

function Contact() {
  const { tr, t } = useLang();
  const { product } = Route.useSearch();
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", country: "", product: product ?? "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<Record<string, boolean>>({});
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], true]))); return; }
    setErr({}); setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(r.data);
    setBusy(false);
    if (error) { toast.error(tr({ en: "Could not send, please email us directly.", ar: "تعذر الإرسال، راسلنا على البريد مباشرة." })); return; }
    setDone(true);
    toast.success(tr({ en: "Message sent — our export team will reply soon.", ar: "تم الإرسال — سيرد عليك فريق التصدير قريبًا." }));
  };

  const input = (k: keyof typeof f) => `peer w-full rounded-2xl border bg-background px-4 pb-2.5 pt-6 text-sm transition focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 ${err[k] ? "border-destructive" : "border-input"}`;
  const Field = ({ k, label, type = "text", max }: { k: keyof typeof f; label: string; type?: string; max: number }) => (
    <label className="relative block">
      <input type={type} value={f[k]} onChange={set(k)} maxLength={max} placeholder=" " className={input(k)} />
      <span className="pointer-events-none absolute start-4 top-4 text-sm text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">{label}</span>
    </label>
  );

  return (
    <>
      <PageBanner page="contact" image={banners.contact.image} kicker={tr({ en: "Contact us for export", ar: "تواصل معنا للتصدير" })} title={tr({ en: "Let's grow together", ar: "لننمو معًا" })} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-4 rounded-3xl bg-primary p-6 text-primary-foreground transition hover:brightness-110"><Mail className="h-7 w-7 text-leaf" /><span className="break-all font-semibold">{contact.email}</span></a>
            {contact.offices.map((o) => <div key={o.label.en} className="flex gap-4 rounded-3xl border border-border bg-card p-6"><MapPin className="h-6 w-6 shrink-0 text-accent" /><div><div className="font-bold text-primary">{tr(o.label)}</div><div className="text-sm text-muted-foreground">{tr(o.value)}</div></div></div>)}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift sm:p-10">
            {done ? (
              <div className="py-16 text-center animate-in zoom-in-95 fade-in">
                <CheckCircle2 className="mx-auto h-16 w-16 text-leaf" />
                 <h2 className="mt-4 font-display text-3xl text-primary">{t("enquiryReceived")}</h2>
                 <p className="mt-2 text-muted-foreground">{t("replySoon")}</p>
                 <Button onClick={() => { setDone(false); setF({ ...f, message: "" }); }} className="mt-6">{t("sendAnother")}</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4" noValidate>
                 <h2 className="font-display text-3xl text-primary">{tr({ en: "Send us an enquiry", ar: "أرسل استفسارك", it: "Invia una richiesta", fr: "Envoyez votre demande", de: "Senden Sie Ihre Anfrage" })}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                   {Field({ k: "name", label: t("fullName"), max: 100 })}
                   {Field({ k: "company", label: t("company"), max: 120 })}
                   {Field({ k: "email", label: t("email"), type: "email", max: 255 })}
                   {Field({ k: "phone", label: t("phone"), type: "tel", max: 30 })}
                   {Field({ k: "country", label: t("country"), max: 60 })}
                  <select value={f.product} onChange={set("product")} className="w-full rounded-2xl border border-input bg-background px-4 py-4 text-sm focus:border-accent focus:outline-none">
                     <option value="">{tr({ en: "Product of interest", ar: "المنتج المطلوب", it: "Prodotto di interesse", fr: "Produit recherché", de: "Gewünschtes Produkt" })}</option>
                    {products.map((p) => <option key={p.id} value={p.name.en}>{tr(p.name)}</option>)}
                  </select>
                </div>
                <label className="relative block">
                  <textarea value={f.message} onChange={set("message")} maxLength={2000} rows={5} placeholder=" " className={input("message")} />
                   <span className="pointer-events-none absolute start-4 top-4 text-sm text-muted-foreground transition-all peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[11px]">{tr({ en: "Message — volumes, destination, timing *", ar: "الرسالة — الكميات، الوجهة، التوقيت *", it: "Messaggio — volumi, destinazione, tempistiche *", fr: "Message — volumes, destination, calendrier *", de: "Nachricht — Mengen, Ziel, Zeitplan *" })}</span>
                </label>
                 {Object.keys(err).length > 0 && <p className="text-sm text-destructive">{tr({ en: "Please complete the required fields with a valid email.", ar: "من فضلك أكمل الحقول المطلوبة ببريد صحيح.", it: "Completa i campi richiesti con un'email valida.", fr: "Complétez les champs obligatoires avec un e-mail valide.", de: "Bitte füllen Sie die Pflichtfelder mit einer gültigen E-Mail aus." })}</p>}
                 <Button disabled={busy} size="lg" className="group">
                  {busy ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : <Send className="h-5 w-5 transition group-hover:translate-x-1 rtl:rotate-180" />}
                   {busy ? t("sending") : t("sendMessage")}
                 </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
