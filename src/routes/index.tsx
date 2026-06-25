import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Instagram, Mail, ArrowRight } from "lucide-react";
import { SiteShell, IG_URL, EMAIL } from "@/components/SiteShell";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allegra Magdalena — Tattoo Artist" },
      { name: "description", content: "Tatouages fine line, flash et compositions. FR · EN · עברית." },
      { property: "og:title", content: "Allegra Magdalena — Tattoo Artist" },
      { property: "og:description", content: "Tatouages fine line, flash et compositions." },
      { property: "og:image", content: hero },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative border-b-2 border-ink overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs uppercase tracking-widest mb-6"
            >
              ⟶ Tattoo artist · since 2019
            </motion.div>
            <h1 className="font-display uppercase text-[14vw] lg:text-[8.5vw] leading-[0.85] tracking-tighter">
              <motion.span initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="block">
                ALLEGRA
              </motion.span>
              <motion.span
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="block text-accent"
                whileHover={{ skewX: -6 }}
              >
                MAGDALENA
              </motion.span>
              <motion.span initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="block">
                TATTOO.
              </motion.span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/flash" className="group inline-flex items-center gap-3 border-2 border-ink bg-ink text-paper px-6 py-4 font-mono uppercase hover:bg-accent hover:border-accent transition">
                Voir les flash <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 border-2 border-ink px-6 py-4 font-mono uppercase hover:bg-ink hover:text-paper">
                <Mail className="w-4 h-4" /> Réserver
              </a>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative border-t-2 lg:border-t-0 lg:border-l-2 border-ink min-h-[400px] lg:min-h-[600px]"
          >
            <img src={hero} alt="Allegra Magdalena tatouant" className="absolute inset-0 w-full h-full object-cover" width={1024} height={1024} />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-4 right-4 w-24 h-24 bg-accent text-paper rounded-full flex items-center justify-center font-display uppercase text-xs text-center"
            >
              Book<br />Now ✷
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRÉSENTATION TRILINGUE */}
      <section className="border-b-2 border-ink">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-ink">
          {[
            {
              code: "FR",
              title: "Bonjour",
              body: "Je suis Allegra Magdalena, tatoueuse. Je dessine et grave sur la peau des fines lignes, des corps, des plantes et des compositions habitées. Chaque projet est une rencontre — un dialogue entre ton histoire et mon trait.",
              align: "text-left",
              dir: "ltr",
            },
            {
              code: "EN",
              title: "Hello",
              body: "I'm Allegra Magdalena, tattoo artist. I draw and ink fine lines, bodies, plants and dense compositions. Every piece begins with a conversation — your story meeting my hand.",
              align: "text-left",
              dir: "ltr",
            },
            {
              code: "HE",
              title: "שלום",
              body: "אני אלגרה מגדלנה, מקעקעת. אני מציירת ומקעקעת קווים דקים, גופים, צמחים והרכבים סבוכים. כל יצירה מתחילה בשיחה — הסיפור שלך פוגש את היד שלי.",
              align: "text-right",
              dir: "rtl",
            },
          ].map((b, i) => (
            <motion.div
              key={b.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 md:p-10 group hover:bg-ink hover:text-paper transition-colors"
              dir={b.dir}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase border border-current px-2 py-1">{b.code}</span>
                <span className="font-mono text-xs opacity-50">0{i + 1}</span>
              </div>
              <h2 className={`mt-6 font-display text-5xl uppercase ${b.align}`}>{b.title}</h2>
              <p className={`mt-4 font-mono text-sm leading-relaxed ${b.align}`}>{b.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT FICHE */}
      <section id="contact" className="p-6 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-widest mb-4">⟶ Fiche contact</p>
            <h2 className="font-display uppercase text-6xl md:text-8xl leading-none">
              Écris-<br />moi.
            </h2>
          </div>
          <div className="lg:col-span-5 brutal-border brutal-shadow-accent p-6 md:p-8 bg-paper">
            <dl className="font-mono text-sm space-y-4">
              <div>
                <dt className="uppercase text-xs opacity-60">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${EMAIL}`} className="underline decoration-2 underline-offset-4 hover:text-accent break-all">
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-60">Instagram</dt>
                <dd className="mt-1">
                  <a href={IG_URL} target="_blank" rel="noreferrer" className="underline decoration-2 underline-offset-4 hover:text-accent">
                    @tal_allegra_magdalena
                  </a>
                </dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-60">Réservations</dt>
                <dd className="mt-1">DM Instagram ou email. Réponse sous 48h.</dd>
              </div>
              <div>
                <dt className="uppercase text-xs opacity-60">Languages</dt>
                <dd className="mt-1">Français · English · עברית</dd>
              </div>
            </dl>
            <a href={`mailto:${EMAIL}`} className="mt-6 inline-flex items-center gap-3 border-2 border-ink bg-ink text-paper px-5 py-3 font-mono uppercase hover:bg-accent hover:border-accent">
              <Mail className="w-4 h-4" /> Envoyer un message
            </a>
            <a href={IG_URL} target="_blank" rel="noreferrer" className="mt-3 ml-3 inline-flex items-center gap-3 border-2 border-ink px-5 py-3 font-mono uppercase hover:bg-ink hover:text-paper">
              <Instagram className="w-4 h-4" /> DM
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
