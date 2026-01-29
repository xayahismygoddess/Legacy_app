import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true, assignedTo: { select: { id: true, username: true } } },
  });
  if (!task) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const body = (await req.json()) as {
    title?: string;
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

  const old = await prisma.task.findUnique({ where: { id } });
  if (!old) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  if (old.status !== (body.status ?? old.status)) {
    await prisma.history.create({
      data: {
        taskId: id,
        userId: session.userId,
        action: "STATUS_CHANGED",
        oldValue: old.status,
        newValue: body.status ?? "",
      },
    });
  }
  if (old.title !== (body.title ?? old.title)) {
    await prisma.history.create({
      data: {
        taskId: id,
        userId: session.userId,
        action: "TITLE_CHANGED",
        oldValue: old.title,
        newValue: body.title ?? "",
      },
    });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title: body.title!.trim(),
      description: body.description ?? old.description,
      status: body.status ?? old.status,
      priority: body.priority ?? old.priority,
      projectId: body.projectId ?? old.projectId,
      assignedToId: body.assignedTo ?? old.assignedToId,
      dueDate: body.dueDate ?? old.dueDate,
      estimatedHours: body.estimatedHours ?? old.estimatedHours,
    },
    include: { project: true, assignedTo: { select: { id: true, username: true } } },
  });

  if (task.assignedToId) {
    await prisma.notification.create({
      data: {
        userId: task.assignedToId,
        message: `Tarea actualizada: ${task.title}`,
        type: "task_updated",
      },
    });
  }

  return NextResponse.json(task);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });

  await prisma.history.create({
    data: {
      taskId: id,
      userId: session.userId,
      action: "DELETED",
      oldValue: task.title,
    },
  });
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
