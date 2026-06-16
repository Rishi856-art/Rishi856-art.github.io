"use client";

import { useEffect, useState } from "react";
import { demoAlbums, demoPhotos } from "./demo-data";
import { createClient, isSupabaseConfigured } from "./supabase/client";
import type { Album, Photo } from "./types";

export function useLivePortfolioData(initialAlbums = demoAlbums, initialPhotos = demoPhotos) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const supabase = createClient();
      const [{ data: albumData }, { data: photoData }] = await Promise.all([
        supabase.from("albums").select("*").order("created_at", { ascending: false }),
        supabase.from("photos").select("*").order("created_at", { ascending: false }),
      ]);

      if (!cancelled) {
        if (albumData?.length) setAlbums(albumData);
        if (photoData?.length) setPhotos(photoData);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { albums, photos, loading };
}
