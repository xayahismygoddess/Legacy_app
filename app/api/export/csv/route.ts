import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    include: { project: true },
    orderBy: { id: "asc" },
  });

  const headers = "ID,Título,Estado,Prioridad,Proyecto\n";
  const rows = tasks
    .map((t) => {
      const title = (t.title ?? "").replace(/"/g, '""');
      const status = t.status ?? "Pendiente";
      const priority = t.priority ?? "Media";
      const project = (t.project?.name ?? "Sin proyecto").replace(/"/g, '""');
      return `${t.id},"${title}","${status}","${priority}","${project}"`;
    })
    .join("\n");
  const csv = headers + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="export_tasks.csv"',
    },
  });
}
