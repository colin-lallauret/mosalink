import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { domain: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    // Vérifier que le domaine existe et est publié
    const domain = await prisma.domain.findFirst({
      where: { 
        url: params.domain,
        isPublish: true 
      }
    });

    if (!domain) {
      return NextResponse.json({ error: "Domaine non trouvé" }, { status: 404 });
    }

    // Récupérer les bookmarks du domaine spécifique
    const bookmarks = await prisma.bookmark.findMany({
      where: { 
        domainId: domain.id
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
  } catch (error) {
    console.error("Erreur récupération bookmarks:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
