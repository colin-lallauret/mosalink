import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { redirect } from "next/navigation";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Login from "@/components/specific/Login";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email) {
    const domain = await prisma.user
      .findUnique({ where: { email: session.user.email } })
      .domain();
    return domain && redirect(routeDomainFront(domain.url));
  }

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-8">
      <h1 className="font-bold text-2xl">
        Bienvenue sur {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <Login />
    </div>
  );
}
