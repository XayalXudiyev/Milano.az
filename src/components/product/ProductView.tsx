"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import { useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Check, Info } from "lucide-react";
import "swiper/css";
import "swiper/css/thumbs";
import { finalPrice, type Product } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";
import { ManagerTrigger } from "@/components/manager/ManagerCard";
import { cart, itemLines } from "@/lib/cart";
import { formatPrice, cn } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/Icons";
import PackCatalog from "./PackCatalog";

const isCutout = (src: string) => src.startsWith("/img/hq/") || src.startsWith("/img/p/");

function ZoomImage({ src, alt, contain, priority, photo }: { src: string; alt: string; contain: boolean; priority?: boolean; photo?: boolean }) {
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  return (
    <div
      className="relative size-full overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
      onPointerLeave={() => setZoom(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
        style={{ transformOrigin: origin }}
        className={cn(
          "transition-transform duration-500 ease-out",
          zoom ? "scale-[1.7]" : "scale-100",
          contain && !photo ? "object-contain p-[10%] drop-shadow-[0_30px_30px_rgba(40,20,25,0.25)]" : "object-cover",
          photo && "mix-blend-multiply",
        )}
      />
    </div>
  );
}

export default function ProductView({ product: raw }: { product: Product }) {
  const { t, lang, href, product: loc, brand: getB, category: getC } = useLang();
  const tp = t.product;
  const product = loc(raw);
  const brand = getB(product.brand);
  const category = getC(product.category);
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const variant = product.variants?.find((v) => v.id === variantId);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [thumbs, setThumbs] = useState<SwiperT | null>(null);
  const main = useRef<SwiperT | null>(null);
  const [added, setAdded] = useState(false);

  const images = [product.image, ...(product.gallery ?? [])];
  const variantImages = product.variants?.filter((v) => v.image).map((v) => v.image!) ?? [];
  const allImages = [...new Set([...images, ...variantImages])];

  const unit = finalPrice(product);
  const saved = Math.round((product.price - unit) * qty * 100) / 100;

  const selectVariant = (id: string) => {
    setVariantId(id);
    const img = product.variants?.find((v) => v.id === id)?.image;
    if (img) main.current?.slideTo(allImages.indexOf(img));
  };

  const add = () => {
    cart.add(product.slug, variantId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const quickOrder = whatsappLink(
    [t.cart.msgSingle, "", ...itemLines(raw, variantId, qty, lang), "", `✅ ${t.cart.msgTotal}: ${formatPrice(Math.round(unit * qty * 100) / 100)}`, `🚚 ${t.cart.msgDelivery}`].join("\n"),
  );

  const tabs = [
    { t: tp.tabs.desc, c: <p className="leading-relaxed text-muted">{product.description}</p> },
    {
      t: tp.tabs.features,
      c: (
        <ul className="grid gap-3 sm:grid-cols-2">
          {product.features.map((f) => (
            <li key={f} className="flex gap-3 rounded-2xl bg-white/70 p-4 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-rose" />
              {f}
            </li>
          ))}
        </ul>
      ),
    },
    ...(product.usage ? [{ t: tp.tabs.usage, c: <p className="leading-relaxed text-muted">{product.usage}</p> }] : []),
    ...(product.specs?.length
      ? [
          {
            t: tp.tabs.specs,
            c: (
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white/60">
                {[{ label: tp.brand, value: `${brand.name} (${brand.origin})` }, ...product.specs, ...(variant?.code ? [{ label: tp.code, value: variant.code }] : [])].map((s) => (
                  <div key={s.label} className="grid grid-cols-[minmax(110px,40%)_1fr] gap-4 px-5 py-3.5 text-sm">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* qalereya */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]" style={{ background: product.tint }}>
            <div aria-hidden className="glow absolute -top-1/4 left-1/2 aspect-square w-[110%] -translate-x-1/2" style={{ ["--glow" as string]: "rgb(255 255 255 / 0.6)", ["--glow-scale" as string]: 1.2 }} />
            <Swiper
              modules={[Thumbs, A11y, Keyboard]}
              thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
              onSwiper={(s) => (main.current = s)}
              keyboard={{ enabled: true }}
              speed={700}
              className="aspect-[4/5] sm:aspect-square"
            >
              {allImages.map((src, i) => (
                <SwiperSlide key={src}>
                  <ZoomImage src={src} alt={`${product.name} — ${tp.image} ${i + 1}`} contain={isCutout(src)} photo={product.photo && isCutout(src)} priority={i === 0} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="pointer-events-none absolute top-4 left-4 z-10 flex flex-wrap gap-2">
              {product.discount ? <span className="rounded-full bg-rose px-3 py-1.5 text-sm font-bold text-white shadow-lg">−{product.discount}%</span> : null}
              {product.badges?.map((b) => (
                <span key={b} className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold tracking-wide uppercase backdrop-blur">
                  {t.badge[b]}
                </span>
              ))}
            </div>
          </div>
          {allImages.length > 1 && (
            <Swiper modules={[Thumbs]} onSwiper={setThumbs} watchSlidesProgress slidesPerView={4.5} spaceBetween={10} breakpoints={{ 640: { slidesPerView: 5.5 } }} className="mt-3">
              {allImages.map((src) => (
                <SwiperSlide key={src} className="group cursor-pointer">
                  <div
                    className="relative aspect-square overflow-hidden rounded-2xl opacity-50 ring-2 ring-transparent transition-all group-[.swiper-slide-thumb-active]:opacity-100 group-[.swiper-slide-thumb-active]:ring-ink hover:opacity-100"
                    style={{ background: product.tint }}
                  >
                    <Image src={src} alt="" fill sizes="120px" className={isCutout(src) && !product.photo ? "object-contain p-2" : "object-cover"} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* məlumat */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link href={href(`/brendler/${brand.slug}/`)} className="eyebrow rounded-full bg-ink px-3 py-1.5 text-[0.62rem] text-ivory transition-colors hover:bg-rose">
              {brand.name}
            </Link>
            <Link href={href(`/mehsullar/?kateqoriya=${category.slug}`)} className="rounded-full border border-line px-3 py-1.5 text-muted transition-colors hover:border-ink hover:text-ink">
              {category.name}
            </Link>
            {product.code && <span className="rounded-full border border-line px-3 py-1.5 text-muted">{tp.code}: {product.code}</span>}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl leading-[0.98] font-medium tracking-tight sm:text-5xl lg:text-6xl"
          >
            {product.name}
          </motion.h1>
          <p className="mt-3 text-lg text-muted">{product.short}</p>
          {product.volume && <p className="mt-1 text-sm font-semibold">{product.volume}</p>}

          <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className={cn("font-display text-5xl font-semibold tabular-nums sm:text-6xl", product.discount ? "text-rose" : "text-ink")}>{formatPrice(unit)}</span>
            {product.discount ? (
              <>
                <span className="pb-2 text-xl text-muted line-through tabular-nums">{formatPrice(product.price)}</span>
                <span className="mb-2 rounded-full bg-rose/10 px-3 py-1 text-sm font-semibold text-rose">{tp.save}: {formatPrice(saved)}</span>
              </>
            ) : null}
          </div>

          {product.note && (
            <p className="mt-4 flex items-center gap-2 rounded-2xl bg-gold-2/25 px-4 py-3 text-sm font-medium text-ink">
              <Info className="size-4 shrink-0 text-gold" />
              {product.note}
            </p>
          )}

          {product.variants && (
            <div className="mt-8">
              <p className="mb-3 text-sm">
                <span className="text-muted">{product.variantLabel}:</span> <strong>{variant?.label}</strong>
                {variant?.code && <span className="text-muted"> · {tp.variantCode} {variant.code}</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) =>
                  v.swatch ? (
                    <button
                      key={v.id}
                      onClick={() => selectVariant(v.id)}
                      title={v.label}
                      aria-label={v.label}
                      aria-pressed={v.id === variantId}
                      className={cn(
                        "relative grid size-11 place-items-center rounded-full ring-offset-2 ring-offset-ivory transition-all",
                        v.id === variantId ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40",
                      )}
                    >
                      <span className="size-9 rounded-full shadow-inner" style={{ background: v.swatch }} />
                      {v.id === variantId && <Check className={cn("absolute size-4", ["#f2f2f2", "#ebdcc0", "#dcc09a", "#c9ccd1", "#e3dc2a", "#d8c27a", "#f2c14e", "#e5c24a"].includes(v.swatch.toLowerCase()) ? "text-ink" : "text-white")} />}
                    </button>
                  ) : (
                    <button
                      key={v.id}
                      onClick={() => selectVariant(v.id)}
                      aria-pressed={v.id === variantId}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
                        v.id === variantId ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
                      )}
                    >
                      {v.label}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex h-14 items-center rounded-full border border-line bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-14 place-items-center" aria-label={t.cart.dec}>
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button onClick={() => setQty((q) => q + 1)} className="grid size-14 place-items-center" aria-label={t.cart.inc}>
                <Plus className="size-4" />
              </button>
            </div>
            <button onClick={add} className="btn btn-primary h-14 flex-1 text-base sm:min-w-56">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? "ok" : "add"} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-2">
                  {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
                  {added ? tp.added : tp.add}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
          <a href={quickOrder} target="_blank" rel="noreferrer" className="btn mt-3 h-14 w-full border border-[#1f9f55] text-[#1f9f55] hover:bg-[#1f9f55] hover:text-white">
            <WhatsAppIcon className="size-5" /> {tp.quick}
          </a>
          <ManagerTrigger className="mt-3 w-full justify-start" />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[Truck, ShieldCheck].map((Icon, i) => ({ Icon, ...tp.perks[i] })).map(({ Icon, t, d }) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
                <Icon className="size-5 shrink-0 text-rose" />
                <span className="text-xs leading-tight">
                  <strong className="block text-sm">{t}</strong>
                  <span className="text-muted">{d}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* tablar */}
          <div className="mt-12">
            <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line" role="tablist">
              {tabs.map((t, i) => (
                <button key={t.t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={cn("relative shrink-0 pb-4 text-sm font-semibold transition-colors", tab === i ? "text-ink" : "text-muted hover:text-ink")}>
                  {t.t}
                  {tab === i && <motion.span layoutId="pd-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-rose" />}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="pt-6" role="tabpanel">
                {tabs[tab]?.c}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {product.pack?.length ? <PackCatalog product={raw} /> : null}

      {/* mobil yapışqan səbət paneli */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">{product.name}</p>
            <p className={cn("text-lg font-bold tabular-nums", product.discount ? "text-rose" : "")}>{formatPrice(unit)}</p>
          </div>
          <button onClick={add} className="btn btn-primary h-12 px-5 text-sm">
            <ShoppingBag className="size-4" /> {tp.toCart}
          </button>
        </div>
      </div>
    </>
  );
}
