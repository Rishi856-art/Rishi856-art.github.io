"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="page-shell flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div><div className="font-display text-3xl tracking-[.15em]">RISHI<span className="text-gold">.</span></div><p className="mt-2 text-xs uppercase tracking-[.2em] text-white/35">Frames shaped by feeling</p></div>
        <div className="flex items-center gap-5 text-white/50">
          <Link href="https://instagram.com/rishisrikar" aria-label="Instagram"><Instagram size={18} /></Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin size={18} /></Link>
          <Link href="mailto:rishiexperiments@gmail.com" aria-label="Email"><Mail size={18} /></Link>
          <span className="ml-4 text-[10px] uppercase tracking-[.2em]">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
