import { useBanner } from "@/lib/cms";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home, Info, Apple, BadgeCheck, Handshake, Mail, Languages, Facebook, Instagram, Linkedin, MapPin, Ship, MessageCircle } from "lucide-react";
import { brand, banners, contact } from "@/data/site";
import { useLang, languages } from "@/lib/lang";
import { useLive } from "@/lib/live";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", key: "home", icon: Home },
  { to: "/about", key: "about", icon: Info },
  { to: "/products", key: "products", icon: Apple },
  { to: "/export", key: "export", icon: Ship },
  { to: "/certifications", key: "certs", icon: BadgeCheck },
  { to: "/partners", key: "partners", icon: Handshake },
  { to: "/contact", key: "contact", icon: Mail },
] as const;

type Social = { facebook_url: string; instagram_url: string; linkedin_url: string; maps_url: string; whatsapp?: string };
function useSocial() {
  const s: Social | null = useLive().settings;
  return {
    facebook: s?.facebook_url || contact.social.facebook,
    instagram: s?.instagram_url || contact.social.instagram,
    linkedin: s?.linkedin_url || contact.social.linkedin,
    map: s?.maps_url || contact.map,
    whatsapp: s?.whatsapp || "",
  };
}

export function Logo({ className = "h-11" }: { className?: string }) {
  return <img src={brand.logo} alt="Agro Sun for Agricultural Industry" className={`${className} w-auto object-contain`} />;
}

