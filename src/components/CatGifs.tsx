import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import cat from "@/assets/cats/giphy-11.gif.asset.json";

export const CAT_GIFS = [cat];

export function CatGif({
  src,
  className = "",
  size = 90,
  alt = "cat",
}: {
  src: string;
  className?: string;
  size?: number;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
      className={`object-contain pointer-events-none select-none ${className}`}
    />
  );
}

type Star = { id: number; x: number; y: number; rot: number; char: string; color: string };

// Cursor trail of stars in the site's palette. No gif, stars stay in place then fade.
export function FloatingCats() {
  const [stars, setStars] = useState<Star[]>([]);
  const idRef = useRef(0);
  const lastStarRef = useRef(0);

  useEffect(() => {
    const chars = ["✦", "✧", "★", "✩", "✷", "✸", "✱"];
    const colors = [
      "var(--color-ink)",
      "var(--color-accent)",
      "var(--accent-2)",
      "var(--accent-3)",
    ];
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastStarRef.current < 55) return;
      lastStarRef.current = now;
      const id = ++idRef.current;
      const star: Star = {
        id,
        x: e.clientX + (Math.random() * 20 - 10),
        y: e.clientY + (Math.random() * 20 - 10),
        rot: Math.random() * 360,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setStars((s) => [...s.slice(-28), star]);
      window.setTimeout(() => {
        setStars((s) => s.filter((x) => x.id !== id));
      }, 1000);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      <AnimatePresence>
        {stars.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 0, scale: 0.3, rotate: s.rot }}
            animate={{ opacity: 1, scale: 1, rotate: s.rot + 40 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              color: s.color,
              textShadow: "1.5px 1.5px 0 var(--color-ink)",
              transform: "translate(-50%, -50%)",
            }}
            className="font-display text-xl select-none"
          >
            {s.char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
