"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { BadgeCheck, Truck, MessagesSquare, Store } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { BRANDS, SKU_COUNT } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => `${Math.round(n)}${suffix}`);
  useEffect(() => {
    if (inView) animate(v, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

const ICONS = [BadgeCheck, Truck, MessagesSquare, Store];
const STAT_VALUES = [
  { to: BRANDS.length, s: "" },
  { to: Math.floor(SKU_COUNT / 10) * 10, s: "+" },
  { to: 40, s: "%" },
  { to: 24, s: "/7" },
];

export default function WhyUs() {
  const { t } = useLang();
  const ITEMS = t.why.items.map((x, i) => ({ ...x, Icon: ICONS[i] }));
  const STATS = STAT_VALUES.map((x, i) => ({ ...x, l: t.why.stats[i] }));
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading align="center" eyebrow={t.why.eyebrow} title={t.why.title} className="mb-14" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ Icon, t, d }, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-[1.75rem] border border-line bg-white/50 p-7 transition-colors duration-500 hover:border-transparent hover:bg-ink hover:text-ivory"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-blush text-rose transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-rose group-hover:text-white">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-6 text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted transition-colors group-hover:text-white/60">{d}</p>
          </motion.div>
        ))}
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="text-center">
            <dt className="font-display text-6xl font-semibold tracking-tight text-ink sm:text-7xl">
              <Counter to={s.to} suffix={s.s} />
            </dt>
            <dd className="mt-1 text-sm text-muted">{s.l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
