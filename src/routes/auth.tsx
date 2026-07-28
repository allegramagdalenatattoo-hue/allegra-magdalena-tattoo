import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Allegra Magdalena" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/admin" });
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        if (data.session) {
          navigate({ to: "/admin" });
        } else {
          setMessage("Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.");
          setMode("login");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 noise-bg opacity-[0.18] mix-blend-multiply" />
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -top-8 -right-8 font-display uppercase text-[22vw] text-stroke opacity-20 select-none"
      >
        ZONE51
      </motion.div>

      <div className="w-full max-w-md relative">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase mb-6 hover:text-accent">
          <ArrowLeft className="w-3 h-3" /> Retour au site
        </Link>

        <div className="brutal-border brutal-shadow-lime bg-paper p-6 md:p-8 rotate-[-1deg]">
          <div className="flex items-center gap-3">
            <span className="bg-ink text-paper p-2 border-2 border-ink animate-jitter">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="font-display uppercase text-4xl leading-none">
              Accès<br /><span className="text-accent">Admin</span>
            </h1>
          </div>

          <div className="mt-6 grid grid-cols-2 border-2 border-ink font-mono text-xs uppercase">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-3 py-2 ${mode === "login" ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper"}`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`px-3 py-2 border-l-2 border-ink ${mode === "signup" ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper"}`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4 font-mono text-sm">
            <label className="block">
              <span className="uppercase text-xs">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 outline-none focus:bg-[var(--accent-2)]"
                placeholder="toi@exemple.com"
              />
            </label>
            <label className="block">
              <span className="uppercase text-xs">Mot de passe</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border-2 border-ink bg-paper px-3 py-2 outline-none focus:bg-[var(--accent-2)]"
                placeholder="••••••••"
              />
            </label>

            {error && <p className="border-2 border-accent bg-accent text-paper px-3 py-2 text-xs uppercase">{error}</p>}
            {message && <p className="border-2 border-ink bg-[var(--accent-2)] px-3 py-2 text-xs uppercase">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full border-2 border-ink bg-ink text-paper px-4 py-3 font-display uppercase text-xl hover:bg-accent hover:border-accent disabled:opacity-50"
            >
              {busy ? "…" : mode === "login" ? "Entrer" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-4 font-mono text-[10px] uppercase opacity-70">
            Le premier compte créé devient administrateur du site.
          </p>
        </div>
      </div>
    </div>
  );
}
