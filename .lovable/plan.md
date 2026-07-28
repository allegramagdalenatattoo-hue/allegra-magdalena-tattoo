# Panneau d'administration photos

## Objectif
Gérer toutes les photos du site (ajouter, trier par glisser-déposer, supprimer, modifier titres/prix/statuts) depuis une page d'admin, sans jamais toucher au code.

## Ce que tu auras
- **Page de connexion** `/auth` : email + mot de passe. Réservée à toi — le premier compte créé devient admin, les suivants n'ont aucun droit.
- **Panneau `/admin`** (protégé, style brutaliste assorti au site) avec onglets :
  - **Tatouages** — la galerie archive
  - **Flash** — les pièces de chaque catégorie (nudité, botanique, corps, composition, animaux)
  - **Shop** — les dessins/objets en vente (avec prix + statut)
  - **Images du site** — photo d'accueil (hero) + covers des catégories
- Pour chaque photo : **ajouter** (upload depuis ton téléphone/ordi), **réordonner** par glisser-déposer, **supprimer**, **éditer** titre / prix / statut « Disponible / Réservé ».
- Les pages publiques se mettent à jour **automatiquement** dès que tu changes quelque chose dans l'admin.
- Tes images actuelles sont importées comme point de départ : rien ne disparaît, tu pars de l'existant.
- Petit lien « Admin » discret dans le footer + bouton déconnexion dans l'admin.

## Étapes
1. Activer **Lovable Cloud** (base de données + stockage de fichiers + connexion intégrés, aucun compte externe à créer).
2. Rendre les 12 images actuelles stables (copie dans `public/photos/`).
3. Créer la base : table `photos` (section, titre, prix, statut, URL, ordre) + rôles admin, avec règles de sécurité (lecture publique, écriture admin uniquement) et import des photos existantes.
4. Créer le bucket de stockage pour les nouveaux uploads.
5. Brancher la connexion (`/auth` + protection des routes admin).
6. Construire le panneau `/admin` : onglets, grille de photos, upload, glisser-déposer (dnd-kit), suppression, édition.
7. Rebrancher les pages publiques (accueil, tatouages, flash, shop) sur la base de données.
8. Vérifier : build + parcours complet connexion → ajout → tri → suppression → affichage public.

## Détails techniques
- **Lovable Cloud** : PostgreSQL + Storage + Auth (Supabase sous le capot, sans configuration).
- **Table `photos`** : `id, section (tattoos | flash:<slug> | shop | site:hero | site:cover:<slug>), title, subtitle, price, status, image_url, storage_path, sort_order`. RLS : `SELECT` public, `INSERT/UPDATE/DELETE` via `has_role(auth.uid(), 'admin')` (security definer). GRANTs inclus dans la migration.
- **Table `user_roles`** + enum `app_role` ; trigger qui donne le rôle `admin` au premier inscrit.
- **Storage** : bucket public `photos` ; policies : lecture publique, écriture admin. Les uploads sont nommés `section/uuid-nomfichier`.
- **Auth** : portail géré par l'intégration (`/auth`, gate `_authenticated`, middleware bearer). Pas de comptes publics — juste ton accès admin.
- **Pages publiques** : lecture via TanStack Query (`useSuspenseQuery`) avec repli sur le contenu statique actuel si la base est vide (le site ne peut pas se retrouver vide par accident).
- **Admin** : `@dnd-kit/core` + `@dnd-kit/sortable` pour le glisser-déposer ; mutations via le client Supabase du navigateur (RLS applique les droits).
- SEO inchangé (métadonnées, sitemap et JSON-LD conservés ; les images dynamiques alimentent les schémas).

## Après la mise en ligne
Tu te crées un compte une seule fois sur `/auth` (ton email + un mot de passe) → tu es admin à vie. Ensuite tout se gère depuis `/admin`.