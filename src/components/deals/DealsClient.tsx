"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { discounted } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

const OFFER_STYLE = [
  { bg: "#151214", fg: "#f8f3ef", accent: "#d9bd8c", img: "/img/hq/cck006.webp", href: "/brendler/razorline/", span: "lg:col-span-2 lg:row-span-2" },
  { bg: "#c8102e", fg: "#ffffff", accent: "#ffd3d8", img: "/img/hq/wax-red.webp", href: "/brendler/redone/", span: "" },
  { bg: "#f4d9dc", fg: "#151214", accent: "#c2415e", img: "/img/hq/kera-oil.webp", href: "/mehsullar/nouvelle-kera-sublime-set/", span: "" },
  { bg: "#d6e4ef", fg: "#151214", accent: "#c8102e", img: "/img/hq/curl-spray.webp", href: "/mehsullar/nouvelle-curl-me-up-set/", span: "" },
  { bg: "#ece7e0", fg: "#151214", accent: "#b8935a", img: "/img/p/brush-45.webp", href: "/brendler/artego/", span: "" },
];

export default function DealsClient() {
  const { t, href } = useLang();
  const d = t.dealsPage;
  const items = discounted();
  const tiers = [...new Set(items.map((p) => p.discount!))].sort((a, b) => b - a);

  return (
    <>
      <section className="container-x pb-16">
        <div className="grid auto-rows-[200px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.offers.map((o, i) => {
            const s = OFFER_STYLE[i];
            return (
              <motion.div
                key={o.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={s.span}
              >
                <Link href={href(s.href)} className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-6" style={{ background: s.bg, color: s.fg }}>
                  <span className="relative z-10 font-display text-6xl leading-none font-semibold sm:text-7xl" style={{ color: s.accent }}>
                    {o.big}
                  </span>
                  <span className="relative z-10">
                    <span className="block text-xl font-semibold">{o.t}</span>
                    <span className="block text-sm opacity-70">{o.d}</span>
                  </span>
                  <span className="absolute -right-6 -bottom-6 w-[46%] transition-transform duration-700 ease-out-expo group-hover:scale-110 group-hover:-rotate-6">
                    <Image src={s.img} alt="" width={400} height={500} className={`h-auto w-full ${s.img.includes("/p/") ? "mix-blend-multiply" : "drop-shadow-2xl"}`} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {tiers.map((tier) => (
        <section key={tier} id={`endirim-${tier}`} className="container-x scroll-mt-24 py-12">
          <SectionHeading title={`*${d.tier(tier)}*`} className="mb-10" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
            {items
              .filter((p) => p.discount === tier)
              .map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
          </div>
        </section>
      ))}
      <div className="pb-16" />
    </>
  );
}
