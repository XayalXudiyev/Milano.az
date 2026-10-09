"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState, useSyncExternalStore, type MouseEvent } from "react";
import { Check, Copy, Mail, Phone, X, RotateCw } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { useLang } from "@/lib/i18n/context";
import { WhatsAppIcon, Sparkle } from "@/components/ui/Icons";
import { lockScroll } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/format";
import MilanoLogo from "@/components/ui/MilanoLogo";

/* ───────── kiçik qlobal vəziyyət (kart haradan açıldı) ───────── */
type Origin = { x: number; y: number; w: number; vw: number; vh: number } | null;
let origin: Origin = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
export const managerCard = {
  open(el?: HTMLElement | null) {
    const r = el?.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, vw, vh } : { x: vw / 2, y: vh, w: 80, vw, vh };
    emit();
  },
  close() {
    origin = null;
    emit();
  },
};
const useOrigin = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => origin,
    () => null,
  );

/* ───────── kopyalama düyməsi ───────── */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function CopyRow({ icon, label, value, href, copyValue }: { icon: React.ReactNode; label: string; value: string; href: string; copyValue: string }) {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const onCopy = async (e: MouseEvent) => {
    e.stopPropagation();
    await copyText(copyValue);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <div className="relative flex items-center gap-2.5 rounded-2xl bg-white/[0.07] p-1.5 pl-2.5 ring-1 ring-white/10 backdrop-blur">
      <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-2">{icon}</span>
      <a href={href} onClick={(e) => e.stopPropagation()} className="min-w-0 flex-1">
        <span className="block text-[0.55rem] tracking-[0.2em] text-white/45 uppercase">{label}</span>
        <span className="block truncate text-[0.88rem] font-semibold tracking-wide text-white tabular-nums">{value}</span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
          done ? "bg-[#1f9f55] text-white" : "bg-gold-2 text-ink hover:bg-white",
        )}
        aria-label={`${t.manager.copy}: ${value}`}
        title={t.manager.copy}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={done ? "ok" : "copy"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
            {done ? <Check className="size-4" /> : <Copy className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {done && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            className="pointer-events-none absolute -top-3 right-1 rounded-full bg-[#1f9f55] px-2.5 py-0.5 text-[0.65rem] font-bold text-white shadow-lg"
            role="status"
          >
            {t.manager.copied}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── bank kartı üzü: çip ───────── */
function Chip() {
  return (
    <svg viewBox="0 0 48 36" className="h-7 w-9" aria-hidden>
      <defs>
        <linearGradient id="chipg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfae" />
          <stop offset="0.5" stopColor="#c9a25e" />
          <stop offset="1" stopColor="#f1d79a" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="46" height="34" rx="7" fill="url(#chipg)" />
      <path d="M1 12h14M1 24h14M33 12h14M33 24h14M15 1v34M33 1v34M15 18h18" stroke="#8a6a32" strokeWidth="1.2" fill="none" opacity=".6" />
    </svg>
  );
}

/* ───────── modal + 3D kart ───────── */
export function ManagerCardModal() {
  const o = useOrigin();
  const { t } = useLang();
  const [flipped, setFlipped] = useState(false);

  // siçan ilə yüngül 3D əyilmə + parıltı
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const tiltX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 });
  const tiltY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 15 });
  const glare = useTransform([mx, my], ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.28), transparent 45%)`);

  const open = o !== null;
  // modal hər açılanda kart üz tərəfi ilə başlayır
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setFlipped(false);
  }

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && managerCard.close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const vw = { w: o?.vw ?? 1000, h: o?.vh ?? 800 };
  // kartın ölçüsü: şaquli bank kartı nisbəti (54 × 85.6)
  const cardH = Math.min(560, vw.h * 0.78, (Math.min(vw.w * 0.88, 360) * 85.6) / 54);
  const cardW = (cardH * 54) / 85.6;
  const from = o ? { x: o.x - vw.w / 2, y: o.y - vw.h / 2, scale: Math.max(0.12, o.w / cardW) } : { x: 0, y: 0, scale: 0.2 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center" role="dialog" aria-modal="true" aria-label={`${SITE.manager.name} — ${t.manager.role}`}>
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={managerCard.close}
          />
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.6 } }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={managerCard.close}
            className="absolute top-4 right-4 z-10 grid size-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label={t.common.close}
          >
            <X className="size-5" />
          </motion.button>

          <div className="relative flex flex-col items-center gap-5" style={{ perspective: 1600 }}>
            {/* uçuş + fırlanma (bank kartı effekti) */}
            <motion.div
              initial={{ x: from.x, y: from.y, scale: from.scale, rotateY: -540, rotateZ: -25, opacity: 0.4 }}
              animate={{ x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0, opacity: 1 }}
              exit={{ x: from.x, y: from.y, scale: from.scale, rotateY: 360, rotateZ: 20, opacity: 0 }}
              transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d", width: cardW, height: cardH }}
            >
              <motion.div
                style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
                className="size-full"
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse") return;
                  const r = e.currentTarget.getBoundingClientRect();
                  mx.set((e.clientX - r.left) / r.width);
                  my.set((e.clientY - r.top) / r.height);
                }}
                onPointerLeave={() => {
                  mx.set(0.5);
                  my.set(0.5);
                }}
              >
                <motion.div
                  className="relative size-full cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 70, damping: 14 }}
                  onClick={() => setFlipped((f) => !f)}
                >
                  {/* ÜZ */}
                  <div className="absolute inset-0 overflow-hidden rounded-[26px] bg-ink text-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/15 [backface-visibility:hidden]">
                    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,#9a2a44_0%,transparent_55%),radial-gradient(90%_70%_at_0%_100%,#5b4423_0%,transparent_60%)]" />
                    <div className="relative h-[46%] overflow-hidden">
                      <Image src={SITE.manager.photo} alt={SITE.manager.name} fill sizes="360px" className="object-cover object-[50%_30%]" priority />
                      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink" />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <MilanoLogo className="h-5 text-white drop-shadow" />
                      </div>
                      <svg viewBox="0 0 24 24" className="absolute top-4 right-4 size-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M8.5 7.5a7 7 0 0 1 0 9M12 5a10.5 10.5 0 0 1 0 14M5 10a3 3 0 0 1 0 4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="relative flex h-[54%] flex-col px-4 pt-1 pb-4 sm:px-5">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="eyebrow text-[0.55rem] text-gold-2">{t.manager.role}</p>
                          <p className="truncate font-display text-[1.9rem] leading-none font-semibold">{SITE.manager.name}</p>
                        </div>
                        <Chip />
                      </div>
                      <div className="mt-3 flex flex-1 flex-col justify-center gap-2">
                        {SITE.phones.map((p) => (
                          <CopyRow key={p.display} icon={<Phone className="size-4" />} label={t.manager.phone} value={p.display} href={p.href} copyValue={p.display.replace(/\s/g, "")} />
                        ))}
                        <CopyRow icon={<Mail className="size-4" />} label={t.manager.email} value={SITE.email} href={`mailto:${SITE.email}`} copyValue={SITE.email} />
                      </div>
                    </div>
                    <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-[26px]" />
                  </div>

                  {/* ARXA */}
                  <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-rose text-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/20 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(100%_60%_at_0%_0%,#e8b6bd_0%,transparent_60%),radial-gradient(80%_60%_at_100%_100%,#6d1830_0%,transparent_60%)]" />
                    <div className="relative mt-8 h-12 bg-ink/85" />
                    <div className="relative mx-5 mt-5 flex h-11 items-center justify-between rounded-md bg-[repeating-linear-gradient(135deg,#fff_0_6px,#f4d9dc_6px_12px)] px-3 text-ink">
                      <span className="font-display text-lg italic">{SITE.manager.name}</span>
                      <span className="text-[0.6rem] font-bold tracking-widest">OFFICIAL</span>
                    </div>
                    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                      <Sparkle className="size-8 text-gold-2" />
                      <MilanoLogo className="h-10 text-white" />
                      <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase">Milano MMC</p>
                      <p className="text-sm text-white/80">{t.manager.back}</p>
                      <p className="font-display text-lg text-white/90 italic">Nouvelle · Redist · RedOne · Razorline</p>
                    </div>
                    <div className="relative flex items-center justify-between px-5 pb-5 text-[0.65rem] tracking-[0.2em] text-white/70 uppercase">
                      <span>{SITE.instagramHandle}</span>
                      <span>2026</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.9 } }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <a href={whatsappLink(t.manager.greeting)} target="_blank" rel="noreferrer" className="btn h-11 bg-[#25D366] px-5 text-sm text-white">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
              <button onClick={() => setFlipped((f) => !f)} className="btn h-11 bg-white/10 px-5 text-sm text-white backdrop-blur hover:bg-white/20">
                <RotateCw className="size-4" /> {t.manager.flip}
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── açma düymələri ───────── */
export function ManagerTrigger({ variant = "button", className, light }: { variant?: "button" | "card" | "avatar"; className?: string; light?: boolean }) {
  const { t } = useLang();

  if (variant === "card") {
    return (
      <motion.button
        type="button"
        onClick={(e) => managerCard.open(e.currentTarget)}
        whileHover={{ rotate: -2, y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={cn("group relative block w-full max-w-[300px] overflow-hidden rounded-[22px] bg-ink text-left text-white shadow-2xl ring-1 ring-white/10", className)}
        aria-label={t.manager.open}
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,#9a2a44_0%,transparent_55%)]" />
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={SITE.manager.photo} alt={SITE.manager.name} fill sizes="300px" className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
        </div>
        <div className="relative p-5 pt-1">
          <p className="eyebrow text-[0.55rem] text-gold-2">{t.manager.role}</p>
          <p className="font-display text-3xl font-semibold">{SITE.manager.name}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <RotateCw className="size-4 text-gold-2 transition-transform duration-700 group-hover:rotate-180" />
            {t.manager.open}
          </p>
        </div>
      </motion.button>
    );
  }

  if (variant === "avatar") {
    return (
      <button
        type="button"
        onClick={(e) => managerCard.open(e.currentTarget)}
        className={cn("relative size-11 overflow-hidden rounded-full ring-2 ring-rose ring-offset-2 ring-offset-ivory transition-transform hover:scale-105", className)}
        aria-label={t.manager.open}
        title={t.manager.openShort}
      >
        <Image src={SITE.manager.photo} alt="" fill sizes="44px" className="object-cover object-[50%_30%]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => managerCard.open(e.currentTarget)}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 text-left text-sm font-semibold transition-colors",
        light ? "bg-white/10 text-white hover:bg-white/15" : "bg-white text-ink shadow-sm ring-1 ring-line hover:ring-ink",
        className,
      )}
    >
      <span className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-rose">
        <Image src={SITE.manager.photo} alt="" fill sizes="40px" className="object-cover object-[50%_30%]" />
      </span>
      <span className="leading-tight">
        <span className={cn("block text-[0.62rem] tracking-[0.18em] uppercase", light ? "text-gold-2" : "text-rose")}>
          {SITE.manager.name} · {t.manager.role}
        </span>
        {t.manager.open}
      </span>
    </button>
  );
}
