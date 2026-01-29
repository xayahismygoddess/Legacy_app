import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const status = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const projectId = parseInt(searchParams.get("projectId") ?? "0", 10);

  const tasks = await prisma.task.findMany({
    include: { project: true, assignedTo: { select: { id: true, username: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const filtered = tasks.filter((t) => {
    if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q))
      return false;
    if (status && t.status !== status) return false;
    if (priority && t.priority !== priority) return false;
    if (projectId > 0 && (t.projectId ?? 0) !== projectId) return false;
    return true;
  });

  return NextResponse.json(filtered);
}
