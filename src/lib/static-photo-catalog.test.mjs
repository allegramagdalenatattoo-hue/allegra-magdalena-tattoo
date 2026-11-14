import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { staticPhotosFor, localPhotoUrl } from "./static-photo-catalog";
import catalog from "./static-photos.json";

describe("autonomous photo catalog", () => {
  test("every exported photo resolves to an existing static file", () => {
    expect(catalog.length).toBe(770);
    for (const photo of catalog) {
      expect(photo.image_url.startsWith("/photos/")).toBe(true);
      expect(existsSync(`public${photo.image_url}`)).toBe(true);
      expect(localPhotoUrl({ id: photo.id, image_url: "unavailable" })).toBe(photo.image_url);
    }
  });

  test("section selection preserves the 99 current tattoo photos and excludes other sections", () => {
    const tattoos = staticPhotosFor(["tattoos"]);
    expect(tattoos.length).toBe(99);
    expect(tattoos.every((photo) => photo.section === "tattoos")).toBe(true);
    expect(staticPhotosFor(["unknown"])).toEqual([]);
  });
});