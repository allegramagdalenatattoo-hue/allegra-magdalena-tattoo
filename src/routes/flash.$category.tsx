import { createFileRoute, Link, notFound, type ErrorComponentProps } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { PhotoViewer } from "@/components/PhotoViewer";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/flash-data";
import { photosQueryOptions, coverSection, flashSection } from "@/lib/photos";

function buildPieces(cat: (typeof CATEGORIES)[number]) {
  return Array.from({ length: cat.count }, (_, i) => ({
    id: String(i + 1),
    title: `${cat.title} · ${String(i + 1).padStart(2, "0")}`,
    image: null as string | null,
  }));
}

const sectionsFor = (slug: string) => [coverSection(slug), flashSection(slug)];

export const Route = createFileRoute("/flash/$category")({
  loader: async ({ params, context }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.category);
    if (!cat) throw notFound();
    await context.queryClient.ensureQueryData(photosQueryOptions(sectionsFor(cat.slug)));
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
            { property: "og:url", content: `https://allega-magdalena-tattoo.lovable.app/flash/${params.category}` },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          links: [{ rel: "canonical", href: `https://allega-magdalena-tattoo.lovable.app/flash/${params.category}` }],
          scripts: [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `Flash · ${loaderData.cat.title}`,
                description: loaderData.cat.desc,
                url: `https://allega-magdalena-tattoo.lovable.app/flash/${params.category}`,
                creator: { "@type": "Person", name: "Allegra Magdalena" },

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
  errorComponent: ({ error }: ErrorComponentProps) => (
    <SiteShell>
      <div className="p-12 font-mono">
        {error instanceof Error ? error.message : String(error)}
      </div>
    </SiteShell>
  ),
  component: FlashCategory,
});

function FlashCategory() {
  const { cat } = Route.useLoaderData();
  const { data: photos } = useSuspenseQuery(photosQueryOptions(sectionsFor(cat.slug)));
  const dbPieces = photos.filter((p) => p.section === flashSection(cat.slug));
  const cover = photos.find((p) => p.section === coverSection(cat.slug))?.image_url ?? cat.cover;
  const pieces = dbPieces.length
    ? dbPieces.map((p) => ({
        id: p.id,
        title: p.title || cat.title,
        image: p.image_url as string | null,
      }))
    : buildPieces(cat);
  const count = pieces.length;




  return (
    <SiteShell>
      <section className="p-6 md:p-12 border-b-2 border-ink">
        <Link to="/flash" className="inline-flex items-center gap-2 font-mono text-xs uppercase hover:text-accent">
          <ArrowLeft className="w-3 h-3" /> Toutes les catégories
        </Link>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest mb-3">⟶ Flash · {cat.title}</p>
            <h1 className="font-display uppercase text-5xl md:text-7xl xl:text-8xl leading-[0.85] break-words">
              {cat.title}<span className="text-accent">.</span>
            </h1>
            <p className="mt-4 max-w-xl font-mono text-sm">{cat.desc}</p>
          </div>
          <div className="lg:col-span-5 brutal-border p-4">
             {cover ? <img src={cover} alt={`Planche cover flash ${cat.title.toLowerCase()} — ${count} dessins disponibles`} className="w-full h-64 object-cover border-b-2 border-ink" width={1024} height={1024} loading="lazy" /> : <div className="flex h-64 items-center justify-center border-b-2 border-ink bg-muted p-6">
               <span className="font-display uppercase text-3xl text-center break-words">{cat.title}</span>
             </div>}
            <div className="font-mono text-xs uppercase pt-3 flex justify-between">
              <span>{count} pièces</span>
              <span>Cover sheet</span>
            </div>

          </div>
        </div>
      </section>

       {count === 0 ? <section className="p-6 md:p-12"><p className="font-mono text-sm">Aucun flash pour le moment.</p></section> : <PhotoViewer photos={pieces.map((p) => ({ src: p.image ?? cover ?? "", title: p.title }))}>
        {(open) => <section className="p-4 md:p-8">
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
              <Button variant="ghost" onClick={() => open(i)} aria-label={`Agrandir ${p.title}`} className="block h-auto w-full rounded-none p-0 hover:bg-paper">
                <div className="aspect-square border-b-2 border-ink overflow-hidden bg-paper relative">
                   <img src={p.image ?? cover ?? undefined} alt={`Dessin flash ${cat.title.toLowerCase()} ${p.title}`} loading="lazy" width={512} height={512} className="w-full h-full object-cover" />
                </div>
              </Button>
              <div className="p-3 font-mono text-xs uppercase break-words">{p.title}</div>
            </motion.article>
          ))}
        </div>
      </section>}
       </PhotoViewer>}
    </SiteShell>
  );
}
