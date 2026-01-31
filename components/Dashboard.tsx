"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

import TasksTab from "@/components/tabs/TasksTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import CommentsTab from "@/components/tabs/CommentsTab";
import HistoryTab from "@/components/tabs/HistoryTab";
import NotificationsTab from "@/components/tabs/NotificationsTab";
import SearchTab from "@/components/tabs/SearchTab";
import ReportsTab from "@/components/tabs/ReportsTab";

type User = { id: number; username: string };

const TABS = [
  { id: "tasks", label: "Tareas" },
  { id: "projects", label: "Proyectos" },
  { id: "comments", label: "Comentarios" },
  { id: "history", label: "Historial" },
  { id: "notifications", label: "Notificaciones" },
  { id: "search", label: "Búsqueda" },
  { id: "reports", label: "Reportes" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Dashboard({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("tasks");

  const logout = useCallback(async () => {
    await onLogout();
  }, [onLogout]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* HEADER */}
      <header className="
        relative overflow-hidden
        rounded-2xl px-6 py-4 mb-6
        bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-400/20
        backdrop-blur-xl border border-white/20
        shadow-[0_0_40px_rgba(217,70,239,0.25)]
        flex flex-wrap items-center justify-between gap-4
      ">
        <h1 className="text-xl font-bold text-white drop-shadow">
          Task Manager Legacy
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80">
            Usuario:{" "}
            <strong className="text-white">
              {user.username}
            </strong>
          </span>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="
              px-4 py-2 rounded-xl text-sm font-semibold
              bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400
              text-white shadow-lg
              hover:shadow-[0_0_25px_rgba(236,72,153,0.8)]
            "
          >
            Salir
          </motion.button>
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              className="relative px-5 py-2 rounded-2xl text-sm font-medium"
            >
              {/* NEON GLOW */}
              {isActive && (
                <motion.span
                  layoutId="vapor-glow"
                  className="
                    absolute -inset-2 rounded-3xl
                    bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-400/40
                    blur-2xl
                  "
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              )}

              {/* GLASS BG */}
              <motion.span
                layoutId="vapor-bg"
                className={`
                  absolute inset-0 rounded-2xl backdrop-blur-xl border
                  ${
                    isActive
                      ? "bg-white/20 border-black/40"
                      : "bg-white/10 border-black/20 hover:bg-white/20"
                  }
                `}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              />

              {/* TEXT */}
              <span
                className={`
                  relative z-10 tracking-wider
                  ${
                    isActive
                      ? "text-black drop-shadow"
                      : "text-white/80"
                  }
                `}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
          rounded-2xl p-6 min-h-[320px]
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_60px_rgba(139,92,246,0.25)]
        "
      >
        {activeTab === "tasks" && <TasksTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "comments" && <CommentsTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "search" && <SearchTab />}
        {activeTab === "reports" && <ReportsTab />}
      </motion.div>
    </div>
  );
}
