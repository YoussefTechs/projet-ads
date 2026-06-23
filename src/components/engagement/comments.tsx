"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export interface CommentView {
  id: string;
  body: string;
  createdAt: Date | string;
  author: { name: string | null; image: string | null };
  replies?: CommentView[];
}

/** Élément commentaire (récursif pour les réponses). */
function CommentItem({ comment }: { comment: CommentView }) {
  return (
    <li className="border-b border-border py-4 last:border-0">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {(comment.author.name ?? "?").charAt(0).toUpperCase()}
        </span>
        <span className="font-medium">{comment.author.name ?? "Anonyme"}</span>
        <span className="text-xs text-muted-foreground">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      <p className="mt-2 whitespace-pre-line text-sm text-ink-700 dark:text-ink-300">
        {comment.body}
      </p>
      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 border-border pl-4">
          {comment.replies.map((r) => (
            <CommentItem key={r.id} comment={r} />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Section commentaires : liste (rendue serveur, SEO) + formulaire (client).
 * Un nouveau commentaire passe en modération avant publication.
 */
export function Comments({
  entityType,
  entityId,
  comments,
}: {
  entityType: string;
  entityId: string;
  comments: CommentView[];
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId, body }),
      });
      const data = await res.json();
      if (res.status === 401) {
        router.push("/connexion");
        return;
      }
      if (res.ok) {
        setStatus("ok");
        setMessage("Merci ! Votre commentaire sera publié après modération.");
        setBody("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Erreur réseau.");
    }
  }

  return (
    <section className="mt-12" id="commentaires">
      <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold">
        <MessageSquare size={22} /> Commentaires ({comments.length})
      </h2>

      <form onSubmit={onSubmit} className="mb-8">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={2}
          placeholder="Partagez votre expérience ou posez une question…"
          aria-label="Votre commentaire"
        />
        <div className="mt-3 flex items-center gap-3">
          <Button type="submit" loading={status === "loading"}>
            Publier
          </Button>
          {message && (
            <p
              role="status"
              className={`text-sm ${status === "ok" ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
          )}
        </div>
      </form>

      {comments.length > 0 ? (
        <ul>
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">
          Soyez le premier à commenter !
        </p>
      )}
    </section>
  );
}
