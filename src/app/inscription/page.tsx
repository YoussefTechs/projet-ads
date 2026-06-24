import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = buildMetadata({
  title: "Inscription",
  description: "Créez votre compte Atlas gratuitement.",
  path: "/inscription",
  noindex: true,
});

export default function RegisterPage() {
  return (
    <AuthShell
      title="Créer un compte"
      subtitle="C'est gratuit et ça prend 30 secondes."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-medium text-brand-700 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
