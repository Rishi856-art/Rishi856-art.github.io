import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/photo-grid";
import { getAlbum, getAlbums } from "@/lib/data";

export async function generateStaticParams() {
  const albums = await getAlbums();
  return albums.map((album) => ({ slug: album.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const album = await getAlbum(slug); return { title: album?.title || "Album", description: album?.description }; }
export default async function AlbumDetail({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const album = await getAlbum(slug); if (!album) notFound(); return <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44"><p className="eyebrow">Collection</p><div className="mt-5 flex flex-col justify-between gap-6 border-b border-white/10 pb-12 lg:flex-row lg:items-end"><h1 className="display-title">{album.title}</h1><p className="max-w-md text-sm leading-7 text-white/45">{album.description}</p></div><div className="mt-12"><PhotoGrid photos={album.photos} filters={false}/>{!album.photos.length && <p className="py-24 text-center text-white/40">This album is waiting for its first photograph.</p>}</div></div>; }
