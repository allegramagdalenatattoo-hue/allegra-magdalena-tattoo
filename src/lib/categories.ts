import { queryOptions } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";
import { getCategories } from "./categories.functions";

export type GalleryCategory = Tables<"gallery_categories">;
export const categoriesQueryOptions = () => queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    if (typeof window === "undefined") return getCategories();
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.from("gallery_categories").select("*").order("sort_order").order("title");
    if (error) throw error;
    return data;
  },
  staleTime: 0,
});