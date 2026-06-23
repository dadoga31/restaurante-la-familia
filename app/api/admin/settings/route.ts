import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    revalidatePath("/", "page");
    revalidatePath("/menu", "page");
    return NextResponse.json(setting);
  } catch {
    return NextResponse.json({ error: "Tabla no creada aún — ejecuta el SQL en Supabase" }, { status: 503 });
  }
}
