"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, Parallax, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperT } from "swiper";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-creative";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLang } from "@/lib/i18n/context";

type Slide = {
  poster: string;
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  big: string;
  href: string;
  cta: string;
  bg: string;
  fg: "light" | "dark";
  accentColor: string;
};

const SLIDES: Slide[] = [
  {
    poster: "/img/poster/razor-05.webp",
    eyebrow: "Razorline · Japan Steel",
    title: "Qızılı dəqiqlik,",
    accent: "yarı qiymətinə",
    text: "Bütün Razorline qayçılarında 40% endirim. 200 ₼ əvəzinə cəmi 120 ₼ — Yapon poladı, ömürlük itilik.",
    big: "−40%",
    href: "/brendler/razorline/",
    cta: "Qayçılara bax",
    bg: "#151214",
    fg: "light",
    accentColor: "#d9bd8c",
  },
  {
    poster: "/img/promo/nouvelle-kera-poster.webp",
    eyebrow: "Nouvelle · Kera Sublime",
    title: "İpək kimi saçların",
    accent: "sirri",
    text: "Keratin əsaslı yarımpermanent düzləşdirici krem 1000 ml. Formaldehidsiz, parabensiz. 180 ₼ → 100 ₼.",
    big: "−44%",
    href: "/mehsullar/nouvelle-kera-sublime-hero-cream/",
    cta: "Məhsula keç",
    bg: "#f4d9dc",
    fg: "dark",
    accentColor: "#c2415e",
  },
  {
    poster: "/img/poster/redone-01.webp",
    eyebrow: "RedOne · Hair & Grooming",
    title: "Güclü stil,",
    accent: "güclü endirim",
    text: "Bütün RedOne wax, odekolon, after shave və təraş gellərində 20% endirim. Aqua wax cəmi 4,80 ₼.",
    big: "−20%",
    href: "/brendler/redone/",
    cta: "RedOne kolleksiyası",
    bg: "#1d0a0e",
    fg: "light",
    accentColor: "#ff4d5e",
  },
  {
    poster: "/img/promo/nouvelle-blonde.webp",
    eyebrow: "Nouvelle · Color Effective",
    title: "Baxımlı",
    accent: "açma gücü",
    text: "Root-ready mavi açıcı pudra — saçı zədələmədən 9 tona qədər açır. 500 q — 25 ₼.",
    big: "9 ton",
    href: "/mehsullar/nouvelle-color-effective-blonde/",
    cta: "Ətraflı",
    bg: "#e9e4fb",
    fg: "dark",
    accentColor: "#6b5bd6",
  },
  {
    poster: "/img/promo/redist-biotin-routine.webp",
    eyebrow: "Redist · Biotin",
    title: "3 addımlı",
    accent: "biotin rutini",
    text: "Şampun, maska və kondisioner — sulfatsız, duzsuz. Dəst halında 20% endirimlə: 32,70 ₼ → 26,16 ₼.",
    big: "−20%",
    href: "/mehsullar/redist-biotin-set/",
    cta: "Dəsti al",
    bg: "#3a1f1c",
    fg: "light",
    accentColor: "#f2a7b0",
  },
  {
    poster: "/img/promo/nouvelle-curl-bestsellers.webp",
    eyebrow: "Nouvelle · Curl Me Up",
    title: "Buruqlar üçün",
    accent: "tam qayğı",
    text: "Şampun, maska və sprey — vegan formula ilə nəmləndirir, buruqları dəranır. Paket 10% endirimlə: 48 ₼ → 43,20 ₼.",
    big: "−10%",
    href: "/mehsullar/nouvelle-curl-me-up-set/",
    cta: "Dəstə bax",
    bg: "#f6e6e2",
    fg: "dark",
    accentColor: "#c8102e",
  },
];

const DELAY = 6000;

