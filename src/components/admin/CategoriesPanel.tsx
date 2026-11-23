import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQueryOptions, type GalleryCategory } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoriesPanel() {
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const client = useQueryClient();
  const [kind, setKind] = useState("flash");
  const [title, setTitle] = useState("");
  const add = useMutation({
    mutationFn: async () => {
      const stem = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "categorie";
      const slug = categories.some((c) => c.kind === kind && c.slug === stem) ? `${stem}-${crypto.randomUUID().slice(0, 8)}` : stem;
      const { error } = await supabase.from("gallery_categories").insert({ kind, title: title.trim(), slug, sort_order: categories.length });
      if (error) throw error;
    },
    onSuccess: () => { setTitle(""); client.invalidateQueries({ queryKey: ["categories"] }); toast.success("Catégorie ajoutée"); },
    onError: (error) => toast.error(error.message),
  });
  return <section className="max-w-3xl space-y-6">
    <h2 className="font-display text-3xl uppercase">Menus & catégories</h2>
    <div className="flex gap-2">{[{ value: "flash", label: "Flashs" }, { value: "tattoos", label: "Tatouages" }].map((item) => <Button key={item.value} variant={kind === item.value ? "default" : "outline"} onClick={() => setKind(item.value)}>{item.label}</Button>)}</div>
    <form className="flex flex-wrap gap-2" onSubmit={(event) => { event.preventDefault(); add.mutate(); }}>
      <Input aria-label="Nom de la nouvelle catégorie" placeholder="Nom de la catégorie" value={title} onChange={(event) => setTitle(event.target.value)} className="min-w-0 flex-1 bg-paper border-ink" required />
      <Button type="submit" disabled={!title.trim() || add.isPending}><Plus /> Ajouter</Button>
    </form>
    <div className="divide-y-2 divide-ink border-y-2 border-ink">
      {categories.filter((c) => c.kind === kind).map((category) => <CategoryRow key={category.id} category={category} />)}
      {!categories.some((c) => c.kind === kind) && <p className="py-6 font-mono text-sm">Aucune catégorie.</p>}
    </div>
  </section>;
}

function CategoryRow({ category }: { category: GalleryCategory }) {
  const [title, setTitle] = useState(category.title);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (remove: boolean) => {
      const result = remove ? await supabase.from("gallery_categories").delete().eq("id", category.id) : await supabase.from("gallery_categories").update({ title: title.trim() }).eq("id", category.id);
      if (result.error) throw result.error;
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ["categories"] }); toast.success("Catégories enregistrées"); },
    onError: (error) => toast.error(error.message.includes("foreign key") ? "Cette catégorie contient encore des tatouages." : error.message),
  });
  return <div className="flex gap-2 items-center py-3">
    <Input aria-label={`Nom de ${category.title}`} value={title} onChange={(event) => setTitle(event.target.value)} className="flex-1 min-w-0 bg-paper border-ink" />
    <Button variant="outline" size="icon" title="Enregistrer" aria-label={`Enregistrer ${category.title}`} disabled={!title.trim() || title === category.title || mutation.isPending} onClick={() => mutation.mutate(false)}><Save /></Button>
    <Button variant="outline" size="icon" title="Supprimer" aria-label={`Supprimer ${category.title}`} disabled={mutation.isPending} onClick={() => { if (window.confirm(`Supprimer la catégorie « ${category.title} » ?`)) mutation.mutate(true); }}><Trash2 /></Button>
  </div>;
}