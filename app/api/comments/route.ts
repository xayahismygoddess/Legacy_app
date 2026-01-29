import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "taskId requerido" }, { status: 400 });
  }
  const tid = parseInt(taskId, 10);
  if (isNaN(tid)) return NextResponse.json({ error: "taskId inválido" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { taskId: tid },
    include: { user: { select: { id: true, username: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = (await req.json()) as { taskId: number; commentText: string };
  if (!body.taskId || !body.commentText?.trim()) {
    return NextResponse.json({ error: "taskId y comentario requeridos" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      taskId: body.taskId,
      userId: session.userId,
      commentText: body.commentText.trim(),
    },
    include: { user: { select: { id: true, username: true } } },
  });
  return NextResponse.json(comment);
}
