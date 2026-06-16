import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryContent } from "@/components/gallery-content";
import { getAlbums, getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery", description: "A complete archive of portrait, travel, street, nature, and cinematic photography." };
export default async function GalleryPage() { const [albums, photos] = await Promise.all([getAlbums(), getPhotos()]); return <Suspense fallback={<div className="page-shell min-h-screen pt-36 text-white/40">Loading gallery...</div>}><GalleryContent initialAlbums={albums} initialPhotos={photos}/></Suspense>; }
