import { cn } from "@/lib/format";

/** Milano MMC loqosu — "Milano.az" (vektor). Rəng `currentColor`-dan götürülür. */
export default function MilanoLogo({ className, title = "Milano MMC" }: { className?: string; title?: string }) {
  return (
    <span
      role="img"
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn("inline-block aspect-[4056/896] bg-current", className)}
      style={{
        WebkitMask: "url(/img/milano-logo.svg) center / contain no-repeat",
        mask: "url(/img/milano-logo.svg) center / contain no-repeat",
      }}
    />
  );
}
