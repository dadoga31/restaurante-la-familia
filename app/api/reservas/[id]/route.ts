import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const valid = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const reservation = await prisma.reservation.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
  return NextResponse.json(reservation);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.reservation.delete({ where: { id: parseInt(id) } });
  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true });
}
