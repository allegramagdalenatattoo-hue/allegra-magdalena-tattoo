import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { loadLivePhotos } from "./gallery-live";
import { claimAdmin } from "./photos.functions";

export const adminAccessOptions = () => queryOptions({ queryKey: ["claim-admin"], queryFn: () => claimAdmin(), staleTime: Infinity, retry: false });
export const adminPhotosOptions = (section: string) => queryOptions({
  queryKey: ["admin-photos", section],
  queryFn: () => loadLivePhotos(supabase, [section], import.meta.env.VITE_SUPABASE_URL),
});
export const adminArticlesOptions = () => queryOptions({
  queryKey: ["admin-articles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("blog_articles").select("*").order("article_date", { ascending: false });
    if (error) throw error;
    return data;
  },
});