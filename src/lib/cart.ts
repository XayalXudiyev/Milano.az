"use client";

import { useSyncExternalStore } from "react";
import { finalPrice, getProduct, type Product, type Variant } from "./data";
import { formatPrice } from "./format";
import { whatsappLink } from "./site";
import type { Lang } from "./i18n/config";
import { DICTS } from "./i18n/dict";
import { localizeProduct } from "./i18n/content";

export type CartLine = { slug: string; variantId?: string; qty: number };
/** Son əlavə olunan məhsul — "Səbətə əlavə olundu" bildirişi üçün (`key` hər əlavədə artır). */
export type Added = CartLine & { key: number };
type State = { lines: CartLine[]; open: boolean; added: Added | null };

const KEY = "np-cart-v1";
const EMPTY: State = { lines: [], open: false, added: null };
let state: State = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const lines = (JSON.parse(raw) as CartLine[]).filter((l) => getProduct(l.slug));
      state = { ...state, lines };
    }
  } catch {
    /* localStorage əlçatan deyil — boş səbətlə davam edirik */
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  if (next.lines) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state.lines));
    } catch {
      /* yoxlanılmır */
    }
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  hydrate();
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCart() {
  const s = useSyncExternalStore(
    subscribe,
    () => (hydrate(), state),
    () => EMPTY,
  );
  return s;
}

const same = (a: CartLine, slug: string, variantId?: string) => a.slug === slug && a.variantId === variantId;

export const cart = {
  add(slug: string, variantId?: string, qty = 1) {
    hydrate();
    const exists = state.lines.find((l) => same(l, slug, variantId));
    const lines = exists
      ? state.lines.map((l) => (same(l, slug, variantId) ? { ...l, qty: l.qty + qty } : l))
      : [...state.lines, { slug, variantId, qty }];
    set({ lines, added: { slug, variantId, qty, key: (state.added?.key ?? 0) + 1 } });
  },
  dismiss() {
    set({ added: null });
  },
  setQty(slug: string, variantId: string | undefined, qty: number) {
    const lines =
      qty <= 0
        ? state.lines.filter((l) => !same(l, slug, variantId))
        : state.lines.map((l) => (same(l, slug, variantId) ? { ...l, qty } : l));
    set({ lines });
  },
  remove(slug: string, variantId?: string) {
    set({ lines: state.lines.filter((l) => !same(l, slug, variantId)) });
  },
  clear() {
    set({ lines: [] });
  },
  open() {
    set({ open: true, added: null });
  },
  close() {
    set({ open: false });
  },
};

export type ResolvedLine = CartLine & { product: Product; variant?: Variant; unit: number; total: number };

export function resolve(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((l) => {
    const product = getProduct(l.slug);
    if (!product) return [];
    const variant = product.variants?.find((v) => v.id === l.variantId);
    const unit = finalPrice(product);
    return [{ ...l, product, variant, unit, total: Math.round(unit * l.qty * 100) / 100 }];
  });
}

export function totals(lines: ResolvedLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const full = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return {
    count,
    subtotal: Math.round(subtotal * 100) / 100,
    saved: Math.round((full - subtotal) * 100) / 100,
  };
}

/**
 * WhatsApp mesajında bir məhsulun sətirləri — sadə dildə:
 *   1) Məhsulun adı (variant · kod)
 *      2 ədəd × 10 ₼ = 20 ₼  (36 ₼ əvəzinə)
 */
export function itemLines(product: Product, variantId: string | undefined, qty: number, lang: Lang, n?: number) {
  const d = DICTS[lang].cart;
  const p = localizeProduct(product, lang);
  const variant = p.variants?.find((v) => v.id === variantId);
  const v = variant ? ` (${variant.label}${variant.code ? ` · ${variant.code}` : ""})` : "";
  const code = !variant && p.code ? ` (${d.msgCode}: ${p.code})` : "";
  const unit = finalPrice(product);
  const total = Math.round(unit * qty * 100) / 100;
  const amount = qty > 1 ? `${qty} ${d.msgPcs} × ${formatPrice(unit)} = ${formatPrice(total)}` : `1 ${d.msgPcs} — ${formatPrice(total)}`;
  const old = product.discount ? `  (${d.msgInstead(formatPrice(Math.round(product.price * qty * 100) / 100))})` : "";
  return [`${n ? `${n}) ` : "▪️ "}${p.name}${v}${code}`, `     ${amount}${old}`];
}

export function orderMessage(lines: ResolvedLine[], lang: Lang = "az") {
  const d = DICTS[lang].cart;
  const t = totals(lines);
  const rows = lines.flatMap((l, i) => [...itemLines(l.product, l.variantId, l.qty, lang, i + 1), ""]);
  return [
    d.msgHello,
    "",
    `🛒 ${d.msgOrder(t.count)}`,
    "",
    ...rows,
    "━━━━━━━━━━━━━━",
    `✅ ${d.msgTotal}: ${formatPrice(t.subtotal)}`,
    ...(t.saved > 0 ? [`🎁 ${d.msgSaved}: ${formatPrice(t.saved)}`, `     (${d.msgWithout(formatPrice(Math.round((t.subtotal + t.saved) * 100) / 100))})`] : []),
    `🚚 ${d.msgDelivery}`,
  ].join("\n");
}

export const orderLink = (lines: ResolvedLine[], lang: Lang = "az") => whatsappLink(orderMessage(lines, lang));
