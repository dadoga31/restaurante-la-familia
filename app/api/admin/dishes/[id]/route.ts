import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, price, image, isActive, isDailyMenu, categoryId, order, allergens } = body;

  const dish = await prisma.dish.update({
    where: { id: parseInt(id) },
    data: {
      name,
      description: description ?? null,
      price: parseFloat(String(price).replace(",", ".")),
      image: image || null,
      isActive: Boolean(isActive),
      isDailyMenu: Boolean(isDailyMenu),
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
  return NextResponse.json(dish);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.dish.delete({ where: { id: parseInt(id) } });
  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin/menus");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
