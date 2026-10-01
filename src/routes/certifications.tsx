import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { banners, certifications, about } from "@/data/site";
import { useLang } from "@/lib/lang";
import { PageBanner, Section, Reveal } from "@/components/site/Shell";

const title = "Agrosun Certifications — GLOBALG.A.P., BRC, ISO 22000, ISO 9001, HACCP";
const description = "Agrosun Group complies with European food-safety standards: GLOBALG.A.P., BRC Food, ISO 22000, ISO 9001 and HACCP, with full lot-code traceability.";

export const Route = createFileRoute("/certifications")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Certs,
});

function Certs() {
  const { tr } = useLang();
  return (
    <>
      <PageBanner image={banners.certifications.image} kicker={tr({ en: "Quality & compliance", ar: "اعتمادات الجودة والامتثال الدولي" })} title={tr({ en: "Full compliance is our passport to global markets", ar: "الامتثال الكامل هو جواز مرورنا للأسواق العالمية" })} />
      <Section kicker={tr({ en: "Our certificates", ar: "شهاداتنا" })} title={tr({ en: "European food-safety standards at every stage", ar: "نلتزم بمعايير السلامة الغذائية الأوروبية في جميع مراحل الإنتاج" })}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 100}>
              <div className="group h-full rounded-3xl border-2 border-gold/40 bg-card p-6 text-center transition hover:-translate-y-2 hover:border-gold hover:shadow-lift">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold/20 text-gold-foreground transition group-hover:rotate-12 group-hover:scale-110"><BadgeCheck className="h-10 w-10" /></span>
                <h3 className="mt-5 text-lg font-extrabold text-primary">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tr(c.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-secondary" kicker={tr({ en: "Protocols", ar: "البروتوكولات" })} title={tr({ en: "Strict raw-material control & traceability", ar: "بروتوكولات صارمة لضبط المواد الخام وتتبع المنتج" })}>
        <div className="grid gap-4 md:grid-cols-2">
          {about.controls.map((c, i) => <div key={i} className="flex gap-4 rounded-3xl bg-card p-6"><ShieldCheck className="h-8 w-8 shrink-0 text-accent" /><div><h3 className="font-bold text-primary">{tr(c.title)}</h3><p className="mt-1 text-sm text-muted-foreground">{tr(c.text)}</p></div></div>)}
        </div>
      </Section>
    </>
  );
}
