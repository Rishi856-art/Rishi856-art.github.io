"use client";

import type { Photo } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";

export function PhotoGrid({ photos, filters = true }: { photos: Photo[]; filters?: boolean }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))], [photos]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const visible = filter === "All" ? photos : photos.filter((photo) => photo.category === filter);
  const move = (direction: number) => setSelected((value) => value === null ? null : (value + direction + visible.length) % visible.length);

  return (
    <>
      {filters && <div className="mb-10 flex flex-wrap gap-2">{categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[.18em] transition ${filter === category ? "border-gold bg-gold text-ink" : "border-white/15 text-white/55 hover:border-white/40"}`}>{category}</button>)}</div>}
      <motion.div layout className="masonry">
        <AnimatePresence>{visible.map((photo, index) => <motion.button layout key={photo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(index)} className="group relative block w-full overflow-hidden bg-white/5 text-left"><img src={photo.image_url} alt={photo.alt_text} loading="lazy" className="h-auto w-full transition duration-700 group-hover:scale-[1.03]"/><span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"/><span className="absolute bottom-0 left-0 translate-y-3 p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"><span className="block font-display text-2xl">{photo.title}</span><span className="text-[9px] uppercase tracking-[.25em] text-gold">{photo.category}</span></span></motion.button>)}</AnimatePresence>
      </motion.div>
      <AnimatePresence>{selected !== null && visible[selected] && <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><button className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-3" aria-label="Close"><X/></button><button onClick={(e) => { e.stopPropagation(); move(-1); }} className="absolute left-3 z-10 rounded-full bg-white/10 p-3 sm:left-8" aria-label="Previous"><ChevronLeft/></button><motion.img key={visible[selected].id} src={visible[selected].image_url} alt={visible[selected].alt_text} className="max-h-full max-w-full object-contain" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}/><button onClick={(e) => { e.stopPropagation(); move(1); }} className="absolute right-3 z-10 rounded-full bg-white/10 p-3 sm:right-8" aria-label="Next"><ChevronRight/></button><div className="absolute bottom-5 left-5"><p className="font-display text-2xl">{visible[selected].title}</p><p className="eyebrow mt-1">{visible[selected].category}</p></div></motion.div>}</AnimatePresence>
    </>
  );
}
