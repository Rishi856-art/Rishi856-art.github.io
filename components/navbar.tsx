"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["Home", "/"], ["Album", "/albums"], ["Gallery", "/gallery"], ["Contact Us", "/contact"],
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? "border-b border-white/10 bg-ink/90 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="page-shell flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-[0.18em]">RISHI<span className="text-gold">.</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => <Link key={href} href={href} className={`text-[11px] uppercase tracking-[0.22em] transition hover:text-gold ${pathname === href ? "text-gold" : "text-white/70"}`}>{label}</Link>)}
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="page-shell flex flex-col gap-5 pb-8 md:hidden">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="font-display text-4xl text-white/80">{label}</Link>)}</nav>}
    </header>
  );
}
