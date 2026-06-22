import { prisma } from "@/lib/prisma";
import ReservasClient from "./ReservasClient";

export const revalidate = 30;

export default async function AdminReservasPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ date: "desc" }, { time: "asc" }],
  });

  const serialized = reservations.map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    date: r.date, time: r.time, guests: r.guests,
    specialRequest: r.specialRequest, status: r.status, confirmCode: r.confirmCode,
  }));

  return <ReservasClient initialReservations={serialized} />;
}
