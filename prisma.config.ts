import { defineConfig } from "prisma/config";

// Prisma's CLI does not read .env files itself. Shell variables win.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // The file is optional.
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Migrations use the direct (non-pooled) connection. "prisma generate" needs none.
  datasource: { url: process.env.DIRECT_URL ?? "" },
});
