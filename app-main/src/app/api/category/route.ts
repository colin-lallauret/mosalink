import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";

export async function GET() {
  const session = await getServerSession(authOptions);

  const categoriesData = await prisma.user
    .findUnique({ where: { email: session?.user?.email ?? undefined } })
    .domain()
    .categories({
      orderBy: {
        name: "asc",
      },
    });

  return NextResponse.json(categoriesData ?? []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.name && !data.url) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const newCategory = await prisma.category.create({
    data: {
      name: data.name,
      url: data.url,
      domain: {
        connect: {
          id: session.user.domainId,
        },
      },
    },
  });

  return NextResponse.json(newCategory);
}
