"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type User = { id: number; username: string };

export default function LoginForm({ onLogin }: { onLogin: (u: User) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Usuario y contraseña requeridos");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error ?? "Error al iniciar sesión");
        return;
      }
      onLogin(d.user);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full max-w-sm rounded-3xl p-6 md:p-8
        bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-400/20
        backdrop-blur-2xl border border-white/20
        shadow-[0_0_80px_rgba(217,70,239,0.35)]
      "
    >
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-white text-center drop-shadow mb-1">
        Task Manager Legacy
      </h1>
      <p className="text-white/70 text-sm text-center mb-8 tracking-wider">
        sistema simple
      </p>

      <form onSubmit={submit} className="space-y-5">
        {/* USER */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="
              w-full px-4 py-2.5 rounded-xl text-sm
              bg-white/10 text-white placeholder-white/40
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-pink-400/60
            "
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="
              w-full px-4 py-2.5 rounded-xl text-sm
              bg-white/10 text-white placeholder-white/40
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-purple-400/60
            "
          />
        </div>

        {/* ERROR */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pink-300 text-sm text-center"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        {/* BUTTON */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          type="submit"
          className="
            w-full py-3 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
            text-white
            shadow-lg
            hover:shadow-[0_0_30px_rgba(236,72,153,0.8)]
            disabled:opacity-50
          "
        >
          {loading ? "Entrando…" : "Entrar"}
        </motion.button>
      </form>
    </motion.div>
  );
}
