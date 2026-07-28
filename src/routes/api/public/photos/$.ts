import { createFileRoute } from "@tanstack/react-router";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

// Public read-through for the private "photos" bucket. Only admins can write
// to the bucket, so every stored file is curated gallery content.
export const Route = createFileRoute("/api/public/photos/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..") || path.startsWith("/")) {
          return new Response("Bad path", { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("photos").download(path);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }
        const ext = path.split(".").pop()?.toLowerCase() ?? "";
        return new Response(await data.arrayBuffer(), {
          headers: {
            "content-type": data.type || CONTENT_TYPES[ext] || "image/jpeg",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
