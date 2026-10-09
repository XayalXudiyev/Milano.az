"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";
import { useLang } from "@/lib/i18n/context";
import MilanoLogo from "./MilanoLogo";

export default function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  const { href, t } = useLang();
  return (
    <Link href={href("/")} aria-label={`${SITE.name} — ${t.nav.home}`} className={`group inline-flex items-center gap-2.5 ${className}`}>
      <MilanoLogo className={`h-6 transition-opacity duration-300 group-hover:opacity-80 lg:h-7 ${light ? "text-ivory" : "text-ink"}`} />
    </Link>
  );
}
