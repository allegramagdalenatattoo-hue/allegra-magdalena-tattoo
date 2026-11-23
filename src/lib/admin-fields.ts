export function photoFields(section: string) {
  return {
    price: section === "shop",
    status: section === "shop",
    description: section === "shop",
    link: section === "shop",
    category: section === "tattoos" || section.startsWith("flash:"),
  };
}