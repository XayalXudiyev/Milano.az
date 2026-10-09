// Saytın əsas məlumatları — ad, əlaqə və s. buradan dəyişdirilir.
export const SITE = {
  name: "Milano MMC",
  // Domen: NEXT_PUBLIC_SITE_URL ilə dəyişdirilə bilər (sitemap, robots, OG şəkillər üçün)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://milano.az",
  phones: [
    { display: "055 426 24 39", href: "tel:+994554262439" },
    { display: "051 230 31 30", href: "tel:+994512303130" },
  ],
  email: "talehxudiyev12@gmail.com",
  whatsapp: "994554262439",
  instagram: "https://www.instagram.com/milano_mmc/",
  instagramHandle: "@milano_mmc",
  manager: {
    name: "Taleh Xudiyev",
    photo: "/img/taleh-xudiyev.webp",
  },
} as const;

export const PHONE = SITE.phones[0];

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
