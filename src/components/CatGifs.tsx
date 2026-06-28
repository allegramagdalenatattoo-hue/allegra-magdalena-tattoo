import { motion } from "motion/react";
import cat1 from "@/assets/cats/2VL5-100x100.gif.asset.json";
import cat2 from "@/assets/cats/3a8u-150x150.gif.asset.json";
import cat3 from "@/assets/cats/9fxG-100x100.gif.asset.json";
import cat4 from "@/assets/cats/19zb-100x100.gif.asset.json";
import cat5 from "@/assets/cats/cropped-giphy-12-32x32.gif.asset.json";
import cat6 from "@/assets/cats/giphy-8-300x269.gif.asset.json";
import cat7 from "@/assets/cats/giphy-11.gif.asset.json";
import cat8 from "@/assets/cats/giphy-17.gif.asset.json";
import cat9 from "@/assets/cats/giphy-18-150x150.gif.asset.json";
import cat10 from "@/assets/cats/giphy-22.gif.asset.json";

export const CAT_GIFS = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8, cat9, cat10];

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

// Floating cats scattered with random rotations, draggable/animated
export function FloatingCats() {
  const cats = [
    { src: cat1.url, top: "12%", left: "4%", size: 80, rot: -8, delay: 0 },
    { src: cat2.url, top: "70%", left: "2%", size: 110, rot: 6, delay: 0.4 },
    { src: cat3.url, top: "30%", right: "3%", size: 85, rot: 10, delay: 0.8 },
    { src: cat4.url, top: "82%", right: "5%", size: 90, rot: -12, delay: 1.2 },
    { src: cat8.url, top: "45%", left: "1%", size: 95, rot: 4, delay: 0.6 },
    { src: cat10.url, top: "55%", right: "1%", size: 90, rot: -6, delay: 1 },
  ] as const;
  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block">
      {cats.map((c, i) => (
        <motion.img
          key={i}
          src={c.src}
          alt=""
          initial={{ opacity: 0, scale: 0.6, rotate: c.rot }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [c.rot - 6, c.rot + 6, c.rot - 6],
            y: [0, -14, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: c.delay },
            scale: { duration: 0.6, delay: c.delay },
            rotate: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            top: (c as any).top,
            left: (c as any).left,
            right: (c as any).right,
            width: c.size,
            height: c.size,
          }}
          className="object-contain drop-shadow-[4px_4px_0_var(--color-ink)]"
        />
      ))}
    </div>
  );
}

// Strip of cats for marquee-style decorations
export function CatStrip({ reverse = false }: { reverse?: boolean }) {
  const row = [...CAT_GIFS, ...CAT_GIFS];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-[var(--accent-3)] py-2">
      <div className={`flex gap-6 whitespace-nowrap ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row.map((c, i) => (
          <img key={i} src={c.url} alt="" className="h-16 w-16 object-contain shrink-0" />
        ))}
      </div>
    </div>
  );
}
