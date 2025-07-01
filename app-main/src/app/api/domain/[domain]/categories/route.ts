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

    // Récupérer les catégories du domaine spécifique
    const categories = await prisma.category.findMany({
      where: { 
        domainId: domain.id,
        isPublish: true 
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
