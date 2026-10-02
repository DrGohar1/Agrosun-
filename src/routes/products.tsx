import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Package, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { banners, products, categories, type Category } from "@/data/site";
import { useLang } from "@/lib/lang";
import { PageBanner, Section } from "@/components/site/Shell";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductInquiry } from "@/components/site/ProductInquiry";

const title = "Agrosun Products — Fresh Grapes, IQF Strawberries, Vegetables";
const description = "Gallery of Agrosun export products: fresh grapes, artichokes, peppers, watermelon; IQF strawberries, peas, broccoli, carrots, okra; pickled peppers and artichokes in brine.";

export const Route = createFileRoute("/products")({
  validateSearch: z.object({ c: z.enum(["all", "fresh", "iqf", "processed"]).optional() }),
  head: () => ({ meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Products,
});

function Products() {
  const { t, tr, lang } = useLang();
  const { c } = Route.useSearch();
  const [cat, setCat] = useState<Category | "all">(c ?? "all");
  const [open, setOpen] = useState<number | null>(null);
  const [inquiry, setInquiry] = useState(false);
  const list = cat === "all" ? products : products.filter((p) => p.category === cat);
  const p = open !== null ? list[open] : null;
  const go = (d: number) => setOpen((i) => (i === null ? null : (i + d + list.length) % list.length));

  return (
    <>
      <PageBanner page="products" image={banners.products.image} kicker={tr({ en: "Export portfolio", ar: "محفظة المنتجات التصديرية" })} title={tr({ en: "Product gallery", ar: "معرض المنتجات" })} />
      <Section>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {[{ id: "all" as const, label: { en: t("all"), ar: t("all") } }, ...categories].map((x) => (
            <button key={x.id} onClick={() => setCat(x.id)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${cat === x.id ? "bg-primary text-primary-foreground shadow-lift" : "bg-muted text-foreground/70 hover:text-primary"}`}>
              {tr(x.label)} <span className="tabular ms-1 opacity-60">{x.id === "all" ? products.length : products.filter((p) => p.category === x.id).length}</span>
            </button>
          ))}
        </div>
        <div key={cat} className="columns-1 gap-4 animate-in fade-in duration-500 sm:columns-2 lg:columns-3">
          {list.map((p, i) => (
            <button key={p.id} onClick={() => setOpen(i)} className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl text-start shadow-lift">
              <img src={p.image} alt={p.name.en} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-110 ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-transparent to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase">{tr(categories.find((c) => c.id === p.category)!.label)}</span>
                <h3 className="mt-2 font-display text-2xl">{tr(p.name)}</h3>
                <p className="mt-1 line-clamp-2 max-h-0 text-sm text-primary-foreground/80 opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">{tr(p.text)}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>
      <Dialog open={!!p} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {p && (
            <div key={p.id} className="grid animate-in fade-in duration-300 md:grid-cols-2">
              <div className="relative">
                <img src={p.image} alt={p.name.en} className="h-64 w-full object-cover md:h-full" />
                <button onClick={() => go(-1)} aria-label="Previous" className="absolute start-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90"><ChevronLeft className="h-5 w-5 rtl:rotate-180" /></button>
                <button onClick={() => go(1)} aria-label="Next" className="absolute end-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/90"><ChevronRight className="h-5 w-5 rtl:rotate-180" /></button>
              </div>
              <div className="p-7">
                <DialogTitle className="font-display text-3xl text-primary">{tr(p.name)}</DialogTitle>
                <p className="mt-3 text-muted-foreground">{tr(p.text)}</p>
                {p.specs && <ul className="mt-4 space-y-2 text-sm">{(p.specs[lang] ?? []).map((s) => <li key={s} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-leaf" />{s}</li>)}</ul>}
                {p.packaging && <div className="mt-4 flex gap-2 rounded-2xl bg-muted p-4 text-sm"><Package className="h-5 w-5 shrink-0 text-accent" /><div><b>{t("packaging")}:</b> {tr(p.packaging)}</div></div>}
                <Button onClick={() => setInquiry(true)} className="mt-6 rounded-full px-6">{t("enquire")}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ProductInquiry product={p ?? null} open={inquiry} onOpenChange={setInquiry} />
    </>
  );
}
