import { prisma } from "@/lib/prisma";
import ConfigClient from "./ConfigClient";

export const revalidate = 30;

export default async function ConfiguracionPage() {
  const [blockedSlots, settings] = await Promise.all([
    prisma.blockedSlot.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] }),
    prisma.siteSetting.findMany().catch(() => []),
  ]);

  const maxGuests = settings.find((s) => s.key === "max_guests_per_slot")?.value ?? "30";

  return (
    <ConfigClient
      initialBlockedSlots={blockedSlots.map((s) => ({ id: s.id, date: s.date, time: s.time }))}
      initialMaxGuests={maxGuests}
    />
  );
}
