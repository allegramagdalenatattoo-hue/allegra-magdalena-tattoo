import type { Tables } from "@/integrations/supabase/types";
import catalog from "./static-photos.json";

const photos: Tables<"photos">[] = catalog.map((photo) => ({ ...photo, category_id: null, description: "", external_url: "" }));

export function staticPhotosFor(sections: string[]) {
  return photos.filter((photo) => sections.includes(photo.section));
}

export function localPhotoUrl(photo: Pick<Tables<"photos">, "id" | "image_url">) {
  return photos.find((entry) => entry.id === photo.id)?.image_url ?? photo.image_url;
}