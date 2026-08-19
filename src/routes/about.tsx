import { createFileRoute, Link } from "@tanstack/react-router";

import owner from "@/assets/owner-model.png.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Narayan Collection" },
      {
        name: "description",
        content:
          "Narayan Collection is a men's fashion store built on handpicked fits, honest pricing and personal styling advice.",
      },
      { property: "og:title", content: "Our Story — Narayan Collection" },
      {
        property: "og:description",
        content: "Handpicked menswear, personally styled by the founder.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-5xl">Our story</h1>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <img
          src={owner.url}
          alt="Founder of Narayan Collection wearing a festive black kurta"
          className="rounded-lg border border-border/70 object-cover"
        />
        <div className="space-y-4 text-muted-foreground">
          <p>
            Narayan Collection started with a simple belief: a man should never have to choose
            between looking sharp and paying a fair price. What began as a small storefront is now a
            curated menswear label followed by thousands on Instagram.
          </p>
          <p>
            Every shirt, tee, pair of jeans and festive kurta in our collection is selected by hand.
            Our founder styles each drop himself — if it doesn't look good on him, it doesn't reach
            the rack.
          </p>
          <p>
            We keep the buying experience personal too. Instead of a faceless checkout, you talk to
            us on WhatsApp: we confirm your size, share real photos, and get the parcel moving.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 text-center text-foreground">
            {[
              { k: "500+", v: "Happy customers" },
              { k: "7", v: "Categories" },
              { k: "100%", v: "Handpicked" },
            ].map((s) => (
              <div key={s.v} className="rounded-lg border border-border/70 bg-card p-4">
                <p className="font-display text-3xl text-gold-gradient">{s.k}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
          <Button asChild className="mt-2">
            <Link to="/shop">Browse the collection</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
