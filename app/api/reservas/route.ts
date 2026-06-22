import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { randomBytes } from "crypto";

function generateCode(): string {
  return randomBytes(3).toString("hex").toUpperCase();
}

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (date) where.date = date;
  if (status) where.status = status;

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return NextResponse.json(reservations);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, date, time, guests, specialRequest } = body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  // Fetch settings + blocked slot in parallel
  const [settings, blocked] = await Promise.all([
    prisma.siteSetting.findMany({
      where: { key: { in: ["closed_weekdays", "max_guests_per_slot"] } },
    }).catch(() => []),
    prisma.blockedSlot.findFirst({ where: { date, OR: [{ time: null }, { time }] } }),
  ]);

  const closedVal = settings.find((s) => s.key === "closed_weekdays")?.value;
  const closedWeekdays = closedVal
    ? closedVal.split(",").map((n) => parseInt(n.trim())).filter((n) => !isNaN(n) && n >= 0 && n <= 6)
    : [1]; // default: Monday
  const maxVal = settings.find((s) => s.key === "max_guests_per_slot")?.value;
  const maxGuests = maxVal ? parseInt(maxVal) : 30;

  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  if (closedWeekdays.includes(dayOfWeek)) {
    return NextResponse.json({ error: "El restaurante no abre ese día" }, { status: 400 });
  }

  if (blocked) {
    return NextResponse.json({ error: "Este horario no está disponible" }, { status: 409 });
  }

  const bookedGuests = await prisma.reservation.aggregate({
    where: { date, time, status: { in: ["PENDING", "CONFIRMED"] } },
    _sum: { guests: true },
  });
  const totalBooked = (bookedGuests._sum.guests ?? 0) + guests;
  if (totalBooked > maxGuests) {
    return NextResponse.json(
      { error: `No hay plaza para ${guests} personas en este horario. Llama al 626 261 689 para consultar disponibilidad.` },
      { status: 409 }
    );
  }

  let confirmCode = generateCode();
  let tries = 0;
  while (await prisma.reservation.findUnique({ where: { confirmCode } })) {
    confirmCode = generateCode();
    if (++tries > 10) throw new Error("No se pudo generar código único");
  }

  const reservation = await prisma.reservation.create({
    data: { name, email, phone, date, time, guests, specialRequest, confirmCode, status: "PENDING" },
  });

  revalidatePath("/admin/reservas");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true, confirmCode: reservation.confirmCode }, { status: 201 });
}
