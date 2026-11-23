CREATE TABLE public.gallery_categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind text NOT NULL CHECK (kind IN ('flash','tattoos')),
 slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text NOT NULL CHECK (length(trim(title)) > 0),
 description text NOT NULL DEFAULT '',
 sort_order integer NOT NULL DEFAULT 0,
 UNIQUE (kind, slug)
);
GRANT SELECT ON public.gallery_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_categories TO authenticated;
GRANT ALL ON public.gallery_categories TO service_role;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.gallery_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
ALTER TABLE public.photos ADD COLUMN category_id uuid REFERENCES public.gallery_categories(id) ON DELETE RESTRICT, ADD COLUMN description text NOT NULL DEFAULT '', ADD COLUMN external_url text NOT NULL DEFAULT '';
CREATE TABLE public.blog_articles (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL DEFAULT '',
 cover_path text,
 article_date date NOT NULL DEFAULT CURRENT_DATE,
 content jsonb NOT NULL DEFAULT '{"type":"doc","content":[{"type":"paragraph"}]}'::jsonb,
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_articles TO authenticated;
GRANT ALL ON public.blog_articles TO service_role;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles public read" ON public.blog_articles FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins manage and read drafts" ON public.blog_articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE FUNCTION public.validate_gallery_category() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF TG_OP = 'UPDATE' AND (NEW.slug <> OLD.slug OR NEW.kind <> OLD.kind) THEN RAISE EXCEPTION 'Le nom peut changer, mais pas son adresse ni sa rubrique.'; END IF;
 IF TG_OP = 'DELETE' AND EXISTS (SELECT 1 FROM public.photos WHERE section IN ('flash:' || OLD.slug, 'site:cover:' || OLD.slug)) AND OLD.kind = 'flash' THEN RAISE EXCEPTION 'Déplacez ou supprimez les photos de cette catégorie avant de la supprimer.'; END IF;
 IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_gallery_category BEFORE UPDATE OR DELETE ON public.gallery_categories FOR EACH ROW EXECUTE FUNCTION public.validate_gallery_category();
CREATE FUNCTION public.validate_photo_category() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.category_id IS NOT NULL AND (NEW.section <> 'tattoos' OR NOT EXISTS (SELECT 1 FROM public.gallery_categories WHERE id = NEW.category_id AND kind = 'tattoos')) THEN RAISE EXCEPTION 'Choisissez une catégorie de tatouages.'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_photo_category BEFORE INSERT OR UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION public.validate_photo_category();
CREATE POLICY "Public gallery files can be signed" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'photos' AND EXISTS (SELECT 1 FROM public.photos WHERE storage_path = name));
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'photos') THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.photos; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'gallery_categories') THEN ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_categories; END IF;
END $$;