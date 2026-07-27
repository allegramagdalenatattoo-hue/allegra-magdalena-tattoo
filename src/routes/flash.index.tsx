import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { CATEGORIES } from "@/lib/flash-data";

export const Route = createFileRoute("/flash/")({
  head: () => ({
    meta: [
      { title: "Flash — Allegra Magdalena" },
      { name: "description", content: "Propositions de dessins flash disponibles : nudité, botanique, corps, composition, animaux." },
      { property: "og:title", content: "Flash — Allegra Magdalena" },
      { property: "og:description", content: "Dessins flash disponibles à tatouer." },
      { property: "og:url", content: "https://allega-magdalena-tattoo.lovable.app/flash" },
      { property: "og:image", content: CATEGORIES[3].cover },
    ],
    links: [{ rel: "canonical", href: "https://allega-magdalena-tattoo.lovable.app/flash" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Flash — Allegra Magdalena",
          description: "Catalogue de dessins flash disponibles, classés par catégorie.",
          url: "https://allega-magdalena-tattoo.lovable.app/flash",
          hasPart: CATEGORIES.map((c) => ({
            "@type": "CollectionPage",
            name: `Flash · ${c.title}`,
            url: `https://allega-magdalena-tattoo.lovable.app/flash/${c.slug}`,
            description: c.desc,
          })),
        }),
      },
    ],
  }),
  component: FlashIndex,
});

function FlashIndex() {
  return (
    <SiteShell>
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-ink">
        <p className="font-mono text-xs uppercase tracking-widest mb-4">⟶ Flash disponibles · 5 catégories</p>
        <h1 className="font-display uppercase text-[16vw] lg:text-[10vw] leading-[0.85]">
          Flash<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed">
          Dessins prêts à être tatoués. Choisis une catégorie, repère ta pièce, écris-moi.
          Chaque flash n'est tatoué qu'une à deux fois.
        </p>
      </section>

      <section className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <Link
                to="/flash/$category"
                params={{ category: c.slug }}
                className="block brutal-border group bg-paper hover:bg-ink hover:text-paper transition-colors"
              >
                <div className="relative overflow-hidden border-b-2 border-ink aspect-[4/3] bg-paper">
                  <motion.img
                    src={c.cover}
                    alt={`Flash tatouage ${c.title.toLowerCase()} — planche cover ${c.count} pièces`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05, rotate: -0.5 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute top-2 left-2 bg-ink text-paper font-mono text-xs px-2 py-1 uppercase">
                    {String(i + 1).padStart(2, "0")} / 05
                  </div>
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="font-display uppercase text-3xl leading-none">{c.title}</h2>
                    <p className="font-mono text-xs mt-2 opacity-70">{c.desc}</p>
                  </div>
                  <ArrowUpRight className="w-8 h-8 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="font-mono text-xs uppercase border-t-2 border-current px-4 py-2 flex justify-between">
                  <span>{c.count} pièces</span>
                  <span>Voir →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
