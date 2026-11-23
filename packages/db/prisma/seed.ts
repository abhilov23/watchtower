import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const regions = [
    {
      name: "Mumbai",
      code: "ap-south-1",
    },
    {
      name: "Virginia",
      code: "us-east-1",
    },
    {
      name: "Frankfurt",
      code: "eu-central-1",
    },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: {
        code: region.code,
      },

      update: {
        name: region.name,
        enabled: true,
      },

      create: {
        name: region.name,
        code: region.code,
        enabled: true,
      },
    });
  }

  console.log("Regions seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
