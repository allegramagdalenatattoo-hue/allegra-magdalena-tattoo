import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, Mail, Asterisk, ChevronDown, Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { CAT_GIFS, FloatingCats } from "@/components/CatGifs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/flash-data";

const NAV = [
  { to: "/", label: "ACCUEIL" },
  { to: "/tattoos", label: "TATOUAGES" },
  { to: "/flash", label: "FLASH" },
  { to: "/shop", label: "SHOP" },
] as const;

export const IG_URL = "https://instagram.com/tal_allegra_magdalena";
export const EMAIL = "allegra.magdalena.tattoo@gmail.com";

function FlashMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const active = useLocation({ select: (location) => location.pathname.startsWith("/flash") });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`${mobile ? "w-full justify-between px-4 py-3 text-xl font-display border-b-2 border-ink" : "px-4 py-2 font-mono text-sm border-2 rotate-[1.5deg]"} h-auto rounded-none uppercase ${active ? "border-ink bg-accent text-paper" : "border-transparent hover:border-ink hover:bg-ink hover:text-paper"}`}>
          FLASH <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6} className="w-60 max-w-[calc(100vw-2rem)] rounded-none border-2 border-ink bg-paper text-ink p-1 brutal-shadow">
        <DropdownMenuItem asChild className="rounded-none px-3 py-2.5 font-mono uppercase focus:bg-ink focus:text-paper">
          <Link to="/flash" onClick={onNavigate}>Tous les flashs</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-ink" />
        {CATEGORIES.map((category) => (
          <DropdownMenuItem key={category.slug} asChild className="rounded-none px-3 py-2.5 font-mono uppercase focus:bg-accent-2 focus:text-ink">
            <Link to="/flash/$category" params={{ category: category.slug }} onClick={onNavigate}>{category.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Marquee({
  reverse = false,
  variant = "ink",
  speed = "normal",
}: {
  reverse?: boolean;
  variant?: "ink" | "lime" | "pink" | "accent";
  speed?: "normal" | "fast";
}) {
  const items = [
    "★ ALLEGRA MAGDALENA TATTOO",
    "✷ FINE LINE & FLASH",
    "✦ אלגרה מגדלנה",
    "☠ BOOK NOW",
    "✺ PARIS / WORLD",
    "❂ INK ON SKIN",
  ];
  const row = [...items, ...items, ...items];
  const bg =
    variant === "lime"
      ? "bg-[var(--accent-2)] text-ink"
      : variant === "pink"
      ? "bg-[var(--accent-3)] text-ink"
      : variant === "accent"
      ? "bg-accent text-paper"
      : "bg-ink text-paper";
  const anim = speed === "fast" ? "animate-marquee-fast" : reverse ? "animate-marquee-rev" : "animate-marquee";
  return (
    <div className={`overflow-hidden border-y-2 border-ink py-3 ${bg}`}>
      <div className={`flex gap-12 whitespace-nowrap ${anim}`}>
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
    <div className="relative min-h-screen bg-paper text-ink flex flex-col">
      {/* grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 noise-bg opacity-[0.18] mix-blend-multiply" />
      <FloatingCats />
      {/* floating sticker */}
      <motion.a
        href={IG_URL}
        target="_blank"
        rel="noreferrer"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="hidden md:flex fixed bottom-6 right-6 z-40 w-28 h-28 rounded-full bg-[var(--accent-2)] border-2 border-ink items-center justify-center font-display uppercase text-[10px] text-center brutal-shadow"
      >
        <span className="leading-tight">★ DM ★ ME ★ NOW ★ DM ★</span>
        <Asterisk className="absolute w-6 h-6" />
      </motion.a>

      <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <div className="flex items-center gap-2">
            <img src={CAT_GIFS[0].url} alt="" className="h-12 w-12 object-contain md:h-14 md:w-14" />
            <Link to="/" className="font-display text-xl md:text-2xl uppercase leading-none hover:animate-glitch">
              Allegra<br />Magdalena
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n, i) => (
              n.to === "/flash" ? <FlashMenu key={n.to} /> : <Button key={n.to} asChild variant="ghost" className="h-auto rounded-none p-0 hover:bg-transparent"><Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 font-mono text-sm uppercase border-2 border-transparent hover:border-ink hover:bg-ink hover:text-paper transition-colors ${i % 2 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"}`}
                activeProps={{ className: "px-4 py-2 font-mono text-sm uppercase border-2 border-ink bg-accent text-paper -rotate-2" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link></Button>
            ))}
            <a href={IG_URL} target="_blank" rel="noreferrer" aria-label="Instagram — @tal_allegra_magdalena" className="ml-2 px-3 py-2 border-2 border-ink hover:bg-accent hover:border-accent hover:text-paper transition-colors animate-wobble">
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
          </nav>
          <Button variant="outline" size="icon" onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} className="md:hidden rounded-none border-2 border-ink">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        {open && (
          <div className="md:hidden border-t-2 border-ink flex flex-col">
            {NAV.map((n) => (
              n.to === "/flash" ? <FlashMenu key={n.to} mobile onNavigate={() => setOpen(false)} /> : <Button key={n.to} asChild variant="ghost" className="h-auto rounded-none justify-start px-4 py-3 font-display uppercase text-xl border-b-2 border-ink hover:bg-ink hover:text-paper"><Link to={n.to} onClick={() => setOpen(false)}>
                {n.label}
              </Link></Button>
            ))}
            <a href={IG_URL} target="_blank" rel="noreferrer" className="px-4 py-3 font-display uppercase text-xl flex items-center gap-2">
              <Instagram className="w-5 h-5" /> INSTAGRAM
            </a>
          </div>
        )}
      </header>

      <Marquee variant="ink" />
      <Marquee variant="lime" reverse speed="fast" />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 relative"
      >
        {children}
      </motion.main>

      <footer className="border-t-2 border-ink mt-20 relative">
        <Marquee variant="pink" />
        <Marquee variant="accent" reverse />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-12 bg-ink text-paper">
          <div>
            <h2 className="font-display text-4xl uppercase animate-glitch">Allegra<br/>Magdalena</h2>
            <p className="mt-2 font-mono text-sm opacity-80">Tattoo artist · אמנית קעקועים</p>
          </div>
          <div className="font-mono text-sm space-y-2">
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-[var(--accent-2)]">
              <Mail className="w-4 h-4" /> {EMAIL}
            </a>
            <a href={IG_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[var(--accent-2)]">
              <Instagram className="w-4 h-4" /> @tal_allegra_magdalena
            </a>
          </div>
          <div className="font-mono text-xs uppercase opacity-70">
            © {new Date().getFullYear()} — Tous droits réservés.<br />Site brutaliste, fait à la main, sans pitié.
            <br />
            <Link
              to="/admin"
              className="mt-3 inline-flex items-center gap-2 border-2 border-paper px-3 py-1.5 font-mono text-xs uppercase hover:bg-paper hover:text-ink"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
