"use client";

import Link from "next/link";
import { ArrowUpRight, Aperture, Camera, Compass, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Hero } from "@/components/hero";
import { PhotoGrid } from "@/components/photo-grid";
import { Reveal } from "@/components/reveal";
import { useLivePortfolioData } from "@/lib/live-data";
import type { Photo } from "@/lib/types";

export function HomeContent({ initialPhotos }: { initialPhotos: Photo[] }) {
  const { photos } = useLivePortfolioData(undefined, initialPhotos);
  const featured = photos.filter((photo) => photo.featured);
  const heroPhotos = featured.length ? featured : photos;
  const introPhotos = (featured.length ? featured : photos).slice(0, 3);
  const specialties: [LucideIcon, string, string][] = [
    [Camera, "Portraits", "Intimate portraits with texture, presence, and room to breathe."],
    [Compass, "Travel", "Sense-of-place stories made on the road and far from it."],
    [Aperture, "Editorial", "Clean visual narratives for brands, artists, and publications."],
    [Sparkles, "Cinematic", "Atmospheric stills shaped by shadow, movement, and color."],
  ];

  return (
    <>
      <Hero photos={heroPhotos} />

      <section id="intro" className="relative overflow-hidden border-b border-white/10 py-24 sm:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal className="relative">
            <p className="eyebrow">Behind the lens</p>
            <h2 className="mt-7 font-display text-4xl font-light leading-tight sm:text-6xl">
              I photograph the space between what happened and <em className="text-gold">how it felt.</em>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-8 text-white/50">
              I'm Rishi, a photographer drawn to human stories, cinematic moods, travel moments, and the poetry of everyday light. My work blends honest observation with a premium visual style.
            </p>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-px bg-white/10">
              {["Cinematic", "Travel", "Portraits"].map((item) => (
                <div key={item} className="bg-ink p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[.22em] text-gold">{item}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[.2em] text-gold">
              Work with me <ArrowUpRight size={15} />
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-12 gap-4">
            {introPhotos[0] && (
              <div className="col-span-7 overflow-hidden rounded-t-full border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
                <img src={introPhotos[0].image_url} alt={introPhotos[0].alt_text} className="aspect-[3/4] h-full w-full object-cover" />
              </div>
            )}
            <div className="col-span-5 space-y-4 pt-10">
              {introPhotos[1] && (
                <div className="overflow-hidden border border-white/10 bg-white/5 shadow-xl shadow-black/30">
                  <img src={introPhotos[1].image_url} alt={introPhotos[1].alt_text} className="aspect-[4/5] w-full object-cover" />
                </div>
              )}
              {introPhotos[2] && (
                <div className="overflow-hidden border border-white/10 bg-white/5 shadow-xl shadow-black/30">
                  <img src={introPhotos[2].image_url} alt={introPhotos[2].alt_text} className="aspect-video w-full object-cover" />
                </div>
              )}
            </div>
            <div className="col-span-12 glass -mt-3 ml-auto max-w-sm rounded-2xl p-5">
              <p className="eyebrow">Featured mood</p>
              <p className="mt-3 font-display text-3xl">{introPhotos[0]?.title || "New stories loading"}</p>
              <p className="mt-2 text-xs leading-6 text-white/45">
                A small preview of the work Rishi is building into this living portfolio.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[.025] py-24 sm:py-32">
        <div className="page-shell">
          <Reveal className="mb-12 flex items-end justify-between">
            <div>
              <p className="eyebrow">Selected frames</p>
              <h2 className="mt-4 font-display text-5xl sm:text-7xl">Featured work</h2>
            </div>
            <Link href="/gallery" className="hidden text-xs uppercase tracking-[.2em] text-white/50 sm:block">
              View all work -&gt;
            </Link>
          </Reveal>
          <PhotoGrid photos={photos.slice(0, 6)} filters={false} />
        </div>
      </section>

      <section className="page-shell py-24 sm:py-36">
        <Reveal>
          <p className="eyebrow">What I photograph</p>
          <h2 className="mt-4 font-display text-5xl sm:text-7xl">Built around feeling.</h2>
        </Reveal>
        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map(([Icon, title, text], index) => (
            <Reveal key={title} delay={index * 0.08} className="h-full bg-ink p-8 sm:p-10">
              <Icon className="text-gold" strokeWidth={1.2} />
              <h3 className="mt-14 font-display text-3xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/45">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#0c0c0b] py-24 sm:py-36">
        <div className="page-shell">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Kind words</p>
            <blockquote className="mt-8 font-display text-4xl font-light leading-tight sm:text-6xl">
              "Rishi has a way of turning simple moments into photographs that feel cinematic, personal, and alive."
            </blockquote>
            <p className="mt-8 text-[10px] uppercase tracking-[.28em] text-white/40">Client story · India</p>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-24 text-center sm:py-36">
        <Reveal>
          <p className="eyebrow">Have a story in mind?</p>
          <h2 className="mt-5 font-display text-6xl sm:text-8xl">Let's make it visible.</h2>
          <Link href="/contact" className="button-primary mt-9">
            Start a conversation <ArrowUpRight size={15} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
