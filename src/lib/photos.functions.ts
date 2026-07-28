import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient } from "./photos.server";

export const getPhotos = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ sections: z.array(z.string()).min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: rows, error } = await supabase
      .from("photos")
      .select("*")
      .in("section", data.sections)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows;
  });

// Grants the admin role to the caller only when no admin exists yet (first account wins),
// then reports whether the caller is an admin.
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (!count) {
      await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
    }
    const { data: role } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(role) };
  });
