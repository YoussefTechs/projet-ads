"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("ok");
      setMessage(data.message ?? "Message envoyé !");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setMessage(data.error ?? "Une erreur est survenue.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot anti-spam (caché) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" loading={status === "loading"}>
          Envoyer
        </Button>
        {message && (
          <p className={`text-sm ${status === "ok" ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
