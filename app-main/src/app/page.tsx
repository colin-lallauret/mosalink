import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { routeDomainFront } from "@/utils/routes/routesFront";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  const domain = await prisma.domain.findUnique({
    where: { url: session.user.domainUrl },
  });

  return (
    <main className="flex flex-col gap-20 w-full h-screen justify-center items-center">
      <h1 className="text-3xl font-bold">
        Bienvenue sur {process.env.NEXT_PUBLIC_APP_NAME}
      </h1>
      <Link href={routeDomainFront(domain?.url ?? "")}>
        <div className="group border rounded-lg shadow p-4 flex items-center gap-40">
          <div className="flex flex-col">
            <p className="font-bold">{domain?.name}</p>
            <p className="text-sm text-slate-500">/{domain?.url}</p>
          </div>

          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-all" />
        </div>
      </Link>
    </main>
  );
}