export default function CampaignSlider() {
  const swiper = useRef<SwiperT | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const cur = SLIDES[index];
  const { t, href } = useLang();
  const c = t.campaigns;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <SectionHeading eyebrow={c.eyebrow} title={c.title} />
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl tabular-nums">
              <span className="text-rose">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-muted"> / {String(SLIDES.length).padStart(2, "0")}</span>
            </span>
            <button onClick={() => swiper.current?.slidePrev()} className="grid size-12 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-ivory" aria-label={t.common.prev}>
              <ArrowLeft className="size-4" />
            </button>
            <button onClick={() => swiper.current?.slideNext()} className="grid size-12 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-ivory" aria-label={t.common.next}>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]"
          animate={{ backgroundColor: cur.bg }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Swiper
            modules={[Autoplay, EffectCreative, Parallax, Keyboard, A11y]}
            onSwiper={(s) => (swiper.current = s)}
            onSlideChange={(s) => setIndex(s.realIndex)}
            onAutoplayTimeLeft={(_, __, p) => bar.current?.style.setProperty("transform", `scaleX(${1 - p})`)}
            loop
            speed={1100}
            parallax
            grabCursor
            keyboard={{ enabled: true }}
            autoplay={{ delay: DELAY, disableOnInteraction: false, pauseOnMouseEnter: true }}
            effect="creative"
            creativeEffect={{
              prev: { translate: ["-25%", 0, -1], opacity: 0 },
              next: { translate: ["100%", 0, 0] },
            }}
          >
            {SLIDES.map((s, i) => {
              const light = s.fg === "light";
              const tx = c.slides[i];
              const big = c.bigs[i];
              return (
                <SwiperSlide key={s.poster} style={{ background: s.bg }}>
                  <div className="relative grid min-h-[620px] items-center gap-8 overflow-hidden p-6 sm:p-10 md:grid-cols-[1.1fr_1fr] lg:min-h-[640px] lg:p-16">
                    <span
                      aria-hidden
                      data-swiper-parallax="-30%"
                      className="pointer-events-none absolute -bottom-[0.18em] left-2 font-display text-[34vw] leading-none font-semibold tracking-tighter whitespace-nowrap opacity-[0.07] select-none md:text-[16rem] lg:text-[20rem]"
                      style={{ color: light ? "#fff" : "#151214" }}
                    >
                      {big}
                    </span>

                    <div className={`relative z-10 order-2 md:order-1 ${light ? "text-ivory" : "text-ink"}`}>
                      <p data-swiper-parallax="-120" className="eyebrow mb-5" style={{ color: s.accentColor }}>
                        {s.eyebrow}
                      </p>
                      <h3 data-swiper-parallax="-260" className="font-display text-[2.6rem] leading-[0.95] font-medium tracking-tight sm:text-6xl lg:text-7xl">
                        {tx.title} <em style={{ color: s.accentColor }}>{tx.accent}</em>
                      </h3>
                      <p data-swiper-parallax="-380" className={`mt-5 max-w-md text-base leading-relaxed sm:text-lg ${light ? "text-ivory/70" : "text-muted"}`}>
                        {tx.text}
                      </p>
                      <div data-swiper-parallax="-480" className="mt-8 flex flex-wrap items-center gap-4">
                        <Link href={href(s.href)} className={`btn ${light ? "btn-light" : "btn-primary"}`}>
                          {tx.cta} <ArrowUpRight className="size-4" />
                        </Link>
                        <span className="font-display text-4xl font-semibold italic" style={{ color: s.accentColor }}>
                          {big}
                        </span>
                      </div>
                    </div>

                    <div className="relative order-1 mx-auto w-full max-w-[300px] md:order-2 md:max-w-[400px]" data-swiper-parallax="-15%">
                      <div className="relative aspect-[4/5] rotate-[2.5deg] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-white/20 transition-transform duration-700 hover:rotate-0">
                        <Image src={s.poster} alt={`${s.eyebrow} — ${tx.title} ${tx.accent}`} fill sizes="(max-width: 768px) 80vw, 400px" priority={i === 0} className="object-cover" />
                      </div>
                      <div className="absolute -top-4 -left-4 grid size-20 rotate-[-12deg] place-items-center rounded-full text-center text-white shadow-xl sm:size-24" style={{ background: s.accentColor }}>
                        <span className="font-display text-xl leading-none font-semibold sm:text-2xl">{big}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="absolute inset-x-6 bottom-5 z-10 h-[3px] overflow-hidden rounded-full bg-white/20 sm:inset-x-10 lg:inset-x-16">
            <span ref={bar} className="block h-full origin-left rounded-full" style={{ background: cur.accentColor, transform: "scaleX(0)" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
