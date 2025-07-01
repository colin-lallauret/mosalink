import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  const folder = await prisma.folder.findUnique({
    select: {
      id: true,
      name: true,
      isPublish: true,
      url: true,
      userCreatorId: true,
      bookmarks: {
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
        orderBy: {
          creationDate: "desc",
        },
      },
      users: {
        select: {
          id: true,
          email: true,
        },
      },
    },
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(folder);
}
