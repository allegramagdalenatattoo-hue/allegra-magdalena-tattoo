import { expect, test } from "bun:test";
import { photoFields } from "./admin-fields";
test("Flash has a category but no price or availability status", () => {
  expect(photoFields("flash:nudite")).toEqual({ price: false, status: false, description: false, link: false, category: true });
});
test("tattoos have a category without a price or status", () => {
  expect(photoFields("tattoos").category).toBe(true);
  expect(photoFields("tattoos").price).toBe(false);
  expect(photoFields("tattoos").status).toBe(false);
});
test("Shop supports description, euro price, link and status", () => {
  expect(photoFields("shop")).toEqual({ price: true, status: true, description: true, link: true, category: false });
});