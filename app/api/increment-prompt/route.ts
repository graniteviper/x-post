// /app/api/increment-prompt/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date();
  if (
    today.getFullYear() !== user.lastReset.getFullYear() ||
    today.getMonth() !== user.lastReset.getMonth() ||
    today.getDate() !== user.lastReset.getDate()
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: { promptCount: 1, lastReset: today },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { promptCount: { increment: 1 } },
    });
  }

  return NextResponse.json({ success: true });
}
