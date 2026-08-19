import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { categoryLabel, effectivePrice, inr, resolveImageUrl, type Product } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  const price = effectivePrice(product);
  const onSale = price < product.price;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="tilt-card group block overflow-hidden rounded-xl border border-border/70 bg-card hover:shadow-lift"
    >
      <div className="shine relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={resolveImageUrl(product.image_url)}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-foreground">
            Sale
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/85 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-background">
            Sold out
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {categoryLabel(product.category)}
        </p>
        <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{inr(price)}</span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">{inr(product.price)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
