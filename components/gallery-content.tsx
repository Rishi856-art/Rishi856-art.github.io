"use client";

import { useSearchParams } from "next/navigation";
import { PhotoGrid } from "@/components/photo-grid";
import { Reveal } from "@/components/reveal";
import { useLivePortfolioData } from "@/lib/live-data";
import type { Album, Photo } from "@/lib/types";

export function GalleryContent({ initialAlbums, initialPhotos }: { initialAlbums: Album[]; initialPhotos: Photo[] }) {
  const searchParams = useSearchParams();
  const { albums, photos } = useLivePortfolioData(initialAlbums, initialPhotos);
  const albumSlug = searchParams.get("album");
  const album = albums.find((item) => item.slug === albumSlug);
  const visiblePhotos = album ? photos.filter((photo) => photo.album_id === album.id) : photos;

  return <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44"><Reveal><p className="eyebrow">{album ? "Album" : "The archive"}</p><h1 className="display-title mt-5">{album ? album.title : <>All frames,<br/><em className="text-white/45">one place.</em></>}</h1><p className="mt-8 max-w-lg text-sm leading-7 text-white/45">{album?.description || "A living collection of people, places, and passing moments. Select a frame to see it full screen."}</p></Reveal><div className="mt-14"><PhotoGrid photos={visiblePhotos} filters={!album}/>{!visiblePhotos.length && <p className="py-24 text-center text-white/40">This space is ready for Rishi’s first upload.</p>}</div></div>;
}
