import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

/**
 * Configuration NextAuth « edge-safe » (sans Prisma ni bcrypt).
 * - Attribution automatique du rôle ADMIN si l'e-mail Google == ADMIN_EMAIL.
 * - Protection des routes /admin, /dashboard (ADMIN/EDITOR) et /compte
 *   (connecté) avec redirection vers /403 ou /connexion.
 */
export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  providers: [],
  callbacks: {
    /** Contrôle d'accès appliqué par le middleware. */
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;
      const isAdminArea =
        path.startsWith("/admin") || path.startsWith("/dashboard");
      const isAccount = path.startsWith("/compte");

      if (isAdminArea) {
        if (!user) {
          return NextResponse.redirect(new URL("/connexion", nextUrl));
        }
        if (user.role !== "ADMIN" && user.role !== "EDITOR") {
          return NextResponse.redirect(new URL("/403", nextUrl));
        }
        return true;
      }

      if (isAccount) {
        if (!user) {
          return NextResponse.redirect(new URL("/connexion", nextUrl));
        }
        return true;
      }

      return true;
    },
    /** Propage l'id et le rôle dans le JWT (+ rôle ADMIN auto via ADMIN_EMAIL). */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }
      // L'administrateur principal est identifié par son e-mail Google.
      const email = user?.email ?? token.email;
      if (email && email === process.env.ADMIN_EMAIL) {
        token.role = "ADMIN";
      }
      return token;
    },
    /** Expose l'id et le rôle dans la session côté serveur/client. */
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role =
          (token.role as "USER" | "EDITOR" | "ADMIN" | undefined) ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
