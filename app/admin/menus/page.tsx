import { prisma } from "@/lib/prisma";
import MenusClient from "./MenusClient";

export const revalidate = 30;

export default async function AdminMenusPage() {
  const [dishes, categories] = await Promise.all([
    prisma.dish.findMany({
      include: { category: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  let menuImage = "";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "daily_menu_image" } });
    menuImage = setting?.value ?? "";
  } catch { /* tabla no creada aún */ }

  const serializedDishes = dishes.map((d) => ({
    id: d.id, name: d.name, description: d.description, price: d.price,
    image: d.image, isActive: d.isActive, isDailyMenu: d.isDailyMenu,
    categoryId: d.categoryId, order: d.order,
    category: { id: d.category.id, name: d.category.name, slug: d.category.slug, order: d.category.order },
  }));

  const serializedCategories = categories.map((c) => ({
    id: c.id, name: c.name, slug: c.slug, order: c.order,
  }));

  return (
    <MenusClient
      initialDishes={serializedDishes}
      initialCategories={serializedCategories}
      initialMenuImage={menuImage}
    />
  );
}
