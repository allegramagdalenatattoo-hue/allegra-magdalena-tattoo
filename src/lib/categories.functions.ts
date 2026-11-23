import { createServerFn } from "@tanstack/react-start";
import { createPublicClient } from "./photos.server";

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await createPublicClient().from("gallery_categories").select("*").order("sort_order").order("title");
  if (error) throw error;
  return data;
});