import { prisma } from "@/lib/db";
import { ModerationQueue } from "@/components/admin/moderation-queue";

export default async function ModerationPage() {
  const comments = await prisma.comment.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { name: true, email: true } } },
    take: 100,
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold">Modération</h1>
      <p className="mb-6 text-muted-foreground">
        {comments.length} commentaire{comments.length > 1 ? "s" : ""} en attente.
      </p>
      <ModerationQueue
        initial={comments.map((c) => ({
          id: c.id,
          body: c.body,
          createdAt: c.createdAt,
          entityType: c.entityType,
          author: c.author,
        }))}
      />
    </div>
  );
}
