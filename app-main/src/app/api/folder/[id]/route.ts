import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isAdminDomain } from "@/utils/roles/utils";
import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  const deleteFolders = await prisma.folder.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json(deleteFolders);
}
