"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CmsStatus } from "@/components/cms-status";
import { Reveal } from "@/components/reveal";
import { useLivePortfolioData } from "@/lib/live-data";
import type { Album, Photo } from "@/lib/types";

export function AlbumsContent({ initialAlbums, initialPhotos }: { initialAlbums: Album[]; initialPhotos: Photo[] }) {
  const { albums, photos, error } = useLivePortfolioData(initialAlbums, initialPhotos);

  return (
    <>
    <CmsStatus message={error} />
    <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44">
      <Reveal>
        <p className="eyebrow">Collections</p>
        <h1 className="display-title mt-5">
          Stories,<br />
          <em className="text-white/45">chaptered.</em>
        </h1>
      </Reveal>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album, index) => {
          const albumPhotos = photos.filter((photo) => photo.album_id === album.id);
          const coverPhoto = albumPhotos.find((photo) => photo.featured) || albumPhotos[0];
          const cover = album.cover_url || coverPhoto?.image_url;

          return (
            <Reveal key={album.id} delay={(index % 3) * 0.08}>
              <Link href={`/gallery?album=${album.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-white/5">
                {cover ? (
                  <img
                    src={cover}
                    alt={`${album.title} album`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.035] text-center text-xs uppercase tracking-[.2em] text-white/30">
                    Add photos
                  </div>
                )}

                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="flex items-end justify-between">
                    <span>
                      <span className="eyebrow text-white/45">{String(albumPhotos.length).padStart(2, "0")} photographs</span>
                      <span className="mt-2 block font-display text-4xl sm:text-5xl">{album.title}</span>
                    </span>
                    <ArrowUpRight className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
    </>
  );
}
