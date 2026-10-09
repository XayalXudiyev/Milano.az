"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X, Phone, Truck } from "lucide-react";
import { cart, orderLink, resolve, totals, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { PHONE } from "@/lib/site";
import { useLang } from "@/lib/i18n/context";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { lockScroll } from "./SmoothScroll";

export default function CartDrawer() {
  const { lines, open } = useCart();
  const { t, lang, href, product } = useLang();
  const c = t.cart;
  const items = resolve(lines);
  const tt = totals(items);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cart.close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={c.title}>
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={cart.close} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-ivory shadow-2xl sm:top-2 sm:right-2 sm:h-[calc(100%-1rem)] sm:rounded-[28px]"
          >
            <header className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="font-display text-3xl font-semibold">{c.title}</h2>
                <p className="text-sm text-muted">{c.items(tt.count)}</p>
              </div>
              <button onClick={cart.close} className="grid size-11 place-items-center rounded-full bg-cream transition-transform hover:rotate-90" aria-label={t.common.close}>
                <X className="size-5" />
              </button>
            </header>

            {items.length > 0 && (
              <div className="mx-6 mb-2 rounded-2xl bg-cream p-3.5">
                <p className="flex items-center gap-2 text-xs font-medium">
                  <Truck className="size-4 text-rose" />
                  {c.freeNote}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="grid size-24 place-items-center rounded-full bg-blush">
                    <ShoppingBag className="size-9 text-rose" />
                  </motion.div>
                  <p className="mt-6 font-display text-2xl font-semibold">{c.empty}</p>
                  <p className="mt-2 max-w-xs text-sm text-muted">{c.emptyText}</p>
                  <Link href={href("/mehsullar/")} onClick={cart.close} className="btn btn-primary mt-6">
                    {c.toCatalog}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {items.map((l) => (
                      <motion.li
                        key={l.slug + (l.variantId ?? "")}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-4 overflow-hidden py-4"
                      >
                        <Link href={href(`/mehsullar/${l.slug}/`)} onClick={cart.close} className="relative size-24 shrink-0 overflow-hidden rounded-2xl" style={{ background: l.product.tint }}>
                          <Image
                            src={l.variant?.image ?? l.product.image}
                            alt=""
                            fill
                            sizes="96px"
                            className={l.product.cover ? "object-cover" : l.product.photo ? "object-cover mix-blend-multiply" : "object-contain p-2"}
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="line-clamp-2 text-sm leading-snug font-semibold">{product(l.product).name}</p>
                          {l.variant && (
                            <p className="mt-0.5 text-xs text-muted">
                              {product(l.product).variantLabel}: {product(l.product).variants?.find((v) => v.id === l.variantId)?.label}
                              {l.variant.code ? ` · ${l.variant.code}` : ""}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line bg-white">
                              <button onClick={() => cart.setQty(l.slug, l.variantId, l.qty - 1)} className="grid size-8 place-items-center" aria-label={c.dec}>
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
                              <button onClick={() => cart.setQty(l.slug, l.variantId, l.qty + 1)} className="grid size-8 place-items-center" aria-label={c.inc}>
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold tabular-nums">{formatPrice(l.total)}</p>
                              {l.product.discount ? <p className="text-[0.7rem] text-muted line-through tabular-nums">{formatPrice(l.product.price * l.qty)}</p> : null}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => cart.remove(l.slug, l.variantId)} className="self-start p-1 text-muted transition-colors hover:text-rose" aria-label={c.remove}>
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {tt.saved > 0 && (
                  <div className="flex justify-between text-sm text-rose">
                    <span>{c.saved}</span>
                    <span className="font-semibold tabular-nums">−{formatPrice(tt.saved)}</span>
                  </div>
                )}
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm text-muted">{c.total}</span>
                  <span className="font-display text-4xl font-semibold tabular-nums">{formatPrice(tt.subtotal)}</span>
                </div>
                <a href={orderLink(items, lang)} target="_blank" rel="noreferrer" className="btn mt-4 h-14 w-full bg-[#1f9f55] text-white hover:bg-[#178a48]">
                  <WhatsAppIcon className="size-5" /> {c.order}
                </a>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <a href={PHONE.href} className="btn btn-ghost h-11 text-sm">
                    <Phone className="size-4" /> {t.common.call}
                  </a>
                  <button onClick={cart.clear} className="btn h-11 bg-cream text-sm hover:bg-sand">
                    {c.clear}
                  </button>
                </div>
                <p className="mt-3 text-center text-[0.7rem] text-muted">{c.cashNote}</p>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
