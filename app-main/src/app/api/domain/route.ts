import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getNameToUrl } from "@/utils/url/utils";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const domain = await prisma.user
    .findUnique({ where: { email: session?.user?.email ?? undefined } })
    .domain();

  return NextResponse.json(domain);
}

export async function POST(request: Request) {
  const requestDomain = await request.json();

  const name: string = requestDomain.name;
  const url: string = getNameToUrl(name);

  const domain = await prisma.domain.create({
    data: {
      name,
      url,
    },
  });

  return NextResponse.json({ domain });
}
