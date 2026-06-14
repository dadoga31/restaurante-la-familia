import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      dishes: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
    },
  });
  return NextResponse.json(categories);
}
