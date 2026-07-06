import nudite from "@/assets/flash-nudite.jpg";
import botanique from "@/assets/flash-botanique.jpg";
import corps from "@/assets/flash-corps.jpg";
import composition from "@/assets/flash-composition.jpg";
import animaux from "@/assets/flash-animaux.jpg";

export const CATEGORIES = [
  { slug: "nudite", title: "Nudité", count: 8, cover: nudite, desc: "Figures, courbes et présences. Le corps comme paysage." },
  { slug: "botanique", title: "Botanique", count: 12, cover: botanique, desc: "Découvrez mes tatouages flash sur le thème de la botanique : fougères, fleurs sauvages et herbes folles." },
  { slug: "corps", title: "Corps", count: 9, cover: corps, desc: "Tatouages flash sur le thème du corps : mains, pieds, anatomies et fragments de présence." },
  { slug: "composition", title: "Composition", count: 6, cover: composition, desc: "Tatouages flash en composition : pièces denses, narratives et graphiques à porter en grand." },
  { slug: "animaux", title: "Animaux", count: 10, cover: animaux, desc: "Découvrez mes tatouages flash sur le thème animal : serpents, oiseaux, chevaux et insectes." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
