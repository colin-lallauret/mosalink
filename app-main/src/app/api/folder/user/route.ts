import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.userId || !data.folderId) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const folder = await prisma.folder.update({
    where: {
      id: data.folderId,
    },
    data: {
      users: {
        connect: {
          id: data.userId,
        },
      },
    },
  });

  return NextResponse.json(folder);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  const data = await req.json();

  if (!data.userId || !data.folderId) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  if (!session?.user?.email) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const folder = await prisma.folder.update({
    where: {
      id: data.folderId,
    },
    data: {
      users: {
        disconnect: {
          id: data.userId,
        },
      },
    },
  });

  return NextResponse.json(folder);
}
