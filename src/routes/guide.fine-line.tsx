import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import { SiteShell, EMAIL } from "@/components/SiteShell";
import cover from "@/assets/flash-botanique.jpg";

const TITLE = "Fine line : vieillissement, durabilité & entretien — Allegra Magdalena";
const DESCRIPTION =
  "Guide complet sur le vieillissement des tatouages fine line : durabilité, pros et cons, placements à éviter, aftercare et retouches. Par Allegra Magdalena.";
const URL = "https://allega-magdalena-tattoo.lovable.app/guide/fine-line";

export const Route = createFileRoute("/guide/fine-line")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { property: "og:image", content: cover },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          url: URL,
          inLanguage: "fr",
          author: { "@type": "Person", name: "Allegra Magdalena" },
          publisher: { "@type": "Person", name: "Allegra Magdalena" },
          image: `https://allega-magdalena-tattoo.lovable.app${cover}`,
          mainEntityOfPage: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Combien de temps dure un tatouage fine line ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Un tatouage fine line bien exécuté reste lisible entre 10 et 20 ans. Les lignes s'épaississent légèrement au fil des années sous l'effet de la migration de l'encre dans le derme. Un placement à faible frottement et une protection solaire prolongent nettement la netteté.",
              },
            },
            {
              "@type": "Question",
              name: "Quels sont les avantages et inconvénients du fine line ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Avantages : rendu délicat, adapté aux petites pièces, cicatrisation rapide, discrétion. Inconvénients : moins de contraste sur le long terme, nécessite des retouches plus fréquentes, moins tolérant sur les zones à forte élasticité (doigts, pieds, intérieur des mains).",
              },
            },
            {
              "@type": "Question",
              name: "Quels placements font mal vieillir un fine line ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Doigts, paumes, plantes des pieds, coudes et intérieur des poignets vieillissent mal : forte kératinisation, frottements et exposition solaire dégradent les lignes fines. Préférez avant-bras, cuisses, dos, mollets et flanc.",
              },
            },
            {
              "@type": "Question",
              name: "À quelle fréquence faut-il retoucher un fine line ?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Une première retouche gratuite est proposée après cicatrisation complète (4 à 8 semaines). Ensuite, un rafraîchissement tous les 5 à 10 ans permet de garder les lignes nettes.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: GuideFineLine,
});

