import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [dishes, setting] = await Promise.all([
    prisma.dish.findMany({
      where: { isDailyMenu: true, isActive: true },
      include: { category: { select: { name: true, order: true } } },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.siteSetting.findUnique({ where: { key: "daily_menu_image" } }).catch(() => null),
  ]);

  const grouped = new Map<number, { name: string; dishes: { id: number; name: string; description: string | null; price: number }[] }>();
  for (const dish of dishes) {
    if (!grouped.has(dish.categoryId))
      grouped.set(dish.categoryId, { name: dish.category.name, dishes: [] });
    grouped.get(dish.categoryId)!.dishes.push({
      id: dish.id, name: dish.name, description: dish.description, price: dish.price,
    });
  }

  return NextResponse.json(
    { image: setting?.value || null, menu: Array.from(grouped.values()) },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
