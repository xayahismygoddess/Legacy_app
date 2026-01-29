import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    include: {
      project: true,
      assignedTo: { select: { id: true, username: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await req.json()) as {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    projectId?: number;
    assignedTo?: number;
    dueDate?: string;
    estimatedHours?: number;
  };
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "El título es requerido" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: body.title.trim(),
      description: body.description ?? "",
      status: body.status ?? "Pendiente",
      priority: body.priority ?? "Media",
      projectId: body.projectId || null,
      assignedToId: body.assignedTo || null,
      dueDate: body.dueDate || null,
      estimatedHours: body.estimatedHours ?? 0,
      createdById: session.userId,
    },
    include: { project: true, assignedTo: { select: { id: true, username: true } } },
  });

  await prisma.history.create({
    data: {
      taskId: task.id,
      userId: session.userId,
      action: "CREATED",
      newValue: task.title,
    },
  });

  if (task.assignedToId) {
    await prisma.notification.create({
      data: {
        userId: task.assignedToId,
        message: `Nueva tarea asignada: ${task.title}`,
        type: "task_assigned",
      },
    });
  }

  return NextResponse.json(task);
}
