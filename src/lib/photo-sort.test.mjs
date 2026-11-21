import { describe, expect, test } from "bun:test";
import { sortPhotosByNameDescending } from "./photo-sort";

describe("public photo name ordering", () => {
  test("sorts gallery photos by name from Z to A without changing the source", () => {
    const photos = [
      { id: "a", title: "Aster" },
      { id: "z", title: "Zinnia" },
      { id: "m", title: "Magnolia" },
    ];

    expect(sortPhotosByNameDescending(photos).map((photo) => photo.title)).toEqual([
      "Zinnia",
      "Magnolia",
      "Aster",
    ]);
    expect(photos.map((photo) => photo.title)).toEqual(["Aster", "Zinnia", "Magnolia"]);
  });

  test("orders numbered names in descending numeric order", () => {
    const photos = [{ title: "Flash 2" }, { title: "Flash 10" }, { title: "Flash 1" }];

    expect(sortPhotosByNameDescending(photos).map((photo) => photo.title)).toEqual([
      "Flash 10",
      "Flash 2",
      "Flash 1",
    ]);
  });
});
