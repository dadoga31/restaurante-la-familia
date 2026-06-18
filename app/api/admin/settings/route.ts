import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const { key, value } = await req.json();
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath("/");
  return NextResponse.json(setting);
}
