import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, slug, order } = await req.json();
  const cat = await prisma.category.update({
    where: { id: parseInt(id) },
    data: { name, slug, order },
  });
  return NextResponse.json(cat);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.category.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
