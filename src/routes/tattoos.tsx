import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { SiteShell } from "@/components/SiteShell";
import { photosQueryOptions } from "@/lib/photos";
import t1 from "@/assets/tattoo-1.jpg";
import t2 from "@/assets/tattoo-2.jpg";
import t3 from "@/assets/tattoo-3.jpg";
import t4 from "@/assets/tattoo-4.jpg";
import t5 from "@/assets/tattoo-5.jpg";
import t6 from "@/assets/tattoo-6.jpg";

export const Route = createFileRoute("/tattoos")({
  head: () => ({
    meta: [
      { title: "Tatouages — Allegra Magdalena" },
      { name: "description", content: "Galerie de mes tatouages : fine line, botanique, figures et compositions." },
      { property: "og:title", content: "Tatouages — Allegra Magdalena" },
      { property: "og:description", content: "Galerie de mes tatouages réalisés." },
      { property: "og:url", content: "https://allega-magdalena-tattoo.lovable.app/tattoos" },
      { property: "og:image", content: t5 },
    ],
    links: [{ rel: "canonical", href: "https://allega-magdalena-tattoo.lovable.app/tattoos" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Tatouages — Allegra Magdalena",
          description: "Galerie de tatouages fine line, botanique, figures et compositions.",
          url: "https://allega-magdalena-tattoo.lovable.app/tattoos",
          creator: { "@type": "Person", name: "Allegra Magdalena" },
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(photosQueryOptions(["tattoos"])),
  component: Tattoos,
});

const ITEMS = [
  { src: t1, title: "Fougère", year: "2024", placement: "Avant-bras" },
  { src: t2, title: "Figure", year: "2024", placement: "Cuisse" },
  { src: t3, title: "Serpent", year: "2023", placement: "Clavicule" },
  { src: t4, title: "Bouquet", year: "2024", placement: "Main" },
  { src: t5, title: "Composition florale", year: "2023", placement: "Dos" },
  { src: t6, title: "Cheval", year: "2024", placement: "Épaule" },
];

function Tattoos() {
  const { data: photos } = useSuspenseQuery(photosQueryOptions(["tattoos"]));
  const items = photos.length
    ? photos.map((p) => {
        const [placement = "", year = ""] = p.subtitle.split("·").map((s) => s.trim());
        return { src: p.image_url, title: p.title, placement, year };
      })
    : ITEMS;
  return (
    <SiteShell>
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-ink">
        <p className="font-mono text-xs uppercase tracking-widest mb-4">⟶ Archive · 01 / 06</p>
        <h1 className="font-display uppercase text-[16vw] lg:text-[10vw] leading-[0.85]">
          Tatou<motion.span animate={{ rotate: [0, -3, 3, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }} className="inline-block text-accent">·</motion.span>ages
        </h1>
      </section>

      <section className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((it, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="brutal-border bg-paper group"
            >
              <div className="relative overflow-hidden border-b-2 border-ink aspect-[4/5]">
                <motion.img
                  src={it.src}
                  alt={`Tatouage fine line ${it.title.toLowerCase()} sur ${it.placement.toLowerCase()} par Allegra Magdalena (${it.year})`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute top-2 left-2 bg-ink text-paper font-mono text-xs px-2 py-1 uppercase">
                  N°{String(i + 1).padStart(2, "0")}
                </div>
              </div>
              <figcaption className="flex items-baseline justify-between p-4">
                <div>
                  <div className="font-display uppercase text-xl leading-none">{it.title}</div>
                  <div className="font-mono text-xs opacity-80 mt-1">{it.placement}</div>
                </div>
                <div className="font-mono text-xs">{it.year}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
