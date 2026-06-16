import { HomeContent } from "@/components/home-content";
import { getPhotos } from "@/lib/data";

export default async function HomePage() {
  const photos = await getPhotos();
  return <HomeContent initialPhotos={photos} />;
}
