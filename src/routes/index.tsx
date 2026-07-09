import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, Mail, ArrowRight } from "lucide-react";
import { SiteShell, IG_URL, EMAIL } from "@/components/SiteShell";
import { CAT_GIFS } from "@/components/CatGifs";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allegra Magdalena — Tattoo Artist" },
      { name: "description", content: "Tatouages fine line, flash et compositions. FR · EN · עברית." },
      { property: "og:title", content: "Allegra Magdalena — Tattoo Artist" },
      { property: "og:description", content: "Tatouages fine line, flash et compositions." },
      { property: "og:url", content: "https://allegra-ink-flash.lovable.app/" },
      { property: "og:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "https://allegra-ink-flash.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Allegra Magdalena",
          alternateName: "אלגרה מגדלנה",
          jobTitle: "Tattoo Artist",
          url: "https://allegra-ink-flash.lovable.app/",
          image: "https://allegra-ink-flash.lovable.app/",
          sameAs: ["https://instagram.com/tal_allegra_magdalena"],
          email: "allegra.magdalena.tattoo@gmail.com",
          knowsAbout: ["Fine line tattoo", "Flash tattoo", "Botanical tattoo"],
          knowsLanguage: ["fr", "en", "he"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative border-b-2 border-ink overflow-hidden">
        {/* floating tags */}
        <motion.div
          className="absolute top-6 right-6 z-20 bg-[var(--accent-2)] border-2 border-ink px-3 py-1 font-mono text-xs uppercase rotate-[8deg]"
          animate={{ rotate: [8, -4, 8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✱ Nouveaux flash !!
        </motion.div>
        <motion.div
          className="absolute bottom-6 left-6 z-20 bg-[var(--accent-3)] border-2 border-ink px-3 py-1 font-mono text-xs uppercase -rotate-6 animate-blink"
        >
          ⚡ Walk-ins parfois
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs uppercase tracking-widest mb-6 inline-block bg-ink text-paper px-2 py-1"
            >
              ⟶ Tattoo artist · since 2019 · TLV
            </motion.div>
            <h1 className="font-display uppercase text-[13vw] lg:text-[10vw] leading-[0.82] tracking-tighter">
              <motion.span
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 80 }}
                className="block hover:animate-glitch"
              >
                ALLEGRA
              </motion.span>
              <motion.span
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80 }}
                className="block text-stroke"
                whileHover={{ skewX: -10, color: "var(--color-accent)" }}
              >
                MAGDALENA
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="block"
              >
                TATTOO<span className="text-accent animate-blink inline-block px-2">!</span>
              </motion.span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/flash" className="group inline-flex items-center gap-3 border-2 border-ink bg-ink text-paper px-6 py-4 font-mono uppercase hover:bg-accent hover:border-accent transition brutal-shadow-lime">
                Voir les flash <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 border-2 border-ink px-6 py-4 font-mono uppercase hover:bg-ink hover:text-paper brutal-shadow-pink">
                <Mail className="w-4 h-4" /> Réserver
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative border-t-2 lg:border-t-0 lg:border-l-2 border-ink min-h-[400px] lg:min-h-[600px] overflow-hidden"
          >
            <img src={hero} alt="Allegra Magdalena tatouant" className="absolute inset-0 w-full h-full object-cover" width={1024} height={1024} />
            <div className="absolute inset-0 scanlines pointer-events-none mix-blend-multiply opacity-60" />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 right-4 w-28 h-28 bg-accent text-paper rounded-full flex items-center justify-center font-display uppercase text-xs text-center border-2 border-ink"
            >
              Book<br />Now ✷
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-4 left-4 bg-paper border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase rotate-[-6deg]"
            >
              ▶ live · atelier
            </motion.div>
          </motion.div>
          {/* inline cats on hero corner */}
          <motion.img
            src={CAT_GIFS[0].url}
            alt=""
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 8, -8, 0] }}
            transition={{ rotate: { duration: 3, repeat: Infinity } }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 lg:left-[55%] w-24 h-24 z-20 pointer-events-none"
          />
        </div>
      </section>

      {/* PRÉSENTATION TRILINGUE */}
      <section className="border-b-2 border-ink relative">
        <div className="absolute -top-5 left-8 z-10 bg-ink text-paper px-3 py-1 font-mono text-xs uppercase rotate-[-3deg] border-2 border-ink">
          ⟶ 3 langues / 3 שפות / 3 languages
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
          {[
            {
              code: "FR",
              title: "Bonjour",
              body: "Je suis Allegra Magdalena, tatoueuse. Je dessine et grave sur la peau des fines lignes, des corps, des plantes et des compositions habitées. Chaque projet est une rencontre — un dialogue entre ton histoire et mon trait.",
              align: "text-left",
              dir: "ltr",
              bg: "hover:bg-[var(--accent-2)] hover:text-ink",
            },
            {
              code: "EN",
              title: "Hello",
              body: "I'm Allegra Magdalena, tattoo artist. I draw and ink fine lines, bodies, plants and dense compositions. Every piece begins with a conversation — your story meeting my hand.",
              align: "text-left",
              dir: "ltr",
              bg: "hover:bg-accent hover:text-paper",
            },
            {
              code: "HE",
              title: "שלום",
              body: "אני אלגרה מגדלנה, מקעקעת. אני מציירת ומקעקעת קווים דקים, גופים, צמחים והרכבים סבוכים. כל יצירה מתחילה בשיחה — הסיפור שלך פוגש את היד שלי.",
              align: "text-right",
              dir: "rtl",
              bg: "hover:bg-[var(--accent-3)] hover:text-ink",
            },
          ].map((b, i) => (
            <motion.div
              key={b.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 md:p-10 group transition-colors ${b.bg}`}
              dir={b.dir}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase border-2 border-current px-2 py-1 group-hover:animate-jitter">{b.code}</span>
                <span className="font-display text-2xl opacity-30">0{i + 1}</span>
              </div>
              <h2 className={`mt-6 font-display text-6xl uppercase group-hover:animate-glitch ${b.align}`}>{b.title}</h2>
              <p className={`mt-4 font-mono text-sm leading-relaxed ${b.align}`}>{b.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT FICHE */}
      <section id="contact" className="p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -right-10 top-10 font-display uppercase text-[20vw] text-stroke opacity-30 pointer-events-none select-none"
        >
          CONTACT
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest mb-4 bg-ink text-paper inline-block px-2 py-1">⟶ Fiche contact</p>
            <h2 className="font-display uppercase text-7xl md:text-9xl leading-none">
              Écris-<br /><span className="text-accent animate-drift inline-block">moi.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 brutal-border brutal-shadow-lime p-6 md:p-8 bg-paper rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <dl className="font-mono text-sm space-y-4">
              <div>
                <dt className="uppercase text-xs opacity-80">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${EMAIL}`} className="underline decoration-2 underline-offset-4 hover:text-accent break-all">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-80">Instagram</dt>
                <dd className="mt-1">
                  <a href={IG_URL} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-accent">
                    @tal_allegra_magdalena
                  </a>
                </dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-80">Réservations</dt>
                <dd className="mt-1">DM Instagram ou email. Réponse sous 48h.</dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-80">Languages</dt>
                <dd className="mt-1">Français · English · עברית</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 border-2 border-ink bg-ink text-paper px-5 py-3 font-mono uppercase hover:bg-accent hover:border-accent">
                <Mail className="w-4 h-4" /> Envoyer
              </a>
              <a href={IG_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border-2 border-ink px-5 py-3 font-mono uppercase hover:bg-ink hover:text-paper">
                <Instagram className="w-4 h-4" /> DM
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

