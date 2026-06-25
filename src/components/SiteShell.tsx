import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, Mail } from "lucide-react";
import { type ReactNode, useState } from "react";

const NAV = [
  { to: "/", label: "ACCUEIL" },
  { to: "/tattoos", label: "TATOUAGES" },
  { to: "/flash", label: "FLASH" },
  { to: "/shop", label: "SHOP" },
] as const;

export const IG_URL = "https://instagram.com/tal_allegra_magdalena";
export const EMAIL = "allegra.magdalena.tattoo@gmail.com";

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = ["★ ALLEGRA MAGDALENA TATTOO", "★ FINE LINE & FLASH", "★ ‎אלגרה מגדלנה", "★ BOOK NOW", "★ TEL AVIV / WORLD"];
  const row = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink text-paper py-3">
      <div className={`flex gap-12 whitespace-nowrap ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row.map((t, i) => (
          <span key={i} className="font-display text-2xl tracking-wider uppercase">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <Link to="/" className="font-display text-xl md:text-2xl uppercase leading-none hover:text-accent transition-colors">
            Allegra<br />Magdalena
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 font-mono text-sm uppercase border-2 border-transparent hover:border-ink hover:bg-ink hover:text-paper transition-colors"
                activeProps={{ className: "px-4 py-2 font-mono text-sm uppercase border-2 border-ink bg-ink text-paper" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <a href={IG_URL} target="_blank" rel="noreferrer" className="ml-2 px-3 py-2 border-2 border-ink hover:bg-accent hover:border-accent hover:text-paper transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </nav>
          <button onClick={() => setOpen(!open)} className="md:hidden border-2 border-ink px-3 py-2 font-mono text-sm uppercase">
            {open ? "X" : "MENU"}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t-2 border-ink flex flex-col">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-4 py-3 font-display uppercase text-xl border-b-2 border-ink hover:bg-ink hover:text-paper">
                {n.label}
              </Link>
            ))}
            <a href={IG_URL} target="_blank" rel="noreferrer" className="px-4 py-3 font-display uppercase text-xl flex items-center gap-2">
              <Instagram className="w-5 h-5" /> INSTAGRAM
            </a>
          </div>
        )}
      </header>

      <Marquee />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1"
      >
        {children}
      </motion.main>

      <footer className="border-t-2 border-ink mt-20">
        <Marquee reverse />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-12">
          <div>
            <h3 className="font-display text-3xl uppercase">Allegra Magdalena</h3>
            <p className="mt-2 font-mono text-sm">Tattoo artist · אמנית קעקועים</p>
          </div>
          <div className="font-mono text-sm space-y-2">
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-accent">
              <Mail className="w-4 h-4" /> {EMAIL}
            </a>
            <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent">
              <Instagram className="w-4 h-4" /> @tal_allegra_magdalena
            </a>
          </div>
          <div className="font-mono text-xs uppercase opacity-70">
            © {new Date().getFullYear()} — Tous droits réservés.<br />Site brutaliste, fait à la main.
          </div>
        </div>
      </footer>
    </div>
  );
}
