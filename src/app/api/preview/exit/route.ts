import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Désactive le mode brouillon. */
export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
