"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Səhifə kilidi (modal/menyu açıq olanda) */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Telefonda native scroll həm daha axıcıdır, həm də hər kadr işləyən rAF dövrəsi olmur
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    // giriş ekranı açıq olanda scroll gözləyir (Loader.tsx)
    if (document.documentElement.classList.contains("is-loading")) {
      lenis.stop();
      window.addEventListener("nv:loaded", () => lenis?.start(), { once: true });
    }
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Hər səhifənin son scroll mövqeyini yadda saxla; geri/irəli düyməsində bərpa olunur
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    let raf = 0;
    const save = () => {
      if (popY !== null || restoring) return; // bərpa gedərkən yazma
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(scrollKey(), String(Math.round(window.scrollY)));
        } catch {}
      });
    };
    const onPop = () => {
      // URL artıq qayıdılan səhifəyə dəyişib — mövqeyi dərhal oxu (sonrakı scroll hadisələri onu korlamasın)
      try {
        popY = Number(sessionStorage.getItem(scrollKey())) || 0;
      } catch {
        popY = 0;
      }
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", save);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    if (popY === null) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      if (!lenis) window.scrollTo(0, 0);
      return;
    }
    const y = popY;
    popY = null;
    restoring = true;
    // Məzmun tam render olunana qədər bir neçə kadr gözlə, sonra həmin yerə qayıt
    let tries = 0;
    let raf = 0;
    const restore = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max >= y || tries++ > 60) {
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        restoring = false;
        return;
      }
      raf = requestAnimationFrame(restore);
    };
    raf = requestAnimationFrame(restore);
    return () => {
      cancelAnimationFrame(raf);
      restoring = false;
    };
  }, [pathname]);

  return null;
}

/** Geri/irəli naviqasiyasında bərpa olunacaq mövqe (null — adi keçid). */
let popY: number | null = null;
let restoring = false;
const scrollKey = () => `nv-scroll:${window.location.pathname}${window.location.search}`;
