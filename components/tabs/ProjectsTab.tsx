"use client";

import { useEffect, useState } from "react";

type Project = { id: number; name: string; description: string };

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = async () => {
    try {
      const r = await fetch("/api/projects");
      const d = await r.json();
      setProjects(Array.isArray(d) ? d : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pick = (p: Project) => {
    setSelected(p);
    setName(p.name);
    setDescription(p.description ?? "");
  };

  const clear = () => {
    setSelected(null);
    setName("");
    setDescription("");
  };

  const add = async () => {
    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }
    const r = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description }),
    });
    if (!r.ok) {
      const d = await r.json();
      alert(d.error ?? "Error");
      return;
    }
    load();
    clear();
    alert("Proyecto agregado");
  };

  const update = async () => {
    if (!selected) {
      alert("Selecciona un proyecto");
      return;
    }
    if (!name.trim()) {
      alert("El nombre es requerido");
      return;
    }
    const r = await fetch(`/api/projects/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description }),
    });
    if (!r.ok) {
      const d = await r.json();
      alert(d.error ?? "Error");
      return;
    }
    load();
    clear();
    alert("Proyecto actualizado");
  };

  const remove = async () => {
    if (!selected) {
      alert("Selecciona un proyecto");
      return;
    }
    if (!confirm(`¿Eliminar proyecto: ${selected.name}?`)) return;
    const r = await fetch(`/api/projects/${selected.id}`, { method: "DELETE" });
    if (!r.ok) {
      alert("Error al eliminar");
      return;
    }
    load();
    clear();
    alert("Proyecto eliminado");
  };

  if (loading) return <div className="text-liminal-void text-sm">Cargando proyectos…</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-base md:text-lg font-bold text-liminal-deep border-b border-liminal-border pb-2">
        Gestión de Proyectos
      </h2>

      <section className="liminal-panel rounded-xl p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white mb-1">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-white mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full liminal-input rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" onClick={add} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-void text-white text-sm">
            Agregar
          </button>
          <button type="button" onClick={update} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-stone text-white text-sm">
            Actualizar
          </button>
          <button type="button" onClick={remove} className="liminal-btn px-4 py-2 rounded-lg bg-red-600/90 text-white text-sm">
            Eliminar
          </button>
          <button type="button" onClick={clear} className="liminal-btn px-4 py-2 rounded-lg bg-liminal-mist text-liminal-deep text-sm">
            Limpiar
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-liminal-shadow mb-2">Proyectos</h3>
        <div className="overflow-x-auto rounded-xl border border-liminal-border">
          <table className="table-responsive w-full text-sm">
            <thead>
              <tr className="bg-liminal-mist/80">
                <th className="text-left p-2 md:p-3">ID</th>
                <th className="text-left p-2 md:p-3">Nombre</th>
                <th className="text-left p-2 md:p-3 hidden md:table-cell">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => pick(p)}
                  className={`border-t border-liminal-border cursor-pointer hover:bg-liminal-mist/50 ${
                    selected?.id === p.id ? "bg-liminal-mist/70" : ""
                  }`}
                >
                  <td className="p-2 md:p-3" data-label="ID">{p.id}</td>
                  <td className="p-2 md:p-3 font-medium" data-label="Nombre">{p.name}</td>
                  <td className="p-2 md:p-3 hidden md:table-cell" data-label="Descripción">{p.description ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
