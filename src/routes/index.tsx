import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Snowflake, Sprout, Truck, PackageCheck, Globe2 } from "lucide-react";
import { banners, brand, hero, stats, products, certifications, markets, about } from "@/data/site";
import { useLang } from "@/lib/lang";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Section, Reveal } from "@/components/site/Shell";

const title = "Agro Sun — Agrosun Group | Egyptian Fresh & IQF Produce Exporter since 1995";
const description = "Agrosun Group: farming, sorting, IQF freezing and export of Egyptian grapes, strawberries, artichokes and vegetables to the EU, UK and USA since 1995.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});

const heroCards = [
  { id: "artichokes", label: { en: "Fresh vegetables", ar: "خضروات طازجة" }, edge: "border-accent", tint: "from-accent/90 via-accent/60" },
  { id: "grapes", label: { en: "Fresh grapes", ar: "عنب طازج" }, edge: "border-leaf", tint: "from-primary/95 via-primary/60" },
  { id: "iqf-strawberries", label: { en: "Frozen IQF produce", ar: "منتجات مجمدة IQF" }, edge: "border-gold", tint: "from-primary-deep/95 via-primary-deep/60" },
];

const icons = [Sprout, Truck, PackageCheck, Snowflake, Globe2];

function Home() {
  const { t, tr, lang } = useLang();
  const [hs, setHs] = useState<{ hero_media_url: string; hero_media_type: string; hero_title_en: string; hero_title_ar: string; hero_subtitle_en: string; hero_subtitle_ar: string } | null>(null);
  useEffect(() => { void supabase.from("site_settings").select("hero_media_url,hero_media_type,hero_title_en,hero_title_ar,hero_subtitle_en,hero_subtitle_ar").eq("id", "main").maybeSingle().then(({ data }) => setHs(data)); }, []);
  const heroTitle = hs && (lang === "ar" ? hs.hero_title_ar : hs.hero_title_en);
  const heroSub = hs && (lang === "ar" ? hs.hero_subtitle_ar : hs.hero_subtitle_en);
  const featured = products.filter((p) => p.featured).concat(products.filter((p) => ["artichokes", "iqf-broccoli"].includes(p.id)));
  return (
    <>
      <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden pt-32 pb-40 text-center text-primary-foreground lg:min-h-[92vh]">
        <img src={(hs?.hero_media_type !== "video" && hs?.hero_media_url) || banners.home.image} alt="Agrosun farms with centre-pivot irrigation" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover animate-[kenburns_14s_ease-out_forwards]" />
        {hs?.hero_media_type === "video" && hs.hero_media_url && <video src={hs.hero_media_url} poster={banners.home.image} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/60 via-primary-deep/25 to-primary-deep/80" />
        <div className="relative mx-auto w-full max-w-6xl px-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-[2000ms] fill-mode-both">
          <p className="inline-flex rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground backdrop-blur sm:text-xs sm:tracking-[0.2em]">{tr(hero.kicker)}</p>
          <h1 className="mt-6 font-display text-[clamp(2.3rem,5.2vw,4.9rem)] uppercase leading-[1.02] tracking-tight drop-shadow-lg">{heroTitle ? heroTitle : <>
            {tr({ en: "Cultivating quality,", ar: "نزرع الجودة،" })}<br />{tr({ en: "exporting ", ar: "ونصدّر " })}<span className="text-accent">{tr({ en: "excellence.", ar: "التميّز." })}</span></>}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/90 sm:text-xl">{heroSub || <>{tr(hero.title)} <span className="italic text-leaf">{tr(hero.titleAccent)}</span></>}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground shadow-lift transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95">{t("explore")}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" /></Link>
            <Link to="/contact" className="inline-flex items-center rounded-full border border-primary-foreground/50 bg-primary-foreground/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-primary-foreground/20 active:scale-95">{t("talk")}</Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-28 px-5 sm:-mt-32">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3 sm:gap-6">
          {heroCards.map((c, i) => {
            const p = products.find((x) => x.id === c.id) ?? products[i]; if (!p) return null;
            return (
              <Link key={c.id} to="/products" style={{ animationDelay: `${2200 + i * 150}ms` }}
                className={`group relative flex h-36 items-center overflow-hidden rounded-2xl border-s-4 ${c.edge} bg-card shadow-lift transition duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both hover:-translate-y-2 active:scale-[0.98] sm:h-44`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${c.tint} to-transparent rtl:bg-gradient-to-l`} />
                <img src={p.image} alt="" className="absolute inset-y-0 end-0 h-full w-3/5 object-cover transition duration-700 [mask-image:linear-gradient(to_right,transparent,black_40%)] group-hover:scale-110 rtl:[mask-image:linear-gradient(to_left,transparent,black_40%)]" />
                <div className="relative z-10 ps-6 text-start">
                  <h3 className="font-display text-2xl uppercase leading-tight text-primary-foreground drop-shadow sm:text-[1.7rem]">{tr(c.label)}</h3>
                  <span className="mt-3 block h-0.5 w-10 bg-gold transition-all duration-500 group-hover:w-20" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mt-10 px-5">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border shadow-lift md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className="bg-card p-6 text-center">
              <div className="tabular text-3xl font-bold text-accent sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{tr(s.label)}</div>
            </div>
          ))}
        </div>
      </section>

      <Section kicker={tr({ en: "Our products", ar: "منتجاتنا" })} title={tr({ en: "Fresh, frozen & processed", ar: "طازج، مجمد ومصنّع" })}>
        <div className="grid gap-5 md:grid-cols-3">
          {([{ c: "fresh" as const, img: products[0]!.image, label: { en: "Fresh Produce", ar: "الحاصلات الطازجة" } }, { c: "iqf" as const, img: products.find((p) => p.id === "iqf-strawberries")!.image, label: { en: "IQF Frozen", ar: "التجميد السريع" } }, { c: "processed" as const, img: products.find((p) => p.id === "pickled-peppers")!.image, label: { en: "Processed", ar: "منتجات مصنّعة" } }]).map((x, i) => (
            <Reveal key={x.c} delay={i * 120}>
              <Link to="/products" search={{ c: x.c }} className="group relative block h-80 overflow-hidden rounded-3xl shadow-lift">
                <img src={x.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                  <h3 className="font-display text-3xl">{tr(x.label)}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-leaf">{t("readMore")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary" kicker={tr({ en: "Quality journey", ar: "رحلة الجودة" })} title={tr({ en: "From the farm to the world", ar: "من المزرعة إلى العالم" })}>
        <div className="grid gap-4 md:grid-cols-5">
          {about.chain.map((s, i) => { const I = icons[i] ?? Sprout; return (
            <Reveal key={i} delay={i * 100}>
              <div className="group h-full rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-accent hover:shadow-lift">
                <div className="flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground transition group-hover:bg-accent"><I className="h-6 w-6" /></span><span className="tabular text-3xl text-border">0{i + 1}</span></div>
                <h3 className="mt-5 text-lg font-bold text-primary">{tr(s.title)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tr(s.text)}</p>
              </div>
            </Reveal>
          ); })}
        </div>
      </Section>

      <section className="overflow-hidden border-y border-border bg-background py-8">
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12">
          {[...certifications, ...certifications, ...certifications, ...certifications].map((c, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap text-xl font-extrabold text-primary/70"><img src={brand.mark} alt="" className="h-7" />{c.name}</span>
          ))}
        </div>
      </section>

      <Section kicker={tr({ en: "Global reach", ar: "الانتشار العالمي" })} title={tr({ en: "We deliver to the strongest markets", ar: "نصل بمنتجاتنا إلى أقوى الأسواق العالمية" })}>
        <div className="flex flex-wrap gap-3">
          {markets.map((m) => <span key={m.name.en} className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent">{m.flag} {tr(m.name)}</span>)}
        </div>
        <blockquote className="mt-12 rounded-3xl bg-primary p-8 font-display text-2xl leading-snug text-primary-foreground sm:p-12 sm:text-3xl">“{tr(about.quote)}”</blockquote>
      </Section>
    </>
  );
}
