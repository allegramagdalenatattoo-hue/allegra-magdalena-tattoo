-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Photos table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  price TEXT,
  status TEXT NOT NULL DEFAULT 'Disponible',
  image_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX photos_section_order_idx ON public.photos (section, sort_order);

GRANT SELECT ON public.photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are publicly readable"
ON public.photos FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert photos"
ON public.photos FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update photos"
ON public.photos FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete photos"
ON public.photos FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Storage policies for the private photos bucket (admin-only write/read; public serving goes through the app)
CREATE POLICY "Admins can upload photo files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update photo files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete photo files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read photo files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'photos' AND public.has_role(auth.uid(), 'admin'));

-- 4. Seed: existing site images
INSERT INTO public.photos (section, title, subtitle, price, status, image_url, sort_order) VALUES
  ('site:hero', 'Photo d''accueil', '', NULL, 'Disponible', '/photos/hero.jpg', 0),
  ('site:cover:nudite', 'Cover — Nudité', '', NULL, 'Disponible', '/photos/flash-nudite.jpg', 0),
  ('site:cover:botanique', 'Cover — Botanique', '', NULL, 'Disponible', '/photos/flash-botanique.jpg', 0),
  ('site:cover:corps', 'Cover — Corps', '', NULL, 'Disponible', '/photos/flash-corps.jpg', 0),
  ('site:cover:composition', 'Cover — Composition', '', NULL, 'Disponible', '/photos/flash-composition.jpg', 0),
  ('site:cover:animaux', 'Cover — Animaux', '', NULL, 'Disponible', '/photos/flash-animaux.jpg', 0),
  ('tattoos', 'Fougère', 'Avant-bras · 2024', NULL, 'Disponible', '/photos/tattoo-1.jpg', 0),
  ('tattoos', 'Figure', 'Cuisse · 2024', NULL, 'Disponible', '/photos/tattoo-2.jpg', 1),
  ('tattoos', 'Serpent', 'Clavicule · 2023', NULL, 'Disponible', '/photos/tattoo-3.jpg', 2),
  ('tattoos', 'Bouquet', 'Main · 2024', NULL, 'Disponible', '/photos/tattoo-4.jpg', 3),
  ('tattoos', 'Composition florale', 'Dos · 2023', NULL, 'Disponible', '/photos/tattoo-5.jpg', 4),
  ('tattoos', 'Cheval', 'Épaule · 2024', NULL, 'Disponible', '/photos/tattoo-6.jpg', 5),
  ('shop', 'Flash sheet — Botanique', 'Original encre / papier', '120 €', 'Disponible', '/photos/flash-botanique.jpg', 0),
  ('shop', 'Composition · figures', 'Original encre / papier', '240 €', 'Disponible', '/photos/flash-composition.jpg', 1),
  ('shop', 'Animaux — print A3', 'Édition de 25', '45 €', 'Disponible', '/photos/flash-animaux.jpg', 2),
  ('shop', 'Nudité — étude', 'Original', '180 €', 'Disponible', '/photos/flash-nudite.jpg', 3),
  ('shop', 'Corps — print A4', 'Édition ouverte', '30 €', 'Disponible', '/photos/flash-corps.jpg', 4),
  ('shop', 'Tirage photo — atelier', 'Édition de 10', '60 €', 'Disponible', '/photos/hero.jpg', 5);