export function Loader() {
  const { t } = useLang();
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const a = setTimeout(() => setHide(true), 1900);
    const b = setTimeout(() => setGone(true), 2600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (gone) return null;
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-primary-deep transition-opacity duration-700 ${hide ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <img src={banners.home.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 animate-[kenburns_3s_ease-out_forwards]" />
      <div className="absolute inset-0 bg-hero" />
      <div className="relative flex flex-col items-center">
        <div className="rounded-3xl bg-background p-6 shadow-lift animate-[logopop_1s_cubic-bezier(.2,.9,.3,1.3)_both]">
          <img src={brand.logo} alt="Agro Sun" className="h-28 w-auto sm:h-36" />
        </div>
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-primary-foreground/15">
          <div className="h-full bg-accent animate-[loadbar_1.8s_ease-in-out_forwards]" />
        </div>
        <p className="mt-4 text-sm tracking-[0.3em] text-primary-foreground/80 uppercase">{t("loading")}</p>
      </div>
    </div>
  );
}

export function TopBar() {
  const { t, lang, setLang } = useLang();
  const social = useSocial();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 30); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border/60 bg-background/95 px-3 py-2 shadow-lift backdrop-blur sm:px-4 lg:flex lg:justify-between">
          <Link to="/"><Logo className="h-10 sm:h-12" /></Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} activeProps={{ className: "text-accent after:scale-x-100" }}
                className="relative px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:text-accent after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:scale-x-0 after:bg-accent after:transition-transform">
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-0.5">
              <a href={social.facebook || "#"} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-accent"><Facebook className="h-4 w-4" /></a>
              <a href={social.instagram || "#"} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-accent"><Instagram className="h-4 w-4" /></a>
              <a href={social.linkedin || "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-accent"><Linkedin className="h-4 w-4" /></a>
              <a href={social.map} target="_blank" rel="noreferrer" aria-label="Map" className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-accent"><MapPin className="h-4 w-4" /></a>
              {social.whatsapp && <a href={`https://wa.me/${social.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hidden h-8 w-8 place-items-center text-muted-foreground hover:text-accent sm:grid"><MessageCircle className="h-4 w-4" /></a>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-md px-2 sm:px-3" aria-label="Language">
                  <span className="text-base leading-none">{languages.find((l) => l.code === lang)?.flag}</span><span className="hidden uppercase sm:inline">{lang}</span><Languages className="hidden h-4 w-4 opacity-60 sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {languages.map((l) => <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} className={`gap-3 ${l.code === lang ? "font-bold text-accent" : ""}`}><span className="text-lg leading-none">{l.flag}</span>{l.label}</DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/contact" className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-lift transition hover:brightness-110 sm:inline-flex">{t("talk")}</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useLang();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 lg:hidden pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:pb-4">
       <div className="mx-auto grid max-w-xl grid-cols-7 items-stretch gap-0.5 rounded-2xl border border-primary-foreground/10 bg-primary-deep/95 p-1.5 shadow-lift backdrop-blur">
        {nav.map(({ to, key, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            activeProps={{ className: "bg-accent text-accent-foreground" }}
            inactiveProps={{ className: "text-primary-foreground/70 hover:text-primary-foreground" }}
             className="flex min-w-0 flex-col items-center gap-0.5 overflow-hidden rounded-xl px-0.5 py-2 text-[8px] font-semibold transition sm:text-xs">
            <Icon className="h-5 w-5" />
             <span className="w-full truncate text-center">{t(key)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function DevCredit() {
  const { tr } = useLang();
  const dev = useLive().settings;
  if (!dev?.developer_name) return null;
  const inner = <>{dev.developer_avatar_url && <img src={dev.developer_avatar_url} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-primary-foreground/30" />}<span>{tr({ en: "Developed by", ar: "تطوير" })} <b className="text-primary-foreground/80">{dev.developer_name}</b></span></>;
  return dev.developer_url ? <a href={dev.developer_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-leaf">{inner}</a> : <span className="flex items-center gap-2">{inner}</span>;
}

export function Footer() {
  const { tr, t, lang } = useLang();
  const st = useLive().settings;
  const local = (base: string) => st ? String((st as unknown as Record<string, unknown>)[`${base}_${lang}`] || (st as unknown as Record<string, unknown>)[`${base}_en`] || "") : "";
  const slogan = local("slogan");
  const offices = st?.hq_address ? [{ k: { en: "Headquarters", ar: "المقر الرئيسي", it: "Sede centrale", fr: "Siège", de: "Hauptsitz" }, v: lang === "ar" ? st.hq_address : local("hq_address") || st.hq_address }, { k: { en: "Packhouse — Badr", ar: "محطة التعبئة — بدر", it: "Magazzino — Badr", fr: "Station — Badr", de: "Packhaus — Badr" }, v: lang === "ar" ? st.packhouse_address : local("packhouse_address") || st.packhouse_address }, { k: { en: "IQF complex — Sadat City", ar: "مجمع IQF — السادات", it: "Impianto IQF — Sadat", fr: "Usine IQF — Sadate", de: "IQF-Werk — Sadat" }, v: lang === "ar" ? st.iqf_address : local("iqf_address") || st.iqf_address }].filter((o) => o.v) : null;
  const email = st?.email || contact.email;
  return (
    <footer className="bg-primary-deep pb-32 pt-16 text-primary-foreground lg:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-2xl bg-background p-3"><Logo className="h-16" /></div>
          <p className="mt-4 text-sm text-primary-foreground/70">{slogan || tr({ en: "Your strategic partner for sustainable growth.", ar: "شريككم الاستراتيجي للنمو المستدام." })}</p>
        </div>
        <div className="space-y-3 text-sm">
          {offices ? offices.map((o) => <div key={o.k.en}><div className="font-bold text-leaf">{tr(o.k)}</div><div className="text-primary-foreground/70">{o.v}</div></div>) : contact.offices.map((o) => <div key={o.label.en}><div className="font-bold text-leaf">{tr(o.label)}</div><div className="text-primary-foreground/70">{tr(o.value)}</div></div>)}
          {st?.phone && <a href={`tel:${st.phone}`} className="block font-semibold hover:text-leaf">{st.phone}</a>}
        </div>
        <div className="space-y-3 text-sm">
          <a href={`mailto:${email}`} className="block font-semibold hover:text-leaf">{email}</a>
          <div className="text-primary-foreground/70">{contact.website}</div>
          <div className="flex flex-wrap gap-3 pt-2">{nav.map((n) => <Link key={n.to} to={n.to} className="text-primary-foreground/70 hover:text-leaf">{t(n.key)}</Link>)}</div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-primary-foreground/10 px-5 pt-6 text-xs text-primary-foreground/50"><span>© {new Date().getFullYear()} {brand.legal}. {tr({ en: "All rights reserved.", ar: "جميع الحقوق محفوظة." })}</span><DevCredit /></div>
    </footer>
  );
}

export function PageBanner({ image, kicker, title, children, page }: { image: string; kicker: string; title: string; children?: ReactNode; page?: string }) {
  const { lang } = useLang(); const b = useBanner(page ?? "");
  if (b) { const row = b as unknown as Record<string, unknown>; image = b.image_url || image; title = String(row[`title_${lang}`] || b.title_en || title); kicker = String(row[`subtitle_${lang}`] || b.subtitle_en || kicker); }
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden pb-14 pt-32 text-primary-foreground">
       {b?.media_type === "video" ? <video src={image} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" /> : <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover animate-[kenburns_12s_ease-out_forwards]" />}
      <div className="absolute inset-0 bg-hero" />
      <img src={brand.mark} alt="" aria-hidden className="pointer-events-none absolute -bottom-10 end-4 h-64 opacity-10" />
      <div className="relative mx-auto w-full max-w-7xl px-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-leaf">{kicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function Section({ kicker, title, children, className = "" }: { kicker?: string; title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-5">
        {(kicker || title) && (
          <div className="mb-10 flex items-end gap-4">
            <img src={brand.mark} alt="" aria-hidden className="h-12 w-auto" />
            <div>
              {kicker && <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{kicker}</p>}
              {title && <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">{title}</h2>}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** Fade elements in as they scroll into view. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, [el]);
  return <div ref={setEl} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}>{children}</div>;
}
