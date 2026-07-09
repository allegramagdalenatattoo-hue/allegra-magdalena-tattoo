import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, Mail } from "lucide-react";
import { SiteShell, EMAIL, IG_URL } from "@/components/SiteShell";
import { CATEGORIES } from "@/lib/flash-data";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Allegra Magdalena" },
      { name: "description", content: "Dessins originaux et objets en vente. Pour commander : DM Instagram ou email." },
      { property: "og:title", content: "Shop — Allegra Magdalena" },
      { property: "og:description", content: "Dessins originaux et objets en édition limitée." },
      { property: "og:url", content: "https://allegra-ink-flash.lovable.app/shop" },
      { property: "og:image", content: CATEGORIES[1].cover },
    ],
    links: [{ rel: "canonical", href: "https://allegra-ink-flash.lovable.app/shop" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Shop — Allegra Magdalena",
          description: "Dessins originaux, prints en édition limitée et objets à commander en DM ou par email.",
          url: "https://allegra-ink-flash.lovable.app/shop",
        }),
      },
    ],
  }),
  component: Shop,
});

const ITEMS = [
  { title: "Flash sheet — Botanique", cat: "Dessin", price: "120 €", img: CATEGORIES[1].cover, edition: "Original encre / papier" },
  { title: "Composition · figures", cat: "Dessin", price: "240 €", img: CATEGORIES[3].cover, edition: "Original encre / papier" },
  { title: "Animaux — print A3", cat: "Print", price: "45 €", img: CATEGORIES[4].cover, edition: "Édition de 25" },
  { title: "Nudité — étude", cat: "Dessin", price: "180 €", img: CATEGORIES[0].cover, edition: "Original" },
  { title: "Corps — print A4", cat: "Print", price: "30 €", img: CATEGORIES[2].cover, edition: "Édition ouverte" },
  { title: "Tirage photo — atelier", cat: "Photo", price: "60 €", img: hero, edition: "Édition de 10" },
];

function Shop() {
  return (
    <SiteShell>
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-ink">
        <p className="font-mono text-xs uppercase tracking-widest mb-4">⟶ Vitrine · DM pour commander</p>
        <h1 className="font-display uppercase text-[16vw] lg:text-[10vw] leading-[0.85]">
          Sh<motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="inline-block text-accent">o</motion.span>p
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed">
          Dessins originaux, prints en édition limitée et objets. Pas de panier ici —
          écris-moi en DM ou par email pour réserver ta pièce. Expédition mondiale.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={IG_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-2 border-ink bg-ink text-paper px-5 py-3 font-mono uppercase hover:bg-accent hover:border-accent">
            <Instagram className="w-4 h-4" /> DM @tal_allegra_magdalena
          </a>
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 border-2 border-ink px-5 py-3 font-mono uppercase hover:bg-ink hover:text-paper">
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>
      </section>

      <section className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {ITEMS.map((it, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="brutal-border bg-paper group"
            >
              <div className="aspect-[4/5] border-b-2 border-ink overflow-hidden relative">
                <motion.img src={it.img} alt={it.title} width={1024} height={1024} loading="lazy" className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} />
                <div className="absolute top-2 left-2 bg-accent text-paper font-mono text-xs px-2 py-1 uppercase">{it.cat}</div>
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display uppercase text-xl leading-none">{it.title}</h2>
                  <span className="font-display text-2xl shrink-0">{it.price}</span>
                </div>
                <p className="font-mono text-xs opacity-80 mt-2">{it.edition}</p>
                <a
                  href={`mailto:${EMAIL}?subject=Shop%20-%20${encodeURIComponent(it.title)}`}
                  className="mt-4 block text-center border-2 border-ink px-4 py-2 font-mono text-xs uppercase hover:bg-ink hover:text-paper"
                >
                  Demander
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
