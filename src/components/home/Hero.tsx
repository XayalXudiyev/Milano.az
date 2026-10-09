"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Component, useEffect, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import Magnetic from "@/components/ui/Magnetic";
import { Sparkle } from "@/components/ui/Icons";
import { BRANDS, PRODUCTS, SKU_COUNT, finalPrice } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { useLang } from "@/lib/i18n/context";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** WebGL dəstəklənmədikdə statik kompozisiya qalır */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const ease = [0.16, 1, 0.3, 1] as const;

function StaticComposition() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[70%] w-[70%]">
        <Image src="/img/hq/kera-cream.webp" alt="" width={280} height={889} priority className="absolute top-[6%] left-[22%] h-[82%] w-auto animate-[float_6s_ease-in-out_infinite] drop-shadow-2xl" />
        <Image src="/img/hq/wax-red.webp" alt="" width={585} height={823} priority className="absolute right-[8%] bottom-[2%] h-[44%] w-auto animate-[float_7s_ease-in-out_infinite] drop-shadow-2xl [animation-delay:1s]" />
        <Image src="/img/hq/cck006.webp" alt="" width={758} height={900} priority className="absolute top-0 right-[4%] h-[46%] w-auto rotate-[-18deg] drop-shadow-2xl" />
      </div>
    </div>
  );
}

const kera = PRODUCTS.find((p) => p.slug === "nouvelle-kera-sublime-hero-cream")!;

