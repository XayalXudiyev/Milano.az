"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS, type Category } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/format";

function TiltCard({ c, className, index }: { c: Category; className?: string; index: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 150, damping: 18 });
  const count = PRODUCTS.filter((p) => p.category === c.slug).length;
  const { t, href } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn("[perspective:1200px]", className)}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry }}
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
        className="group relative h-full overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]"
      >
        <Link href={href(`/mehsullar/?kateqoriya=${c.slug}`)} className="block h-full min-h-[220px]" style={{ background: c.tint }}>
          <Image
            src={c.image}
            alt={c.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-110"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <span className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/90 text-ink transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-rose group-hover:text-white">
            <ArrowUpRight className="size-5" />
          </span>
          <span className="absolute inset-x-0 bottom-0 p-5 text-ivory sm:p-7">
            <span className="eyebrow text-[0.6rem] text-white/70">{t.common.productsCount(count)}</span>
            <span className="mt-1 block font-display text-[1.6rem] leading-[0.95] font-medium sm:text-4xl">{c.name}</span>
            <span className="mt-2 block max-h-0 overflow-hidden text-sm text-white/75 opacity-0 transition-all duration-700 ease-out-expo group-hover:max-h-10 group-hover:opacity-100">
              {c.short}
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function CategoryBento() {
  const { t, categories } = useLang();
  const [a, b, c, d, e, f] = categories();
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading eyebrow={t.categories.eyebrow} title={t.categories.title} className="mb-12" />
      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:grid-cols-4">
        <TiltCard c={b} index={0} className="col-span-2 row-span-2" />
        <TiltCard c={a} index={1} />
        <TiltCard c={e} index={2} />
        <TiltCard c={c} index={3} className="col-span-2" />
        <TiltCard c={d} index={4} className="col-span-2" />
        {f && <TiltCard c={f} index={5} className="col-span-2" />}
      </div>
    </section>
  );
}
