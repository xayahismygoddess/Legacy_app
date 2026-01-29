import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: session.userId },
    data: { read: true },
  });
  return NextResponse.json({ ok: true });
}
