import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, description, price, image, isActive, isDailyMenu, categoryId, order } = body;

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
    },
    include: { category: true },
  });

  return NextResponse.json(dish);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.dish.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
