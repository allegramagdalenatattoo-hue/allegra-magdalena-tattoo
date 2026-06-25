import nudite from "@/assets/flash-nudite.jpg";
import botanique from "@/assets/flash-botanique.jpg";
import corps from "@/assets/flash-corps.jpg";
import composition from "@/assets/flash-composition.jpg";
import animaux from "@/assets/flash-animaux.jpg";

export const CATEGORIES = [
  { slug: "nudite", title: "Nudité", count: 8, cover: nudite, desc: "Figures, courbes et présences. Le corps comme paysage." },
  { slug: "botanique", title: "Botanique", count: 12, cover: botanique, desc: "Fougères, fleurs sauvages, herbes folles." },
  { slug: "corps", title: "Corps", count: 9, cover: corps, desc: "Mains, pieds, anatomies, fragments." },
  { slug: "composition", title: "Composition", count: 6, cover: composition, desc: "Pièces denses, narratives, à porter en grand." },
  { slug: "animaux", title: "Animaux", count: 10, cover: animaux, desc: "Serpents, oiseaux, chevaux, insectes." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
