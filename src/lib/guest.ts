import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function getVisitorId() {
  const cookieStore = await cookies();

  let visitorId = cookieStore.get("visitor_id")?.value;

  if (!visitorId) {
    visitorId = randomUUID();

    cookieStore.set("visitor_id", visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return visitorId;
}

export async function registerVisitor(visitorId: string) {
  const existingVisitor = await prisma.guestUsage.findUnique({
    where: { visitorId },
  });

  if (!existingVisitor) {
    const newVisitor = await prisma.guestUsage.create({
      data: {
        visitorId,
        analysesCount: 1,
      },
    });
    return newVisitor.analysesCount;
  }

  const visitor = await prisma.guestUsage.findUnique({
    where: { visitorId },
  });

  if (visitor && visitor.analysesCount >= 4) {
    return NextResponse.json(
      {
        error:
          "Limite de análises atingido para visitantes. Por favor, registre-se para continuar usando o serviço.",
      },
      { status: 403 },
    );
  }

  const updatedVisitor = await prisma.guestUsage.update({
    where: { visitorId },
    data: { analysesCount: { increment: 1 } },
  });

  return updatedVisitor.analysesCount;
}
