// All editable site content lives here (texts from the company PDFs, images, banners).
// Change a photo by swapping its import; change a text by editing the en/ar strings.
const logo = { url: "/images/agrosun-logo.png" };
const mark = { url: "/images/agrosun-mark.png" };
const field = { url: "/images/pdf-field.jpg" };
const pdfGrapes = { url: "/images/pdf-grapes.jpg" };
const sorting = { url: "/images/pdf-sorting.jpg" };
const grapes = { url: "/images/grapes.jpg" };
const artichokes = { url: "/images/artichokes.jpg" };
const facility = { url: "/images/facility.jpg" };
const heroFields = { url: "/images/hero-fields.jpg" };
const greenBeans = { url: "/images/green-beans.jpg" };
const springOnions = { url: "/images/spring-onions.jpg" };
const peas = { url: "/images/peas.jpg" };
const cauliflower = { url: "/images/cauliflower.jpg" };
const strawberries = { url: "/images/strawberries.jpg" };
const broccoli = { url: "/images/broccoli.jpg" };
const okra = { url: "/images/okra.jpg" };
const pickled = { url: "/images/pickled-peppers.jpg" };
const carrots = { url: "/images/carrots.jpg" };
const peppers = { url: "/images/bell-peppers.jpg" };
const watermelon = { url: "/images/watermelon.jpg" };

export type L = { en: string; ar: string; it?: string; fr?: string; de?: string };

export const brand = {
  name: "AGRO SUN",
  legal: "Agrosun Group",
  tagline: { en: "For Agricultural Industry", ar: "للصناعات الزراعية" },
  logo: logo.url,
  mark: mark.url,
  since: 1995,
};

/** Page banners — swap any image or headline here. */
export const banners = {
  home: { image: field.url, fallback: heroFields.url },
  about: { image: pdfGrapes.url },
  products: { image: grapes.url },
  certifications: { image: sorting.url },
  partners: { image: facility.url },
  contact: { image: field.url },
};

export const hero = {
  kicker: { en: "Egyptian growers & exporters · since 1995", ar: "مزارعون ومصدّرون مصريون · منذ 1995" },
  title: { en: "From Egyptian soil", ar: "من أرض مصر" },
  titleAccent: { en: "to the world's tables.", ar: "إلى موائد العالم." },
  sub: {
    en: "Agrosun Group — your strategic partner for sustainable growth. Three decades of farming, packing, IQF freezing and export to the EU, UK and USA.",
    ar: "مجموعة أجروصن — شريككم الاستراتيجي للنمو المستدام. ثلاثة عقود من الزراعة والفرز والتجميد السريع والتصدير إلى أوروبا والمملكة المتحدة والولايات المتحدة.",
  },
};

export const stats = [
  { value: "30+", label: { en: "Years of experience", ar: "عامًا من الخبرة" } },
  { value: "2", label: { en: "Owned facilities", ar: "منشأة مملوكة" } },
  { value: "7", label: { en: "International certifications", ar: "اعتمادات دولية" } },
  { value: "-18°C", label: { en: "Unbroken cold chain", ar: "سلسلة تبريد متصلة" } },
];

