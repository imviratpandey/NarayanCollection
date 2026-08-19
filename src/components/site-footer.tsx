import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import { whatsappUrl } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo.url} alt="" width={32} height={32} className="h-8 w-8" loading="lazy" />
            <span className="font-display text-xl">Narayan Collection</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Trendy fits and premium style for men. Shirts, tees, jeans, baggy wear and ethnic — all
            in one place.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-foreground">Cart & Checkout</Link></li>
            <li><Link to="/about" className="hover:text-foreground">Our Story</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Store Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg">Order on WhatsApp</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +91 84337 96256
            </li>
            <li>
              <a
                href={whatsappUrl("Hi Narayan Collection! I would like to know more about your collection.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" /> Chat with us
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/narayan_collection9/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Instagram className="h-4 w-4" /> @narayan_collection9
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="space-y-1.5 border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Narayan Collection · WhatsApp +91 84337 96256</p>
        <p>
          Made with ❤️ and ☕ by{" "}
          <a
            href="https://www.instagram.com/imviratpandey/"
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:text-foreground"
          >
            Devendra Pandey (@imviratpandey)
          </a>
        </p>
      </div>
    </footer>
  );
}
