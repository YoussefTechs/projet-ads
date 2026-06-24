import { auth } from "@/auth";
import { SettingsForm } from "@/components/account/settings-form";

export const metadata = { title: "Paramètres", robots: { index: false } };

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Paramètres</h1>
      <SettingsForm
        name={session!.user.name ?? ""}
        email={session!.user.email ?? ""}
      />
    </div>
  );
}
