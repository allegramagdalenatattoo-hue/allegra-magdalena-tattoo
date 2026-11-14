import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { getPhotos } from "./photos.functions";
import { CATEGORIES } from "./flash-data";
import { staticPhotosFor } from "./static-photo-catalog";

export type Photo = Tables<"photos">;

export const FLASH_SLUGS = CATEGORIES.map((category) => category.slug);

export function coverSection(slug: string) {
  return `site:cover:${slug}`;
}

export function flashSection(slug: string) {
  return `flash:${slug}`;
}

export const photosQueryOptions = (sections: string[]) =>
  queryOptions({
    queryKey: ["photos", ...sections],
    queryFn: () => import.meta.env.VITE_STATIC_PHOTOS === "true"
      ? Promise.resolve(staticPhotosFor(sections))
      : getPhotos({ data: { sections } }),
  });

export function photoFor(photos: Photo[], section: string): Photo | undefined {
  return photos.find((p) => p.section === section);
}
