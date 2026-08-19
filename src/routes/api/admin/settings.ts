import { createFileRoute } from "@tanstack/react-router";
import fs from "fs/promises";
import path from "path";

const settingsPath = path.resolve(process.cwd(), "src/data/settings.json");

export const Route = createFileRoute("/api/admin/settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fs.readFile(settingsPath, "utf-8");
          return new Response(data, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          // Return default if file missing
          return new Response(
            JSON.stringify({ festival: "none", offerText: "", offerActive: false }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          await fs.writeFile(settingsPath, JSON.stringify(body, null, 2), "utf-8");
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Failed to save settings:", error);
          return new Response(JSON.stringify({ error: "Failed to save settings" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
