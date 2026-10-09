import type { Metadata, Viewport } from "next";
import { display, sans } from "@/app/fonts";
import { SITE } from "@/lib/site";
import type { Lang } from "@/lib/i18n/config";
import { LangProvider } from "@/lib/i18n/context";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CartToast from "./CartToast";
import FloatingContact from "./FloatingContact";
import SmoothScroll from "./SmoothScroll";
import Loader from "./Loader";
import { ManagerCardModal } from "@/components/manager/ManagerCard";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  keywords: ["Nouvelle", "Kera Sublime", "RedOne wax", "Razorline", "Redist", "keratin", "barber", "Baku", "Bakı"],
};

export const rootViewport: Viewport = {
  themeColor: "#f8f3ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    // Loader skripti `<html>`-ə hidrasiyadan əvvəl sinif əlavə edir
    <html lang={lang} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Loader />
        <LangProvider lang={lang}>
          <SmoothScroll />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
          <FloatingContact />
          <ManagerCardModal />
        </LangProvider>
      </body>
    </html>
  );
}
