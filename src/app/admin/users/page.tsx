import { prisma } from "@/lib/db";
import { requireAdminAccess } from "@/server/admin-data";
import { updateUserRole } from "@/server/admin-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdminAccess(true); // réservé au rôle ADMIN
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  const adminEmail = process.env.ADMIN_EMAIL;

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold">Utilisateurs</h1>
      <p className="mb-6 text-muted-foreground">
        Gérez les rôles. L'administrateur principal ({adminEmail}) est promu
        automatiquement à la connexion.
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Utilisateur</th>
              <th className="p-3 font-medium">Rôle</th>
              <th className="p-3 font-medium">Inscrit</th>
              <th className="p-3 font-medium">Modifier</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMainAdmin = u.email === adminEmail;
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="font-medium">{u.name ?? "—"}</div>
                    <div className="text-muted-foreground">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant={u.role === "ADMIN" ? "brand" : "muted"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-3">
                    {isMainAdmin ? (
                      <span className="text-xs text-muted-foreground">
                        Admin principal
                      </span>
                    ) : (
                      <form
                        action={updateUserRole.bind(null, u.id)}
                        className="flex items-center gap-2"
                      >
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="rounded-md border border-input bg-card px-2 py-1.5 text-sm"
                        >
                          <option value="USER">USER</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <Button type="submit" size="sm" variant="outline">
                          OK
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
