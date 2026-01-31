"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";

type User = { id: number; username: string } | null;

export default function Home() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const onLogin = (u: { id: number; username: string }) => {
    setUser(u);
  };

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse text-liminal-void text-sm">Cargando…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <LoginForm onLogin={onLogin} />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6 lg:p-8">
      <Dashboard user={user} onLogout={onLogout} />
    </main>
  );
}
//John 3:16 "Porque de tal manera amó Dios al mundo, que dio a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, sino que tenga vida eterna."