const nameCollator = new Intl.Collator("fr", {
  numeric: true,
  sensitivity: "base",
});

export function sortPhotosByNameDescending<T extends { title: string }>(photos: readonly T[]): T[] {
  return [...photos].sort((a, b) => nameCollator.compare(b.title, a.title));
}
