import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { Role } from "@prisma/client";
import { isAdminDomain } from "@/utils/roles/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.email && !data.role) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      role: data.role ?? Role.USER,
      domain: {
        connect: {
          id: session.user.domainId,
        },
      },
      image: data.image,
    },
  });

  return NextResponse.json(newUser);
}

export async function GET() {
  const session = await getServerSession(authOptions);

  const users = await prisma.user.findMany({
    where: { domainId: session?.user?.domainId ?? undefined },
  });

  return NextResponse.json(users ?? []);
}
