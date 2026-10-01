import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { L } from "@/data/site";

export type Lang = "en" | "ar";

const ui = {
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "من نحن" },
  products: { en: "Products", ar: "المنتجات" },
  certs: { en: "Certificates", ar: "شهاداتنا" },
  partners: { en: "Partners", ar: "شركاؤنا" },
  contact: { en: "Contact", ar: "تواصل" },
  export: { en: "Export", ar: "التصدير" },
  explore: { en: "Explore products", ar: "استكشف المنتجات" },
  talk: { en: "Talk to export team", ar: "تواصل مع فريق التصدير" },
  loading: { en: "Fresh from Egypt…", ar: "طازج من مصر…" },
  all: { en: "All", ar: "الكل" },
  packaging: { en: "Packaging", ar: "التعبئة" },
  enquire: { en: "Enquire about this product", ar: "استفسر عن هذا المنتج" },
  readMore: { en: "Learn more", ar: "اعرف المزيد" },
} satisfies Record<string, L>;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof ui) => string; tr: (v: L) => string };
const C = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => { const s = localStorage.getItem("lang"); if (s === "ar" || s === "en") setLang(s); }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return <C.Provider value={{ lang, setLang, t: (k) => ui[k][lang], tr: (v) => v[lang] }}>{children}</C.Provider>;
}

export function useLang() {
  const c = useContext(C);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
