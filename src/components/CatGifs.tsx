import { motion } from "motion/react";
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

// Scattered cats — same GIF (kitten with sparkly eyes) repeated across the viewport
export function FloatingCats() {
  const cats = [
    { top: "8%",  left: "3%",  size: 70,  rot: -12, delay: 0,    dur: 2.8 },
    { top: "65%", left: "2%",  size: 100, rot: 8,   delay: 0.3,  dur: 3.5 },
    { top: "25%", right: "4%", size: 65,  rot: 14,  delay: 0.6,  dur: 2.4 },
    { top: "78%", right: "6%", size: 80,  rot: -18, delay: 0.9,  dur: 3.2 },
    { top: "42%", left: "5%",  size: 55,  rot: 22,  delay: 1.2,  dur: 2.1 },
    { top: "12%", right: "15%",size: 120, rot: -6,  delay: 0.5,  dur: 4.0 },
    { top: "55%", right: "2%", size: 75,  rot: 5,   delay: 1.5,  dur: 2.6 },
    { top: "88%", left: "30%", size: 90,  rot: -10, delay: 0.8,  dur: 3.0 },
    { top: "35%", left: "45%", size: 85,  rot: 16,  delay: 1.1,  dur: 3.3 },
    { top: "18%", left: "75%", size: 95,  rot: -4,  delay: 0.2,  dur: 3.8 },
  ] as const;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {cats.map((c, i) => (
        <motion.img
          key={i}
          src={cat.url}
          alt=""
          initial={{ opacity: 0, scale: 0.5, rotate: c.rot }}
          animate={{
            opacity: 1,
            scale: [0.9, 1.05, 0.9],
            rotate: [c.rot - 10, c.rot + 10, c.rot - 10],
            x: [0, 10, -8, 0],
            y: [0, -18, 8, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: c.delay },
            scale: { duration: c.dur, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: c.dur * 0.8, repeat: Infinity, ease: "easeInOut" },
            x: { duration: c.dur * 1.2, repeat: Infinity, ease: "easeInOut" },
            y: { duration: c.dur, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            top: c.top,
            left: (c as any).left,
            right: (c as any).right,
            width: c.size,
            height: c.size,
          }}
          className="object-contain drop-shadow-[3px_3px_0_var(--color-ink)]"
        />
      ))}
    </div>
  );
}
