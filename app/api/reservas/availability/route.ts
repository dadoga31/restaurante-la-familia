import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALL_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "20:00","20:30","21:00","21:30","22:00","22:30",
];

function isMonday(dateStr: string): boolean {
  return new Date(dateStr + "T12:00:00").getDay() === 1;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  if (isMonday(date)) {
    const slots: Record<string, { available: boolean; remaining: number }> = {};
    ALL_SLOTS.forEach((s) => { slots[s] = { available: false, remaining: 0 }; });
    return NextResponse.json({ date, slots, closed: true });
  }

  let maxGuests = 30;
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "max_guests_per_slot" } });
    if (setting?.value) maxGuests = parseInt(setting.value);
  } catch { /* SiteSetting table may not exist yet */ }

  const [reservations, blockedSlots] = await Promise.all([
    prisma.reservation.findMany({
      where: { date, status: { in: ["PENDING", "CONFIRMED"] } },
      select: { time: true, guests: true },
    }),
    prisma.blockedSlot.findMany({ where: { date } }),
  ]);

  const wholeDayBlocked = blockedSlots.some((b) => b.time === null);
  const blockedTimes = new Set(blockedSlots.filter((b) => b.time !== null).map((b) => b.time as string));

  const guestsBySlot: Record<string, number> = {};
  ALL_SLOTS.forEach((s) => { guestsBySlot[s] = 0; });
  reservations.forEach((r) => { guestsBySlot[r.time] = (guestsBySlot[r.time] ?? 0) + r.guests; });

  const slots: Record<string, { available: boolean; remaining: number }> = {};
  ALL_SLOTS.forEach((s) => {
    const blocked = wholeDayBlocked || blockedTimes.has(s);
    const remaining = blocked ? 0 : Math.max(0, maxGuests - guestsBySlot[s]);
    slots[s] = { available: !blocked && remaining > 0, remaining };
  });

  return NextResponse.json({ date, slots, maxGuests, closed: false });
}
