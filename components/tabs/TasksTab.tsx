"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
  estimatedHours: number;
  projectId: number | null;
  project: { id: number; name: string } | null;
  assignedToId: number | null;
  assignedTo: { id: number; username: string } | null;
};

type Project = { id: number; name: string; description: string };
type User = { id: number; username: string };

export default function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pendiente",
    priority: "Media",
    projectId: 0,
    assignedTo: 0,
    dueDate: "",
    estimatedHours: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    high: 0,
    overdue: 0,
  });

  /* ---------------- LOAD DATA ---------------- */
  const load = useCallback(async () => {
    try {
      const [t, p, u] = await Promise.all([
        fetch("/api/tasks").then((r) => r.json()),
        fetch("/api/projects").then((r) => r.json()),
        fetch("/api/users").then((r) => r.json()),
      ]);
      if (Array.isArray(t)) setTasks(t);
      if (Array.isArray(p)) setProjects(p);
      if (Array.isArray(u)) setUsers(u);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------- STATS ---------------- */
  useEffect(() => {
    const now = new Date();
    let completed = 0,
      pending = 0,
      high = 0,
      overdue = 0;

    tasks.forEach((t) => {
      t.status === "Completada" ? completed++ : pending++;
      if (t.priority === "Alta" || t.priority === "Crítica") high++;
      if (t.dueDate && t.status !== "Completada" && new Date(t.dueDate) < now)
        overdue++;
    });

    setStats({
      total: tasks.length,
      completed,
      pending,
      high,
      overdue,
    });
  }, [tasks]);

  /* ---------------- SELECT TASK ---------------- */
  const selectTask = (t: Task) => {
    setSelectedId(t.id);
    setForm({
      title: t.title,
      description: t.description ?? "",
      status: t.status,
      priority: t.priority,
      projectId: t.projectId ?? 0,
      assignedTo: t.assignedToId ?? 0,
      dueDate: t.dueDate ?? "",
      estimatedHours: t.estimatedHours
        ? String(t.estimatedHours)
        : "",
    });
  };

  if (loading) {
    return (
      <div className="text-white/60 tracking-widest animate-pulse">
        CARGANDO TAREAS…
      </div>
    );
  }

  return (
    <>
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/40 via-black to-cyan-900/40" />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="space-y-10"
      >
        {/* HEADER */}
        <motion.h2
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="text-xl font-bold text-white tracking-[0.25em]"
        >
          GESTIÓN DE TAREAS
        </motion.h2>

        {/* FORM */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-3xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 space-y-5"
        >
          <h3 className="text-xs text-white/60 uppercase tracking-[0.3em]">
            CREAR / EDITAR
          </h3>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Título"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="md:col-span-2 vapor-input"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
              className="vapor-input"
            >
              {["Pendiente", "En Progreso", "Completada"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>

            <textarea
              rows={2}
              placeholder="Descripción"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="md:col-span-2 vapor-input resize-none"
            />

            <select
              value={form.priority}
              onChange={(e) =>
                setForm((f) => ({ ...f, priority: e.target.value }))
              }
              className="vapor-input"
            >
              {["Baja", "Media", "Alta", "Crítica"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>

            <select
              value={form.projectId}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  projectId: Number(e.target.value),
                }))
              }
              className="vapor-input"
            >
              <option value={0}>— Proyecto —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={form.assignedTo}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  assignedTo: Number(e.target.value),
                }))
              }
              className="vapor-input"
            >
              <option value={0}>Sin asignar</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, dueDate: e.target.value }))
              }
              className="vapor-input"
            />

            <input
              type="number"
              placeholder="Horas estimadas"
              value={form.estimatedHours}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  estimatedHours: e.target.value,
                }))
              }
              className="vapor-input"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[
              { label: "Agregar", color: "from-cyan-400 to-purple-500" },
              { label: "Actualizar", color: "from-purple-500 to-pink-500" },
              { label: "Eliminar", color: "from-red-500 to-pink-600" },
              { label: "Limpiar", color: "from-white/40 to-white/10" },
            ].map((b) => (
              <motion.button
                key={b.label}
                whileHover={{
                  y: -2,
                  boxShadow: "0 0 25px rgba(236,72,153,0.6)",
                }}
                whileTap={{ scale: 0.94 }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${b.color}`}
              >
                {b.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* TABLE */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl"
        >
          <table className="w-full text-sm text-white/90">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left hidden sm:table-cell">
                  Estado
                </th>
                <th className="p-3 text-left hidden md:table-cell">
                  Prioridad
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => selectTask(t)}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedId === t.id
                      ? "bg-pink-500/20 shadow-[inset_0_0_0_1px_rgba(236,72,153,0.8)]"
                      : "hover:bg-white/5 hover:backdrop-blur-md"
                  }`}
                >
                  <td className="p-3">{t.id}</td>
                  <td className="p-3 font-medium">{t.title}</td>
                  <td className="p-3 hidden sm:table-cell">
                    {t.status}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {t.priority}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* STATS */}
        <div className="text-xs text-white/60 tracking-[0.25em] font-mono">
          TOTAL {stats.total} · OK {stats.completed} · PEND{" "}
          {stats.pending} · HIGH {stats.high} · LATE{" "}
          {stats.overdue}
        </div>
      </motion.div>
    </>
  );
}
