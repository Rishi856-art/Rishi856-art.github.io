import { demoAlbums, demoPhotos } from "./demo-data";
import { createClient } from "./supabase/server";
import type { Album, Photo } from "./types";

export async function getAlbums(): Promise<Album[]> {
  const supabase = await createClient();
  if (!supabase) return demoAlbums;
  try {
    const { data, error } = await supabase.from("albums").select("*").order("created_at", { ascending: false });
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

export async function getPhotos(): Promise<Photo[]> {
  const supabase = await createClient();
  if (!supabase) return demoPhotos;
  try {
    const { data, error } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

export async function getAlbum(slug: string) {
  const albums = await getAlbums();
  const album = albums.find((item) => item.slug === slug);
  if (!album) return null;
  const photos = (await getPhotos()).filter((photo) => photo.album_id === album.id);
  return { ...album, photos };
}
