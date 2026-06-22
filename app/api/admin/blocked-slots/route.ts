import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const slots = await prisma.blockedSlot.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] });
  return NextResponse.json(slots);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { date, time } = await req.json();
  if (!date) return NextResponse.json({ error: "date requerido" }, { status: 400 });

  const slot = await prisma.blockedSlot.create({
    data: { date, time: time || null },
  });
  return NextResponse.json(slot, { status: 201 });
}
