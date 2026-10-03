import { Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { useLang } from "@/lib/lang";
import { useLive } from "@/lib/live";
import { brand } from "@/data/site";
import { Section, Reveal } from "./Shell";

const groups: Record<string, { en: string; ar: string; it: string; fr: string; de: string }> = {
  leadership: { en: "Board & leadership", ar: "مجلس الإدارة والقيادة", it: "Consiglio e direzione", fr: "Conseil et direction", de: "Vorstand & Leitung" },
  export: { en: "Export directors", ar: "مديرو التصدير", it: "Direttori export", fr: "Directeurs export", de: "Exportleitung" },
  quality: { en: "Quality assurance", ar: "ضمان الجودة", it: "Controllo qualità", fr: "Assurance qualité", de: "Qualitätssicherung" },
};

/** Leadership & export team from the admin "Team & Governance" tab; hidden until someone is added. */
export function TeamSection() {
  const { tr, t, lang } = useLang();
  const { team, settings } = useLive();
  const vis = settings?.section_visibility as Record<string, boolean> | undefined;
  if (!team.length || vis?.["team"] === false) return null;
  return (
    <Section className="bg-secondary" kicker={t("teamKicker")} title={t("team")}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m, i) => {
          const name = lang === "ar" ? m.name_ar || m.name_en : m.name_en;
          const role = lang === "ar" ? m.title_ar || m.title_en : m.title_en;
          const g = groups[m.group_name ?? "leadership"];
          return (
            <Reveal key={m.id} delay={i * 90}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card transition duration-500 hover:-translate-y-1.5 hover:border-accent hover:shadow-lift">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img src={m.photo_url || brand.mark} alt={name} loading="lazy" onError={(e) => { e.currentTarget.src = brand.mark; }} className={`h-full w-full transition duration-700 group-hover:scale-105 ${m.photo_url ? "object-cover" : "object-contain p-12 opacity-40"}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                    {g && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase text-gold-foreground">{tr(g)}</span>}
                    <h3 className="mt-2 font-display text-2xl leading-tight">{name}</h3>
                    <p className="text-sm text-primary-foreground/85">{role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4">
                  {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-accent"><Linkedin className="h-4 w-4" /></a>}
                  {m.whatsapp && <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition hover:border-accent hover:text-accent"><MessageCircle className="h-4 w-4" /></a>}
                  {m.phone && <a href={`tel:${m.phone}`} aria-label="Phone" className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition hover:border-accent hover:text-accent"><Phone className="h-4 w-4" /></a>}
                  {m.email && <a href={`mailto:${m.email}`} className="ms-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition hover:brightness-110"><Mail className="h-3.5 w-3.5" />{t("contactPerson")}</a>}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
