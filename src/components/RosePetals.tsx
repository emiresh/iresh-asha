import petal from "@/assets/petal.png";
import { useMemo } from "react";

export function RosePetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 28,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * 12,
        opacity: 0.35 + Math.random() * 0.45,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden>
      {petals.map((p) => (
        <img
          key={p.id}
          src={petal}
          alt=""
          className="absolute animate-petal will-change-transform"
          style={{
            left: `${p.left}%`,
            top: "-10vh",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.06))",
          }}
        />
      ))}
    </div>
  );
}
