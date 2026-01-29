import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  const all = searchParams.get("all") === "true";

  if (all) {
    const history = await prisma.history.findMany({
      include: { user: { select: { id: true, username: true } } },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    return NextResponse.json(history);
  }

  if (!taskId) return NextResponse.json({ error: "taskId requerido" }, { status: 400 });
  const tid = parseInt(taskId, 10);
  if (isNaN(tid)) return NextResponse.json({ error: "taskId inválido" }, { status: 400 });

  const history = await prisma.history.findMany({
    where: { taskId: tid },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { timestamp: "asc" },
  });
  return NextResponse.json(history);
}
