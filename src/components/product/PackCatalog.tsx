"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { finalPrice, getProduct, type Product } from "@/lib/data";
import { useLang } from "@/lib/i18n/context";
import { formatPrice, cn } from "@/lib/format";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/** Paket səhifəsində "Paketə daxildir" kataloqu — hər məhsul şəkli və məlumatı ilə. */
export default function PackCatalog({ product }: { product: Product }) {
  const { t, href, product: loc } = useLang();
  const tp = t.product.pack;
  const items = (product.pack ?? []).flatMap((it) => {
    const p = getProduct(it.slug);
    return p ? [{ ...it, p: loc(p) }] : [];
  });
  if (!items.length) return null;

  const separately = items.reduce((s, it) => s + it.p.price, 0);
  const inPack = finalPrice(product);
  const saved = Math.round((separately - inPack) * 100) / 100;

  return (
    <section className="mt-24 sm:mt-32">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow={tp.eyebrow} title={tp.title(items.length)} />
        <Reveal y={20} className="flex shrink-0 flex-wrap items-stretch gap-3">
          <div className="rounded-2xl border border-line bg-white/60 px-5 py-3">
            <p className="text-xs text-muted">{tp.separately}</p>
            <p className="text-lg font-semibold text-muted tabular-nums line-through">{formatPrice(separately)}</p>
          </div>
          <div className="rounded-2xl bg-ink px-5 py-3 text-ivory">
            <p className="text-xs text-white/60">{tp.inPack}</p>
            <p className="text-lg font-bold tabular-nums">{formatPrice(inPack)}</p>
          </div>
          {saved > 0 && (
            <div className="rounded-2xl bg-rose px-5 py-3 text-white">
              <p className="text-xs text-white/75">{t.product.save}</p>
              <p className="text-lg font-bold tabular-nums">
                {formatPrice(saved)} · −{product.discount}%
              </p>
            </div>
          )}
        </Reveal>
      </div>

      <ol className="mt-14 grid gap-16 sm:gap-24">
        {items.map((it, i) => (
          <li key={it.slug} className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn("relative lg:sticky lg:top-24", i % 2 === 1 && "lg:order-2")}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]" style={{ background: product.tint }}>
                <Image src={it.image} alt={it.p.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <span className="absolute top-5 left-5 grid size-14 place-items-center rounded-full bg-ivory/90 font-display text-xl font-semibold text-rose backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:py-6">
              <p className="eyebrow text-rose">
                {tp.step} {i + 1}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-tight font-semibold sm:text-4xl">{it.p.name}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {it.p.volume && <span className="rounded-full border border-line px-3 py-1">{it.p.volume}</span>}
                <span className="font-semibold tabular-nums">{formatPrice(it.p.price)}</span>
                <Link href={href(`/mehsullar/${it.slug}/`)} className="inline-flex items-center gap-1 text-rose hover:underline">
                  {tp.view} <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              <div className="mt-8 grid gap-6">
                {it.sections.map((s) => (
                  <div key={s.title} className="rounded-3xl border border-line bg-white/60 p-5 sm:p-6">
                    <h4 className="mb-3 font-semibold">{s.title}</h4>
                    {s.text && <p className="text-sm leading-relaxed text-muted">{s.text}</p>}
                    {s.list && (
                      <ul className="grid gap-2.5">
                        {s.list.map((li) => (
                          <li key={li} className="flex gap-3 text-sm leading-relaxed">
                            <Check className="mt-0.5 size-4 shrink-0 text-rose" />
                            <span>{li}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
