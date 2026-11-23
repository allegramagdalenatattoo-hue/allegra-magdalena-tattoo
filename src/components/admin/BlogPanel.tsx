import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Save, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { adminArticlesOptions } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RichTextEditor } from "./RichTextEditor";

type Article = Tables<"blog_articles">;

export function BlogPanel() {
  const { data: articles } = useSuspenseQuery(adminArticlesOptions());
  const client = useQueryClient();
  const [editing, setEditing] = useState<Article | "new" | null>(null);
  const remove = useMutation({
    mutationFn: async (article: Article) => {
      const { error } = await supabase.from("blog_articles").delete().eq("id", article.id);
      if (error) throw error;
      if (article.cover_path) await supabase.storage.from("photos").remove([article.cover_path]);
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ["admin-articles"] }); toast.success("Article supprimé"); },
    onError: (error) => toast.error(error.message),
  });
  return <section className="space-y-6">
    <div className="flex flex-wrap justify-between gap-4"><h2 className="font-display text-3xl uppercase">Articles / Blog</h2><Button onClick={() => setEditing("new")}><Plus /> Ajouter</Button></div>
    {articles.length === 0 && <p className="font-mono text-sm py-8 border-y-2 border-ink">Aucun article.</p>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{articles.map((article) => <article key={article.id} className="border-2 border-ink p-4 bg-paper space-y-4">
      <div className="flex justify-between font-mono text-xs"><span>{article.status === "draft" ? "Brouillon" : "Publié"}</span><time>{article.article_date}</time></div>
      <h3 className="font-display text-xl break-words">{article.title || "Sans titre"}</h3>
      <div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(article)}><Pencil /> Modifier</Button><Button variant="outline" size="icon" aria-label={`Supprimer ${article.title}`} disabled={remove.isPending} onClick={() => { if (window.confirm(`Supprimer « ${article.title} » ?`)) remove.mutate(article); }}><Trash2 /></Button></div>
    </article>)}</div>
    {editing && <ArticleEditor key={editing === "new" ? "new" : editing.id} article={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
  </section>;
}

function ArticleEditor({ article, onClose }: { article: Article | null; onClose: () => void }) {
  const client = useQueryClient();
  const [title, setTitle] = useState(article?.title ?? "");
  const [date, setDate] = useState(article?.article_date ?? new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [content, setContent] = useState<Json>(article?.content ?? { type: "doc", content: [{ type: "paragraph" }] });
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: async () => {
      let path = article?.cover_path ?? null;
      let uploaded: string | null = null;
      if (cover) {
        path = `blog/${crypto.randomUUID()}-${cover.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
        const { error } = await supabase.storage.from("photos").upload(path, cover);
        if (error) throw error;
        uploaded = path;
      }
      const row = { title: title.trim(), article_date: date, status, content, cover_path: path, updated_at: new Date().toISOString() };
      const { error } = article ? await supabase.from("blog_articles").update(row).eq("id", article.id) : await supabase.from("blog_articles").insert(row);
      if (error) { if (uploaded) await supabase.storage.from("photos").remove([uploaded]); throw error; }
      if (uploaded && article?.cover_path) await supabase.storage.from("photos").remove([article.cover_path]);
    },
    onSuccess: () => { client.invalidateQueries({ queryKey: ["admin-articles"] }); toast.success("Article enregistré"); onClose(); },
    onError: (error) => toast.error(error.message),
  });
  return <Dialog open onOpenChange={(open) => { if (!open && !save.isPending) onClose(); }}><DialogContent className="max-w-3xl max-h-[90dvh] overflow-y-auto bg-paper border-2 border-ink text-ink">
    <DialogHeader><DialogTitle>Article</DialogTitle><DialogDescription>{article ? "Modifier l’article" : "Nouvel article"}</DialogDescription></DialogHeader>
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}>
      <label className="block space-y-1 font-mono text-sm">Titre<Input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
      <div className="grid grid-cols-2 gap-3"><label className="font-mono text-sm">Date<Input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><label className="font-mono text-sm">Statut<select className="w-full h-9 border border-ink rounded-md bg-paper px-2" value={status} onChange={(event) => setStatus(event.target.value)}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label></div>
      <label className="flex items-center gap-2 font-mono text-sm"><ImagePlus /> Image de couverture<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) { setCover(file); const reader = new FileReader(); reader.onload = () => setPreview(String(reader.result)); reader.readAsDataURL(file); } }} className="min-w-0 w-full text-xs" /></label>
      {preview && <img src={preview} alt="Couverture" className="h-40 w-full object-contain" />}
      {!preview && article?.cover_path && <ExistingCover path={article.cover_path} />}
      <RichTextEditor content={article?.content ?? { type: "doc", content: [{ type: "paragraph" }] }} onChange={setContent} />
      <Button type="submit" disabled={!title.trim() || save.isPending}><Save /> {save.isPending ? "Enregistrement…" : "Enregistrer"}</Button>
    </form>
  </DialogContent></Dialog>;
}

function ExistingCover({ path }: { path: string }) {
  const { data } = useSuspenseQuery({ queryKey: ["article-cover", path], queryFn: async () => {
    const { data, error } = await supabase.storage.from("photos").createSignedUrl(path, 3600);
    if (error) throw error;
    return data.signedUrl;
  } });
  return <img src={data} alt="Couverture" className="h-40 w-full object-contain" />;
}