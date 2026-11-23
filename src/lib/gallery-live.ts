import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export async function loadLivePhotos(client: SupabaseClient<Database>, sections: string[], browserBase: string) {
  const { data, error } = await client.from("photos").select("*").in("section", sections)
    .order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (error) throw error;
  const paths = data.flatMap((photo) => photo.storage_path ? [photo.storage_path] : []);
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data: signed, error: signError } = await client.storage.from("photos").createSignedUrls(paths, 86400);
    if (signError) throw signError;
    for (const entry of signed ?? []) {
      if (entry.error || !entry.path || !entry.signedUrl) throw new Error("Une photo n’a pas pu être chargée.");
      const url = new URL(entry.signedUrl);
      urls.set(entry.path, `${browserBase.replace(/\/$/, "")}${url.pathname}${url.search}`);
    }
  }
  return data.map((photo) => ({ ...photo, image_url: photo.storage_path ? urls.get(photo.storage_path) ?? photo.image_url : photo.image_url }));
}