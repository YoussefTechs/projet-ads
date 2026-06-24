"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function ForgotForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        Si un compte existe pour cette adresse, vous recevrez un e-mail pour
        réinitialiser votre mot de passe.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // L'envoi réel sera branché sur le service e-mail (Phase 4).
        setSent(true);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <Button type="submit" className="w-full">
        Réinitialiser mon mot de passe
      </Button>
    </form>
  );
}
