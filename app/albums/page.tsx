import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getAlbums, getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Albums", description: "Explore photography stories by collection." };

export default async function AlbumsPage() {
  const [albums, photos] = await Promise.all([getAlbums(), getPhotos()]);
  return <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44"><Reveal><p className="eyebrow">Collections</p><h1 className="display-title mt-5">Stories,<br/><em className="text-white/45">chaptered.</em></h1></Reveal><div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{albums.map((album, index) => { const count = photos.filter((p) => p.album_id === album.id).length; const cover = album.cover_url || photos.find((p) => p.album_id === album.id)?.image_url; return <Reveal key={album.id} delay={(index % 3) * .08}><Link href={`/albums/${album.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-white/5">{cover && <img src={cover} alt={`${album.title} album`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>}<span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"/><span className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><span className="flex items-end justify-between"><span><span className="eyebrow text-white/45">{String(count).padStart(2,"0")} photographs</span><span className="mt-2 block font-display text-4xl sm:text-5xl">{album.title}</span></span><ArrowUpRight className="translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"/></span></span></Link></Reveal>; })}</div></div>;
}
