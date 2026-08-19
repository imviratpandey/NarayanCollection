import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { buildOrderMessage, inr, resolveImageUrl, whatsappUrl } from "@/lib/shop";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart & WhatsApp Checkout — Narayan Collection" },
      {
        name: "description",
        content: "Review your Narayan Collection cart and place your order directly on WhatsApp.",
      },
      { property: "og:title", content: "Cart & WhatsApp Checkout — Narayan Collection" },
      { property: "og:description", content: "Fast, simple ordering over WhatsApp." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });

  const checkout = () => {
    if (items.length === 0) return;
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill your name, phone and address");
      return;
    }
    window.open(whatsappUrl(buildOrderMessage(items, form)), "_blank");
    toast.success("Order sent to WhatsApp — we'll confirm shortly!");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-5xl">Your bag</h1>

      {items.length === 0 ? (
        <div className="mt-8">
          <p className="text-muted-foreground">Your bag is empty.</p>
          <Button asChild className="mt-4">
            <Link to="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {items.map((i) => (
              <div
                key={`${i.id}-${i.size}`}
                className="flex gap-4 rounded-lg border border-border/70 bg-card p-3"
              >
                <img src={resolveImageUrl(i.image_url)} alt={i.name} className="h-28 w-24 rounded object-cover" />
                <div className="flex-1">
                  <h2 className="font-display text-2xl leading-tight">{i.name}</h2>
                  {i.size && <p className="text-sm text-muted-foreground">Size {i.size}</p>}
                  <p className="mt-1 font-semibold">{inr(i.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded border border-border"
                      onClick={() => setQty(i.id, i.size, i.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button
                      className="h-7 w-7 rounded border border-border"
                      onClick={() => setQty(i.id, i.size, i.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      className="ml-3 text-muted-foreground hover:text-destructive"
                      onClick={() => remove(i.id, i.size)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold">{inr(i.price * i.qty)}</p>
              </div>
            ))}
            <button className="text-sm text-muted-foreground hover:underline" onClick={clear}>
              Clear bag
            </button>
          </div>

          <div className="h-fit rounded-lg border border-border/70 bg-card p-6 shadow-soft">
            <h2 className="text-3xl">Checkout on WhatsApp</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We confirm stock, size and delivery over chat — no online payment needed.
            </p>

            <div className="mt-5 space-y-3">
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="address">Delivery address</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea id="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-lg font-semibold">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>

            <Button className="mt-4 w-full" size="lg" onClick={checkout}>
              <MessageCircle className="mr-1 h-4 w-4" /> Order on WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
