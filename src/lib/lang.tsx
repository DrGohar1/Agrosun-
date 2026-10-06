import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { L } from "@/data/site";
import { phrases } from "./phrases";

export type Lang = "en" | "ar" | "it" | "fr" | "de";
export const languages: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇪🇬" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

type Row = Record<Lang, string>;
const ui = {
  home: { en: "Home", ar: "الرئيسية", it: "Home", fr: "Accueil", de: "Start" },
  about: { en: "About", ar: "من نحن", it: "Chi siamo", fr: "À propos", de: "Über uns" },
  products: { en: "Products", ar: "المنتجات", it: "Prodotti", fr: "Produits", de: "Produkte" },
  certs: { en: "Certificates", ar: "شهاداتنا", it: "Certificazioni", fr: "Certificats", de: "Zertifikate" },
  partners: { en: "Partners", ar: "شركاؤنا", it: "Partner", fr: "Partenaires", de: "Partner" },
  contact: { en: "Contact", ar: "تواصل", it: "Contatti", fr: "Contact", de: "Kontakt" },
  export: { en: "Export", ar: "التصدير", it: "Export", fr: "Export", de: "Export" },
  explore: { en: "Explore products", ar: "استكشف المنتجات", it: "Scopri i prodotti", fr: "Découvrir les produits", de: "Produkte entdecken" },
  talk: { en: "Talk to export team", ar: "تواصل مع فريق التصدير", it: "Parla con l'export", fr: "Contacter l'équipe export", de: "Export-Team kontaktieren" },
  loading: { en: "Fresh from Egypt…", ar: "طازج من مصر…", it: "Fresco dall'Egitto…", fr: "Frais d'Égypte…", de: "Frisch aus Ägypten…" },
  all: { en: "All", ar: "الكل", it: "Tutti", fr: "Tous", de: "Alle" },
  packaging: { en: "Packaging", ar: "التعبئة", it: "Imballaggio", fr: "Emballage", de: "Verpackung" },
  harvestCalendar: { en: "Harvest calendar", ar: "موسم الحصاد", it: "Calendario di raccolta", fr: "Calendrier de récolte", de: "Erntekalender" },
  yearRound: { en: "Year-round supply", ar: "توريد طوال العام", it: "Fornitura tutto l'anno", fr: "Approvisionnement toute l'année", de: "Ganzjährige Lieferung" },
  inSeason: { en: "In season", ar: "في الموسم", it: "In stagione", fr: "En saison", de: "In Saison" },
  exportReady: { en: "Export-ready", ar: "جاهز للتصدير", it: "Pronto per l'export", fr: "Prêt à l'export", de: "Exportbereit" },
  enquire: { en: "Enquire about this product", ar: "استفسر عن هذا المنتج", it: "Richiedi informazioni", fr: "Demander un devis", de: "Anfrage senden" },
  readMore: { en: "Learn more", ar: "اعرف المزيد", it: "Scopri di più", fr: "En savoir plus", de: "Mehr erfahren" },
  team: { en: "Leadership & Export Team", ar: "القيادة وفريق التصدير", it: "Direzione e team export", fr: "Direction et équipe export", de: "Führung & Export-Team" },
  teamKicker: { en: "People behind every shipment", ar: "الفريق وراء كل شحنة", it: "Le persone dietro ogni spedizione", fr: "L'équipe derrière chaque expédition", de: "Die Menschen hinter jeder Lieferung" },
  contactPerson: { en: "Contact", ar: "تواصل", it: "Contatta", fr: "Contacter", de: "Kontakt" },
  followUs: { en: "Follow us", ar: "تابعنا", it: "Seguici", fr: "Suivez-nous", de: "Folgen Sie uns" },
  previous: { en: "Previous", ar: "السابق", it: "Precedente", fr: "Précédent", de: "Zurück" },
  next: { en: "Next", ar: "التالي", it: "Successivo", fr: "Suivant", de: "Weiter" },
  sendAnother: { en: "Send another", ar: "إرسال رسالة أخرى", it: "Invia un altro", fr: "Envoyer un autre", de: "Weitere senden" },
  sending: { en: "Sending…", ar: "جارٍ الإرسال…", it: "Invio…", fr: "Envoi…", de: "Wird gesendet…" },
  sendMessage: { en: "Send message", ar: "إرسال", it: "Invia messaggio", fr: "Envoyer", de: "Nachricht senden" },
  fullName: { en: "Full name *", ar: "الاسم بالكامل *", it: "Nome completo *", fr: "Nom complet *", de: "Vollständiger Name *" },
  company: { en: "Company", ar: "الشركة", it: "Azienda", fr: "Entreprise", de: "Unternehmen" },
  email: { en: "Email *", ar: "البريد الإلكتروني *", it: "Email *", fr: "E-mail *", de: "E-Mail *" },
  phone: { en: "Phone / WhatsApp", ar: "الهاتف / واتساب", it: "Telefono / WhatsApp", fr: "Téléphone / WhatsApp", de: "Telefon / WhatsApp" },
  country: { en: "Country", ar: "الدولة", it: "Paese", fr: "Pays", de: "Land" },
  enquiryReceived: { en: "Enquiry received", ar: "تم استلام استفسارك", it: "Richiesta ricevuta", fr: "Demande reçue", de: "Anfrage erhalten" },
  replySoon: { en: "Our export team will contact you shortly.", ar: "سيتواصل معك فريق التصدير في أقرب وقت.", it: "Il nostro team export ti contatterà a breve.", fr: "Notre équipe export vous contactera rapidement.", de: "Unser Export-Team meldet sich in Kürze." },
} satisfies Record<string, Row>;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof ui) => string; tr: (v: L) => string; rtl: boolean };
const C = createContext<Ctx | null>(null);

/** Content text: explicit translation → built-in phrase dictionary → English. */
function translate(v: L, lang: Lang) {
  if (lang === "en" || lang === "ar") return v[lang] || v.en;
  return v[lang] || phrases[lang]?.[v.en] || phrases[lang]?.[v.en.trim()] || v.en;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem("lang") as Lang | null;
    if (s && languages.some((l) => l.code === s)) { setLang(s); return; }
    // First visit: follow the buyer's browser language when we support it.
    const b = navigator.language.slice(0, 2) as Lang;
    if (languages.some((l) => l.code === b)) setLang(b);
  }, []);
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return <C.Provider value={{ lang, setLang, rtl: lang === "ar", t: (k) => ui[k][lang], tr: (v) => translate(v, lang) }}>{children}</C.Provider>;
}

export function useLang() {
  const c = useContext(C);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}
