import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import { SiteShell, EMAIL } from "@/components/SiteShell";
import { CATEGORIES, type CategorySlug } from "@/lib/flash-data";

function buildPieces(cat: (typeof CATEGORIES)[number]) {
  return Array.from({ length: cat.count }, (_, i) => ({
    id: i + 1,
    title: `${cat.title} · ${String(i + 1).padStart(2, "0")}`,
    price: `${180 + ((i * 37) % 320)} €`,
    priceNum: 180 + ((i * 37) % 320),
    status: i % 5 === 0 ? "Réservé" : "Disponible",
  }));
}

export const Route = createFileRoute("/flash/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? {
          meta: [
            { title: `Flash · ${loaderData.cat.title} — Allegra Magdalena` },
            { name: "description", content: loaderData.cat.desc },
            { property: "og:title", content: `Flash · ${loaderData.cat.title}` },
            { property: "og:description", content: loaderData.cat.desc },
            { property: "og:url", content: `https://allegra-ink-flash.lovable.app/flash/${params.category}` },
            { property: "og:image", content: loaderData.cat.cover },
          ],
          links: [{ rel: "canonical", href: `https://allegra-ink-flash.lovable.app/flash/${params.category}` }],
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `Flash · ${loaderData.cat.title}`,
                description: loaderData.cat.desc,
                url: `https://allegra-ink-flash.lovable.app/flash/${params.category}`,
                creator: { "@type": "Person", name: "Allegra Magdalena" },
                hasPart: buildPieces(loaderData.cat).map((p) => ({
                  "@type": "Product",
                  name: p.title,
                  category: `Flash tattoo · ${loaderData.cat.title}`,
                  image: `https://allegra-ink-flash.lovable.app${loaderData.cat.cover}`,
                  brand: { "@type": "Person", name: "Allegra Magdalena" },
                  offers: {
                    "@type": "Offer",
                    price: String(p.priceNum),
                    priceCurrency: "EUR",
                    availability:
                      p.status === "Réservé"
                        ? "https://schema.org/SoldOut"
                        : "https://schema.org/InStock",
                    url: `https://allegra-ink-flash.lovable.app/flash/${params.category}`,
                  },
                })),
              }),
            },
          ],
        }
      : {},
  notFoundComponent: () => (
    <SiteShell>
      <div className="p-12">
        <h1 className="font-display text-5xl uppercase">Catégorie inconnue</h1>
        <Link to="/flash" className="mt-6 inline-block border-2 border-ink px-5 py-3 font-mono uppercase hover:bg-ink hover:text-paper">
          Retour aux flash
        </Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell>
      <div className="p-12 font-mono">{error.message}</div>
    </SiteShell>
  ),
  component: FlashCategory,
});

function FlashCategory() {
  const { cat } = Route.useLoaderData();
  const pieces = buildPieces(cat);


  return (
    <SiteShell>
      <section className="p-6 md:p-12 border-b-2 border-ink">
        <Link to="/flash" className="inline-flex items-center gap-2 font-mono text-xs uppercase hover:text-accent">
          <ArrowLeft className="w-3 h-3" /> Toutes les catégories
        </Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest mb-3">⟶ Flash · {cat.title}</p>
            <h1 className="font-display uppercase text-[16vw] lg:text-[9vw] leading-[0.85]">
              {cat.title}<span className="text-accent">.</span>
            </h1>
            <p className="mt-4 max-w-xl font-mono text-sm">{cat.desc}</p>
          </div>
          <div className="lg:col-span-5 brutal-border p-4">
            <img src={cat.cover} alt={`Planche cover flash ${cat.title.toLowerCase()} — ${cat.count} dessins disponibles`} className="w-full h-64 object-cover border-b-2 border-ink" width={1024} height={1024} loading="lazy" />
            <div className="font-mono text-xs uppercase pt-3 flex justify-between">
              <span>{cat.count} pièces</span>
              <span>Cover sheet</span>
            </div>
          </div>
        </div>
      </section>

      <section className="p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {pieces.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
              whileHover={{ y: -4, rotate: i % 2 ? 0.5 : -0.5 }}
              className="brutal-border bg-paper group"
            >
              <div className="aspect-square border-b-2 border-ink overflow-hidden bg-paper relative">
                <img src={cat.cover} alt={`Dessin flash ${cat.title.toLowerCase()} ${p.title} — ${p.status.toLowerCase()}`} loading="lazy" width={512} height={512} className="w-full h-full object-cover" style={{ objectPosition: `${(i * 23) % 100}% ${(i * 41) % 100}%` }} />
                {p.status === "Réservé" && (
                  <div className="absolute inset-0 bg-ink/70 flex items-center justify-center">
                    <span className="font-display uppercase text-2xl text-accent rotate-[-8deg] border-2 border-accent px-3 py-1">Réservé</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="font-mono text-xs uppercase truncate">{p.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-lg">{p.price}</span>
                  <a
                    href={`mailto:${EMAIL}?subject=Flash%20${encodeURIComponent(p.title)}`}
                    className={`text-xs font-mono uppercase border-2 border-ink px-2 py-1 transition-colors ${p.status === "Réservé" ? "opacity-30 pointer-events-none" : "hover:bg-ink hover:text-paper"}`}
                  >
                    <Mail className="w-3 h-3 inline" /> {p.status === "Réservé" ? "—" : "Réserver"}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
