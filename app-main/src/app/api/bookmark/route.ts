import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.title && !data.url && !data.tags && !data.description) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      title: data.title,
      url: data.url,
      description: data.description,
      tags: data.tags,
      user: {
        connect: {
          id: session.user.id,
        },
      },
      category: {
        connect: {
          id: data.categoryId,
        },
      },
      domain: {
        connect: {
          id: session.user.domainId,
        },
      },
      image: data.image,
    },
  });

  return NextResponse.json(bookmark);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      domainId: session.user.domainId,
    },
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
  });

  return NextResponse.json(bookmarks);
}
