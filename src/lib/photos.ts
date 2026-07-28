import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { getPhotos } from "./photos.functions";

export type Photo = Tables<"photos">;

export const FLASH_SLUGS = ["nudite", "botanique", "corps", "composition", "animaux"] as const;

export function coverSection(slug: string) {
  return `site:cover:${slug}`;
}

export function flashSection(slug: string) {
  return `flash:${slug}`;
}

export const photosQueryOptions = (sections: string[]) =>
  queryOptions({
    queryKey: ["photos", ...sections],
    queryFn: () => getPhotos({ data: { sections } }),
  });

export function photoFor(photos: Photo[], section: string): Photo | undefined {
  return photos.find((p) => p.section === section);
}
