import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.bookmarkId) {
    return NextResponse.json({
      message: "Veillez ajouter un bookmark",
      status: 403,
    });
  }

  const oldBookmark = await prisma.bookmark.findUnique({
    where: {
      id: data.bookmarkId,
    },
  });

  if (!oldBookmark) {
    return NextResponse.json({
      message: "Bookmark introuvable",
      status: 403,
    });
  }

  const newBookmark = await prisma.bookmark.create({
    data: {
      title: oldBookmark.title,
      url: oldBookmark.url,
      description: oldBookmark.description,
      tags: oldBookmark.tags,
      user: {
        connect: {
          id: session.user.id,
        },
      },
      category: {
        connect: {
          id: oldBookmark.categoryId,
        },
      },
      domain: {
        connect: {
          id: session.user.domainId,
        },
      },
      image: oldBookmark.image,
    },
  });

  return NextResponse.json(newBookmark);
}
