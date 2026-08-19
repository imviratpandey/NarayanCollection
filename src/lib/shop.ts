export const WHATSAPP_NUMBER = "918433796256";
export const BRAND = "Narayan Collection";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sale_price: number | null;
  image_url: string;
  gallery: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const CATEGORIES = [
  { slug: "shirts", label: "Shirts" },
  { slug: "tshirts", label: "T-Shirts" },
  { slug: "jeans", label: "Jeans" },
  { slug: "baggy", label: "Baggy Wear" },
  { slug: "trousers", label: "Trousers" },
  { slug: "jackets", label: "Jackets" },
  { slug: "ethnic", label: "Ethnic" },
];

export function categoryLabel(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export function inr(value: number) {
  return "₹" + Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function effectivePrice(p: Pick<Product, "price" | "sale_price">) {
  return p.sale_price && p.sale_price > 0 ? p.sale_price : p.price;
}

export function resolveImageUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("/__l5e/assets-v1/")) {
    const filename = url.split("/").pop();
    return `/assets/${filename}`;
  }
  return url;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size: string | null;
  qty: number;
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(items: CartItem[], customer: { name: string; phone: string; address: string; note: string }) {
  const lines = [
    `*New Order — ${BRAND}*`,
    "",
    ...items.map(
      (i, n) =>
        `${n + 1}. ${i.name}${i.size ? ` (Size: ${i.size})` : ""} × ${i.qty} — ${inr(i.price * i.qty)}`,
    ),
    "",
    `*Total: ${inr(items.reduce((s, i) => s + i.price * i.qty, 0))}*`,
    "",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
  ];
  if (customer.note.trim()) lines.push(`Note: ${customer.note}`);
  return lines.join("\n");
}
