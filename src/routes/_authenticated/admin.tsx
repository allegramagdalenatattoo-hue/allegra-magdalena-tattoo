import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { ExternalLink, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { claimAdmin } from "@/lib/photos.functions";
import { coverSection, flashSection } from "@/lib/photos";
import { PhotoGrid } from "@/components/admin/PhotoGrid";
import { CATEGORIES } from "@/lib/flash-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Allegra Magdalena" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "tattoos" | "flash" | "shop" | "site";

const TABS: { id: Tab; label: string }[] = [
  { id: "tattoos", label: "Tatouages" },
  { id: "flash", label: "Flash" },
  { id: "shop", label: "Shop" },
  { id: "site", label: "Images du site" },
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const claim = useQuery({
    queryKey: ["claim-admin"],
    queryFn: () => claimAdmin(),
    staleTime: Infinity,
    retry: false,
  });
  const [tab, setTab] = useState<Tab>("tattoos");
  const [flashCat, setFlashCat] = useState<string>(CATEGORIES[0].slug);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Toaster position="bottom-right" />
      <header className="sticky top-0 z-40 bg-ink text-paper border-b-2 border-ink">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <h1 className="font-display uppercase text-2xl leading-none">
            Admin<span className="text-accent">.</span>
          </h1>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 border-2 border-paper px-3 py-2 font-mono text-xs uppercase hover:bg-paper hover:text-ink"
            >
              <ExternalLink className="w-3 h-3" /> Voir le site
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 border-2 border-paper bg-accent px-3 py-2 font-mono text-xs uppercase hover:bg-paper hover:text-ink"
            >
              <LogOut className="w-3 h-3" /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8">
        {claim.isPending ? (
          <p className="font-mono uppercase text-sm animate-blink">Chargement…</p>
        ) : claim.data?.isAdmin ? (
          <>
            <nav className="flex flex-wrap gap-2 mb-6">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`border-2 border-ink px-4 py-2 font-mono text-sm uppercase ${
                    tab === t.id ? "bg-ink text-paper -rotate-1" : "hover:bg-ink hover:text-paper"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {tab === "tattoos" && (
              <PhotoGrid
                section="tattoos"
                hint="La galerie de la page Tatouages. Sous-titre = emplacement · année (ex : Avant-bras · 2024)."
              />
            )}

            {tab === "flash" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setFlashCat(c.slug)}
                      className={`border-2 border-ink px-3 py-1 font-mono text-xs uppercase ${
                        flashCat === c.slug ? "bg-accent text-paper border-accent" : "hover:bg-ink hover:text-paper"
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
                <PhotoGrid
                  key={flashCat}
                  section={flashSection(flashCat)}
                  showPrice
                  hint="Les vraies pièces de cette catégorie. Tant qu'il n'y en a aucune, le site affiche des visuels génériques."
                />
              </div>
            )}

            {tab === "shop" && (
              <PhotoGrid
                section="shop"
                showPrice
                hint="Les articles de la page Shop. Sous-titre = édition (ex : Édition de 25). Prix ex : 120 €."
              />
            )}

            {tab === "site" && (
              <div className="space-y-10">
                <section>
                  <h2 className="font-display uppercase text-3xl mb-3">Photo d'accueil</h2>
                  <PhotoGrid
                    section="site:hero"
                    showSubtitle={false}
                    hint="La grande image à côté de ton nom sur l'accueil. La première de la liste est utilisée."
                  />
                </section>
                {CATEGORIES.map((c) => (
                  <section key={c.slug}>
                    <h2 className="font-display uppercase text-3xl mb-3">Cover — {c.title}</h2>
                    <PhotoGrid
                      section={coverSection(c.slug)}
                      showSubtitle={false}
                      hint={`L'image de couverture de la catégorie ${c.title} (page Flash). La première de la liste est utilisée.`}
                    />
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-md brutal-border p-6 bg-paper">
            <h2 className="font-display uppercase text-3xl">Accès refusé</h2>
            <p className="mt-3 font-mono text-sm">
              Ce compte n'est pas administrateur. Seul le premier compte créé obtient ce rôle.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
