import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = buildMetadata({
  title: "Connexion",
  description: "Connectez-vous à votre compte Atlas.",
  path: "/connexion",
  noindex: true,
});

export default function LoginPage() {
  return (
    <AuthShell
      title="Bon retour !"
      subtitle="Connectez-vous pour retrouver vos favoris."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-medium text-brand-700 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
