import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewerPhoto = { src: string; title: string };

export function PhotoViewer({ photos, children }: {
  photos: ViewerPhoto[];
  children: (open: (index: number) => void) => ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const photo = index === null ? undefined : photos[index];
  const move = (direction: number) => setIndex((current) =>
    current === null || !photos.length ? current : (current + direction + photos.length) % photos.length,
  );
  return (
    <>
      {children(setIndex)}
      <Dialog.Root open={Boolean(photo)} onOpenChange={(open) => { if (!open) setIndex(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-ink/95" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-3 z-[101] flex flex-col bg-ink text-paper outline-none md:inset-8"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                move(event.key === "ArrowRight" ? 1 : -1);
              }
            }}
          >
            <div className="flex min-h-14 items-center justify-between gap-4 pb-3">
              <Dialog.Title className="min-w-0 break-words font-mono text-sm uppercase">{photo?.title}</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Fermer" title="Fermer" className="shrink-0 border-2 border-paper text-paper"><X /></Button>
              </Dialog.Close>
            </div>
            <div className="relative min-h-0 flex-1"
              onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
              onTouchEnd={(event) => {
                const end = event.changedTouches[0]?.clientX;
                if (touchStart !== null && end !== undefined && Math.abs(end - touchStart) > 50) move(end < touchStart ? 1 : -1);
                setTouchStart(null);
              }}
            >
              {photo && <img src={photo.src} alt={photo.title} className="h-full w-full object-contain" />}
            </div>
            <div className="flex min-h-16 items-center justify-center gap-6 pt-3">
              <Button variant="ghost" size="icon" disabled={photos.length < 2} onClick={() => move(-1)} aria-label="Photo précédente" title="Photo précédente" className="border-2 border-paper text-paper"><ChevronLeft /></Button>
              <span className="font-mono text-xs tabular-nums">{index === null ? 0 : index + 1} / {photos.length}</span>
              <Button variant="ghost" size="icon" disabled={photos.length < 2} onClick={() => move(1)} aria-label="Photo suivante" title="Photo suivante" className="border-2 border-paper text-paper"><ChevronRight /></Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}