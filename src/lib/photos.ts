import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { getPhotos } from "./photos.functions";
import { CATEGORIES } from "./flash-data";
import { loadLivePhotos } from "./gallery-live";

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
    queryFn: async () => {
      if (typeof window === "undefined") return getPhotos({ data: { sections } });
      const { supabase } = await import("@/integrations/supabase/client");
      return loadLivePhotos(supabase, sections, import.meta.env.VITE_SUPABASE_URL);
    },
    staleTime: 0,
    refetchInterval: 30 * 60 * 1000,
  });

export function photoFor(photos: Photo[], section: string): Photo | undefined {
  return photos.find((p) => p.section === section);
}
