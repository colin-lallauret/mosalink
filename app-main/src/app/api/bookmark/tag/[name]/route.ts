import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const bookmarks = await prisma.domain
    .findUnique({
      where: {
        id: session.user.domainId,
      },
    })
    .bookmark({
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        image: true,
        tags: true,
        category: {
          select: {
            name: true,
            id: true,
            url: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        tags: {
          has: params.name,
        },
      },
      orderBy: {
        creationDate: "desc",
      },
    });

  return NextResponse.json(bookmarks);
}