export const about = {
  quote: {
    en: "We are the agro-industrial bridge connecting Egyptian soil with the European and American markets.",
    ar: "نحن الجسر الزراعي والصناعي الذي يربط التربة المصرية بالسوق الأوروبية والأمريكية.",
  },
  pillars: [
    { title: { en: "History", ar: "التاريخ" }, text: { en: "Founded in 1995, giving us deep understanding of global market requirements.", ar: "تأسست المجموعة عام 1995، مما يمنحنا خبرة عميقة في فهم متطلبات الأسواق العالمية." } },
    { title: { en: "Integrated model", ar: "النموذج المتكامل" }, text: { en: "A Farm-to-Table system: we control farming, sorting, IQF processing and export.", ar: "منظومة من المزرعة إلى المائدة: نتحكم في الزراعة والفرز والتصنيع (IQF) والتصدير." } },
    { title: { en: "Infrastructure", ar: "البنية التحتية" }, text: { en: "A sorting & packing station in Badr Center and an advanced freezing & processing complex in Sadat City.", ar: "محطة فرز وتعبئة في مركز بدر، ومجمع تجميد وتصنيع متطور في مدينة السادات." } },
  ],
  structure: [
    { name: "Agrosun Fresh Produce", ar: "أجروصن لتصدير الحاصلات الطازجة", items: { en: ["Farming", "Sorting & packing (Badr Center)", "Fresh export"], ar: ["الزراعة", "الفرز والتعبئة (مركز بدر)", "التصدير الطازج"] } },
    { name: "Agrosun Agro-Processing", ar: "أجروصن للتصنيع الزراعي", items: { en: ["Food processing", "IQF freezing (Sadat City)"], ar: ["التصنيع الغذائي", "التجميد السريع (مدينة السادات)"] } },
  ],
  chain: [
    { title: { en: "Farming", ar: "الزراعة" }, text: { en: "Centre-pivot irrigation & greenhouses, to GLOBALG.A.P. standards", ar: "الري المحوري والبيوت المحمية وفق معايير GlobalGAP" } },
    { title: { en: "Harvest", ar: "الحصاد" }, text: { en: "Refrigerated transport from field to station", ar: "نقل مبرد من الحقل إلى المحطة" } },
    { title: { en: "Processing", ar: "المعالجة" }, text: { en: "Sorting in Badr · IQF freezing in Sadat", ar: "فرز في بدر · تجميد سريع في السادات" } },
    { title: { en: "Logistics", ar: "اللوجستيات" }, text: { en: "Sea & air freight with cold chain", ar: "شحن بحري وجوي مبرد" } },
    { title: { en: "Customer", ar: "العميل" }, text: { en: "Europe, UK & USA", ar: "أوروبا والمملكة المتحدة وأمريكا" } },
  ],
  controls: [
    { title: { en: "Risk assessment", ar: "تقييم المخاطر" }, text: { en: "Full analysis of allergens and pesticides.", ar: "تحليل شامل لمسببات الحساسية والمبيدات." } },
    { title: { en: "Receiving inspection", ar: "فحص الاستلام" }, text: { en: "Every shipment matched against registered specifications.", ar: "مطابقة كل شحنة مع المواصفات المسجلة." } },
    { title: { en: "Supplier approval", ar: "اعتماد الموردين" }, text: { en: "We buy only from approved suppliers with consistent specifications.", ar: "لا يتم الشراء إلا من موردين معتمدين لديهم مواصفات منتظمة وموثوقة." } },
    { title: { en: "Precise traceability", ar: "التتبع الدقيق" }, text: { en: "Lot Code system tracing every product from shelf back to farm, with strict -18°C control for frozen goods.", ar: "نظام Lot Code لتتبع المنتج من رف المستهلك حتى المزرعة، مع تحكم حراري صارم (-18°C) للمجمدات." } },
  ],
};

export const facilities = [
  { name: { en: "Badr Center Packhouse", ar: "محطة فرز وتعبئة مركز بدر" }, place: { en: "El-Tahaddi Rd., El-Beheira", ar: "طريق التحدي – محافظة البحيرة" }, image: sorting.url, points: { en: ["Electronic sorting & grading lines for uniform size and colour", "Pre-cooling systems to lock in freshness", "Hand sorting of fresh grapes before rapid cooling"], ar: ["خطوط فرز إلكترونية لضمان تجانس الأحجام والألوان", "أنظمة تبريد أولي لضمان النضارة", "فرز يدوي للعنب الفريش قبل التبريد السريع"] } },
  { name: { en: "Sadat City IQF Complex", ar: "مجمع التجميد والتصنيع – مدينة السادات" }, place: { en: "Industrial Zone, Sadat City, Menofia", ar: "المنطقة الصناعية – مدينة السادات، المنوفية" }, image: facility.url, points: { en: ["Individual Quick Freezing (IQF) technology", "Preserves texture, colour and nutrition of every piece separately", "Strawberries, broccoli, peas, okra & carrots"], ar: ["تقنية التجميد السريع الفردي (IQF)", "تحافظ على القوام واللون والقيمة الغذائية لكل ثمرة بشكل منفصل", "فراولة، بروكلي، بسلة، بامية وجزر"] } },
];

export type Category = "fresh" | "iqf" | "processed";
export const categories: { id: Category; label: L }[] = [
  { id: "fresh", label: { en: "Fresh Produce", ar: "الحاصلات الطازجة" } },
  { id: "iqf", label: { en: "IQF Frozen", ar: "التجميد السريع" } },
  { id: "processed", label: { en: "Processed", ar: "منتجات مصنّعة" } },
];

export type Product = { id: string; category: Category; name: L; text: L; specs?: { en: string[]; ar: string[] }; packaging?: L; image: string; featured?: boolean };

