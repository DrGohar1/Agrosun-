import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { brand, type Product } from "@/data/site";
import { useLang } from "@/lib/lang";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30),
  country: z.string().trim().max(60),
  message: z.string().trim().min(1).max(2000),
});

export function ProductInquiry({ product, open, onOpenChange }: { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { tr, t } = useLang();
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", country: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => { if (open) setDone(false); }, [open]);
  if (!product) return null;
  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((v) => ({ ...v, [key]: e.target.value }));
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = inquirySchema.safeParse(form);
    if (!parsed.success) { toast.error(tr({ en: "Check the required fields and email", ar: "راجع البيانات المطلوبة والبريد الإلكتروني", it: "Controlla i campi obbligatori e l'email", fr: "Vérifiez les champs obligatoires et l'e-mail", de: "Prüfen Sie Pflichtfelder und E-Mail" })); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, product: product.name.en, source: "product" });
    setBusy(false);
    if (error) { toast.error(tr({ en: "Could not send. Please try again.", ar: "تعذر الإرسال، حاول مرة أخرى", it: "Invio non riuscito. Riprova.", fr: "Envoi impossible. Réessayez.", de: "Senden fehlgeschlagen. Bitte erneut versuchen." })); return; }
    setDone(true);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92svh] max-w-2xl overflow-y-auto p-0">
        <div className="border-b border-border bg-secondary px-6 py-5">
          <img src={brand.logo} alt="Agro Sun" className="h-14 w-auto" />
           <DialogTitle className="mt-4 font-display text-2xl text-primary">{t("enquire")}: {tr(product.name)}</DialogTitle>
        </div>
         {done ? <div className="px-7 py-14 text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-leaf" /><h3 className="mt-4 font-display text-2xl text-primary">{t("enquiryReceived")}</h3><p className="mt-2 text-muted-foreground">{t("replySoon")}</p></div> :
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
             <Input required maxLength={100} placeholder={t("fullName")} value={form.name} onChange={update("name")} />
             <Input maxLength={120} placeholder={t("company")} value={form.company} onChange={update("company")} />
             <Input required type="email" maxLength={255} placeholder={t("email")} value={form.email} onChange={update("email")} />
             <Input type="tel" maxLength={30} placeholder={t("phone")} value={form.phone} onChange={update("phone")} />
             <Input maxLength={60} placeholder={t("country")} value={form.country} onChange={update("country")} />
            <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm font-semibold text-primary">{tr(product.name)}</div>
             <Textarea required maxLength={2000} rows={4} placeholder={tr({ en: "Volume, destination and timing *", ar: "الكميات والوجهة والتوقيت المطلوب *", it: "Volume, destinazione e tempistiche *", fr: "Volume, destination et calendrier *", de: "Menge, Ziel und Zeitplan *" })} value={form.message} onChange={update("message")} className="sm:col-span-2" />
             <Button disabled={busy} size="lg" className="sm:col-span-2">{busy ? t("sending") : <><Send />{t("sendMessage")}</>}</Button>
          </form>}
      </DialogContent>
    </Dialog>
  );
}