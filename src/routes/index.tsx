import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Snowflake, Sprout, Truck, PackageCheck, Globe2, BadgeCheck, Handshake } from "lucide-react";
import { brand, hero, stats as baseStats, certifications, markets, about, partners as fallbackPartners } from "@/data/site";
import { useLive } from "@/lib/live";
import { useRows } from "@/lib/cms";
import { useLang } from "@/lib/lang";
import { Section, Reveal } from "@/components/site/Shell";
import { ProductWindow } from "@/components/site/ProductWindow";
import { useState } from "react";
import heroReal from "@/assets/hero-real.jpg";
import { Leaf, ShieldCheck, Award, Users, FlaskConical, HardHat, ChevronDown } from "lucide-react";

const title = "Agro Sun — Agrosun Group | Egyptian Fresh & IQF Produce Exporter since 1995";
const description = "Agrosun Group: farming, sorting, IQF freezing and export of Egyptian grapes, strawberries, artichokes and vegetables to the EU, UK and USA since 1995.";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});

const mainCats = [
  { c: "fresh" as const, img: "/images/grapes.jpg", label: { en: "Fresh Produce", ar: "الحاصلات الطازجة", it: "Prodotti freschi", fr: "Produits frais", de: "Frischware" }, sub: { en: "Grapes · Artichokes · Vegetables", ar: "عنب · خرشوف · خضروات", it: "Uva · Carciofi · Verdure", fr: "Raisins · Artichauts · Légumes", de: "Trauben · Artischocken · Gemüse" }, edge: "border-leaf", tint: "from-primary/95 via-primary/60" },
  { c: "iqf" as const, img: "/images/iqf-strawberry-pack.jpg", label: { en: "Processed Agro-Foods", ar: "المنتجات المصنّعة", it: "Agroalimentari trasformati", fr: "Agroalimentaire transformé", de: "Verarbeitete Agrarprodukte" }, sub: { en: "IQF Frozen · Pickled & Brined", ar: "مجمد IQF · مخللات ومحفوظات", it: "Surgelati IQF · Sottaceti", fr: "Surgelés IQF · Saumurés", de: "IQF-Tiefkühl · Eingelegt" }, edge: "border-accent", tint: "from-accent/90 via-accent/55" },
];

const certIcon: Record<string, typeof BadgeCheck> = { "GLOBALG.A.P.": Leaf, BRCGS: Award, "BRC FOOD": Award, SMETA: Users, "ISO 22000": ShieldCheck, HACCP: FlaskConical, "ISO 45001": HardHat };

const icons = [Sprout, Truck, PackageCheck, Snowflake, Globe2];