export const products: Product[] = [
  { id: "grapes", category: "fresh", featured: true, image: pdfGrapes.url, name: { en: "Fresh Grapes", ar: "عنب فريش" }, text: { en: "Our flagship export product — prepared to standard specifications with exceptional care at every stage.", ar: "فخر إنتاجنا والمنتج الرئيسي للتصدير، مجهز بمواصفات قياسية وعناية فائقة في كل مرحلة." } },
  { id: "artichokes", category: "fresh", image: artichokes.url, name: { en: "Fresh Artichokes", ar: "خرشوف طازج" }, text: { en: "Fresh artichokes, hearts and quarters.", ar: "خرشوف طازج، قلوب وأرباع." } },
  { id: "strawberries-fresh", category: "fresh", image: strawberries.url, name: { en: "Fresh Strawberries", ar: "فراولة فريش" }, text: { en: "Hand-picked, export-ready strawberries.", ar: "فراولة طازجة جاهزة للتصدير." } },
  { id: "peppers", category: "fresh", image: peppers.url, name: { en: "Coloured Peppers", ar: "فلفل ألوان" }, text: { en: "Red, yellow and green peppers.", ar: "فلفل أحمر وأصفر وأخضر." } },
  { id: "spring-onions", category: "fresh", image: springOnions.url, name: { en: "Spring Onions", ar: "بصل أخضر" }, text: { en: "Fresh bunched spring onions.", ar: "بصل أخضر طازج." } },
  { id: "watermelon", category: "fresh", image: watermelon.url, name: { en: "Watermelon", ar: "بطيخ أحمر" }, text: { en: "Sweet red watermelon for European markets.", ar: "بطيخ أحمر للأسواق الأوروبية." } },
  { id: "green-beans", category: "fresh", image: greenBeans.url, name: { en: "Green Beans", ar: "فاصوليا" }, text: { en: "Seasonal crop.", ar: "محصول موسمي." } },
  { id: "peas-fresh", category: "fresh", image: peas.url, name: { en: "Fresh Peas", ar: "بسلة" }, text: { en: "Seasonal crop.", ar: "محصول موسمي." } },
  { id: "cauliflower", category: "fresh", image: cauliflower.url, name: { en: "Cauliflower", ar: "قرنبيط" }, text: { en: "Seasonal crop.", ar: "محصول موسمي." } },
  { id: "iqf-strawberries", category: "iqf", featured: true, image: strawberries.url, name: { en: "IQF Strawberries — The Red Gold", ar: "فراولة مجمدة — الذهب الأحمر" }, text: { en: "Grade A, fully ripe strawberries frozen with IQF to keep their natural sweetness and deep red colour.", ar: "فراولة درجة أولى كاملة النضج، مجمدة بتقنية IQF للحفاظ على حلاوتها الطبيعية ولونها الأحمر القوي." }, specs: { en: ["Grade A, whole ripe fruit", "Ideal for juices, jams & desserts"], ar: ["درجة أولى (Grade A) كاملة النضج", "مثالية للعصائر والمربى والحلويات"] }, packaging: { en: "10 kg bulk cartons for food processing or repacking", ar: "كرتون 10 كجم (Bulk) للتصنيع الغذائي أو إعادة التعبئة" } },
  { id: "iqf-peas", category: "iqf", image: peas.url, name: { en: "IQF Green Peas", ar: "بسلة خضراء مجمدة" }, text: { en: "Sweet, tender peas harvested and frozen immediately so no vitamins are lost.", ar: "بسلة سكرية طرية، حُصدت وجُمدت فورًا لضمان عدم فقدان الفيتامينات." }, specs: { en: ["Bright green colour", "Uniform kernel size"], ar: ["لون أخضر زاهٍ", "حبات متجانسة الحجم"] }, packaging: { en: "10 kg Agrosun-branded cartons, built for long shipping & storage", ar: "كرتون 10 كجم بعلامة أجروصن يتحمل الشحن والتخزين الطويل" } },
  { id: "iqf-broccoli", category: "iqf", image: broccoli.url, name: { en: "IQF Broccoli", ar: "بروكلي مجمد" }, text: { en: "Carefully cut florets of uniform size, free of stems and leaves.", ar: "زهيرات مقطعة بعناية لضمان حجم موحد، خالية من السيقان والأوراق." }, specs: { en: ["Keeps crunchy texture and dark green colour after cooking"], ar: ["يحتفظ بقوامه المقرمش ولونه الأخضر الداكن بعد الطهي"] }, packaging: { en: "10 kg Agrosun cartons, ready for direct export", ar: "كرتونة أجروصن 10 كجم جاهزة للتصدير المباشر" } },
  { id: "iqf-carrots", category: "iqf", image: carrots.url, name: { en: "IQF Carrots", ar: "جزر مجمد" }, text: { en: "High-quality carrots with natural sweetness and rich orange colour.", ar: "جزر عالي الجودة يتميز بالحلاوة واللون البرتقالي الغني." }, specs: { en: ["Available sliced or diced"], ar: ["متوفر شرائح أو مكعبات"] }, packaging: { en: "10 kg cartons carrying the Agrosun quality mark", ar: "كرتون 10 كجم يحمل علامة الجودة من أجروصن" } },
  { id: "iqf-okra", category: "iqf", image: okra.url, name: { en: "IQF Okra", ar: "بامية مجمدة" }, text: { en: "The taste of fresh, any time of year.", ar: "طعم الطازج في أي وقت." } },
  { id: "pickled-peppers", category: "processed", image: pickled.url, name: { en: "Pickled Peppers", ar: "فلفل مخلل" }, text: { en: "Sweet and hot pickled peppers.", ar: "فلفل مخلل حلو وحار." } },
  { id: "artichoke-brine", category: "processed", image: artichokes.url, name: { en: "Artichokes in Brine", ar: "خرشوف في محلول ملحي" }, text: { en: "Artichoke hearts preserved in brine.", ar: "قلوب خرشوف محفوظة في محلول ملحي." } },
];