function GuideFineLine() {
  return (
    <SiteShell>
      <section className="p-6 md:p-12 border-b-2 border-ink">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase hover:text-accent">
          <ArrowLeft className="w-3 h-3" /> Accueil
        </Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest mb-3">⟶ Guide · Fine line</p>
        <h1 className="font-display uppercase text-[14vw] lg:text-[7vw] leading-[0.85]">
          Fine line<span className="text-accent">.</span>
          <br />
          <span className="text-[10vw] lg:text-[4vw]">Vieillissement & durabilité</span>
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-sm leading-relaxed">
          {DESCRIPTION}
        </p>
      </section>

      <article className="p-6 md:p-12 max-w-3xl mx-auto space-y-12 font-mono text-sm leading-relaxed">
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">C'est quoi le fine line ?</h2>
          <p>
            Le fine line désigne un tatouage réalisé avec des aiguilles très petites (souvent 1RL ou 3RL),
            produisant des traits nets, précis, sans remplissage lourd. Le style favorise le dessin,
            la ligne pure et les compositions aérées — au détriment du contraste massif d'un traditionnel.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Comment ça vieillit ?</h2>
          <p>
            Toute encre injectée dans la peau migre légèrement au fil du temps : les macrophages
            déplacent les pigments, la peau perd de son élasticité, le soleil dégrade les molécules.
            Sur un trait fin, cette migration est plus visible : une ligne de 0,2 mm qui s'épaissit
            de 0,1 mm perd 50 % de sa précision perçue. Un fine line propre reste beau 10 à 20 ans ;
            au-delà, il devient plus doux, plus flou — souvent charmant, parfois à retoucher.
          </p>
          <ul className="mt-4 list-disc pl-6 space-y-2">
            <li><strong>Années 0–2</strong> : lignes nettes, cicatrisation stabilisée, retouche possible.</li>
            <li><strong>Années 2–7</strong> : lignes stables, léger adoucissement des angles.</li>
            <li><strong>Années 7–15</strong> : épaississement visible, contours moins tranchants.</li>
            <li><strong>Années 15+</strong> : rendu diffus, patine — retouche ou refresh conseillé.</li>
          </ul>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Pros & cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="brutal-border p-5 bg-paper">
              <h3 className="font-display uppercase text-xl mb-3">Avantages</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rendu délicat, élégant, adapté aux petites pièces.</li>
                <li>Cicatrisation rapide (moins de trauma cutané).</li>
                <li>Compositions denses et graphiques possibles.</li>
                <li>Discrétion : facile à porter en zone couverte ou apparente.</li>
              </ul>
            </div>
            <div className="brutal-border p-5 bg-paper">
              <h3 className="font-display uppercase text-xl mb-3">Inconvénients</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Moins de contraste sur le long terme.</li>
                <li>Retouches plus fréquentes que sur un traditionnel.</li>
                <li>Placements à forte élasticité fragilisent la ligne.</li>
                <li>Exposition solaire = ennemi n°1 de la netteté.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Le placement compte plus que tu ne crois</h2>
          <p>
            La zone du corps détermine directement la durée de vie d'un fine line. Deux facteurs :
            l'épaisseur de la peau et la friction quotidienne.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <h3 className="font-display uppercase text-lg mb-2 text-accent">✔ Bons placements</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Avant-bras extérieur</li>
                <li>Cuisses, mollets</li>
                <li>Dos, omoplate</li>
                <li>Flanc, côtes (avec réserve)</li>
                <li>Nuque, derrière l'oreille</li>
              </ul>
            </div>
            <div>
              <h3 className="font-display uppercase text-lg mb-2 text-accent">✘ Placements à éviter</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Doigts, paumes</li>
                <li>Plantes des pieds</li>
                <li>Intérieur du poignet (parfois)</li>
                <li>Coudes, genoux</li>
                <li>Zones à fort étirement</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Aftercare : la seule chose qui te sépare d'un beau tatouage dans 15 ans</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Jours 1–3</strong> : garde le film Second Skin s'il est posé (jusqu'à 4 jours), sinon lave à l'eau tiède + savon neutre 2×/jour et sèche par tamponnement.</li>
            <li><strong>Jours 3–14</strong> : hydrate finement avec une pommade neutre (Bepanthen, Hustle Butter). Pas de crasse, pas de bain, pas de piscine, pas de sport intense.</li>
            <li><strong>Jours 14–30</strong> : peau qui pèle, ne gratte pas. Continue à hydrater 2×/jour.</li>
            <li><strong>À vie</strong> : SPF 50 sur la zone dès qu'elle voit le soleil. C'est ça, le vrai secret.</li>
          </ol>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">FAQ rapide</h2>
          <dl className="space-y-4">
            <div>
              <dt className="font-display uppercase text-lg">Combien de temps dure un fine line ?</dt>
              <dd className="mt-1">Entre 10 et 20 ans en restant lisible. Une retouche tous les 5 à 10 ans le maintient net.</dd>
            </div>
            <div>
              <dt className="font-display uppercase text-lg">Un fine line, ça se retouche ?</dt>
              <dd className="mt-1">Oui — première retouche offerte après cicatrisation. Ensuite selon usure.</dd>
            </div>
            <div>
              <dt className="font-display uppercase text-lg">Ça part vraiment plus vite qu'un tatouage classique ?</dt>
              <dd className="mt-1">La disparition est identique ; c'est la <em>lisibilité</em> qui baisse plus vite parce que la ligne est fine dès le départ.</dd>
            </div>
            <div>
              <dt className="font-display uppercase text-lg">Est-ce que je peux me faire tatouer les doigts en fine line ?</dt>
              <dd className="mt-1">Techniquement oui, mais je préviens : ça bougera en 1 à 3 ans. À faire en connaissance de cause.</dd>
            </div>
          </dl>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="brutal-border p-6 bg-ink text-paper">
          <h2 className="font-display uppercase text-3xl md:text-4xl mb-3">Envie d'un fine line ?</h2>
          <p className="mb-4">Écris-moi avec ton idée, ta zone et ta taille approximative. Je réponds sous 48h.</p>
          <a
            href={`mailto:${EMAIL}?subject=Projet%20fine%20line`}
            className="inline-flex items-center gap-2 border-2 border-paper bg-accent text-paper px-5 py-3 font-mono uppercase hover:bg-paper hover:text-ink transition-colors"
          >
            <Mail className="w-4 h-4" /> Prendre rendez-vous
          </a>
        </motion.section>
      </article>
    </SiteShell>
  );
}
