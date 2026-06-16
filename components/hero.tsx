"use client";

import type { Photo } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

export function Hero({ photos }: { photos: Photo[] }) {
  const slides = photos.length ? photos.slice(0, 5) : [];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setActive((value) => (value + 1) % slides.length), 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="noise relative min-h-screen overflow-hidden">
      <AnimatePresence mode="sync">
        {slides[active] && <motion.img key={slides[active].id} src={slides[active].image_url} alt={slides[active].alt_text} className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} />}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
      <div className="page-shell relative z-10 flex min-h-screen items-end pb-24 pt-32 sm:items-center sm:pb-0">
        <div className="max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="eyebrow mb-6">Photographer · Visual storyteller</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: 1 }} className="display-title text-[18vw] sm:text-8xl lg:text-[9rem]">Stories held<br/><em className="font-light text-white/65">in light.</em></motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }} className="mt-9 flex flex-wrap gap-3"><Link href="/gallery" className="button-primary">Explore work <ArrowUpRight size={15}/></Link><Link href="/contact" className="button-ghost">Start a project</Link></motion.div>
        </div>
      </div>
      <a href="#intro" className="absolute bottom-8 right-8 z-10 hidden items-center gap-3 text-[10px] uppercase tracking-[.28em] text-white/50 sm:flex"><span>Scroll to discover</span><span className="scroll-line h-8 w-px bg-white"/><ArrowDown size={13}/></a>
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 gap-2 lg:flex">{slides.map((photo, index) => <button key={photo.id} aria-label={`Show slide ${index + 1}`} onClick={() => setActive(index)} className={`h-px transition-all ${active === index ? "w-10 bg-gold" : "w-5 bg-white/40"}`}/>)}</div>
    </section>
  );
}
