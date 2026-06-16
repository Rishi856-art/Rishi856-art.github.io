import type { Metadata } from "next";
import { AlbumsContent } from "@/components/albums-content";
import { getAlbums, getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Albums", description: "Explore photography stories by collection." };

export default async function AlbumsPage() {
  const [albums, photos] = await Promise.all([getAlbums(), getPhotos()]);
  return <AlbumsContent initialAlbums={albums} initialPhotos={photos} />;
}
