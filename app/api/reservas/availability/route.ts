import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALL_SLOTS = [
  "13:00","13:30","14:00","14:30","15:00","15:30",
  "20:00","20:30","21:00","21:30","22:00","22:30",
];

function parseWeekdays(val: string): number[] {
  return val.split(",").map((n) => parseInt(n.trim())).filter((n) => !isNaN(n) && n >= 0 && n <= 6);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  // Fetch all settings + reservations + blocked slots in parallel
  const [settingsArr, reservations, blockedSlots] = await Promise.all([
    prisma.siteSetting.findMany({
      where: { key: { in: ["closed_weekdays", "max_guests_per_slot"] } },
    }).catch(() => []),
    prisma.reservation.findMany({
      where: { date, status: { in: ["PENDING", "CONFIRMED"] } },
      select: { time: true, guests: true },
    }),
    prisma.blockedSlot.findMany({ where: { date } }),
  ]);

  const getVal = (key: string) => settingsArr.find((s) => s.key === key)?.value;
  const closedWeekdays = parseWeekdays(getVal("closed_weekdays") ?? "1");
  const maxGuests = parseInt(getVal("max_guests_per_slot") ?? "30");

  const emptySlots = Object.fromEntries(ALL_SLOTS.map((s) => [s, { available: false, remaining: 0 }]));

  // Check configured closed weekdays
  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  if (closedWeekdays.includes(dayOfWeek)) {
    return NextResponse.json({ date, slots: emptySlots, closed: true });
  }

  const wholeDayBlocked = blockedSlots.some((b) => b.time === null);
  if (wholeDayBlocked) {
    return NextResponse.json({ date, slots: emptySlots, closed: true });
  }

  const blockedTimes = new Set(blockedSlots.filter((b) => b.time !== null).map((b) => b.time as string));

  const guestsBySlot: Record<string, number> = {};
  ALL_SLOTS.forEach((s) => { guestsBySlot[s] = 0; });
  reservations.forEach((r) => { guestsBySlot[r.time] = (guestsBySlot[r.time] ?? 0) + r.guests; });

  const slots: Record<string, { available: boolean; remaining: number }> = {};
  ALL_SLOTS.forEach((s) => {
    const blocked = blockedTimes.has(s);
    const remaining = blocked ? 0 : Math.max(0, maxGuests - guestsBySlot[s]);
    slots[s] = { available: !blocked && remaining > 0, remaining };
  });

  return NextResponse.json({ date, slots, maxGuests, closed: false });
}
