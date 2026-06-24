"use client";

import { useState } from "react";
import { Check, Trash2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

interface PendingComment {
  id: string;
  body: string;
  createdAt: Date | string;
  entityType: string;
  author: { name: string | null; email: string };
}

export function ModerationQueue({ initial }: { initial: PendingComment[] }) {
  const [comments, setComments] = useState(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function act(id: string, action: "approve" | "reject" | "spam") {
    setPendingId(id);
    const res = await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
    setPendingId(null);
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        icon={Check}
        title="Tout est à jour"
        description="Aucun commentaire en attente de modération."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{c.author.name ?? "Anonyme"}</strong>{" "}
              · {c.author.email} · sur {c.entityType.toLowerCase()}
            </span>
            <span>{formatDate(c.createdAt)}</span>
          </div>
          <p className="text-sm">{c.body}</p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => act(c.id, "approve")}
              loading={pendingId === c.id}
            >
              <Check size={15} /> Approuver
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => act(c.id, "reject")}
              loading={pendingId === c.id}
            >
              <Trash2 size={15} /> Rejeter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => act(c.id, "spam")}
              loading={pendingId === c.id}
            >
              <Ban size={15} /> Spam
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
