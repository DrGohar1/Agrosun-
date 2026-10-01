import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { banners, markets, clientTypes, partners, brand } from "@/data/site";
import { useLang } from "@/lib/lang";
import { PageBanner, Section, Reveal } from "@/components/site/Shell";

const title = "Agrosun Partners & Markets — UK, Germany, Italy, EU, USA";
const description = "Who Agrosun Group works with: importers, distributors, food processors and retailers across the UK, Germany, Italy, the EU and the USA.";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Partners,
});

function Partners() {
  const { tr } = useLang();
  return (
    <>
      <PageBanner image={banners.partners.image} kicker={tr({ en: "Partners & markets", ar: "شركاؤنا وأسواقنا" })} title={tr({ en: "Your strategic partner for sustainable growth", ar: "شريككم الاستراتيجي للنمو المستدام" })} />
      <Section kicker={tr({ en: "Where we export", ar: "الأسواق الحالية" })} title={tr({ en: "Markets we serve", ar: "الأسواق التي نخدمها" })}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {markets.map((m, i) => <Reveal key={m.name.en} delay={i * 80}><div className="rounded-3xl border border-border bg-card p-6 text-center transition hover:-translate-y-1 hover:shadow-lift"><div className="text-5xl">{m.flag}</div><div className="mt-3 font-bold text-primary">{tr(m.name)}</div></div></Reveal>)}
        </div>
      </Section>
      <Section className="bg-secondary" kicker={tr({ en: "Who we deal with", ar: "بنتعامل مع مين" })} title={tr({ en: "Built for large, recurring programmes", ar: "قدرة على تلبية الكميات الكبيرة" })}>
        <div className="grid gap-5 md:grid-cols-3">
          {clientTypes.map((c, i) => <Reveal key={i} delay={i * 120}><div className="h-full rounded-3xl bg-card p-7 shadow-lift"><Building2 className="h-8 w-8 text-accent" /><h3 className="mt-4 text-xl font-bold text-primary">{tr(c.title)}</h3><p className="mt-2 text-muted-foreground">{tr(c.text)}</p></div></Reveal>)}
        </div>
      </Section>
      <Section kicker={tr({ en: "Our partners", ar: "شركاؤنا" })} title={tr({ en: "Group companies & brands", ar: "شركات وعلامات المجموعة" })}>
        <div className="grid gap-4 sm:grid-cols-3">
          {partners.map((p) => <div key={p.name} className="flex items-center gap-4 rounded-3xl border border-border bg-card p-6"><img src={p.logo ?? brand.mark} alt="" className="h-12 w-auto" /><span className="font-bold text-primary">{p.name}</span></div>)}
        </div>
      </Section>
    </>
  );
}
