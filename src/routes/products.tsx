import { useState, type SyntheticEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Package, CalendarDays, Snowflake, Sprout, Factory, Droplets, Eye } from "lucide-react";
import { banners, catalogGroups, categories, brand, type Category } from "@/data/site";
import { useLive } from "@/lib/live";
import { useLang } from "@/lib/lang";
import { PageBanner, Section } from "@/components/site/Shell";
import { ProductWindow } from "@/components/site/ProductWindow";

const title = "Agrosun Products — Fresh Grapes, IQF Strawberries, Vegetables";
const description = "Gallery of Agrosun export products: fresh grapes, artichokes, peppers, watermelon; IQF strawberries, peas, broccoli, carrots, okra; pickled peppers and artichokes in brine.";

export const Route = createFileRoute("/products")({
  validateSearch: z.object({ c: z.enum(["fresh", "iqf", "processed"]).optional() }),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Products,
});

function Products() {
  const { t, tr, lang } = useLang();
  const { products } = useLive();
  const { c } = Route.useSearch();
  const [cat, setCat] = useState<Category>(c ?? "fresh");
  const [open, setOpen] = useState<number | null>(null);
  const main = cat === "fresh" ? "fresh" : "processed";
  const list = products.filter((p) => p.category === cat);
  const count = (id: Category) => products.filter((p) => p.category === id).length;
  const fallback = (e: SyntheticEvent<HTMLImageElement>) => { const image = e.currentTarget; if (image.dataset['fallback']) return; image.dataset['fallback'] = "1"; image.src = brand.mark; image.classList.add("object-contain", "p-8"); };
  const monthNames = new Intl.DateTimeFormat(lang, { month: "short" });
  const calendar = (months?: number[]) => months?.length ? months.map((m) => monthNames.format(new Date(2026, m - 1, 1))).join(" · ") : t("yearRound");
  const labelFor = (id: Category) => tr(categories.find((item) => item.id === id)?.label ?? catalogGroups.fresh);

  const node = (active: boolean) => `group relative flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-start shadow-lift transition duration-500 hover:-translate-y-1 active:scale-[0.98] ${active ? "border-accent bg-primary text-primary-foreground" : "border-border bg-card text-primary hover:border-accent"}`;
  const branch = (active: boolean) => `mx-auto w-0.5 origin-top transition-all duration-700 ${active ? "h-8 scale-y-100 bg-accent" : "h-8 scale-y-50 bg-border"}`;

  return (
    <>
      <PageBanner page="products" image={banners.products.image} kicker={tr({ en: "Export portfolio", ar: "محفظة المنتجات التصديرية", it: "Portafoglio export", fr: "Portefeuille export", de: "Exportportfolio" })} title={tr({ en: "Product gallery", ar: "معرض المنتجات", it: "Galleria prodotti", fr: "Galerie produits", de: "Produktgalerie" })} />
      <Section className="depth-section">
        {/* Motion tree: Agrosun → Fresh / Processed → IQF / Pickled */}
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="mx-auto w-fit rounded-full bg-primary-deep px-6 py-2 text-sm font-bold uppercase text-primary-foreground shadow-lift animate-in fade-in zoom-in-90 duration-700">Agrosun · {products.length} {t("products").toLowerCase()}</div>
          <div className="relative mx-auto h-8 w-0.5 bg-accent" />
          <div className="relative mx-auto h-0.5 w-1/2 bg-accent" />
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {(["fresh", "processed"] as const).map((id, i) => (
              <div key={id} className="animate-in fade-in slide-in-from-top-4 fill-mode-both duration-700" style={{ animationDelay: `${200 + i * 150}ms` }}>
                <div className={branch(main === id)} />
                <button onClick={() => setCat(id === "fresh" ? "fresh" : main === "processed" ? cat : "iqf")} className={node(main === id)}>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${main === id ? "bg-accent text-accent-foreground" : "bg-secondary text-primary"}`}>{id === "fresh" ? <Sprout /> : <Factory />}</span>
                  <span className="min-w-0"><span className="block font-display text-base leading-tight sm:text-xl">{tr(catalogGroups[id])}</span><span className="tabular text-xs opacity-75">{id === "fresh" ? count("fresh") : count("iqf") + count("processed")} {t("products").toLowerCase()}</span></span>
                </button>
                {id === "processed" && (
                  <div className={`grid transition-all duration-700 ${main === "processed" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-40"}`}>
                    <div className="overflow-hidden">
                      <div className={branch(main === "processed")} />
                      <div className="mx-auto h-0.5 w-1/2 bg-accent" />
                      <div className="grid grid-cols-2 gap-2">
                        {(["iqf", "processed"] as const).map((sub) => (
                          <div key={sub}><div className="mx-auto h-4 w-0.5 bg-accent" />
                            <button onClick={() => setCat(sub)} className={`flex w-full flex-col items-center gap-1 rounded-xl border-2 p-3 text-center text-xs font-bold transition hover:-translate-y-0.5 sm:text-sm ${cat === sub ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-primary hover:border-accent"}`}>
                              {sub === "iqf" ? <Snowflake className="h-5 w-5" /> : <Droplets className="h-5 w-5" />}{labelFor(sub)}<span className="tabular opacity-70">{count(sub)}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-5">
          <div className="min-w-0"><p className="text-xs font-bold uppercase text-accent">{tr(catalogGroups[main])}</p><h2 className="mt-1 truncate font-display text-3xl text-primary">{labelFor(cat)}</h2></div><span className="tabular text-sm font-semibold text-muted-foreground">{list.length}</span>
        </div>
        <div key={cat} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <button key={p.id} onClick={() => setOpen(i)} style={{ animationDelay: `${i * 60}ms` }} className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-card text-start shadow-lift transition duration-500 animate-in fade-in slide-in-from-bottom-6 fill-mode-both hover:-translate-y-1.5 hover:border-accent">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted"><img src={p.image || brand.mark} onError={fallback} alt={tr(p.name)} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /><span className="absolute start-3 top-3 rounded-full bg-primary-deep/85 px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground backdrop-blur">{labelFor(p.category)}</span>{p.inSeason && <span className="absolute end-3 top-3 rounded-full bg-leaf px-3 py-1 text-[10px] font-bold text-primary-deep">{t("inSeason")}</span>}</div>
              <div className="flex flex-1 flex-col p-5"><h3 className="font-display text-2xl text-primary">{tr(p.name)}</h3><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{tr(p.text)}</p>
                <div className="mt-auto grid gap-2 border-t border-border pt-4 text-xs"><span className="flex min-w-0 items-center gap-2"><Package className="h-4 w-4 shrink-0 text-accent" /><span className="truncate">{p.packaging ? tr(p.packaging) : t("packaging")}</span></span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-leaf" />{calendar(p.seasonMonths)}</span>{!!p.views && <span className="flex items-center gap-2 tabular"><Eye className="h-4 w-4 text-accent" />{p.views.toLocaleString()}</span>}</div></div>
            </button>
          ))}
        </div>
      </Section>
      <ProductWindow list={list} index={open} onIndex={setOpen} />
    </>
  );
}
