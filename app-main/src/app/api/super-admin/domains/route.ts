import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "@/utils/roles/utils";

// GET - Récupérer tous les domaines avec leurs administrateurs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const domains = await prisma.domain.findMany({
      include: {
        users: {
          where: {
            role: "ADMIN"
          },
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
      },
      orderBy: {
        creationDate: 'desc'
      }
    });

    return NextResponse.json(domains);
  } catch (error) {
    console.error("Erreur lors de la récupération des domaines:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau domaine
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !isSuperAdmin(session.user)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { name, url, isPublish, maximumCategories, adminEmail } = await req.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Le nom et l'URL du domaine sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le domaine existe déjà
    const existingDomain = await prisma.domain.findFirst({
      where: {
        OR: [
          { name: name },
          { url: url }
        ]
      }
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "Un domaine avec ce nom ou cette URL existe déjà" },
        { status: 409 }
      );
    }

    // Créer le domaine
    const newDomain = await prisma.domain.create({
      data: {
        name,
        url,
        isPublish: isPublish || false,
        maximumCategories: maximumCategories || 10
      }
    });

    // Si un email d'admin est fourni, créer l'utilisateur admin
    if (adminEmail) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          role: "ADMIN",
          domainId: newDomain.id
        }
      });
    }

    const domainWithDetails = await prisma.domain.findUnique({
      where: { id: newDomain.id },
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

    return NextResponse.json(domainWithDetails, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du domaine:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
