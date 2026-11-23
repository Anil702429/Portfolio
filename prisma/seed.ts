/**
 * Seeds verified content. Existing rows are never overwritten, so it is safe to
 * run again after editing content in the admin dashboard.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import {
  defaultEducation,
  defaultProjects,
  defaultSettings,
  defaultSkillGroups,
  defaultSocialLinks,
  draftProjects,
} from "../src/content/defaults";
import { PrismaClient } from "../src/generated/prisma/client";
import { slugify } from "../src/lib/slug";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DIRECT_URL or DATABASE_URL before seeding.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, ...defaultSettings },
  });

  if ((await prisma.socialLink.count()) === 0) {
    await prisma.socialLink.createMany({
      data: defaultSocialLinks.map((link, displayOrder) => ({ ...link, displayOrder })),
    });
  }
  if ((await prisma.skillGroup.count()) === 0) {
    await prisma.skillGroup.createMany({
      data: defaultSkillGroups.map((group, displayOrder) => ({ ...group, displayOrder })),
    });
  }
  if ((await prisma.education.count()) === 0) {
    await prisma.education.createMany({
      data: defaultEducation.map((item, displayOrder) => ({ ...item, displayOrder })),
    });
  }

  for (const [displayOrder, project] of [...defaultProjects, ...draftProjects].entries()) {
    const { technologies, ...data } = project;
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...data,
        displayOrder,
        technologies: {
          connectOrCreate: technologies.map((name) => ({
            where: { name },
            create: { name, slug: slugify(name) },
          })),
        },
      },
    });
  }
}

main()
  .then(() => console.log("Seed complete."))
  .finally(() => prisma.$disconnect());
