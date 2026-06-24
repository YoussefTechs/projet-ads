import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata = buildMetadata({
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte Atlas.",
  path: "/mot-de-passe-oublie",
  noindex: true,
});

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié ?"
      subtitle="Saisissez votre e-mail pour recevoir un lien de réinitialisation."
      footer={
        <Link href="/connexion" className="font-medium text-brand-700 hover:underline">
          ← Retour à la connexion
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
