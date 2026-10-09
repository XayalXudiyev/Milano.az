"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X, Phone, ArrowUpRight } from "lucide-react";
import { PHONE, SITE, whatsappLink } from "@/lib/site";
import { useLang } from "@/lib/i18n/context";
import { WhatsAppIcon, InstagramIcon } from "@/components/ui/Icons";
import { ManagerTrigger } from "@/components/manager/ManagerCard";
import { lockScroll } from "./SmoothScroll";
import { useNav } from "./useNav";
import MilanoLogo from "@/components/ui/MilanoLogo";
import { LangInline } from "./LangSwitcher";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const NAV = useNav();

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-ink text-ivory lg:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label={t.common.menu}
          data-lenis-prevent
        >
          <div className="flex h-20 shrink-0 items-center justify-between px-5">
            <MilanoLogo className="h-7 text-ivory" />
            <button onClick={onClose} className="grid size-11 place-items-center rounded-full bg-white/10" aria-label={t.common.close}>
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-5" aria-label={t.common.menu}>
            {NAV.map((item, i) => (
              <div key={item.key} className="overflow-hidden">
                <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "110%" }} transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={item.href} onClick={onClose} className="group flex items-center justify-between border-b border-white/10 py-3">
                    <span className="font-display text-[2.4rem] leading-none font-medium sm:text-6xl">
                      {item.label}
                      {item.hot && <sup className="ml-2 align-super font-sans text-xs font-bold text-rose">−40%</sup>}
                    </span>
                    <ArrowUpRight className="size-6 text-white/40 transition-all group-hover:rotate-45 group-hover:text-rose" />
                  </Link>
                </motion.div>
              </div>
            ))}
          </nav>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="space-y-4 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LangInline />
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="flex h-11 min-w-0 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold" aria-label="Instagram">
                <InstagramIcon className="size-5 shrink-0" /> <span className="truncate">{SITE.instagramHandle}</span>
              </a>
            </div>
            <ManagerTrigger light className="w-full" />
            <div className="grid grid-cols-2 gap-3">
              <a href={PHONE.href} className="btn btn-light h-12 text-sm">
                <Phone className="size-4" /> {t.common.call}
              </a>
              <a href={whatsappLink(t.manager.greeting)} target="_blank" rel="noreferrer" className="btn h-12 bg-[#25D366] text-sm text-white">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
