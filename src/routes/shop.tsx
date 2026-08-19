import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, effectivePrice, type Product } from "@/lib/shop";

type ShopSearch = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search['category'] === "string" ? (search['category'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Men's Clothing — Narayan Collection" },
      {
        name: "description",
        content:
          "Browse shirts, t-shirts, jeans, baggy wear, trousers, jackets and ethnic wear for men at Narayan Collection.",
      },
      { property: "og:title", content: "Shop Men's Clothing — Narayan Collection" },
      { property: "og:description", content: "Trendy men's fits, ordered instantly on WhatsApp." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");

  const { data, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").eq("is_active", true);
      if (category) query = query.eq("category", category);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  const products = (data ?? [])
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "low"
        ? effectivePrice(a) - effectivePrice(b)
        : sort === "high"
          ? effectivePrice(b) - effectivePrice(a)
          : 0,
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-5xl">The Collection</h1>
      <p className="mt-2 text-muted-foreground">Premium menswear, styled for every occasion.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          to="/shop"
          search={{}}
          className={`rounded-full border px-4 py-1.5 text-sm uppercase tracking-wide ${!category ? "bg-primary text-primary-foreground" : "border-border"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to="/shop"
            search={{ category: c.slug }}
            className={`rounded-full border px-4 py-1.5 text-sm uppercase tracking-wide ${category === c.slug ? "bg-primary text-primary-foreground" : "border-border"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="new">Newest</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>

      {isLoading ? (
        <p className="mt-12 text-muted-foreground">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="mt-12 text-muted-foreground">No products found here yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
