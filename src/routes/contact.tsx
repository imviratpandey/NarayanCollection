import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BRAND, whatsappUrl } from "@/lib/shop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Narayan Collection — WhatsApp +91 84337 96256" },
      {
        name: "description",
        content:
          "Reach Narayan Collection on WhatsApp at +91 84337 96256 for sizes, availability and orders.",
      },
      { property: "og:title", content: "Contact Narayan Collection" },
      { property: "og:description", content: "Message us on WhatsApp for sizes, stock and orders." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", message: "" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-5xl">Get in touch</h1>
      <p className="mt-2 text-muted-foreground">
        Questions about a fit, size or delivery? We reply fast on WhatsApp.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">+91 84337 96256</p>
              <p className="text-sm text-muted-foreground">Call or WhatsApp, 10am – 9pm</p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/narayan_collection9/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4"
          >
            <Instagram className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">@narayan_collection9</p>
              <p className="text-sm text-muted-foreground">Latest drops and styling reels</p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">In-store styling</p>
              <p className="text-sm text-muted-foreground">Visit us for a personal fitting</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="text-3xl">Send a message</h2>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="cname">Your name</Label>
              <Input id="cname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="cmsg">Message</Label>
              <Textarea
                id="cmsg"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={() =>
              window.open(
                whatsappUrl(
                  `Hi ${BRAND}!\nName: ${form.name || "-"}\n${form.message || "I have a question."}`,
                ),
                "_blank",
              )
            }
          >
            <MessageCircle className="mr-1 h-4 w-4" /> Send on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}
