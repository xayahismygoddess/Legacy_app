"use client";

import { useState } from "react";

type Comment = {
  id: number;
  taskId: number;
  userId: number;
  commentText: string;
  createdAt: string;
  user: { id: number; username: string };
};

export default function CommentsTab() {
  const [taskId, setTaskId] = useState("");
  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [output, setOutput] = useState("");

  const loadComments = async () => {
    const tid = parseInt(taskId, 10);
    if (!tid) {
      setOutput("Ingresa un ID de tarea.");
      return;
    }
    try {
      const r = await fetch(`/api/comments?taskId=${tid}`);
      const d = await r.json();
      if (!r.ok) {
        setOutput(d.error ?? "Error");
        return;
      }
      const arr = Array.isArray(d) ? d : [];
      setComments(arr);
      const lines = [`=== COMENTARIOS TAREA #${tid} ===`, ""];
      if (!arr.length) lines.push("No hay comentarios");
      else {
        arr.forEach((c: Comment) => {
          lines.push(`[${c.createdAt}] ${c.user?.username ?? "Usuario"}: ${c.commentText}`);
          lines.push("---");
        });
      }
      setOutput(lines.join("\n"));
    } catch {
      setOutput("Error de conexión");
    }
  };

  const addComment = async () => {
    const tid = parseInt(taskId, 10);
    if (!tid) {
      alert("ID de tarea requerido");
      return;
    }
    if (!text.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }
    const r = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: tid, commentText: text.trim() }),
    });
    if (!r.ok) {
      const d = await r.json();
      alert(d.error ?? "Error");
      return;
    }
    setText("");
    loadComments();
    alert("Comentario agregado");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Comentarios de Tareas
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white mb-1">ID Tarea</label>
            <input
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-white mb-1">Comentario</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" onClick={addComment} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
            Agregar Comentario
          </button>
          <button type="button" onClick={loadComments} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Cargar Comentarios
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-white mb-2">Comentarios</h3>
        <textarea
          readOnly
          value={output}
          rows={12}
          className="w-full liminal-input rounded-xl px-3 py-3 text-sm bg-white/50 resize-none font-mono"
        />
      </section>
    </div>
  );
}
