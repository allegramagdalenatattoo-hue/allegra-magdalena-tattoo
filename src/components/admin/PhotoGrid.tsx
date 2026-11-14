import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Photo } from "@/lib/photos";
import { localPhotoUrl } from "@/lib/static-photo-catalog";

const STATUSES = ["Disponible", "Réservé", "Vendu"];

type Props = {
  section: string;
  showPrice?: boolean;
  showSubtitle?: boolean;
  hint?: string;
};

export function PhotoGrid({ section, showPrice = false, showSubtitle = true, hint }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["admin-photos", section];
  const { data, isPending } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("photos")
        .select("*")
        .eq("section", section)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return rows;
    },
  });

  const [items, setItems] = useState<Photo[]>([]);
  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["photos"] });
  }

  async function persistOrder(next: Photo[]) {
    setItems(next);
    const results = await Promise.all(
      next.map((p, i) => supabase.from("photos").update({ sort_order: i }).eq("id", p.id)),
    );
    if (results.some((r) => r.error)) {
      toast.error("Erreur pendant l'enregistrement de l'ordre");
    }
    invalidate();
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    persistOrder(arrayMove(items, oldIdx, newIdx));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    let orderMax = items.reduce((m, p) => Math.max(m, p.sort_order), -1);
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${section.replace(/[^a-zA-Z0-9]/g, "_")}/${crypto.randomUUID()}-${safe}`;
      const { error: upErr } = await supabase.storage
        .from("photos")
        .upload(path, file, { contentType: file.type || "image/jpeg" });
      if (upErr) {
        toast.error(`Upload échoué : ${upErr.message}`);
        continue;
      }
      orderMax += 1;
      const { error: insErr } = await supabase.from("photos").insert({
        section,
        title: file.name.replace(/\.[^.]+$/, ""),
        image_url: `/api/public/photos/${path}`,
        storage_path: path,
        sort_order: orderMax,
      });
      if (insErr) toast.error(`Erreur : ${insErr.message}`);
    }
    setUploading(false);
    toast.success("Photo(s) ajoutée(s) ✱");
    invalidate();
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onDelete(p: Photo) {
    if (!window.confirm(`Supprimer « ${p.title || "cette photo"} » ?`)) return;
    const { error } = await supabase.from("photos").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (p.storage_path) {
      await supabase.storage.from("photos").remove([p.storage_path]);
    }
    toast.success("Photo supprimée");
    invalidate();
  }

  return (
    <div>
      {hint && <p className="font-mono text-xs uppercase opacity-80 mb-4 max-w-2xl">{hint}</p>}

      <div className="mb-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 border-2 border-ink bg-ink text-paper px-5 py-3 font-mono uppercase hover:bg-accent hover:border-accent disabled:opacity-50 brutal-shadow-lime"
        >
          <Plus className="w-4 h-4" /> {uploading ? "Envoi en cours…" : "Ajouter des photos"}
        </button>
      </div>

      {isPending ? (
        <p className="font-mono uppercase text-sm animate-blink">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="brutal-border p-8 text-center font-mono uppercase text-sm opacity-80">
          Aucune photo ici — ajoute la première !
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((p) => (
                <SortableCard
                  key={p.id}
                  photo={p}
                  showPrice={showPrice}
                  showSubtitle={showSubtitle}
                  onDelete={() => onDelete(p)}
                  onSaved={invalidate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableCard({
  photo,
  showPrice,
  showSubtitle,
  onDelete,
  onSaved,
}: {
  photo: Photo;
  showPrice: boolean;
  showSubtitle: boolean;
  onDelete: () => void;
  onSaved: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });
  const [title, setTitle] = useState(photo.title);
  const [subtitle, setSubtitle] = useState(photo.subtitle);
  const [price, setPrice] = useState(photo.price ?? "");
  const [status, setStatus] = useState(photo.status);
  const [saving, setSaving] = useState(false);

  const dirty =
    title !== photo.title ||
    subtitle !== photo.subtitle ||
    price !== (photo.price ?? "") ||
    status !== photo.status;

  async function onSave() {
    setSaving(true);
    const { error } = await supabase
      .from("photos")
      .update({ title, subtitle, price: price || null, status })
      .eq("id", photo.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Enregistré ✱");
    onSaved();
  }

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`brutal-border bg-paper ${isDragging ? "opacity-60 rotate-2 z-30 relative" : ""}`}
    >
      <div className="relative aspect-[4/3] border-b-2 border-ink overflow-hidden bg-ink/5">
        <img src={localPhotoUrl(photo)} alt={photo.title} className="w-full h-full object-cover" loading="lazy" />
        <button
          {...attributes}
          {...listeners}
          aria-label="Déplacer"
          className="absolute top-2 left-2 bg-paper border-2 border-ink p-1.5 cursor-grab active:cursor-grabbing hover:bg-[var(--accent-2)] touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        {status !== "Disponible" && (
          <span className="absolute top-2 right-2 bg-accent text-paper font-mono text-[10px] uppercase px-2 py-1 rotate-3">
            {status}
          </span>
        )}
      </div>

      <div className="p-3 space-y-2 font-mono text-sm">
        <label className="block">
          <span className="text-[10px] uppercase opacity-70">Titre</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-0.5 w-full border-2 border-ink bg-paper px-2 py-1 text-sm outline-none focus:bg-[var(--accent-2)]"
          />
        </label>
        {showSubtitle && (
          <label className="block">
            <span className="text-[10px] uppercase opacity-70">Sous-titre</span>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-0.5 w-full border-2 border-ink bg-paper px-2 py-1 text-sm outline-none focus:bg-[var(--accent-2)]"
            />
          </label>
        )}
        <div className="flex gap-2">
          {showPrice && (
            <label className="block flex-1">
              <span className="text-[10px] uppercase opacity-70">Prix</span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="120 €"
                className="mt-0.5 w-full border-2 border-ink bg-paper px-2 py-1 text-sm outline-none focus:bg-[var(--accent-2)]"
              />
            </label>
          )}
          <label className="block flex-1">
            <span className="text-[10px] uppercase opacity-70">Statut</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-0.5 w-full border-2 border-ink bg-paper px-2 py-1.5 text-sm outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onSave}
            disabled={!dirty || saving}
            className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-ink bg-ink text-paper px-3 py-2 text-xs uppercase hover:bg-accent hover:border-accent disabled:opacity-40"
          >
            <Save className="w-3 h-3" /> {saving ? "…" : "Enregistrer"}
          </button>
          <button
            onClick={onDelete}
            aria-label="Supprimer"
            className="border-2 border-ink px-3 py-2 hover:bg-accent hover:text-paper hover:border-accent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
