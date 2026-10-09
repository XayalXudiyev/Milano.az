import { BRANDS, CATEGORIES, type Brand, type Category, type Product } from "../data";
import { FAQ, type Faq } from "../faq";
import type { Lang } from "./config";
import en from "./content.en.json";
import ru from "./content.ru.json";

type ProductTr = {
  name?: string;
  short?: string;
  description?: string;
  features?: string[];
  usage?: string;
  note?: string;
  volume?: string;
  variantLabel?: string;
  variants?: Record<string, string>;
  specs?: { label: string; value: string }[];
  pack?: { sections: { title: string; list?: string[]; text?: string }[] }[];
};
type Content = {
  products: Record<string, ProductTr>;
  brands: Record<string, { origin?: string; description?: string }>;
  categories: Record<string, { name: string; short: string }>;
  faq: { q: string; a: string }[];
};

const CONTENT: Partial<Record<Lang, Content>> = { en: en as Content, ru: ru as Content };

export function localizeProduct(p: Product, lang: Lang): Product {
  const tr = CONTENT[lang]?.products[p.slug];
  if (!tr) return p;
  return {
    ...p,
    name: tr.name ?? p.name,
    short: tr.short ?? p.short,
    description: tr.description ?? p.description,
    features: tr.features ?? p.features,
    usage: tr.usage ?? p.usage,
    note: tr.note ?? p.note,
    volume: tr.volume ?? p.volume,
    variantLabel: tr.variantLabel ?? p.variantLabel,
    specs: tr.specs ?? p.specs,
    variants: p.variants?.map((v) => ({ ...v, label: tr.variants?.[v.id] ?? v.label })),
    pack: p.pack?.map((it, i) => ({ ...it, sections: tr.pack?.[i]?.sections ?? it.sections })),
  };
}

export function localizeBrand(b: Brand, lang: Lang): Brand {
  const tr = CONTENT[lang]?.brands[b.slug];
  return tr ? { ...b, origin: tr.origin ?? b.origin, description: tr.description ?? b.description } : b;
}

export function localizeCategory(c: Category, lang: Lang): Category {
  const tr = CONTENT[lang]?.categories[c.slug];
  return tr ? { ...c, ...tr } : c;
}

export const brandsFor = (lang: Lang) => BRANDS.map((b) => localizeBrand(b, lang));
export const categoriesFor = (lang: Lang) => CATEGORIES.map((c) => localizeCategory(c, lang));

export function faqFor(lang: Lang): Faq[] {
  const tr = CONTENT[lang]?.faq;
  return tr ? FAQ.map((f, i) => ({ ...f, ...(tr[i] ?? {}) })) : FAQ;
}
