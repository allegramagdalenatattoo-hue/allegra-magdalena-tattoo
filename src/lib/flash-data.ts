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
  { slug: "new-flash", title: "New flash", count: 0, cover: null, desc: "Les nouveaux dessins flash." },
  { slug: "visages", title: "Visages", count: 0, cover: null, desc: "Dessins flash sur le thème des visages." },
  { slug: "men", title: "Men", count: 0, cover: null, desc: "Dessins flash sur le thème des figures masculines." },
  { slug: "statues", title: "Statues", count: 0, cover: null, desc: "Dessins flash inspirés des statues." },
  { slug: "hot-comics", title: "Hot comics", count: 0, cover: null, desc: "Dessins flash sur le thème hot comics." },
  { slug: "art-deco", title: "Art Déco", count: 0, cover: null, desc: "Dessins flash inspirés de l’Art Déco." },
  { slug: "typo", title: "Typo", count: 0, cover: null, desc: "Dessins flash autour de la typographie et du lettrage." },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
