import type { NextAuthConfig } from "next-auth";

/**
 * Configuration NextAuth « edge-safe » (sans Prisma ni bcrypt).
 * Utilisée par le middleware pour protéger les routes via le callback
 * `authorized`. La config complète (adaptateur, providers) est dans `auth.ts`.
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

      if (path.startsWith("/admin")) {
        const role = user?.role;
        return Boolean(user) && (role === "ADMIN" || role === "EDITOR");
      }
      if (path.startsWith("/compte")) {
        return Boolean(user);
      }
      return true;
    },
    /** Propage l'id et le rôle dans le JWT. */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }
      return token;
    },
    /** Expose l'id et le rôle dans la session côté serveur/client. */
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role = token.role ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
