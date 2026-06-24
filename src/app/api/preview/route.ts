import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Active le mode brouillon (preview) — réservé ADMIN/EDITOR. */
export async function GET(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/403");
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") ?? "/";
  (await draftMode()).enable();
  redirect(path.startsWith("/") ? path : "/");
}
