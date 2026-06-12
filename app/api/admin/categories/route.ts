import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  const { name, slug, order } = await req.json();
  if (!name || !slug) {
    return NextResponse.json({ error: "Nombre y slug requeridos" }, { status: 400 });
  }
  const cat = await prisma.category.create({ data: { name, slug, order: order ?? 0 } });
  return NextResponse.json(cat, { status: 201 });
}
