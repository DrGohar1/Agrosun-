import { createFileRoute, Link } from "@tanstack/react-router";
import { Ship, Plane, Truck, Package, Thermometer, FileCheck } from "lucide-react";
import { banners } from "@/data/site";
import { useLang } from "@/lib/lang";
import { PageBanner, Section, Reveal } from "@/components/site/Shell";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export Routes, Packing & Shipping — Agrosun Group" },
      { name: "description", content: "Agrosun export routes from Egypt to Europe, the Gulf and Asia, with packing formats, cold chain and shipping documents." },
      { property: "og:title", content: "Export Routes, Packing & Shipping — Agrosun Group" },
      { property: "og:description", content: "Sea, air and road export from Egypt with full cold chain and export documentation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExportPage,
});

const routes = [
  { icon: Ship, region: { en: "Europe", ar: "أوروبا" }, via: { en: "Reefer containers via Alexandria & Damietta — 7–12 days", ar: "حاويات مبردة عبر الإسكندرية ودمياط — 7 إلى 12 يوم" } },
  { icon: Truck, region: { en: "Gulf & Middle East", ar: "الخليج والشرق الأوسط" }, via: { en: "Refrigerated trucks & Red Sea ports — 3–7 days", ar: "شاحنات مبردة وموانئ البحر الأحمر — 3 إلى 7 أيام" } },
  { icon: Plane, region: { en: "Asia & express orders", ar: "آسيا والطلبات العاجلة" }, via: { en: "Air freight from Cairo for fresh, time-sensitive lots — 1–3 days", ar: "شحن جوي من القاهرة للشحنات الطازجة العاجلة — 1 إلى 3 أيام" } },
];

const packing = [
  { icon: Package, t: { en: "Packing formats", ar: "أشكال التعبئة" }, d: { en: "Cartons, punnets, bulk bins and retail bags — private label available.", ar: "كراتين، علب صغيرة، صناديق كبيرة وأكياس تجزئة — مع إمكانية العلامة الخاصة." } },
  { icon: Thermometer, t: { en: "Cold chain", ar: "سلسلة التبريد" }, d: { en: "Pre-cooling after harvest and −18°C storage for IQF lines until loading.", ar: "تبريد مبدئي بعد الحصاد وتخزين على −18° لخطوط التجميد حتى التحميل." } },
  { icon: FileCheck, t: { en: "Shipping documents", ar: "مستندات الشحن" }, d: { en: "Phytosanitary certificate, certificate of origin, packing list and invoice.", ar: "شهادة صحة نباتية، شهادة منشأ، قائمة تعبئة وفاتورة." } },
];

function ExportPage() {
  const { tr, t } = useLang();
  return (
    <>
      <PageBanner image={banners.products.image} kicker={tr({ en: "Logistics", ar: "اللوجستيات" })} title={tr({ en: "Export routes, packing & shipping", ar: "مسارات التصدير والتعبئة والشحن" })} />
      <Section kicker={tr({ en: "Where we ship", ar: "إلى أين نشحن" })} title={tr({ en: "Export routes", ar: "مسارات التصدير" })}>
        <div className="grid gap-5 md:grid-cols-3">
          {routes.map((r, i) => (
            <Reveal key={r.region.en} delay={i * 120}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-lift transition hover:-translate-y-1">
                <r.icon className="h-9 w-9 text-accent" />
                <h3 className="mt-4 font-display text-2xl text-primary">{tr(r.region)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tr(r.via)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="bg-secondary/50" kicker={tr({ en: "How it arrives", ar: "كيف تصل الشحنة" })} title={tr({ en: "Packing & shipping details", ar: "تفاصيل التعبئة والشحن" })}>
        <div className="grid gap-5 md:grid-cols-3">
          {packing.map((p, i) => (
            <Reveal key={p.t.en} delay={i * 120}>
              <div className="h-full rounded-2xl bg-background p-6">
                <p.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-lg font-bold text-primary">{tr(p.t)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tr(p.d)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link to="/contact" className="mt-10 inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-lift hover:brightness-110">{t("talk")}</Link>
      </Section>
    </>
  );
}
