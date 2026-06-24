"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function SettingsForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: value }),
    });
    setSaving(false);
    setMessage(res.ok ? "Profil mis à jour." : "Erreur lors de la mise à jour.");
    if (res.ok) router.refresh();
  }

  async function deleteAccount() {
    if (!confirm("Supprimer définitivement votre compte ? Cette action est irréversible.")) {
      return;
    }
    await fetch("/api/account", { method: "DELETE" });
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="max-w-lg space-y-8">
      <form onSubmit={save} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" value={value} onChange={(e) => setValue(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" value={email} disabled />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" loading={saving}>
            Enregistrer
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </form>

      <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900/40 dark:bg-red-950/20">
        <h2 className="font-semibold text-red-700 dark:text-red-400">
          Zone de danger
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          La suppression de votre compte est définitive et efface toutes vos
          données (favoris, commentaires).
        </p>
        <Button variant="danger" className="mt-4" onClick={deleteAccount}>
          Supprimer mon compte
        </Button>
      </div>
    </div>
  );
}