export const certifications = [
  { name: "GLOBALG.A.P.", text: { en: "Good Agricultural Practices", ar: "الممارسات الزراعية الجيدة" } },
  { name: "BRC FOOD", text: { en: "Global Standard for Food Safety", ar: "المعيار العالمي لسلامة الغذاء" } },
  { name: "ISO 22000", text: { en: "Food Safety Management Systems", ar: "نظم إدارة سلامة الغذاء" } },
  { name: "ISO 9001", text: { en: "Quality Management Systems", ar: "نظم إدارة الجودة" } },
  { name: "HACCP", text: { en: "Hazard Analysis & Critical Control Points", ar: "تحليل المخاطر ونقاط التحكم الحرجة" } },
  { name: "ISO 45001", text: { en: "Occupational Health & Safety", ar: "الصحة والسلامة المهنية" } },
  { name: "SMETA", text: { en: "Ethical trade audit — fresh produce", ar: "تدقيق التجارة الأخلاقية — الحاصلات الطازجة" } },
];

/** Markets we export to ("who we deal with"). */
export const markets = [
  { flag: "🇬🇧", name: { en: "United Kingdom", ar: "المملكة المتحدة" } },
  { flag: "🇩🇪", name: { en: "Germany", ar: "ألمانيا" } },
  { flag: "🇮🇹", name: { en: "Italy", ar: "إيطاليا" } },
  { flag: "🇪🇺", name: { en: "European Union", ar: "الاتحاد الأوروبي" } },
  { flag: "🇺🇸", name: { en: "United States", ar: "الولايات المتحدة" } },
];

/** Who we work with. Replace with real partner names/logos when ready. */
export const clientTypes = [
  { title: { en: "Importers & distributors", ar: "المستوردون والموزعون" }, text: { en: "Bulk orders and annual export programmes delivered efficiently.", ar: "تلبية الكميات الكبيرة (Bulk Orders) وبرامج التصدير السنوية بكفاءة تامة." } },
  { title: { en: "Food processors", ar: "مصانع الأغذية" }, text: { en: "IQF fruit & vegetables for juices, jams, desserts and ready meals.", ar: "فواكه وخضروات مجمدة للعصائر والمربى والحلويات والوجبات." } },
  { title: { en: "Retail & repackers", ar: "سلاسل التجزئة وإعادة التعبئة" }, text: { en: "Fresh produce and bulk cartons ready for repacking.", ar: "حاصلات طازجة وكراتين جاهزة لإعادة التعبئة." } },
];

export const partners: { name: string; logo?: string }[] = [
  { name: "Agrosun Fresh Produce" },
  { name: "Agrosun Agro-Processing" },
  { name: "El Khan" },
];

export const contact = {
  email: "exportagrosun@agrosunegypt.com",
  website: "www.agrosun-eg.com",
  map: "https://maps.google.com/?q=Sheikh+Zayed+Giza",
  social: { facebook: "", instagram: "", linkedin: "" },
  offices: [
    { label: { en: "Head office", ar: "العنوان الإداري" }, value: { en: "14 El Nozha St.", ar: "١٤ شارع النزهة" } },
    { label: { en: "Badr Center Packhouse", ar: "محطة مركز بدر" }, value: { en: "El-Tahaddi Rd., El-Beheira", ar: "طريق التحدي – محافظة البحيرة" } },
    { label: { en: "Sadat City Factory", ar: "مصنع السادات" }, value: { en: "Industrial Zone 4, Block 4, Sadat City", ar: "المنطقة الصناعية الرابعة، بلوك ٤، مدينة السادات" } },
  ],
};
