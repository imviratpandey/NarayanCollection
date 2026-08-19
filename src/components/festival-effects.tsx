import { useEffect, useState } from "react";

export function FestivalEffects({
  festival,
  customEmoji,
  customColor,
}: {
  festival: string;
  customEmoji?: string;
  customColor?: string;
}) {
  if (festival === "none") return null;

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-[100] overflow-hidden mix-blend-screen ${
          festival === "diwali" ? "bg-orange-500/5" : ""
        }`}
        style={festival === "custom" && customColor ? { backgroundColor: `${customColor}10` } : {}}
      >
        {festival === "diwali" && <DiwaliEffects />}
        {festival === "christmas" && <ChristmasEffects />}
        {festival === "custom" && <CustomEffects emoji={customEmoji || "✨"} />}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float-down {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        @keyframes firework-burst {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .particle {
          position: absolute;
          animation: float-down linear infinite;
        }
        .firework {
          position: absolute;
          animation: firework-burst ease-out infinite;
          border-radius: 50%;
        }
      `,
        }}
      />
    </>
  );
}

function CustomEffects({ emoji }: { emoji: string }) {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 20 + 20, // size for font
    }));
    setParticles(arr);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle opacity-70 mix-blend-normal"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {emoji}
        </div>
      ))}
    </>
  );
}

function DiwaliEffects() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 4 + 2,
    }));
    setParticles(arr);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle rounded-full bg-yellow-400 shadow-[0_0_8px_2px_rgba(250,204,21,0.8)]"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${Math.random() * 3 + 3}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Example static diyas/crackers at the bottom */}
      <div className="absolute bottom-0 left-10 text-6xl opacity-80 mix-blend-normal">🪔</div>
      <div className="absolute bottom-0 right-10 text-6xl opacity-80 mix-blend-normal">🎆</div>
    </>
  );
}

function ChristmasEffects() {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      size: Math.random() * 6 + 4,
    }));
    setSnowflakes(arr);
  }, []);

  return (
    <>
      {snowflakes.map((s) => (
        <div
          key={s.id}
          className="particle rounded-full bg-white opacity-80 blur-[1px]"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="absolute top-16 right-10 text-6xl opacity-90 mix-blend-normal rotate-12">🎅</div>
      <div className="absolute top-16 left-10 text-6xl opacity-90 mix-blend-normal -rotate-12">🎄</div>
    </>
  );
}
