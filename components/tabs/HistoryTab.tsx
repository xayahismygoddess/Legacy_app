"use client";

import { useState } from "react";

type HistoryEntry = {
  id: number;
  taskId: number;
  userId: number;
  action: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  user: { id: number; username: string };
};

export default function HistoryTab() {
  const [taskId, setTaskId] = useState("");
  const [output, setOutput] = useState("");

  const loadForTask = async () => {
    const tid = parseInt(taskId, 10);
    if (!tid) {
      setOutput("Ingresa un ID de tarea.");
      return;
    }
    try {
      const r = await fetch(`/api/history?taskId=${tid}`);
      const d = await r.json();
      if (!r.ok) {
        setOutput(d.error ?? "Error");
        return;
      }
      const arr = Array.isArray(d) ? d : [];
      const lines = [`=== HISTORIAL TAREA #${tid} ===`, ""];
      if (!arr.length) lines.push("No hay historial");
      else {
        arr.forEach((h: HistoryEntry) => {
          lines.push(`${h.timestamp} - ${h.action}`);
          lines.push(`  Usuario: ${h.user?.username ?? "Desconocido"}`);
          lines.push(`  Antes: ${h.oldValue || "(vacío)"}`);
          lines.push(`  Después: ${h.newValue || "(vacío)"}`);
          lines.push("---");
        });
      }
      setOutput(lines.join("\n"));
    } catch {
      setOutput("Error de conexión");
    }
  };

  const loadAll = async () => {
    try {
      const r = await fetch("/api/history?all=true");
      const d = await r.json();
      if (!r.ok) {
        setOutput(d.error ?? "Error");
        return;
      }
      const arr = Array.isArray(d) ? d : [];
      const lines = ["=== HISTORIAL COMPLETO ===", ""];
      if (!arr.length) lines.push("No hay historial");
      else {
        [...arr].reverse().slice(0, 100).forEach((h: HistoryEntry) => {
          lines.push(`Tarea #${h.taskId} - ${h.action} - ${h.timestamp}`);
          lines.push(`  Usuario: ${h.user?.username ?? "Desconocido"}`);
          lines.push(`  Antes: ${h.oldValue || "(vacío)"}`);
          lines.push(`  Después: ${h.newValue || "(vacío)"}`);
          lines.push("---");
        });
      }
      setOutput(lines.join("\n"));
    } catch {
      setOutput("Error de conexión");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Historial de Cambios
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-white mb-1">ID Tarea</label>
            <input
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-32 liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button type="button" onClick={loadForTask} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
            Cargar Historial
          </button>
          <button type="button" onClick={loadAll} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Cargar Todo el Historial
          </button>
        </div>
      </section>

      <section>
        <textarea
          readOnly
          value={output}
          rows={14}
          className="w-full liminal-input rounded-xl px-3 py-3 text-sm bg-white/50 resize-none font-mono"
        />
      </section>
    </div>
  );
}
