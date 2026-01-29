import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "tasks";

  if (type === "tasks") {
    const tasks = await prisma.task.findMany();
    const statusCount: Record<string, number> = {};
    tasks.forEach((t) => {
      const s = t.status || "Pendiente";
      statusCount[s] = (statusCount[s] ?? 0) + 1;
    });
    return NextResponse.json({ type: "tasks", data: statusCount });
  }

  if (type === "projects") {
    const projects = await prisma.project.findMany();
    const tasks = await prisma.task.findMany();
    const data = projects.map((p) => ({
      name: p.name,
      count: tasks.filter((t) => t.projectId === p.id).length,
    }));
    return NextResponse.json({ type: "projects", data });
  }

  if (type === "users") {
    const users = await prisma.user.findMany({ select: { id: true, username: true } });
    const tasks = await prisma.task.findMany();
    const data = users.map((u) => ({
      username: u.username,
      count: tasks.filter((t) => t.assignedToId === u.id).length,
    }));
    return NextResponse.json({ type: "users", data });
  }

  return NextResponse.json({ error: "Tipo de reporte inválido" }, { status: 400 });
}
