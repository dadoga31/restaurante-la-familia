import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const dishes = await prisma.dish.findMany({
    include: { category: true },
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(dishes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, image, isActive, isDailyMenu, categoryId, order, allergens } = body;

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "Nombre, precio y categoría son requeridos" }, { status: 400 });
  }

  const dish = await prisma.dish.create({
    data: {
      name,
      description: description ?? null,
      price: parseFloat(String(price).replace(",", ".")),
      image: image || null,
      isActive: isActive ?? true,
      isDailyMenu: isDailyMenu ?? false,
      categoryId: parseInt(categoryId),
      order: parseInt(String(order ?? 0)),
      allergens: Array.isArray(allergens) ? allergens : [],
    },
    include: { category: true },
  });

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menus");
  revalidatePath("/admin");
  return NextResponse.json(dish, { status: 201 });
}
