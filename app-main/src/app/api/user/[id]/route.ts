import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { isAdminDomain } from "@/utils/roles/utils";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous n'avez pas accès à cette page",
      status: 403,
    });
  }

  if (!params.id) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const deleteBookmarks = await prisma.bookmark.deleteMany({
    where: {
      userId: params.id,
    },
  });

  const deleteUser = await prisma.user.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({ deleteBookmarks, deleteUser });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !isAdminDomain(session.user, session.user.domainId)) {
    return NextResponse.json({
      message: "Vous devez être connecté pour accéder à cette page",
      status: 403,
    });
  }

  const data = await req.json();

  if (!data.email && !data.role) {
    return NextResponse.json({
      message: "Veillez remplir tous les champs",
      status: 403,
    });
  }

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      email: data.email,
      role: data.role,
    },
  });

  return NextResponse.json(user);
}
