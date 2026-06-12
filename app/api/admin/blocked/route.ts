import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const slots = await prisma.blockedSlot.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const { date, time } = await req.json();
  if (!date) return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
  const slot = await prisma.blockedSlot.create({ data: { date, time: time ?? null } });
  return NextResponse.json(slot, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.blockedSlot.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
