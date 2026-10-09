"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { discountedMix } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCarousel from "@/components/product/ProductCarousel";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n/context";

export default function DealsSection() {
  const items = discountedMix().slice(0, 14);
  const { t, href } = useLang();
  return (
    <section className="overflow-hidden bg-cream py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={t.deals.eyebrow} title={t.deals.title} text={t.deals.text} />
          <Reveal className="flex flex-col items-start gap-4 lg:items-end">
            <Link href={href("/endirimler/")} className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="link-underline">{t.common.allDeals}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <ProductCarousel products={items} />
      </div>
    </section>
  );
}
