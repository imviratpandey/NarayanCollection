import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group overflow-hidden border-y border-border/60 bg-foreground py-3 text-background">
      <div className="animate-marquee flex w-max gap-10 group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display whitespace-nowrap text-xl uppercase tracking-[0.2em]"
          >
            {t} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
