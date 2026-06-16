import Link from "next/link";
import { ArrowUpRight, Aperture, Camera, Compass, Sparkles } from "lucide-react";
import { Hero } from "@/components/hero";
import { PhotoGrid } from "@/components/photo-grid";
import { Reveal } from "@/components/reveal";
import { getPhotos } from "@/lib/data";

export default async function HomePage() {
  const photos = await getPhotos();
  const featured = photos.filter((photo) => photo.featured);
  const heroPhotos = featured.length ? featured : photos;

  return (
    <>
      <Hero photos={heroPhotos} />
      <section id="intro" className="page-shell grid gap-10 py-24 sm:py-36 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
        <Reveal><p className="eyebrow">Behind the lens</p><div className="mt-8 h-px w-24 bg-gold/60"/></Reveal>
        <Reveal delay={.1}><h2 className="font-display text-4xl font-light leading-tight sm:text-6xl">I photograph the space between what happened and <em className="text-gold">how it felt.</em></h2><p className="mt-8 max-w-2xl text-base leading-8 text-white/50">I’m Alex, an independent photographer drawn to human stories, untamed landscapes, and the poetry of everyday light. My work blends documentary honesty with a cinematic point of view.</p><Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[.2em] text-gold">Work with me <ArrowUpRight size={15}/></Link></Reveal>
      </section>

      <section className="border-y border-white/10 bg-white/[.025] py-24 sm:py-32">
        <div className="page-shell"><Reveal className="mb-12 flex items-end justify-between"><div><p className="eyebrow">Selected frames</p><h2 className="mt-4 font-display text-5xl sm:text-7xl">Featured work</h2></div><Link href="/gallery" className="hidden text-xs uppercase tracking-[.2em] text-white/50 sm:block">View all work →</Link></Reveal><PhotoGrid photos={photos.slice(0, 6)} filters={false}/></div>
      </section>

      <section className="page-shell py-24 sm:py-36">
        <Reveal><p className="eyebrow">What I photograph</p><h2 className="mt-4 font-display text-5xl sm:text-7xl">Built around feeling.</h2></Reveal>
        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[[Camera,"Portraits","Intimate portraits with texture, presence, and room to breathe."],[Compass,"Travel","Sense-of-place stories made on the road and far from it."],[Aperture,"Editorial","Clean visual narratives for brands, artists, and publications."],[Sparkles,"Cinematic","Atmospheric stills shaped by shadow, movement, and color."]].map(([Icon,title,text], index) => <Reveal key={String(title)} delay={index * .08} className="h-full bg-ink p-8 sm:p-10"><Icon className="text-gold" strokeWidth={1.2}/><h3 className="mt-14 font-display text-3xl">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-white/45">{String(text)}</p></Reveal>)}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#0c0c0b] py-24 sm:py-36"><div className="page-shell"><Reveal className="mx-auto max-w-4xl text-center"><p className="eyebrow">Kind words</p><blockquote className="mt-8 font-display text-4xl font-light leading-tight sm:text-6xl">“Alex didn’t just document the day. Somehow, every frame brings us back to exactly how it felt.”</blockquote><p className="mt-8 text-[10px] uppercase tracking-[.28em] text-white/40">Maya & Daniel · London</p></Reveal></div></section>

      <section className="page-shell py-24 text-center sm:py-36"><Reveal><p className="eyebrow">Have a story in mind?</p><h2 className="mt-5 font-display text-6xl sm:text-8xl">Let’s make it visible.</h2><Link href="/contact" className="button-primary mt-9">Start a conversation <ArrowUpRight size={15}/></Link></Reveal></section>
    </>
  );
}
