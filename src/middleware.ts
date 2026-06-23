import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Middleware d'autorisation (edge-safe).
 * Protège /admin (ADMIN/EDITOR) et /compte (connecté) via le callback
 * `authorized` de `auth.config.ts`.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
