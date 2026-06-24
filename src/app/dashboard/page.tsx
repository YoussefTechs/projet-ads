import { redirect } from "next/navigation";

// Alias pratique : /dashboard → /admin (protégé par le middleware).
export default function DashboardRedirect() {
  redirect("/admin");
}
