import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  if (count > 0) {
    console.log("Users already exist, skipping seed.");
    return;
  }

  await prisma.user.createMany({
    data: [
      {
        username: "admin",
        passwordHash: await bcrypt.hash("admin", 10),
      },
      {
        username: "user1",
        passwordHash: await bcrypt.hash("user1", 10),
      },
      {
        username: "user2",
        passwordHash: await bcrypt.hash("user2", 10),
      },
    ],
  });

  console.log("Seed done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
