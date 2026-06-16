import type { MetadataRoute } from "next";
import { getAlbums } from "@/lib/data";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const albums = await getAlbums();
  return ["", "/albums", "/gallery", "/contact", ...albums.map((album) => `/albums/${album.slug}`)].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 }));
}