export default function Hero() {
  const [ready, setReady] = useState(false);
  const [load3d, setLoad3d] = useState(false);
  const { t, href } = useLang();

  // 3D səhnə (three.js ~1 MB) səhifə açıldıqdan sonra, brauzer boş olanda yüklənir.
  // Telefon/planşetdə, data qənaəti və ya azaldılmış hərəkət rejimində ümumiyyətlə yüklənmir —
  // WebGL + shader kompilyasiyası mobil GPU-da scroll-u dondururdu, statik kompozisiya kifayətdir.
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    // köhnə Safari-də requestIdleCallback yoxdur
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const idle = (cb: () => void) => (ric ? ric(cb, { timeout: 2500 }) : setTimeout(cb, 1));
    const id = window.setTimeout(() => idle(() => setLoad3d(true)), 150);
    return () => window.clearTimeout(id);
  }, []);
  const h = t.hero;

  return (
    <section className="relative -mt-[4.5rem] overflow-hidden pt-[4.5rem] sm:-mt-[4.75rem] sm:pt-[4.75rem] lg:-mt-[5rem] lg:pt-[5rem]">
      {/* fon */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="glow absolute -top-40 -left-40 size-[38rem]" style={{ ["--glow" as string]: "rgb(244 217 220 / 0.7)" }} />
        <div className="glow absolute top-1/3 -right-40 size-[34rem]" style={{ ["--glow" as string]: "#e9e2fb" }} />
        <div className="glow absolute bottom-0 left-1/3 size-[24rem]" style={{ ["--glow" as string]: "rgb(217 189 140 / 0.3)" }} />
      </div>

      <div className="container-x relative grid min-h-[calc(100svh-5.5rem)] items-center gap-6 pb-10 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pb-16">
        <div className="relative z-10 pt-8 lg:pt-0">
          <p
            className="anim-fadeup mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/60 py-1.5 pr-4 pl-1.5 text-xs font-semibold backdrop-blur"
          >
            <span className="rounded-full bg-ink px-2.5 py-1 text-[0.65rem] tracking-wider text-ivory">{h.pillTag}</span>
            {h.pill}
          </p>

          <SplitText
            as="h1"
            animateOnMount
            delay={0.15}
            text={h.title}
            className="font-display text-[min(3.6rem,13vw)] leading-[0.88] font-medium tracking-tight [overflow-wrap:anywhere] sm:text-[5.5rem] lg:text-[6.4rem] xl:text-[7.4rem]"
          />

          <p
            style={{ animationDelay: "0.5s" }}
            className="anim-fadeup mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          >
            {h.text}
          </p>

          <div style={{ animationDelay: "0.65s" }} className="anim-fadeup mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link href={href("/mehsullar/")} className="btn btn-primary">
                {h.cta} <ArrowRight className="size-4" />
              </Link>
            </Magnetic>
          </div>

          <dl
            style={{ animationDelay: "0.85s" }}
            className="anim-fadeup mt-10 grid max-w-md grid-cols-3 divide-x divide-line border-t border-line pt-6"
          >
            {[
              [String(BRANDS.length), h.stats[0]],
              [`${Math.floor(SKU_COUNT / 10) * 10}+`, h.stats[1]],
              [h.oneDay, h.stats[2]],
            ].map(([n, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="font-display text-3xl font-semibold lining-nums sm:text-4xl">{n}</dt>
                <dd className="text-xs tracking-wide text-muted uppercase">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 3D səhnə */}
        <div className="relative h-[440px] sm:h-[540px] lg:h-[min(720px,calc(100svh-7rem))]">
          <motion.div
            aria-hidden
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.1 }}
            style={{ originY: 1 }}
            className="absolute bottom-0 left-1/2 h-[92%] w-[min(78%,520px)] -translate-x-1/2 rounded-t-full bg-gradient-to-b from-white/90 via-blush/60 to-blush-2/40 shadow-[inset_0_2px_30px_rgba(255,255,255,0.9)]"
          />
          <div aria-hidden className="glow absolute bottom-0 left-1/2 h-10 w-[min(90%,600px)] -translate-x-1/2" style={{ ["--glow" as string]: "rgb(21 18 20 / 0.12)", ["--glow-scale" as string]: 1.3 }} />

          {!ready && <StaticComposition />}
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 1.2 }}>
            {load3d && (
              <SceneBoundary>
                <HeroScene onReady={() => setReady(true)} />
              </SceneBoundary>
            )}
          </motion.div>

          {/* üzən şüşə kartlar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
            className="absolute top-[8%] left-0 sm:left-[2%]"
          >
            <Link href={href(`/mehsullar/${kera.slug}/`)} className="card-glass flex items-center gap-3 rounded-2xl p-2 pr-4 shadow-xl transition-transform duration-500 hover:-translate-y-1 animate-[float_6s_ease-in-out_infinite]">
              <span className="relative grid size-12 place-items-center overflow-hidden rounded-xl bg-blush">
                <Image src="/img/hq/kera-cream.webp" alt="" width={40} height={106} className="h-11 w-auto" />
              </span>
              <span>
                <span className="block text-[0.65rem] font-semibold tracking-wider text-muted uppercase">Kera Sublime</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="font-bold text-rose">{formatPrice(finalPrice(kera))}</span>
                  <span className="text-xs text-muted line-through">{formatPrice(kera.price)}</span>
                </span>
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.3, ease }}
            className="absolute right-0 bottom-[14%] sm:right-[2%]"
          >
            <Link href={href("/brendler/razorline/")} className="flex items-center gap-3 rounded-2xl bg-ink p-2 pr-4 text-ivory shadow-2xl transition-transform duration-500 hover:-translate-y-1">
              <span className="grid size-12 place-items-center rounded-xl bg-white/10">
                <Image src="/img/hq/cck006.webp" alt="" width={44} height={60} className="h-10 w-auto -rotate-12" />
              </span>
              <span>
                <span className="block text-[0.65rem] font-semibold tracking-wider text-gold-2 uppercase">{h.razorChip}</span>
                <span className="font-bold">{h.razorChipValue}</span>
              </span>
            </Link>
          </motion.div>

          {/* fırlanan dairəvi yazı */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: ready ? 0 : 1, scale: ready ? 0.6 : 1 }}
            transition={{ duration: 1, delay: ready ? 0 : 1.5, ease }}
            className="pointer-events-none absolute bottom-[4%] left-[3%] hidden size-28 sm:block"
          >
            <svg viewBox="0 0 100 100" className="size-full animate-spin-slow">
              <defs>
                <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-ink text-[9.5px] font-semibold tracking-[0.32em] uppercase">
                <textPath href="#circle">{h.ring}</textPath>
              </text>
            </svg>
            <Sparkle className="absolute inset-0 m-auto size-6 text-rose" />
          </motion.div>
        </div>
      </div>

      {/* aşağı göstərici */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="eyebrow text-[0.6rem] text-muted">{h.scroll}</span>
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollline_1.8s_ease-in-out_infinite] bg-ink" />
        </span>
      </motion.div>
    </section>
  );
}
