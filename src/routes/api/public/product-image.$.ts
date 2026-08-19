import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/product-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || (import.meta.env as any).VITE_SUPABASE_URL || "";
        // Use service role key if available, otherwise fall back to publishable key
        const SUPABASE_KEY =
          process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
          (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY ||
          "";

        console.log("product-image proxy hit:", { path, hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_KEY });

        if (!SUPABASE_URL) return new Response("Storage not configured", { status: 503 });

        // If we have a key, try to proxy the image directly
        if (SUPABASE_KEY) {
          try {
            const client = createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data, error } = await client.storage.from("product-images").download(path);
            if (!error && data) {
              return new Response(await data.arrayBuffer(), {
                headers: {
                  "content-type": data.type || "image/jpeg",
                  "cache-control": "public, max-age=31536000, immutable",
                },
              });
            }
          } catch {
            // fall through to redirect
          }
        }

        // Fallback: redirect to Supabase public storage URL
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
        return Response.redirect(publicUrl, 302);
      },
    },
  },
});
