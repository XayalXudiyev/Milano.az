"use client";

import Marquee from "@/components/ui/Marquee";
import { Sparkle } from "@/components/ui/Icons";
import { useLang } from "@/lib/i18n/context";

const B = ["Nouvelle", "Redist", "RedOne", "Razorline", "Naspura", "Artego", "Fresh Feel"];

export default function MarqueeBand() {
  const A = useLang().t.marquee;
  return (
    <section aria-label="Milano MMC" className="relative z-10 -my-4 overflow-hidden py-10">
      <div className="-rotate-2 bg-rose py-4 text-white shadow-xl sm:py-5">
        <Marquee duration={32}>
          {A.map((t) => (
            <span key={t} className="flex items-center gap-8 px-4 text-lg font-semibold tracking-tight uppercase sm:text-2xl">
              {t}
              <Sparkle className="size-4 text-gold-2" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="mt-[-6px] rotate-1 bg-ink py-4 text-ivory sm:py-5">
        <Marquee duration={40} reverse>
          {B.map((t) => (
            <span key={t} className="flex items-center gap-8 px-4 font-display text-2xl font-medium italic sm:text-4xl">
              {t}
              <span className="size-2 rounded-full bg-rose" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