function Home() {
  const { t, tr, lang } = useLang();
  const { settings: hs, products } = useLive();
  const dbCertifications = useRows("certifications");
  const dbPartners = useRows("partners");
  const localized = (base: string) => hs ? String((hs as unknown as Record<string, unknown>)[`${base}_${lang}`] || (hs as unknown as Record<string, unknown>)[`${base}_en`] || "") : "";
  const heroTitle = localized("hero_title");
  const heroSub = localized("hero_subtitle");
  const custom = Array.isArray(hs?.stats) ? (hs!.stats as { value: string; label_en: string; label_ar: string }[]).filter((x) => x?.value) : [];
  const stats = custom.length ? custom.map((x) => ({ value: x.value, label: { en: x.label_en, ar: x.label_ar || x.label_en } })) : baseStats;
  const [open, setOpen] = useState<number | null>(null);
  const [tree, setTree] = useState<"fresh" | "iqf" | null>(null);
  const [treeList, setTreeList] = useState<typeof products>([]);
  const [treeOpen, setTreeOpen] = useState<number | null>(null);
  const cta = ((hs as unknown as { hero_cta?: Record<string, string> } | null)?.hero_cta) ?? {};
  const ctaLabel = cta[`label_${lang}`] || cta["label_en"];
  const ctaUrl = cta["url"];
  const trending = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 8);
  return (
    <>
      <section className="relative flex min-h-[82svh] items-center justify-center overflow-hidden pb-32 pt-28 text-center text-primary-foreground lg:min-h-[88vh]">
        <img src={(hs?.hero_media_type !== "video" && hs?.hero_media_url) || heroReal} alt="Agrosun farms with centre-pivot irrigation" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover animate-[kenburns_14s_ease-out_forwards]" />
        {hs?.hero_media_type === "video" && hs.hero_media_url && <video src={hs.hero_media_url} poster={heroReal} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto w-full max-w-6xl px-5 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-[2000ms] fill-mode-both">
          <p className="inline-flex rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground backdrop-blur sm:text-xs sm:tracking-[0.2em]">{tr(hero.kicker)}</p>
          <h1 className="mt-6 font-display text-[clamp(2.3rem,5.2vw,4.9rem)] uppercase leading-[1.02] tracking-tight drop-shadow-lg">{heroTitle ? heroTitle : <>
            {tr({ en: "Cultivating quality,", ar: "نزرع الجودة،" })}<br />{tr({ en: "exporting ", ar: "ونصدّر " })}<span className="text-accent">{tr({ en: "excellence.", ar: "التميّز." })}</span></>}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-primary-foreground/90 sm:text-xl">{heroSub || <>{tr(hero.title)} <span className="italic text-leaf">{tr(hero.titleAccent)}</span></>}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ctaUrl && ctaLabel ? <a href={ctaUrl} className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground shadow-lift transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95">{ctaLabel}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" /></a> : null}
            <Link to="/products" className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-accent-foreground shadow-lift transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95">{t("explore")}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180" /></Link>
            <Link to="/contact" className="inline-flex items-center rounded-full border border-primary-foreground/50 bg-primary-foreground/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-primary-foreground/20 active:scale-95">{t("talk")}</Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-md sm:grid-cols-4">
            {stats.map((s) => <div key={s.value} className="px-3 py-4"><div className="tabular text-2xl font-bold text-primary-foreground sm:text-3xl">{s.value}</div><div className="mt-0.5 text-[11px] font-semibold text-primary-foreground/80">{tr(s.label)}</div></div>)}
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-20 sm:-mt-24">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 sm:gap-4 sm:px-5">
          {mainCats.map((c, i) => (
            <button key={c.c} type="button" onClick={() => setTree(tree === c.c ? null : c.c)} aria-expanded={tree === c.c} style={{ animationDelay: `${2200 + i * 150}ms`, clipPath: i === 0 ? "polygon(0 0,100% 0,92% 100%,0 100%)" : "polygon(8% 0,100% 0,100% 100%,0 100%)" }}
              className={`group relative flex h-36 items-end overflow-hidden rounded-2xl bg-card text-start shadow-lift transition duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both active:scale-[0.98] sm:h-56 ${tree === c.c ? "ring-4 ring-gold" : ""}`}>
              <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} to-transparent`} />
              <div className={`relative z-10 p-3 text-primary-foreground sm:p-6 ${i === 1 ? "ps-6 sm:ps-12" : ""}`}>
                <h3 className="font-display text-base uppercase leading-tight drop-shadow sm:text-3xl">{tr(c.label)}</h3>
                <p className="mt-1 hidden text-sm font-semibold opacity-90 sm:block">{tr(c.sub)}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-gold sm:text-sm">{t("explore")} <ChevronDown className={`h-4 w-4 transition ${tree === c.c ? "rotate-180" : ""}`} /></span>
              </div>
            </button>
          ))}
        </div>
        {tree && (
          <div key={tree} className="mx-auto mt-4 max-w-6xl px-3 animate-in fade-in slide-in-from-top-4 duration-500 sm:px-5">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-lift sm:p-6">
              {(tree === "fresh" ? [["fresh", mainCats[0]!.label]] as const : [["iqf", { en: "IQF Frozen", ar: "مجمد IQF", it: "Surgelati IQF", fr: "Surgelés IQF", de: "IQF-Tiefkühl" }], ["processed", { en: "Pickled & Brined", ar: "مخللات ومحفوظات", it: "Sottaceti e salamoia", fr: "Marinés et saumurés", de: "Eingelegt & in Lake" }]] as const).map(([cat, label]) => (
                <div key={cat} className="relative border-s-2 border-leaf ps-4 [&+&]:mt-5">
                  <span className="absolute -start-[7px] top-1 h-3 w-3 rounded-full bg-accent" />
                  <p className="text-xs font-bold uppercase text-accent">{tr(label)}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {products.filter((p) => p.category === cat).map((p, k) => (
                      <button key={p.id} type="button" onClick={() => { setTreeList(products.filter((x) => x.category === cat)); setTreeOpen(k); }} style={{ animationDelay: `${k * 60}ms` }} className="group flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-background p-1.5 text-start transition animate-in fade-in zoom-in-95 fill-mode-both hover:border-accent">
                        <img src={p.image} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                        <span className="min-w-0 truncate text-xs font-bold text-primary sm:text-sm">{tr(p.name)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <Link to="/products" search={{ c: tree === "fresh" ? "fresh" : "iqf" }} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent">{t("readMore")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
            </div>
          </div>
        )}
        <ProductWindow list={treeList} index={treeOpen} onIndex={setTreeOpen} />
      </section>


      <Section className="depth-section" kicker={tr({ en: "Premium export demand", ar: "الطلب التصديري الأعلى", it: "Domanda export premium", fr: "Demande export premium", de: "Premium-Exportnachfrage" })} title={tr({ en: "Most imported export lines", ar: "الأكثر استيرادًا لدى شركائنا", it: "Le linee più importate", fr: "Les lignes les plus importées", de: "Meistimportierte Exportlinien" })}>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
          {trending.map((p, i) => (
            <button key={p.id} onClick={() => setOpen(i)} className="group relative w-64 text-start shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card shadow-lift transition hover:-translate-y-1 sm:w-72">
              <div className="relative h-44 overflow-hidden"><img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute start-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">{i < 3 ? tr({ en: "Most imported", ar: "الأكثر استيرادًا", it: "Più importato", fr: "Plus importé", de: "Meistimportiert" }) : tr({ en: "Top demand", ar: "الأعلى طلبًا", it: "Più richiesto", fr: "Très demandé", de: "Stark gefragt" })}</span></div>
              <div className="p-4"><h3 className="font-bold text-primary">{tr(p.name)}</h3>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span className="tabular">👁 {(p.views ?? 0).toLocaleString()}</span><span className="tabular font-bold text-accent">{(p.tons ?? 0).toLocaleString()} {tr({ en: "t/season", ar: "طن/موسم", it: "t/stagione", fr: "t/saison", de: "t/Saison" })}</span></div></div>
            </button>
          ))}
        </div>
        <ProductWindow list={trending} index={open} onIndex={setOpen} />
      </Section>

      <Section className="depth-section bg-secondary" kicker={tr({ en: "Quality journey", ar: "رحلة الجودة" })} title={tr({ en: "From the farm to the world", ar: "من المزرعة إلى العالم" })}>
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

      <Section className="depth-section" kicker={tr({ en: "Global reach", ar: "الانتشار العالمي" })} title={tr({ en: "We deliver to the strongest markets", ar: "نصل بمنتجاتنا إلى أقوى الأسواق العالمية" })}>
        <div className="flex flex-wrap gap-3">
          {markets.map((m) => <span key={m.name.en} className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-primary transition hover:border-accent hover:text-accent">{m.flag} {tr(m.name)}</span>)}
        </div>
        <blockquote className="mt-12 rounded-3xl bg-primary p-8 font-display text-2xl leading-snug text-primary-foreground sm:p-12 sm:text-3xl">“{tr(about.quote)}”</blockquote>
      </Section>
      <section className="depth-section border-t border-border bg-secondary py-10">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><p className="text-xs font-bold uppercase text-accent">{tr({ en: "Compliance & trust", ar: "الامتثال والثقة", it: "Conformità e fiducia", fr: "Conformité et confiance", de: "Compliance & Vertrauen" })}</p><h2 className="mt-2 font-display text-2xl text-primary">{tr({ en: "Certified for demanding global supply chains", ar: "معتمدون لسلاسل الإمداد العالمية الأكثر تطلبًا", it: "Certificati per le filiere globali più esigenti", fr: "Certifiés pour les chaînes mondiales exigeantes", de: "Zertifiziert für anspruchsvolle globale Lieferketten" })}</h2></div>
            <Link to="/certifications" className="inline-flex items-center gap-2 text-sm font-bold text-accent">{t("readMore")}<ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(dbCertifications?.length ? dbCertifications : certifications).filter((certificate) => ["GLOBALG.A.P.", "BRCGS", "BRC FOOD", "SMETA", "ISO 22000", "HACCP", "ISO 45001"].includes(certificate.name)).map((certificate, k) => { const I = certIcon[certificate.name] ?? BadgeCheck; return <div key={certificate.name} style={{ animationDelay: `${k * 80}ms` }} className="group flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-card/40 px-3 py-5 text-center backdrop-blur-md transition animate-in fade-in zoom-in-95 fill-mode-both hover:-translate-y-1 hover:border-gold"><span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-gold-foreground">{("logo_url" in certificate && certificate.logo_url) ? <img src={certificate.logo_url} alt="" className="h-8 w-8 object-contain" /> : <I className="h-6 w-6" />}</span><b className="text-xs tracking-wide text-primary sm:text-sm">{certificate.name === "BRC FOOD" ? "BRCGS" : certificate.name}</b></div>; })}
          </div>
          <p className="mt-6 text-xs font-bold uppercase text-accent">{tr({ en: "Export partners", ar: "شركاء التصدير", it: "Partner export", fr: "Partenaires export", de: "Exportpartner" })}</p>
          <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none]">
            {(dbPartners?.length ? dbPartners : fallbackPartners).map((partner) => <div key={partner.name} className="flex min-w-52 snap-start items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3 backdrop-blur-md"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">{("logo_url" in partner && partner.logo_url) || ("logo" in partner && partner.logo) ? <img src={("logo_url" in partner ? partner.logo_url : partner.logo) ?? brand.mark} alt="" className="h-7 w-7 object-contain" /> : <Handshake className="h-5 w-5" />}</span><div><span className="block text-[10px] font-bold uppercase text-muted-foreground">{tr({ en: "Global export partner", ar: "شريك تصدير عالمي", it: "Partner export globale", fr: "Partenaire export mondial", de: "Globaler Exportpartner" })}</span><b className="text-sm text-primary">{partner.name}</b></div></div>)}
          </div>
        </div>
      </section>
    </>
  );
}
