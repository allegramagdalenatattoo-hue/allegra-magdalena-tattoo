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

type Star = { id: number; x: number; y: number; rot: number; char: string };

// A single cat that follows the mouse, trailing sparkly stars behind it.
export function FloatingCats() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -200, y: -200 });
  const [stars, setStars] = useState<Star[]>([]);
  const idRef = useRef(0);
  const lastStarRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const now = performance.now();
      if (now - lastStarRef.current > 60) {
        lastStarRef.current = now;
        const id = ++idRef.current;
        const chars = ["✦", "✧", "★", "✩", "✷", "✸"];
        const star: Star = {
          id,
          x: e.clientX + (Math.random() * 30 - 15),
          y: e.clientY + (Math.random() * 30 - 15),
          rot: Math.random() * 360,
          char: chars[Math.floor(Math.random() * chars.length)],
        };
        setStars((s) => [...s.slice(-24), star]);
        window.setTimeout(() => {
          setStars((s) => s.filter((x) => x.id !== id));
        }, 900);
      }
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
            initial={{ opacity: 1, scale: 0.4, rotate: s.rot }}
            animate={{ opacity: 0, scale: 1.3, rotate: s.rot + 120, y: s.y - 30 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              color: "var(--color-accent)",
              textShadow: "2px 2px 0 var(--color-ink)",
            }}
            className="font-display text-xl select-none"
          >
            {s.char}
          </motion.span>
        ))}
      </AnimatePresence>
      <motion.img
        src={cat.url}
        alt=""
        animate={{ x: pos.x - 40, y: pos.y - 40, rotate: [0, 6, -6, 0] }}
        transition={{
          x: { type: "spring", stiffness: 120, damping: 18, mass: 0.6 },
          y: { type: "spring", stiffness: 120, damping: 18, mass: 0.6 },
          rotate: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ position: "absolute", width: 80, height: 80, top: 0, left: 0 }}
        className="object-contain drop-shadow-[3px_3px_0_var(--color-ink)]"
      />
    </div>
  );
}
