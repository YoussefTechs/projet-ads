import { auth } from "@/auth";
import { getUserComments } from "@/server/engagement";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Mes commentaires", robots: { index: false } };

const statusLabels: Record<string, { label: string; variant: "success" | "muted" | "default" }> = {
  APPROVED: { label: "Publié", variant: "success" },
  PENDING: { label: "En modération", variant: "muted" },
  REJECTED: { label: "Refusé", variant: "default" },
  SPAM: { label: "Spam", variant: "default" },
};

export default async function UserCommentsPage() {
  const session = await auth();
  const comments = await getUserComments(session!.user.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Mes commentaires
      </h1>

      {comments.length === 0 ? (
        <EmptyState
          title="Aucun commentaire"
          description="Vos commentaires apparaîtront ici."
        />
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const status = statusLabels[c.status] ?? statusLabels.PENDING;
            return (
              <li key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{c.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
