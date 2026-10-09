import "./globals.css";
import type { Metadata } from "next";
import RootShell from "@/components/layout/RootShell";
import NotFoundView from "@/components/pages/NotFoundView";

export const metadata: Metadata = { title: "404 · Milano MMC" };

export default function GlobalNotFound() {
  return (
    <RootShell lang="az">
      <NotFoundView />
    </RootShell>
  );
}
