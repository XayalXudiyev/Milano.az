"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check, ShoppingBag, X } from "lucide-react";
import { cart, useCart } from "@/lib/cart";
import { finalPrice, getProduct } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";
import { formatPrice } from "@/lib/format";

/** "Səbətə əlavə olundu" bildirişi — 4 saniyədən sonra özü bağlanır, üzərinə gələndə dayanır. */
export default function CartToast() {
  const { added } = useCart();
  const { t, product: loc } = useLang();
  const c = t.cart;
  const raw = added ? getProduct(added.slug) : undefined;
  const p = raw ? loc(raw) : undefined;
  const variant = p?.variants?.find((v) => v.id === added?.variantId);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-3 top-[5.25rem] z-[70] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
      <AnimatePresence mode="popLayout">
        {added && p && raw && (
          <motion.div
            key={added.key}
            role="status"
            initial={{ opacity: 0, y: -24, scale: 0.92, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, scale: 0.96, filter: "blur(4px)", transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="group pointer-events-auto relative w-full max-w-[380px] overflow-hidden rounded-[1.6rem] border border-white/70 bg-ivory/95 shadow-[0_30px_70px_-25px_rgba(21,18,20,0.45)] backdrop-blur-xl"
          >
            <div className="flex items-center gap-3.5 p-3.5 pr-11">
              <div className="relative shrink-0">
                <div className="relative size-16 overflow-hidden rounded-2xl" style={{ background: raw.tint }}>
                  <Image
                    src={variant?.image ?? raw.image}
                    alt=""
                    fill
                    sizes="64px"
                    className={raw.cover ? "object-cover" : raw.photo ? "object-cover mix-blend-multiply" : "object-contain p-1.5"}
                  />
                </div>
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.12 }}
                  className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full bg-[#1f9f55] text-white ring-2 ring-ivory"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </motion.span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-[#1f9f55] uppercase">{c.addedTitle}</p>
                <p className="mt-0.5 truncate text-sm font-semibold">{p.name}</p>
                <p className="truncate text-xs text-muted">
                  {variant ? `${variant.label} · ` : ""}
                  {added.qty} × {formatPrice(finalPrice(raw))}
                </p>
              </div>
            </div>

            <div className="flex gap-2 px-3.5 pb-3.5">
              <button onClick={cart.open} className="btn btn-primary h-10 flex-1 text-sm">
                <ShoppingBag className="size-4" /> {c.view}
              </button>
            </div>

            <button onClick={cart.dismiss} className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-cream hover:text-ink" aria-label={t.common.close}>
              <X className="size-4" />
            </button>

            {/* qalan vaxt zolağı — bitəndə bildiriş bağlanır */}
            <span
              aria-hidden
              onAnimationEnd={cart.dismiss}
              className="absolute inset-x-0 bottom-0 h-[3px] origin-left animate-[cart-toast_4s_linear_forwards] bg-gradient-to-r from-rose to-gold group-hover:[animation-play-state:paused]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
