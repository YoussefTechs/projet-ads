/**
 * Crée un fichier `.env` local s'il n'existe pas, avec des valeurs de
 * développement prêtes à l'emploi (DATABASE_URL docker, AUTH_SECRET généré,
 * ADMIN_EMAIL). N'écrase jamais un `.env` existant.
 */
import { existsSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");

if (existsSync(envPath)) {
  process.exit(0);
}

const secret = randomBytes(32).toString("base64");

const content = `# Généré automatiquement par scripts/setup-env.mjs (modifiable).
DATABASE_URL="postgresql://atlas:atlas@localhost:5432/atlas?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
AUTH_SECRET="${secret}"
AUTH_TRUST_HOST="true"

# Administrateur principal (rôle ADMIN automatique à la connexion Google)
ADMIN_EMAIL="anouarelbardaoui36@gmail.com"

# Google OAuth (créer des identifiants sur https://console.cloud.google.com)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Optionnel
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_ADSENSE_CLIENT=""
NEXT_PUBLIC_GSC_VERIFICATION=""
ANTHROPIC_API_KEY=""
`;

writeFileSync(envPath, content);
console.log("✓ .env créé (valeurs de développement). Pensez à démarrer PostgreSQL : docker compose up -d");
