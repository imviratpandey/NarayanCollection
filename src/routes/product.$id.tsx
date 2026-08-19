import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { categoryLabel, effectivePrice, inr, resolveImageUrl, whatsappUrl, type Product } from "@/lib/shop";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — Narayan Collection" },
      { name: "description", content: "View product details and order on WhatsApp from Narayan Collection." },
      { property: "og:title", content: "Product — Narayan Collection" },
      { property: "og:description", content: "Premium men's fashion from Narayan Collection." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Product | null;
    },
  });

  if (isLoading) return <p className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Loading…</p>;
  if (!product)
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h1 className="text-4xl">Product not available</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );

  const price = effectivePrice(product);
  const needsSize = (product.sizes ?? []).length > 0;

  const addToCart = () => {
    if (needsSize && !size) {
      toast.error("Please select a size");
      return false;
    }
    add({ id: product.id, name: product.name, price, image_url: product.image_url, size, qty: 1 });
    return true;
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
      <div className="space-y-3">
        <img
          src={resolveImageUrl(product.image_url)}
          alt={product.name}
          className="w-full rounded-lg border border-border/70 object-cover"
        />
        {(product.gallery ?? []).length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {product.gallery.map((g) => (
              <img key={g} src={g} alt="" loading="lazy" className="aspect-square rounded object-cover" />
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {categoryLabel(product.category)}
        </p>
        <h1 className="mt-2 text-5xl leading-none">{product.name}</h1>
        <p className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{inr(price)}</span>
          {price < product.price && (
            <span className="text-lg text-muted-foreground line-through">{inr(product.price)}</span>
          )}
        </p>
        <p className="mt-5 whitespace-pre-line text-muted-foreground">{product.description}</p>

        {needsSize && (
          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-wide">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 rounded border px-3 py-1.5 text-sm ${size === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {(product.colors ?? []).length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Colours available: {product.colors.join(", ")}
          </p>
        )}

        <p className="mt-4 text-sm">
          {product.stock > 0 ? (
            <span className="text-primary">In stock ({product.stock} left)</span>
          ) : (
            <span className="text-destructive">Currently sold out</span>
          )}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            size="lg"
            disabled={product.stock === 0}
            onClick={() => {
              if (addToCart()) toast.success("Added to cart");
            }}
          >
            <ShoppingBag className="mr-1 h-4 w-4" /> Add to cart
          </Button>
          <Button
            size="lg"
            variant="secondary"
            disabled={product.stock === 0}
            onClick={() => {
              if (addToCart()) navigate({ to: "/cart" });
            }}
          >
            Buy now
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href={whatsappUrl(
                `Hi! I'm interested in *${product.name}* (${inr(price)})${size ? ` — size ${size}` : ""}.`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="mr-1 h-4 w-4" /> Ask on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
