export type Album = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  album_id: string | null;
  title: string;
  alt_text: string;
  image_url: string;
  storage_path: string | null;
  category: string;
  featured: boolean;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type AlbumWithPhotos = Album & { photos: Photo[] };
