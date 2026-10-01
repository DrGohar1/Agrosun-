import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MapPin } from "lucide-react";
import { banners, about, facilities } from "@/data/site";
import { useLang } from "@/lib/lang";
import { PageBanner, Section, Reveal } from "@/components/site/Shell";

const title = "About Agrosun Group — Three Decades of Egyptian Agro-Export";
const description = "Founded in 1995, Agrosun Group controls farming, sorting, IQF processing and export through its Badr Center packhouse and Sadat City IQF complex.";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: About,
});

function About() {
  const { tr } = useLang();
  return (
    <>
      <PageBanner image={banners.about.image} kicker={tr({ en: "About the group", ar: "نبذة عن المجموعة" })} title={tr({ en: "Experience spanning three decades", ar: "خبرة تمتد لثلاثة عقود" })} />
      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {about.pillars.map((p, i) => (
            <Reveal key={i} delay={i * 120}><div className="h-full rounded-3xl border-t-4 border-accent bg-card p-7 shadow-lift"><h3 className="font-display text-2xl text-primary">{tr(p.title)}</h3><p className="mt-3 text-muted-foreground">{tr(p.text)}</p></div></Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-secondary" kicker={tr({ en: "Group structure", ar: "هيكل المجموعة" })} title="Agrosun Group">
        <p className="-mt-6 mb-8 text-muted-foreground">{tr({ en: "Strategy, finance & international relations", ar: "الاستراتيجية، التمويل، العلاقات الدولية" })}</p>
        <div className="grid gap-5 md:grid-cols-2">
          {about.structure.map((s) => (
            <div key={s.name} className="rounded-3xl bg-primary p-7 text-primary-foreground">
              <h3 className="text-xl font-bold">{s.name}</h3><p className="text-sm text-leaf">{s.ar}</p>
              <ul className="mt-4 space-y-2">{tr({ en: s.items.en.join("|"), ar: s.items.ar.join("|") }).split("|").map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>
      <Section kicker={tr({ en: "Infrastructure", ar: "البنية التحتية" })} title={tr({ en: "Full ownership of our assets", ar: "امتلاك كامل للأصول يضمن استمرارية التوريد" })}>
        <div className="grid gap-8 lg:grid-cols-2">
          {facilities.map((f, i) => (
            <Reveal key={i} delay={i * 150}>
              <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
                <div className="overflow-hidden"><img src={f.image} alt={f.name.en} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <div className="p-7">
                  <h3 className="font-display text-2xl text-primary">{tr(f.name)}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-accent" />{tr(f.place)}</p>
                  <ul className="mt-4 space-y-2 text-sm">{tr({ en: f.points.en.join("|"), ar: f.points.ar.join("|") }).split("|").map((x) => <li key={x} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />{x}</li>)}</ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-primary-deep text-primary-foreground" kicker={tr({ en: "Raw material control", ar: "ضبط الخام وإدارة المخاطر" })}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.controls.map((c, i) => <Reveal key={i} delay={i * 100}><div className="h-full rounded-3xl border border-primary-foreground/10 bg-primary-foreground/5 p-6"><h3 className="text-lg font-bold text-leaf">{tr(c.title)}</h3><p className="mt-2 text-sm text-primary-foreground/75">{tr(c.text)}</p></div></Reveal>)}
        </div>
      </Section>
    </>
  );
}
