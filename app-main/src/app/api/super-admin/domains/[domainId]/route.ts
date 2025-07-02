import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "../../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";

// PUT - Modifier un domaine
export async function PUT(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;
    const { name, url, isPublish, maximumCategories } = await req.json();

    const updatedDomain = await prisma.domain.update({
      where: { id: domainId },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(typeof isPublish === 'boolean' && { isPublish }),
        ...(maximumCategories && { maximumCategories })
      },
      include: {
        users: {
          where: { role: "ADMIN" },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            creationDate: true
          }
        },
        _count: {
          select: {
            users: true,
            categories: true,
            bookmark: true
          }
        }
      }
    });

    return NextResponse.json(updatedDomain);
  } catch (error) {
    console.error("Erreur lors de la modification du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un domaine
export async function DELETE(
  req: Request,
  { params }: { params: { domainId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { domainId } = params;

    // Vérifier si le domaine existe
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      include: {
        _count: {
          select: {
            users: true,
            categories: true,
            bookmark: true
          }
        }
      }
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domaine non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher la suppression du domaine super-admin
    if (domain.name === "super-admin") {
      return NextResponse.json(
        { error: "Impossible de supprimer le domaine super-admin" },
        { status: 400 }
      );
    }

    // Supprimer le domaine (cascade delete configuré dans Prisma)
    await prisma.domain.delete({
      where: { id: domainId }
    });

    return NextResponse.json({ message: "Domaine supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
