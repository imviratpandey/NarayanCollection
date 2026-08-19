import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Download, LogOut, Pencil, Plus, Trash2, Upload, Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { CATEGORIES, categoryLabel, inr, resolveImageUrl, type Product } from "@/lib/shop";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Store Admin — Narayan Collection" },
      { name: "description", content: "Private admin dashboard for managing Narayan Collection products." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Store Admin — Narayan Collection" },
      { property: "og:description", content: "Private admin dashboard." },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: string;
  sale_price: string;
  image_url: string;
  sizes: string;
  colors: string;
  stock: string;
  is_featured: boolean;
  is_active: boolean;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  category: "shirts",
  price: "",
  sale_price: "",
  image_url: "",
  sizes: "S, M, L, XL",
  colors: "",
  stock: "10",
  is_featured: false,
  is_active: true,
};

function AdminPage() {
  const { session, loading } = useSession();
  const isAdmin = useIsAdmin(session?.user.id);

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Loading…</p>;
  if (!session) return <SignIn />;
  if (isAdmin === null) return <p className="mx-auto max-w-6xl px-4 py-20 text-muted-foreground">Checking access…</p>;
  if (!isAdmin)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-4xl">No admin access</h1>
        <p className="mt-2 text-muted-foreground">
          This account ({session.user.email}) is not an administrator.
        </p>
        <Button className="mt-6" variant="outline" onClick={() => supabase.auth.signOut()}>
          Sign out
        </Button>
      </div>
    );

  return <Dashboard email={session.user.email ?? ""} />;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (mode: "in" | "up") => {
    setBusy(true);
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    const { error } = await fn;
    setBusy(false);
    if (error) toast.error(error.message);
    else if (mode === "up") toast.success("Account created. Check your email to confirm, then sign in.");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-5xl">Store admin</h1>
      <p className="mt-2 text-muted-foreground">Sign in to manage products.</p>
      <div className="mt-6 space-y-3 rounded-lg border border-border/70 bg-card p-6 shadow-soft">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="w-full" disabled={busy} onClick={() => submit("in")}>
          Sign in
        </Button>
        <Button className="w-full" variant="outline" disabled={busy} onClick={() => submit("up")}>
          Create admin account
        </Button>
      </div>
    </div>
  );
}

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return res.json() as Promise<{ festival: string; offerText: string; offerActive: boolean; customEmoji: string; customColor: string; geminiApiKey: string }>;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      return res.json() as Promise<any[]>;
    },
  });

  const [localSettings, setLocalSettings] = useState<any>(null);

  // Sync local settings when data loads
  if (settings && !localSettings) {
    setLocalSettings(settings);
  }

  const [savingSettings, setSavingSettings] = useState(false);
  const saveSettings = async () => {
    if (!localSettings) return;
    setSavingSettings(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localSettings),
    });
    setSavingSettings(false);
    qc.invalidateQueries({ queryKey: ["admin-settings"] });
    toast.success("Settings updated");
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!orders) return;
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
    toast.success("Order status updated");
  };

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["featured-products"] });
  };

  const downloadMISReport = async () => {
    setIsExporting(true);
    try {
      if (!products) {
        toast.error("Products not loaded yet");
        return;
      }
      
      const csvRows = [
        ["Product ID", "Name", "Category", "Current Price", "Stock Status", "Total Ordered (Qty)"]
      ];

      // Build product stats
      products.forEach((prod) => {
        let totalOrdered = 0;
        if (orders) {
          orders.forEach((o: any) => {
            if (o.items.toLowerCase().includes(prod.name.toLowerCase())) {
              totalOrdered += 1;
            }
          });
        }
        
        csvRows.push([
          prod.id,
          `"${prod.name}"`,
          prod.category,
          prod.price.toString(),
          prod.is_active ? "In Stock" : "Out of Stock",
          totalOrdered.toString()
        ]);
      });

      const csvContent = csvRows.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Narayan_MIS_Report_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("MIS Report downloaded successfully!");
    } catch (e) {
      toast.error("Failed to generate MIS Report");
    }
    setIsExporting(false);
  };

  const upload = async (file: File) => {
    setUploading(true);
    // Since we don't have access to create the Supabase storage bucket, 
    // we convert the image to a base64 Data URL and store it directly in the text column.
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setForm((f) => (f ? { ...f, image_url: dataUrl } : f));
      setUploading(false);
      toast.success("Image uploaded (as base64)");
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error("Failed to read image");
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.price || !form.image_url) {
      toast.error("Name, price and image are required");
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description,
      category: form.category,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      image_url: form.image_url,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      stock: Number(form.stock || 0),
      is_featured: form.is_featured,
      is_active: form.is_active,
    };
    const res = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(form.id ? "Product updated" : "Product added");
    setForm(null);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      refresh();
    }
  };

  const list = products ?? [];
  const stats = [
    { k: list.length, v: "Products" },
    { k: list.filter((p) => p.is_active).length, v: "Live" },
    { k: list.filter((p) => p.stock === 0).length, v: "Sold out" },
    { k: list.filter((p) => p.is_featured).length, v: "Featured" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-5xl">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={downloadMISReport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download MIS Report
          </Button>
          <Button onClick={() => setForm({ ...EMPTY })}>
            <Plus className="mr-2 h-4 w-4" /> Add product
          </Button>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.v} className="rounded-lg border border-border/70 bg-card p-4">
            <p className="font-display text-4xl">{s.k}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      {localSettings && (
        <div className="mt-8 rounded-lg border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="text-3xl">Store Settings & Offers</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Active Festival Theme</Label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={localSettings.festival}
                onChange={(e) => setLocalSettings({ ...localSettings, festival: e.target.value })}
                disabled={savingSettings}
              >
                <option value="none">None</option>
                <option value="diwali">Diwali (Crackers & Diyas)</option>
                <option value="christmas">Christmas (Snow & Santa)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <Label>Offer Banner Text</Label>
              <Input
                value={localSettings.offerText}
                onChange={(e) => setLocalSettings({ ...localSettings, offerText: e.target.value })}
                disabled={savingSettings}
              />
            </div>
            {localSettings.festival === "custom" && (
              <>
                <div>
                  <Label>Custom Emoji</Label>
                  <Input
                    value={localSettings.customEmoji || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, customEmoji: e.target.value })}
                    disabled={savingSettings}
                    placeholder="e.g. 🎃"
                  />
                </div>
                <div>
                  <Label>Custom Background Color (Hex)</Label>
                  <Input
                    value={localSettings.customColor || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, customColor: e.target.value })}
                    disabled={savingSettings}
                    placeholder="e.g. #ff6600"
                  />
                </div>
              </>
            )}
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={localSettings.offerActive}
                onCheckedChange={(v) => setLocalSettings({ ...localSettings, offerActive: v })}
                disabled={savingSettings}
              />
              <span className="text-sm">Show offer banner</span>
            </div>
            <div className="sm:col-span-2 rounded-lg border border-border/50 bg-muted/30 p-4">
              <Label className="text-base flex items-center gap-2">
                🤖 AI Chatbot API Key
              </Label>
              {localSettings.isEditingApiKey ? (
                <div className="mt-2 flex gap-2">
                  <Input
                    type="password"
                    value={localSettings.geminiApiKey || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
                    disabled={savingSettings}
                    placeholder="Enter new AIzaSy... or AQ... key"
                    className="max-w-md"
                  />
                  <Button 
                    variant="secondary" 
                    onClick={() => setLocalSettings({ ...localSettings, isEditingApiKey: false })}
                    disabled={savingSettings}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between max-w-md">
                  <span className="font-mono text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                    {localSettings.geminiApiKey ? "🔑 🟢 Active (••••••••)" : "🔴 Not Configured"}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setLocalSettings({ ...localSettings, isEditingApiKey: true })}
                    disabled={savingSettings}
                  >
                    Change Key
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">Used for the floating AI customer support bot. Keep this secret!</p>
            </div>
          </div>
          <div className="mt-5">
            <Button onClick={saveSettings} disabled={savingSettings}>
              {savingSettings ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      )}

      {/* Change Password Section */}
      <div className="mt-8 rounded-lg border border-border/70 bg-card p-6 shadow-soft">
        <h2 className="text-3xl text-destructive">Security</h2>
        <p className="mt-2 text-sm text-muted-foreground">Change your admin password. You must enter your current password and answer your security question to verify your identity.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Current Password</Label>
            <Input 
              type="password" 
              placeholder="Enter current password" 
              id="current-password"
            />
          </div>
          <div>
            <Label className="text-destructive font-bold">Security Q: Who's your life partner?</Label>
            <Input 
              type="text" 
              placeholder="Answer..." 
              id="security-answer"
            />
          </div>
          <div>
            <Label>New Password</Label>
            <Input 
              type="password" 
              placeholder="Enter new password" 
              id="new-password"
            />
          </div>
        </div>
        <div className="mt-5">
          <Button 
            variant="destructive"
            onClick={async () => {
              const currentInput = (document.getElementById("current-password") as HTMLInputElement).value;
              const securityAnswer = (document.getElementById("security-answer") as HTMLInputElement).value;
              const newPasswordInput = (document.getElementById("new-password") as HTMLInputElement).value;
              
              if (!currentInput) {
                toast.error("Please enter your current password.");
                return;
              }
              if (securityAnswer.trim().toUpperCase() !== "JYOTI") {
                toast.error("Unauthorized: Incorrect security answer.");
                return;
              }
              if (newPasswordInput.length < 6) {
                toast.error("New password must be at least 6 characters.");
                return;
              }

              // Verify current password by attempting to re-authenticate
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password: currentInput,
              });

              if (signInError) {
                toast.error("Unauthorized: Incorrect current password.");
                return;
              }
              
              // If successful, update to the new password
              const { error: updateError } = await supabase.auth.updateUser({
                password: newPasswordInput
              });
              
              if (updateError) {
                toast.error(updateError.message);
              } else {
                toast.success("Password changed successfully! You will use the new password next time you sign in.");
                (document.getElementById("current-password") as HTMLInputElement).value = "";
                (document.getElementById("security-answer") as HTMLInputElement).value = "";
                (document.getElementById("new-password") as HTMLInputElement).value = "";
              }
            }}
          >
            Update Password
          </Button>
        </div>
      </div>

      {orders && orders.length > 0 && (
        <div className="mt-8 rounded-lg border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="text-3xl">Order Management</h2>
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border/50 bg-background p-4">
                <div>
                  <p className="font-semibold">{order.id} <span className="text-sm font-normal text-muted-foreground">({new Date(order.date).toLocaleDateString()})</span></p>
                  <p className="text-sm text-muted-foreground">{order.customer} - {order.items}</p>
                  <p className="text-sm font-medium mt-1">Total: {inr(order.total)}</p>
                </div>
                <div>
                  <Label className="text-xs mb-1 block text-muted-foreground">Status</Label>
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium uppercase tracking-wider"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="order placed">Order Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="out for delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {form && (
        <div className="mt-8 rounded-lg border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="text-3xl">{form.id ? "Edit product" : "New product"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Sale price (₹, optional)</Label>
              <Input
                type="number"
                value={form.sale_price}
                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
              />
            </div>
            <div>
              <Label>Sizes (comma separated)</Label>
              <Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
            </div>
            <div>
              <Label>Colours (comma separated)</Label>
              <Input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Image</Label>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {form.image_url.startsWith("data:image/") ? (
                  <div className="max-w-md w-full truncate rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    [Base64 Image Data]
                  </div>
                ) : (
                  <Input
                    placeholder="Image URL"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="max-w-md"
                  />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void upload(f);
                    }}
                  />
                </label>
                {form.image_url && (
                  <img src={resolveImageUrl(form.image_url)} alt="" className="h-16 w-16 rounded object-cover" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
              />
              <span className="text-sm">Featured on home</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <span className="text-sm">Visible in shop</span>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={save}>Save product</Button>
            <Button variant="outline" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-10 space-y-3">
        {list.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border border-border/70 bg-card p-3"
          >
            <img src={resolveImageUrl(p.image_url)} alt="" className="h-16 w-14 rounded object-cover" />
            <div className="min-w-40 flex-1">
              <p className="font-display text-xl leading-tight">{p.name}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {categoryLabel(p.category)} · stock {p.stock} · {p.is_active ? "live" : "hidden"}
              </p>
            </div>
            <p className="font-semibold">{inr(p.sale_price ?? p.price)}</p>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Edit"
                onClick={() =>
                  setForm({
                    id: p.id,
                    name: p.name,
                    description: p.description ?? "",
                    category: p.category,
                    price: String(p.price),
                    sale_price: p.sale_price ? String(p.sale_price) : "",
                    image_url: p.image_url,
                    sizes: (p.sizes ?? []).join(", "),
                    colors: (p.colors ?? []).join(", "),
                    stock: String(p.stock),
                    is_featured: p.is_featured,
                    is_active: p.is_active,
                  })
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => del(p.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
