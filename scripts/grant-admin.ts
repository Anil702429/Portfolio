/**
 * Adds an existing Supabase Auth user to the administrator allow-list.
 *   npm run admin:grant -- you@example.com
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // The file is optional.
  }
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) throw new Error("Usage: npm run admin:grant -- you@example.com");

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DIRECT_URL or DATABASE_URL first.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const users = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id::text FROM auth.users WHERE lower(email) = ${email} LIMIT 1`;
    const user = users[0];
    if (!user) {
      throw new Error(`No Supabase Auth user for ${email}. Create it under Authentication > Users first.`);
    }
    await prisma.adminUser.upsert({
      where: { userId: user.id },
      update: { email },
      create: { userId: user.id, email },
    });
    console.log(`${email} is now an administrator.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
