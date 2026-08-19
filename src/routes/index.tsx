import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Truck, Volume2, VolumeX } from "lucide-react";

import owner from "@/assets/owner-model.png.asset.json";
import { ProductCard } from "@/components/product-card";
import { Marquee, Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, whatsappUrl, type Product } from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Narayan Collection — Trendy Men's Fashion in India" },
    ],
  }),
  component: Index,
});

const HINDI_SONGS = [
  "Umqb9DrckMY", // Tum Hi Ho
  "284Ov7ysmfA", // Channa Mereya
  "jHNNMj5bNQw", // Kabira
  "BddP6PYo2gs", // Kesariya
  "bzSTpdcs-EI", // Chaleya
];

function Index() {
  const [isMuted, setIsMuted] = useState(true);
  const [playlist, setPlaylist] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle the songs on client-side to avoid hydration mismatch
    const shuffled = [...HINDI_SONGS].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
  }, []);

  const { data: featured } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

  return (
    <div className="overflow-x-clip bg-background">
      {/* Hidden Audio Player for Hindi Playlist */}
      {playlist.length > 0 && (
        <iframe
          src={`https://www.youtube.com/embed/${playlist[0]}?autoplay=1&loop=1&playlist=${playlist.slice(1).join(",")},${playlist[0]}&mute=${isMuted ? 1 : 0}&enablejsapi=1`}
          title="Background Music Playlist"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute w-1 h-1 opacity-0 pointer-events-none -z-50"
        />
      )}

      {/* Floating Audio Toggle */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="h-14 w-14 rounded-full shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:scale-110 transition-transform backdrop-blur-md bg-background/50 border border-border"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6 text-primary animate-pulse" />}
        </Button>
      </div>

      {/* Immersive Next-Level Hero with Video Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Intense Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-40 z-10">
          <span className="absolute animate-blob left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/40 blur-[120px] mix-blend-screen" />
          <span className="absolute animate-blob animation-delay-2000 right-[10%] top-[40%] h-[600px] w-[600px] rounded-full bg-gold/30 blur-[150px] mix-blend-screen" />
          <span className="absolute animate-blob animation-delay-4000 left-[40%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/30 blur-[100px] mix-blend-screen" />
        </div>

        {/* Video Background */}
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
          <iframe
            className="absolute top-1/2 left-1/2 w-screen h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 opacity-70"
            src="https://www.youtube.com/embed/lM02vNMRRB0?autoplay=1&mute=1&controls=0&loop=1&playlist=lM02vNMRRB0&showinfo=0&rel=0"
            title="Fashion Background"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        </div>

        {/* Hero Content - Glassmorphism */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20">
          <div className="max-w-2xl backdrop-blur-2xl bg-background/70 border border-border/50 p-8 sm:p-12 rounded-3xl shadow-2xl tilt-card">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-gold shadow-sm mb-6">
                <Sparkles className="h-4 w-4" /> The New Standard
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-6xl sm:text-8xl font-black tracking-tight leading-[0.9] text-foreground drop-shadow-sm">
                DRESS <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 dark:from-gold dark:via-yellow-200 dark:to-gold">BEYOND</span> <br/>
                IMAGINATION.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-lg text-foreground/80 font-medium leading-relaxed">
                Step into a world of premium menswear. Handpicked shirts, bagging jeans, and ethnic fits designed for the modern man.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 rounded-full px-8 text-lg font-bold shadow-xl transition-all hover:scale-105 hover:shadow-primary/25 shine">
                  <Link to="/shop">
                    Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <div className="border-y border-border/40 bg-card/50 backdrop-blur-sm py-4">
        <Marquee items={["PREMIUM QUALITY", "STREETWEAR", "BAGGY DENIM", "FESTIVE ETHNIC", "FREE STYLING", "FAST SHIPPING", "NARAYAN EXCLUSIVE"]} />
      </div>

      {/* Glassmorphic Categories */}
      <section className="relative mx-auto max-w-7xl px-4 py-24">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">Curated Styles</h2>
            <p className="mt-4 text-muted-foreground">Find exactly what you're looking for.</p>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 100}>
              <Link
                to="/shop"
                search={{ category: c.slug }}
                className="group relative block h-40 sm:h-56 overflow-hidden rounded-3xl border border-white/5 bg-card/30 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.3)] hover:border-primary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-wide transition-transform duration-500 group-hover:scale-110 group-hover:text-primary">
                    {c.label}
                  </h3>
                  <div className="mt-3 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-12 rounded-full" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative mx-auto max-w-7xl px-4 py-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
        
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black tracking-tight">Hottest Drops</h2>
              <p className="mt-2 text-muted-foreground">The most wanted fits of the week.</p>
            </div>
            <Link to="/shop" className="group mt-4 sm:mt-0 flex items-center font-bold text-primary hover:text-primary/80 transition-colors">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 relative z-10">
          {(featured ?? []).map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 100}>
              <div className="transition-all duration-500 hover:-translate-y-2">
                <ProductCard product={p} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="relative mx-auto mt-20 max-w-7xl px-4 py-20">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Premium Fabric", text: "Every piece is quality checked. No compromises." },
            { icon: Truck, title: "Fast Shipping", text: "Delivered to your doorstep anywhere in India." },
            { icon: ShieldCheck, title: "Real Support", text: "We are human. Chat with us anytime." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 150}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-md p-8 text-center transition-all duration-500 hover:bg-card hover:border-primary/30 tilt-card hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">{f.title}</h3>
                <p className="mt-3 text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 relative overflow-hidden">
        <Reveal>
          <div className="relative rounded-[3rem] border border-gold/20 bg-gradient-to-br from-card to-background p-8 sm:p-16 shadow-[0_0_50px_rgba(var(--gold),0.1)] overflow-hidden">
            <span className="absolute animate-blob -right-20 -top-20 h-96 w-96 bg-gold/20 blur-[100px]" />
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="order-2 md:order-1">
                <p className="inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-gold mb-6">
                  Curated by the Founder
                </p>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  Every fit is <br/> picked by hand.
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  From the store floor to your wardrobe — our founder personally styles and approves
                  each piece, so what you order looks as sharp on you as it does on him. We don't just sell clothes, we sell confidence.
                </p>
                <div className="mt-10">
                  <Button asChild size="lg" className="h-14 rounded-full bg-gold hover:bg-gold/90 text-gold-foreground font-bold px-8 transition-transform hover:scale-105">
                    <a href={whatsappUrl("Hi! I need styling advice.")} target="_blank" rel="noreferrer">
                      Get Styled on WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="relative mx-auto max-w-sm">
                  <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-3xl border-2 border-gold/30" />
                  <img
                    src={owner.url}
                    alt="Founder styled in Narayan Collection"
                    className="relative rounded-3xl object-cover shadow-2xl transition-transform duration-700 hover:-translate-y-2 hover:rotate-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Massive CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[3rem] bg-primary py-24 text-center text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.3)]">
            <span className="absolute left-0 top-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10 mx-auto max-w-2xl px-4">
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-lg">
                READY TO <br/> UPGRADE?
              </h2>
              <p className="mt-6 text-xl opacity-90 font-medium">
                Don't settle for boring fits. Get the best of menswear today.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-10 h-16 rounded-full px-10 text-lg font-black transition-all hover:scale-110 hover:shadow-2xl hover:bg-white text-primary">
                <Link to="/shop">
                  SHOP THE COLLECTION NOW
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
