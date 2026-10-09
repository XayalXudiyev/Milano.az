"use client";

import Link from "next/link";
import { Phone, MapPin, Clock, ArrowUpRight, Mail } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { useLang } from "@/lib/i18n/context";
import { InstagramIcon, WhatsAppIcon, Sparkle } from "@/components/ui/Icons";
import Marquee from "@/components/ui/Marquee";
import { ManagerTrigger } from "@/components/manager/ManagerCard";
import { useNav } from "./useNav";
import { LangInline } from "./LangSwitcher";
import MilanoLogo from "@/components/ui/MilanoLogo";

export default function Footer() {
  const { t, href, categories, brands } = useLang();
  const NAV = useNav();
  const f = t.footer;
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <div className="border-b border-white/10 py-6">
        <Marquee duration={30}>
          {["Nouvelle", "Redist", "RedOne", "Razorline", "Naspura", "Artego", "Fresh Feel"].map((b) => (
            <span key={b} className="flex items-center gap-10 px-5 font-display text-5xl font-medium text-white/90 italic sm:text-7xl">
              {b}
              <Sparkle className="size-5 text-rose" />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <MilanoLogo className="mb-6 h-9 text-ivory" />
          <p className="font-display text-4xl leading-tight font-medium">
            {f.slogan} <span className="text-gold-2 italic">{f.sloganAccent}</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">{t.meta.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a href={whatsappLink(t.manager.greeting)} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[#25D366]" aria-label="WhatsApp">
              <WhatsAppIcon className="size-5" />
            </a>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-rose" aria-label="Instagram">
              <InstagramIcon className="size-5" />
            </a>
            <a href={`mailto:${SITE.email}`} className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-gold" aria-label={t.manager.email}>
              <Mail className="size-5" />
            </a>
            <LangInline className="ml-2" />
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5 text-gold-2">{f.categories}</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            {categories().map((c) => (
              <li key={c.slug}>
                <Link href={href(`/mehsullar/?kateqoriya=${c.slug}`)} className="link-underline hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5 text-gold-2">{f.brands}</p>
          <ul className="space-y-2.5 text-sm text-white/70">
            {brands().map((b) => (
              <li key={b.slug}>
                <Link href={href(`/brendler/${b.slug}/`)} className="link-underline hover:text-white">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5 text-gold-2">{f.contact}</p>
          <ul className="space-y-3 text-sm text-white/70">
            {SITE.phones.map((p) => (
              <li key={p.href}>
                <a href={p.href} className="group flex items-center gap-3 text-2xl font-semibold text-white tabular-nums">
                  {p.display}
                  <ArrowUpRight className="size-5 text-rose transition-transform group-hover:rotate-45" />
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 hover:text-white">
                <Mail className="size-4 text-rose" /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white">
                <InstagramIcon className="size-4 text-rose" /> {SITE.instagramHandle}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-rose" /> {f.address}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-rose" /> {f.hours}
            </li>
          </ul>
          <ManagerTrigger light className="mt-6" />
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row">
        <p>
          © 2026 {SITE.name}. {f.rights}
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {NAV.slice(1).map((n) => (
            <Link key={n.key} href={n.href} className="hover:text-white">
              {n.label}
            </Link>
          ))}
          <a href={SITE.phones[0].href} className="flex items-center gap-1 hover:text-white">
            <Phone className="size-3" /> {SITE.phones[0].display}
          </a>
        </nav>
      </div>

      <div aria-hidden className="pointer-events-none flex justify-center px-4 pb-6 select-none">
        <MilanoLogo title="" className="w-full max-w-[1200px] text-white/[0.05]" />
      </div>
    </footer>
  );
}
