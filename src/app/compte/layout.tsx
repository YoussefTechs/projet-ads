import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
