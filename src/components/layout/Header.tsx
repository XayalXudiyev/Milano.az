"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, ChevronDown } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useLang } from "@/lib/i18n/context";
import { stripLocale } from "@/lib/i18n/config";
import { ManagerTrigger } from "@/components/manager/ManagerCard";
import LangSwitcher from "./LangSwitcher";
import { useNav } from "./useNav";
import { cart, useCart, resolve, totals } from "@/lib/cart";
import { cn } from "@/lib/format";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";

function AnnouncementBar() {
  const { t } = useLang();
  const ANNOUNCEMENTS = t.announce;
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % ANNOUNCEMENTS.length), 4200);
    return () => clearInterval(id);
  }, [ANNOUNCEMENTS.length]);
  return (
    <div className="relative h-9 overflow-hidden bg-ink text-[0.72rem] font-medium tracking-wide text-ivory sm:text-xs">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center"
        >
          <span className="mr-2 text-gold-2">✦</span>
          {ANNOUNCEMENTS[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function MegaMenu({ onClose }: { onClose: () => void }) {
  const { t, href, categories, brands } = useLang();
  const CATEGORIES = categories();
  const BRANDS = brands();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, clipPath: "inset(0 0 100% 0 round 28px)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 28px)" }}
      exit={{ opacity: 0, y: -6, clipPath: "inset(0 0 100% 0 round 28px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 mt-3 w-[min(1100px,calc(100vw-5rem))] -translate-x-1/2 rounded-[28px] border border-white/70 bg-ivory/95 p-6 shadow-[0_40px_80px_-30px_rgba(21,18,20,0.35)] backdrop-blur-xl"
    >
      <div className="grid grid-cols-[1fr_260px] gap-6">
        <div className="grid grid-cols-6 gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <Link href={href(`/mehsullar/?kateqoriya=${c.slug}`)} onClick={onClose} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl" style={{ background: c.tint }}>
                  <Image src={c.image} alt="" fill sizes="200px" className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-110" />
                </div>
                <p className="mt-2.5 text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted">{c.short}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl bg-cream p-5">
          <p className="eyebrow mb-3 text-rose">{t.nav.brands}</p>
          <ul className="space-y-1">
            {BRANDS.map((b) => (
              <li key={b.slug}>
                <Link href={href(`/brendler/${b.slug}/`)} onClick={onClose} className="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white">
                  <span className="font-display text-xl font-semibold">{b.name}</span>
                  <span className="text-[0.65rem] tracking-wider text-muted uppercase">{b.origin}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={href("/endirimler/")} onClick={onClose} className="btn btn-rose mt-4 h-11 w-full text-sm">
            {t.common.allDeals}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const pathname = stripLocale(usePathname());
  const { t } = useLang();
  const NAV = useNav();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef<boolean | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [mega, setMega] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const { lines } = useCart();
  const count = totals(resolve(lines)).count;

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    const hide = y > 300 && y > prev && !mega;
    setHidden(hide);
    // sticky elementlər (məs. kataloq filtri) header-in vəziyyətinə uyğunlaşır.
    // Yalnız dəyişəndə yazılır — <html>-ə hər scroll hadisəsində yazmaq bütün səhifənin stilini yenidən hesablatdırır.
    if (hide !== hiddenRef.current) {
      hiddenRef.current = hide;
      document.documentElement.style.setProperty("--header-offset", hide ? "0.75rem" : "5.5rem");
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (key: string) => (key === "/" ? pathname === "/" : pathname.startsWith(key.replace(/\/$/, "")));

  return (
    <>
      <AnnouncementBar />
      <motion.header
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3"
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-all duration-500 sm:pl-6 lg:h-[4.25rem]",
            scrolled || menu ? "card-glass shadow-[0_20px_50px_-25px_rgba(21,18,20,0.35)]" : "bg-transparent",
          )}
        >
          <Logo />

          <nav className="hidden items-center lg:flex" onMouseLeave={() => setHover(null)} aria-label={t.common.menu}>
            {NAV.map((item) => {
              const isProducts = item.key === "/mehsullar/";
              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => {
                    setHover(item.key);
                    setMega(isProducts);
                  }}
                  onMouseLeave={() => isProducts && setMega(false)}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMega(false)}
                    className={cn(
                      "relative z-10 flex items-center gap-1 rounded-full px-4 py-2.5 text-[0.9rem] font-medium transition-colors",
                      isActive(item.key) ? "text-rose" : "text-ink/80 hover:text-ink",
                    )}
                  >
                    {item.label}
                    {isProducts && <ChevronDown className={cn("size-3.5 transition-transform duration-300", mega && "rotate-180")} />}
                    {item.hot && <span className="ml-0.5 size-1.5 animate-pulse rounded-full bg-rose" />}
                  </Link>
                  {hover === item.key && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/80 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {isProducts && <AnimatePresence>{mega && <MegaMenu onClose={() => setMega(false)} />}</AnimatePresence>}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <ManagerTrigger variant="avatar" className="mr-2 hidden xl:block" />
            <div className="hidden sm:block">
              <LangSwitcher />
            </div>
            <button type="button" onClick={() => setSearch(true)} className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/70" aria-label={t.common.search}>
              <Search className="size-[1.15rem]" />
            </button>
            <button
              type="button"
              onClick={cart.open}
              className="relative grid size-11 place-items-center rounded-full bg-ink text-ivory transition-transform duration-500 ease-out-expo hover:scale-105"
              aria-label={`${t.common.cart} (${count})`}
            >
              <ShoppingBag className="size-[1.1rem]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 text-[0.65rem] font-bold text-white ring-2 ring-ivory"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button type="button" onClick={() => setMenu(true)} className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/70 lg:hidden" aria-label={t.common.menu}>
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menu} onClose={() => setMenu(false)} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
