import type { Album, Photo } from "./types";

const urls = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=88",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1400&q=88",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=88",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=88",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=88",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd4297?auto=format&fit=crop&w=1400&q=88",
  "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1400&q=88",
];

export const demoAlbums: Album[] = [
  { id: "portrait", title: "Portraits", slug: "portraits", description: "Quiet expressions and honest human stories.", cover_url: urls[2], created_at: "2026-01-05" },
  { id: "nature", title: "Nature", slug: "nature", description: "Wild places shaped by light and weather.", cover_url: urls[4], created_at: "2026-01-04" },
  { id: "street", title: "Street", slug: "street", description: "The unscripted rhythm of life in motion.", cover_url: urls[3], created_at: "2026-01-03" },
  { id: "travel", title: "Travel", slug: "travel", description: "Visual notes from roads less familiar.", cover_url: urls[6], created_at: "2026-01-02" },
  { id: "cinematic", title: "Cinematic", slug: "cinematic", description: "Atmospheric frames that feel like memory.", cover_url: urls[0], created_at: "2026-01-01" },
];

export const demoPhotos: Photo[] = urls.map((image_url, index) => ({
  id: `demo-${index}`,
  album_id: demoAlbums[index % demoAlbums.length].id,
  title: ["After the rain", "Canopy", "Stillness", "Midnight crossing", "Open country", "North face", "Desert lines", "Last light"][index],
  alt_text: "Editorial photography portfolio image",
  image_url,
  storage_path: null,
  category: demoAlbums[index % demoAlbums.length].title,
  featured: index < 4,
  width: index % 3 === 0 ? 1600 : 1200,
  height: index % 3 === 0 ? 1000 : 1600,
  created_at: `2026-01-${String(10 - index).padStart(2, "0")}`,
}));
