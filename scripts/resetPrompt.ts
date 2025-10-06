import { prisma } from "@/lib/prisma";

async function resetPrompts() {
  await prisma.user.updateMany({
    data: { promptCount: 0, lastReset: new Date() },
  });
  console.log("✅ Daily prompt limits reset");
}

resetPrompts();
