import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center brutal-border brutal-shadow p-8 bg-paper">
        <h1 className="font-display text-8xl text-ink">404</h1>
        <h2 className="mt-4 font-display text-2xl uppercase">Page introuvable</h2>
        <p className="mt-2 font-mono text-sm">Cette page n'existe pas ou a disparu.</p>
        <Link to="/" className="mt-6 inline-block border-2 border-ink bg-ink text-paper px-6 py-3 font-mono uppercase hover:bg-accent hover:border-accent">
          Retour accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center brutal-border p-8">
        <h1 className="font-display text-2xl uppercase">Erreur</h1>
        <p className="mt-2 font-mono text-sm">Quelque chose s'est cassé.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border-2 border-ink bg-ink text-paper px-4 py-2 font-mono uppercase hover:bg-accent hover:border-accent"
          >
            Réessayer
          </button>
          <a href="/" className="border-2 border-ink px-4 py-2 font-mono uppercase hover:bg-ink hover:text-paper">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Allegra Magdalena — Tattoo Artist" },
      { name: "description", content: "Allegra Magdalena · tatouages fine line, fat line,  flash et compositions. Paris, Tel Aviv & ailleurs." },
      { property: "og:title", content: "Allegra Magdalena — Tattoo Artist" },
      { property: "og:description", content: "Allegra Magdalena · tatouages fine line, fat line,  flash et compositions. Paris, Tel Aviv & ailleurs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Allegra Magdalena — Tattoo Artist" },
      { name: "twitter:description", content: "Allegra Magdalena · tatouages fine line, fat line,  flash et compositions. Paris, Tel Aviv & ailleurs." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c5c7688b-14eb-49b0-b53a-2780504dfeb3" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c5c7688b-14eb-49b0-b53a-2780504dfeb3" },
      { name: "google-site-verification", content: "Nbvfhguk-OcHvokOviAKuyzR4utp6QECUB9hYB4TAdU" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
