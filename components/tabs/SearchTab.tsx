"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
  project: { name: string } | null;
};

type Project = { id: number; name: string };

export default function SearchTab() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectId, setProjectId] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [results, setResults] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setProjects([]));
  }, []);

  const search = async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (projectId > 0) params.set("projectId", String(projectId));

    try {
      const r = await fetch(`/api/search?${params}`);
      const d = await r.json();
      setResults(Array.isArray(d) ? d : []);
    } catch {
      setResults([]);
    }
  };

  const statusOpts = ["", "Pendiente", "En Progreso", "Completada"];
  const priorityOpts = ["", "Baja", "Media", "Alta", "Crítica"];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Búsqueda Avanzada
      </h2>

      {/* PANEL */}
      <motion.section
        className="liminal-panel rounded-xl p-4 md:p-5"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-white mb-1">Texto</label>
            <motion.input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div>
            <label className="block text-xs     text-white mb-1">Estado</label>
            <motion.select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">Todos</option>
              {statusOpts.filter(Boolean).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </motion.select>
          </div>

          <div>
            <label className="block text-xs text-white mb-1">Prioridad</label>
            <motion.select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">Todas</option>
              {priorityOpts.filter(Boolean).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </motion.select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-xs text-white mb-1">Proyecto</label>
            <motion.select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value, 10))}
              className="w-full max-w-xs liminal-input rounded-lg px-3 py-2 text-sm"
              whileFocus={{ scale: 1.01 }}
            >
              <option value={0}>Todos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </motion.select>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={search}
          className="liminal-btn mt-4 px-4 py-2 rounded-lg bg-liminal-void text-white text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Buscar
        </motion.button>
      </motion.section>

      {/* RESULTADOS */}
      <section>
        <h3 className="text-sm font-semibold text-liminal-shadow mb-2">
          Resultados
        </h3>

        <div className="overflow-x-auto rounded-xl border border-liminal-border">
          <table className="table-responsive w-full text-sm">
            <thead>
              <tr className="bg-liminal-mist/80">
                <th className="text-left p-2 md:p-3">ID</th>
                <th className="text-left p-2 md:p-3">Título</th>
                <th className="text-left p-2 md:p-3">Estado</th>
                <th className="text-left p-2 md:p-3">Prioridad</th>
                <th className="text-left p-2 md:p-3 hidden md:table-cell">
                  Proyecto
                </th>
              </tr>
            </thead>

            <AnimatePresence>
              <tbody>
                {results.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-liminal-border"
                  >
                    <td className="p-2 md:p-3">{t.id}</td>
                    <td className="p-2 md:p-3 font-medium">{t.title}</td>
                    <td className="p-2 md:p-3">{t.status ?? "Pendiente"}</td>
                    <td className="p-2 md:p-3">{t.priority ?? "Media"}</td>
                    <td className="p-2 md:p-3 hidden md:table-cell">
                      {t.project?.name ?? "Sin proyecto"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      </section>
    </motion.div>
  );
}
