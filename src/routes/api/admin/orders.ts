import { createFileRoute } from "@tanstack/react-router";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const ordersPath = path.join(process.cwd(), "src/data/orders.json");

export const Route = createFileRoute("/api/admin/orders")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await fs.readFile(ordersPath, "utf-8");
          return new Response(data, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response("[]", { headers: { "Content-Type": "application/json" } });
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          await fs.writeFile(ordersPath, body, "utf-8");
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: "Failed to save orders" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
