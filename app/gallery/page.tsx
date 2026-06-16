import type { Metadata } from "next";
import { PhotoGrid } from "@/components/photo-grid";
import { Reveal } from "@/components/reveal";
import { getPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Gallery", description: "A complete archive of portrait, travel, street, nature, and cinematic photography." };
export default async function GalleryPage() { const photos = await getPhotos(); return <div className="page-shell min-h-screen pb-24 pt-36 sm:pt-44"><Reveal><p className="eyebrow">The archive</p><h1 className="display-title mt-5">All frames,<br/><em className="text-white/45">one place.</em></h1><p className="mt-8 max-w-lg text-sm leading-7 text-white/45">A living collection of people, places, and passing moments. Select a frame to see it full screen.</p></Reveal><div className="mt-14"><PhotoGrid photos={photos}/></div></div>; }
