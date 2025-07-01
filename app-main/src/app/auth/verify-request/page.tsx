import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Mail } from "lucide-react";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prisma";
import { redirect } from "next/navigation";
import { routeDomainFront } from "@/utils/routes/routesFront";

const VerifyRequestPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.status === "authenticated") {
    const domain = await prisma.user
      .findUnique({ where: { email: session.user.email } })
      .domain();
    return domain && redirect(routeDomainFront(domain.url));
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8">
      <Mail className="h-12 w-12" />
      <h1 className="font-bold text-2xl">
        Vous avez reçu un lien de connection
      </h1>
      <p>Regardez dans votre boîte mail</p>
    </div>
  );
};

export default VerifyRequestPage;
