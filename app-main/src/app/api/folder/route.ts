import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
  const session = await getServerSession(authOptions);

  const folders = await prisma.user
    .findUnique({
      where: { id: session?.user?.id },
    })
    .folders({
      select: {
        id: true,
        name: true,
        url: true,
        userCreatorId: true,
        bookmarks: {
          select: {
            id: true,
          },
        },
      },
    });

  return NextResponse.json(folders);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
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

  const normalizedUrl = data.url
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

  function getRandomNumber() {
    return Math.floor(Math.random() * 1000);
  }

  async function isUrlExists(url: string) {
    // Utilisez Prisma pour vérifier si l'URL existe déjà dans la base de données
    const existingUrl = await prisma.folder.findUnique({
      where: {
        url: url,
      },
    });

    return !!existingUrl;
  }

  let url = normalizedUrl;
  let counter = 1;

  while (await isUrlExists(url)) {
    url = `${normalizedUrl}-${getRandomNumber()}`;
    counter += 1;

    // Pour éviter une boucle infinie en cas de problème
    if (counter > 10) {
      throw new Error(
        "Échec de génération d'une URL unique après 10 tentatives."
      );
    }
  }

  const newFolder = await prisma.folder.create({
    data: {
      name: data.name,
      url: url,
      userCreatorId: session.user.id,
      users: {
        connect: {
          id: session.user.userId,
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json(newFolder);
}
